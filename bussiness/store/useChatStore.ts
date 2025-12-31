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
    connect: (token: string, roomId: string | number) => void;
    disconnect: () => void;

    // Actions - Messages
    sendMessage: (message: string, isAdmin?: boolean) => void;
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
    connect: (token: string, roomId: string | number) => {
        const { stompClient, connectionStatus } = get();

        // Prevent multiple connections
        if (stompClient?.active || connectionStatus === 'connecting') {
            console.log('Already connected or connecting...');
            return;
        }

        set({ connectionStatus: 'connecting', roomId });
        console.log('Connecting to WebSocket...', WS_URL);

        const client = new Client({
            webSocketFactory: () => new SockJS(`${WS_URL}?token=${token}`),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
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

                // Subscribe to room messages
                client.subscribe(`/topic/rooms/${roomId}`, (message: IMessage) => {
                    try {
                        const data: ChatMessage = JSON.parse(message.body);
                        console.log('📨 Received message:', data);
                        get().addMessage(data);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                // Load message history after connecting
                get().loadMessageHistory(roomId, token);
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const messages: ChatMessage[] = await response.json();
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

        if (!stompClient?.active || !isConnected || !roomId) {
            console.error('Cannot send message: Not connected or no room');
            return;
        }

        const payload = {
            roomId: roomId,
            message: message,
            admin: isAdmin
        };

        // Send to STOMP destination
        stompClient.publish({
            destination: `/app/business/${roomId}`,
            body: JSON.stringify(payload)
        });

        console.log('📤 Sent message:', payload);
    },

    // Add a message to the list
    addMessage: (message: ChatMessage) => {
        set((state) => {
            // Check if message already exists (prevent duplicates)
            const exists = state.messages.some(m => m.id === message.id);
            if (exists) return state;

            return {
                messages: [...state.messages, message],
                unreadCount: message.admin ? state.unreadCount + 1 : state.unreadCount
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
