import { create } from 'zustand';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Message interface matching backend OutgoingMessage
export interface ChatMessage {
    id: number;
    roomId: number;
    sender: string;
    message: string;
    admin: boolean;
    timestamp: string;
}

// Notification interface
export interface Notification {
    id: string;
    type: 'admin_message' | 'new_review' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
    data?: Record<string, unknown>;
}

// Connection status
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ChatState {
    // Connection
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    stompClient: Client | null;

    // Room
    roomId: string | number | null;

    // Messages
    messages: ChatMessage[];
    isTyping: boolean;
    unreadCount: number;
    isLoading: boolean;

    // Notifications
    notifications: Notification[];
    unreadNotifications: number;

    // Actions - Connection
    connect: (token: string, roomId: string | number) => Promise<void>;
    disconnect: () => void;

    // Actions - Messages
    sendMessage: (message: string, isAdmin?: boolean) => void;
    sendMessageViaRest: (message: string, token: string, isAdmin?: boolean) => Promise<void>;
    loadMessageHistory: (roomId: string | number, token: string) => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    markMessagesAsRead: () => void;
    setTyping: (isTyping: boolean) => void;

    // Actions - Room
    setRoomId: (roomId: string | number) => void;
    createRoom: (token: string) => Promise<string | number | null>;

    // Actions - Notifications
    addNotification: (notification: Notification) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    clearNotifications: () => void;

    // Actions - Utility
    clearMessages: () => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
}

// Backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';
const WS_URL = `${API_BASE_URL}/ws`;

// Helper function to parse timestamp from backend (handles array format from Java LocalDateTime)
const parseTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();

    // If it's already a valid ISO string
    if (typeof timestamp === 'string') {
        const parsed = new Date(timestamp);
        if (!isNaN(parsed.getTime())) {
            return timestamp;
        }
    }

    // If it's an array (Java LocalDateTime format: [year, month, day, hour, minute, second, nano])
    if (Array.isArray(timestamp)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = timestamp;
        // Note: JavaScript months are 0-indexed, but Java months are 1-indexed
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date.toISOString();
    }

    // If it's a number (epoch milliseconds)
    if (typeof timestamp === 'number') {
        return new Date(timestamp).toISOString();
    }

    // Fallback
    return new Date().toISOString();
};

export const useChatStore = create<ChatState>((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    stompClient: null,
    roomId: null,
    messages: [],
    isTyping: false,
    unreadCount: 0,
    isLoading: false,
    notifications: [],
    unreadNotifications: 0,

    // Set room ID
    setRoomId: (roomId: string | number) => {
        set({ roomId });
    },

    // Create a new chat room
    createRoom: async (token: string): Promise<string | number | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                set({ roomId: data.id });
                return data.id;
            }
            return null;
        } catch (error) {
            console.error('Failed to create room:', error);
            return null;
        }
    },

    // Connect to WebSocket server using STOMP
    connect: async (token: string, roomId: string | number) => {
        const { stompClient, connectionStatus } = get();

        // Prevent multiple connections
        if (stompClient?.active || connectionStatus === 'connecting') {
            console.log('Already connected or connecting...');
            return;
        }

        set({ connectionStatus: 'connecting' });
        console.log('Connecting to WebSocket...', WS_URL);

        // First, try to get or create room for this company
        let effectiveRoomId = roomId;
        try {
            // Try to get existing room for this company
            const roomsResponse = await fetch(`${API_BASE_URL}/api/chat/my-room`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (roomsResponse.ok) {
                const roomData = await roomsResponse.json();
                console.log('🔍 my-room API response:', roomData);
                if (roomData && roomData.id) {
                    effectiveRoomId = roomData.id;
                    console.log('✅ Found existing room:', effectiveRoomId);
                } else {
                    console.log('⚠️ my-room returned but no id:', roomData);
                }
            } else if (roomsResponse.status === 404) {
                // No room exists yet, will be created when first message is sent
                console.log('⚠️ No existing room (404), will create on first message');
            } else {
                console.log('⚠️ my-room API error:', roomsResponse.status);
            }
        } catch (error) {
            console.log('❌ Could not fetch room, using provided roomId:', error);
        }

        console.log('🔍 Setting roomId to:', effectiveRoomId);
        set({ roomId: effectiveRoomId });

        // Load message history immediately if we have a room (doesn't depend on WebSocket)
        if (effectiveRoomId && effectiveRoomId !== 0) {
            get().loadMessageHistory(effectiveRoomId, token);
        }

        const connectHeaders: Record<string, string> = {};
        if (token) {
            connectHeaders['Authorization'] = `Bearer ${token}`;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${WS_URL}${token ? `?token=${token}` : ''}`),
            connectHeaders,
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log('✅ STOMP Connected');
                set({
                    isConnected: true,
                    connectionStatus: 'connected',
                    stompClient: client
                });

                const currentRoomId = get().roomId;
                console.log('🔍 onConnect - currentRoomId from store:', currentRoomId);

                // Subscribe to room messages if we have a room
                if (currentRoomId && currentRoomId !== 0) {
                    console.log('🔔 Business subscribing to: /topic/rooms/' + currentRoomId);

                    const handleIncomingMessage = (message: IMessage) => {
                        try {
                            const data: ChatMessage = JSON.parse(message.body);
                            console.log('📨 Business RECEIVED message from WebSocket:', data);
                            get().addMessage(data);
                        } catch (error) {
                            console.error('Error parsing message:', error);
                        }
                    };

                    // Subscribe to room topic where backend broadcasts messages
                    // Backend sends to: /topic/rooms/{roomId}
                    client.subscribe(`/topic/rooms/${currentRoomId}`, handleIncomingMessage);
                    console.log('✅ Successfully subscribed to /topic/rooms/' + currentRoomId);

                    // Note: Message history is already loaded before WebSocket connection
                } else {
                    // No room yet - subscribe to a temporary topic that will be resolved later
                    // We'll need to re-subscribe when room is created
                    console.log('⚠️ No room yet (roomId=' + currentRoomId + '), subscribing to /topic/rooms/0');

                    // Subscribe to topic/rooms/0 as a catch-all for new room creation
                    // The backend should broadcast to this when creating a new room
                    client.subscribe(`/topic/rooms/0`, (message: IMessage) => {
                        try {
                            const data: ChatMessage = JSON.parse(message.body);
                            console.log('📨 Received message from new room:', data);

                            // Update roomId and subscribe to the actual room
                            if (data.roomId && data.roomId !== 0) {
                                set({ roomId: data.roomId });

                                // Subscribe to the actual room topic
                                client.subscribe(`/topic/rooms/${data.roomId}`, (msg: IMessage) => {
                                    try {
                                        const msgData: ChatMessage = JSON.parse(msg.body);
                                        console.log('📨 Received message:', msgData);
                                        get().addMessage(msgData);
                                    } catch (err) {
                                        console.error('Error parsing message:', err);
                                    }
                                });
                            }

                            get().addMessage(data);
                        } catch (error) {
                            console.error('Error parsing message:', error);
                        }
                    });
                }

                // Subscribe to user notifications (for new message alerts from admin)
                client.subscribe('/user/queue/notifications', (message: IMessage) => {
                    try {
                        const notification = JSON.parse(message.body);
                        console.log('🔔 Received notification:', notification);
                        // Add notification to store
                        get().addNotification({
                            id: notification.id?.toString() || Date.now().toString(),
                            type: notification.type === 'MESSAGE' ? 'admin_message' : 'system',
                            title: 'Thông báo',
                            message: notification.message,
                            timestamp: new Date(notification.timestamp || Date.now()),
                            read: false
                        });

                        // If it's a message notification, refresh the chat history
                        // This serves as a backup mechanism if the main room topic subscription fails
                        if (notification.type === 'MESSAGE') {
                            const currentRoomId = get().roomId;
                            if (currentRoomId) {
                                console.log('🔔 Triggering message refresh from notification');
                                get().loadMessageHistory(currentRoomId, token);
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing notification:', error);
                    }
                });
            },

            onStompError: (frame) => {
                console.error('❌ STOMP Error:', frame.headers['message']);
                set({ connectionStatus: 'error', isConnected: false });
            },

            onDisconnect: () => {
                console.log('🔌 STOMP Disconnected');
                set({
                    isConnected: false,
                    connectionStatus: 'disconnected',
                    stompClient: null
                });
            },

            onWebSocketClose: () => {
                console.log('WebSocket closed');
                set({
                    isConnected: false,
                    connectionStatus: 'disconnected'
                });
            },

            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                set({ connectionStatus: 'error', isConnected: false });
            }
        });

        client.activate();
        set({ stompClient: client });
    },

    // Disconnect from WebSocket server
    disconnect: () => {
        const { stompClient } = get();
        if (stompClient?.active) {
            stompClient.deactivate();
            set({
                stompClient: null,
                isConnected: false,
                connectionStatus: 'disconnected'
            });
        }
    },

    // Load message history from REST API
    loadMessageHistory: async (roomId: string | number, token: string) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${roomId}/messages`, {
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                const apiMessages = await response.json();
                console.log('🔍 Raw API messages:', apiMessages);
                console.log('🔍 First message timestamp fields:', apiMessages[0] ? {
                    timestamp: apiMessages[0].timestamp,
                    createdAt: apiMessages[0].createdAt,
                    sentAt: apiMessages[0].sentAt,
                    time: apiMessages[0].time
                } : 'No messages');
                // Transform messages to ensure timestamps are properly parsed
                // Try multiple possible field names for timestamp
                const messages: ChatMessage[] = apiMessages.map((msg: any) => ({
                    ...msg,
                    timestamp: parseTimestamp(msg.timestamp || msg.createdAt || msg.sentAt || msg.time)
                }));
                set({ messages, isLoading: false });
            } else {
                console.error('Failed to load messages:', response.status);
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error loading message history:', error);
            set({ isLoading: false });
        }
    },

    // Send a chat message via STOMP
    sendMessage: (message: string, isAdmin: boolean = false) => {
        const { stompClient, isConnected, roomId } = get();

        if (!stompClient?.active || !isConnected) {
            console.error('Cannot send message: Not connected');
            return;
        }

        // Use roomId if available, otherwise use 0 (backend will create new room)
        const effectiveRoomId = roomId || 0;

        const payload = {
            roomId: effectiveRoomId,
            message: message,
            admin: isAdmin
        };

        // Send to STOMP destination
        // Note: Backend will create room if roomId is 0 or doesn't exist
        stompClient.publish({
            destination: `/app/business/${effectiveRoomId}`,
            body: JSON.stringify(payload)
        });

        console.log('📤 Sent message:', payload);

        // Add optimistically with NEGATIVE temp ID so it can be replaced when real message arrives
        const optimisticMessage: ChatMessage = {
            id: -Date.now(), // Negative ID = temporary/optimistic
            roomId: typeof effectiveRoomId === 'string' ? parseInt(effectiveRoomId) : effectiveRoomId,
            sender: 'Me',
            message: message,
            admin: isAdmin,
            timestamp: new Date().toISOString()
        };

        get().addMessage(optimisticMessage);
    },

    // Send message via REST API (fallback when WebSocket not connected)
    sendMessageViaRest: async (message: string, token: string, isAdmin: boolean = false) => {
        const { roomId } = get();
        const effectiveRoomId = roomId || 0;

        const payload = {
            roomId: effectiveRoomId,
            message: message,
            admin: isAdmin
        };

        try {
            console.log('📤 REST API call to:', `${API_BASE_URL}/api/chat/send`);
            console.log('   Payload:', payload);

            const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedMessage: ChatMessage = await response.json();
                console.log('📤 Sent message via REST:', savedMessage);

                // Add to local state
                get().addMessage(savedMessage);

                // Update roomId if new room was created
                if (savedMessage.roomId && (!roomId || roomId === 0)) {
                    set({ roomId: savedMessage.roomId });
                }
            } else {
                console.error('Failed to send message via REST:', response.status);
            }
        } catch (error) {
            console.error('Error sending message via REST:', error);
        }
    },

    // Add a message to the list
    addMessage: (message: ChatMessage) => {
        set((state) => {
            // If this is a real message from backend (positive ID), check for optimistic message to replace
            if (message.id > 0) {
                const optimisticIndex = state.messages.findIndex(m =>
                    m.id < 0 && // Optimistic message has negative ID
                    m.message === message.message &&
                    Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
                );

                if (optimisticIndex !== -1) {
                    // Replace optimistic message with real one
                    console.log('✅ Replacing optimistic message with real message:', message.id);
                    const newMessages = [...state.messages];
                    newMessages[optimisticIndex] = message;

                    // Update roomId if needed
                    const newRoomId = (!state.roomId || state.roomId === 0) && message.roomId
                        ? message.roomId
                        : state.roomId;

                    return {
                        ...state,
                        messages: newMessages,
                        roomId: newRoomId,
                        unreadCount: message.admin ? state.unreadCount + 1 : state.unreadCount
                    };
                }
            }

            // Check if message already exists (prevent duplicates by ID)
            const exists = state.messages.some(m => m.id === message.id && m.id > 0);
            if (exists) {
                console.log('🔍 Duplicate message detected, skipping:', message.id);
                return state;
            }

            console.log('✅ Adding new message:', message);

            // Update roomId if this is from a new room (first message scenario)
            const newRoomId = (!state.roomId || state.roomId === 0) && message.roomId
                ? message.roomId
                : state.roomId;

            // If roomId changed and we have an active connection, subscribe to the new room topics
            if (newRoomId !== state.roomId && state.stompClient?.active) {
                const client = state.stompClient;
                const handleIncomingMessage = (msg: IMessage) => {
                    try {
                        const data: ChatMessage = JSON.parse(msg.body);
                        console.log('📨 Received message on new subscription:', data);
                        get().addMessage(data);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                };

                // Subscribe to the new room topic
                // Backend broadcasts to /topic/rooms/{roomId}
                client.subscribe(`/topic/rooms/${newRoomId}`, handleIncomingMessage);
                console.log('🔔 Subscribed to room topic:', newRoomId);
            }

            return {
                messages: [...state.messages, message],
                unreadCount: message.admin ? state.unreadCount + 1 : state.unreadCount,
                roomId: newRoomId
            };
        });
    },

    // Mark all messages as read
    markMessagesAsRead: () => {
        set({ unreadCount: 0 });
    },

    // Set typing status
    setTyping: (isTyping: boolean) => {
        set({ isTyping });
    },

    // Add a notification
    addNotification: (notification: Notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadNotifications: state.unreadNotifications + 1
        }));
    },

    // Mark a single notification as read
    markNotificationAsRead: (id: string) => {
        set((state) => {
            const notification = state.notifications.find(n => n.id === id);
            const wasUnread = notification && !notification.read;

            return {
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadNotifications: wasUnread
                    ? Math.max(0, state.unreadNotifications - 1)
                    : state.unreadNotifications
            };
        });
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadNotifications: 0
        }));
    },

    // Clear all notifications
    clearNotifications: () => {
        set({ notifications: [], unreadNotifications: 0 });
    },

    // Clear all messages
    clearMessages: () => {
        set({ messages: [], unreadCount: 0 });
    },

    // Set connection status manually
    setConnectionStatus: (status: ConnectionStatus) => {
        set({ connectionStatus: status, isConnected: status === 'connected' });
    }
}));

export default useChatStore;
