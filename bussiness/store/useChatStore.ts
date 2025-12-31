import { create } from 'zustand';

// Message interface
export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'admin';
    senderName: string;
    senderAvatar?: string;
    timestamp: Date;
    read: boolean;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
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
    socket: WebSocket | null;

    // Messages
    messages: ChatMessage[];
    isTyping: boolean;
    unreadCount: number;

    // Notifications
    notifications: Notification[];
    unreadNotifications: number;

    // Actions - Connection
    connect: (companyId: string) => void;
    disconnect: () => void;

    // Actions - Messages
    sendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
    addMessage: (message: ChatMessage) => void;
    markMessagesAsRead: () => void;
    setTyping: (isTyping: boolean) => void;

    // Actions - Notifications
    addNotification: (notification: Notification) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    clearNotifications: () => void;

    // Actions - Utility
    clearMessages: () => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
}

// WebSocket server URL - Update this with your actual backend URL
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://your-backend.com/ws';

export const useChatStore = create<ChatState>((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    socket: null,
    messages: [],
    isTyping: false,
    unreadCount: 0,
    notifications: [],
    unreadNotifications: 0,

    // Connect to WebSocket server
    connect: (companyId: string) => {
        const { socket, connectionStatus } = get();

        // Prevent multiple connections
        if (socket || connectionStatus === 'connecting') {
            console.log('Already connected or connecting...');
            return;
        }

        set({ connectionStatus: 'connecting' });
        console.log('Connecting to WebSocket...', `${WS_BASE_URL}?companyId=${companyId}`);

        try {
            const ws = new WebSocket(`${WS_BASE_URL}?companyId=${companyId}`);

            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                set({
                    isConnected: true,
                    connectionStatus: 'connected',
                    socket: ws
                });
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Received message:', data);

                    // Handle different message types
                    switch (data.type) {
                        case 'chat_message':
                            get().addMessage({
                                id: data.id || Date.now().toString(),
                                content: data.content,
                                sender: data.sender,
                                senderName: data.senderName || 'Admin',
                                timestamp: new Date(data.timestamp || Date.now()),
                                read: false,
                                type: 'text'
                            });
                            break;

                        case 'typing':
                            set({ isTyping: data.isTyping });
                            break;

                        case 'notification':
                            get().addNotification({
                                id: data.id || Date.now().toString(),
                                type: data.notificationType || 'system',
                                title: data.title,
                                message: data.message,
                                timestamp: new Date(data.timestamp || Date.now()),
                                read: false,
                                link: data.link,
                                data: data.data
                            });
                            break;

                        case 'new_review':
                            get().addNotification({
                                id: data.id || Date.now().toString(),
                                type: 'new_review',
                                title: 'New Review',
                                message: `${data.userName} left a ${data.rating}-star review`,
                                timestamp: new Date(data.timestamp || Date.now()),
                                read: false,
                                link: `/reviews`,
                                data: { reviewId: data.reviewId, rating: data.rating }
                            });
                            break;

                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                set({
                    isConnected: false,
                    connectionStatus: 'disconnected',
                    socket: null
                });

                // Auto-reconnect after 5 seconds if not intentionally closed
                if (event.code !== 1000) {
                    console.log('Attempting to reconnect in 5 seconds...');
                    setTimeout(() => {
                        get().connect(companyId);
                    }, 5000);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                set({
                    connectionStatus: 'error',
                    isConnected: false
                });
            };

            set({ socket: ws });

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            set({ connectionStatus: 'error' });
        }
    },

    // Disconnect from WebSocket server
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close(1000, 'Client disconnecting');
            set({
                socket: null,
                isConnected: false,
                connectionStatus: 'disconnected'
            });
        }
    },

    // Send a chat message
    sendMessage: (content: string, type: 'text' | 'image' | 'file' = 'text') => {
        const { socket, isConnected } = get();

        if (!socket || !isConnected) {
            console.error('Cannot send message: Not connected');
            return;
        }

        const message: ChatMessage = {
            id: Date.now().toString(),
            content,
            sender: 'user',
            senderName: 'Company', // Will be replaced with actual company name
            timestamp: new Date(),
            read: true,
            type
        };

        // Add to local messages immediately (optimistic update)
        get().addMessage(message);

        // Send to server
        socket.send(JSON.stringify({
            type: 'chat_message',
            content,
            messageType: type,
            timestamp: message.timestamp.toISOString()
        }));
    },

    // Add a message to the list
    addMessage: (message: ChatMessage) => {
        set((state) => ({
            messages: [...state.messages, message],
            unreadCount: message.sender === 'admin' && !message.read
                ? state.unreadCount + 1
                : state.unreadCount
        }));
    },

    // Mark all messages as read
    markMessagesAsRead: () => {
        set((state) => ({
            messages: state.messages.map(msg => ({ ...msg, read: true })),
            unreadCount: 0
        }));
    },

    // Set typing status
    setTyping: (isTyping: boolean) => {
        const { socket } = get();
        set({ isTyping });

        // Notify server about typing status
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'typing',
                isTyping
            }));
        }
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

// Hook for auto-connecting when component mounts
export const useAutoConnect = (companyId: string | undefined) => {
    const { connect, disconnect, isConnected } = useChatStore();

    // This should be called in a useEffect in the component
    const initConnection = () => {
        if (companyId && !isConnected) {
            connect(companyId);
        }
    };

    const cleanup = () => {
        disconnect();
    };

    return { initConnection, cleanup };
};

export default useChatStore;
