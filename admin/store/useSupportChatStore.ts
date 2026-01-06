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

// Support Ticket interface
export interface SupportTicket {
    id: string;
    companyId: string;
    companyName: string;
    companyLogo?: string;
    subject: string;
    status: 'open' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    messages: ChatMessage[];
    createdAt: Date;
}

// Admin Notification for new messages
export interface AdminNotification {
    id: string;
    ticketId: string;
    companyName: string;
    companyLogo?: string;
    timestamp: Date;
    read: boolean;
}

// Connection status
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface SupportChatState {
    // Connection
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    stompClient: Client | null;

    // Tickets
    tickets: SupportTicket[];
    selectedTicketId: string | null;
    isLoading: boolean;
    isViewingSupport: boolean; // Track if admin is on the support page

    // Notifications
    notifications: AdminNotification[];
    unreadNotificationCount: number;

    // Chat Widget
    isChatWidgetOpen: boolean;
    shouldOpenChatWithTicket: string | null; // Ticket ID to open when widget opens

    // Typing
    isTyping: boolean;
    typingCompanyId: string | null;

    // Actions - Connection
    connect: (token: string) => void;
    disconnect: () => void;

    // Actions - Tickets
    fetchTickets: (token: string) => Promise<void>;
    selectTicket: (ticketId: string) => void;
    createTicket: (companyId: string, subject: string) => void;
    closeTicket: (ticketId: string) => void;

    // Actions - Messages
    sendMessage: (content: string, ticketId?: string) => void;
    addMessage: (ticketId: string, message: ChatMessage) => void;
    markMessagesAsRead: (ticketId: string) => void;

    // Actions - Notifications
    addNotification: (ticketId: string, companyName: string, companyLogo?: string) => void;
    markAllNotificationsAsRead: () => void;
    clearNotifications: () => void;
    clearNotificationsForTicket: (ticketId: string) => void;

    // Actions - Chat Widget
    openChatWidget: (ticketId?: string) => void;
    closeChatWidget: () => void;

    // Utility
    getSelectedTicket: () => SupportTicket | undefined;
    setConnectionStatus: (status: ConnectionStatus) => void;
    setViewingSupport: (viewing: boolean) => void; // Set whether admin is viewing support page
}

// Backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';
const WS_URL = `${API_BASE_URL}/ws`;

// Helper function to parse timestamp from backend (handles array format from Java LocalDateTime)
const parseTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();

    // If it's already a valid ISO string
    if (typeof timestamp === 'string') {
        // Check if it's a valid date string
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

export const useSupportChatStore = create<SupportChatState>((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    stompClient: null,
    tickets: [],
    selectedTicketId: null,
    isLoading: false,
    isViewingSupport: false,
    notifications: [],
    unreadNotificationCount: 0,
    isChatWidgetOpen: false,
    shouldOpenChatWithTicket: null,
    isTyping: false,
    typingCompanyId: null,

    // Connect to WebSocket server using STOMP
    connect: (token: string) => {
        const { stompClient, connectionStatus } = get();

        // Prevent multiple connections
        if (stompClient?.active || connectionStatus === 'connecting') {
            console.log('Already connected or connecting...');
            return;
        }

        set({ connectionStatus: 'connecting' });
        console.log('Admin connecting to WebSocket...', WS_URL);

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
                console.log('✅ Admin STOMP Connected');
                set({
                    isConnected: true,
                    connectionStatus: 'connected',
                    stompClient: client
                });

                // Subscribe to all existing rooms for admin
                const { tickets } = get();
                tickets.forEach(ticket => {
                    console.log('Admin subscribing to room:', ticket.id);
                    client.subscribe(`/topic/rooms/${ticket.id}`, (message: IMessage) => {
                        try {
                            const data: ChatMessage = JSON.parse(message.body);
                            console.log('📨 Admin received message:', data);
                            get().addMessage(ticket.id, data);
                        } catch (error) {
                            console.error('Error parsing message:', error);
                        }
                    });
                });

                // Also subscribe to topic/rooms/0 for new room creation notifications
                client.subscribe(`/topic/rooms/0`, (message: IMessage) => {
                    try {
                        const data: ChatMessage = JSON.parse(message.body);
                        console.log('📨 Admin received message from new room:', data);

                        // Check if we already have this room
                        const existingTicket = get().tickets.find(t => t.id === data.roomId.toString());
                        if (!existingTicket && data.roomId) {
                            // New room created - subscribe to it and reload tickets
                            client.subscribe(`/topic/rooms/${data.roomId}`, (msg: IMessage) => {
                                try {
                                    const msgData: ChatMessage = JSON.parse(msg.body);
                                    console.log('📨 Admin received message:', msgData);
                                    get().addMessage(data.roomId.toString(), msgData);
                                } catch (err) {
                                    console.error('Error parsing message:', err);
                                }
                            });

                            // Add as new ticket
                            const newTicket: SupportTicket = {
                                id: data.roomId.toString(),
                                companyId: data.sender || 'unknown',
                                companyName: data.sender || 'New Company',
                                subject: 'Support Request',
                                status: 'open',
                                priority: 'medium',
                                lastMessage: data.message,
                                lastMessageTime: new Date(parseTimestamp(data.timestamp)),
                                unreadCount: 1,
                                messages: [data],
                                createdAt: new Date()
                            };

                            set(state => ({
                                tickets: [newTicket, ...state.tickets]
                            }));

                            // Add notification for new room/conversation
                            get().addNotification(newTicket.id, newTicket.companyName, newTicket.companyLogo);
                        } else if (existingTicket) {
                            // Room exists, add message
                            get().addMessage(data.roomId.toString(), data);
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                // Subscribe to admin notifications (for new message alerts from business users)
                client.subscribe('/user/queue/notifications', (message: IMessage) => {
                    try {
                        const notification = JSON.parse(message.body);
                        console.log('🔔 Admin received notification:', notification);
                        // Can be used to show toast notification or update bell icon
                        // For now just log it - the message will already appear in the ticket list
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

    // Fetch all chat rooms from API
    fetchTickets: async (token: string) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                const rooms = await response.json();

                // Fetch companies to get logo URLs - create maps by both ID and name
                let companiesMapById: Record<string, string> = {};
                let companiesMapByName: Record<string, string> = {};
                try {
                    const companiesResponse = await fetch(`${API_BASE_URL}/admin/company/all?page=0&size=100`, {
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    if (companiesResponse.ok) {
                        const companiesData = await companiesResponse.json();
                        // Parse response - handle different possible structures
                        let companies: any[] = [];
                        if (companiesData.success && Array.isArray(companiesData.companies)) {
                            companies = companiesData.companies;
                        } else if (Array.isArray(companiesData)) {
                            companies = companiesData;
                        } else if (companiesData.content && Array.isArray(companiesData.content)) {
                            companies = companiesData.content;
                        } else if (companiesData.data && Array.isArray(companiesData.data)) {
                            companies = companiesData.data;
                        }

                        console.log('🔍 Admin - Companies data:', companies);
                        companies.forEach((company: any) => {
                            if (company.logoUrl) {
                                if (company.id) {
                                    companiesMapById[company.id.toString()] = company.logoUrl;
                                }
                                if (company.name) {
                                    companiesMapByName[company.name.toLowerCase()] = company.logoUrl;
                                }
                            }
                        });
                        console.log('🔍 Admin - Companies logo map by ID:', companiesMapById);
                        console.log('🔍 Admin - Companies logo map by Name:', companiesMapByName);
                    }
                } catch (err) {
                    console.log('Could not fetch companies for logo mapping:', err);
                }

                // Transform API response to tickets format
                const tickets: SupportTicket[] = await Promise.all(
                    rooms.map(async (room: any) => {
                        console.log('🔍 Admin - Processing room:', room); // Debug room structure

                        // Fetch messages for each room
                        const messagesResponse = await fetch(`${API_BASE_URL}/api/chat/rooms/${room.id}/messages`, {
                            credentials: 'include',
                            headers: {
                                'ngrok-skip-browser-warning': 'true'
                            }
                        });

                        let messages: ChatMessage[] = [];
                        if (messagesResponse.ok) {
                            const apiMessages = await messagesResponse.json();

                            messages = apiMessages.map((msg: any) => ({
                                id: msg.id,
                                roomId: room.id,
                                sender: msg.sender,
                                message: msg.message,
                                admin: msg.admin || false,
                                // Try multiple possible field names for timestamp
                                timestamp: parseTimestamp(msg.timestamp || msg.createdAt || msg.sentAt || msg.time)
                            }));
                        }

                        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                        // Set unreadCount to 0 on load - only new real-time messages should be counted as unread
                        const unreadCount = 0;

                        // Get companyId and companyName for logo lookup
                        const companyId = room.userBusinessId?.toString() || room.userBusiness?.id?.toString() || 'unknown';
                        const companyName = room.userBusinessName || room.userBusiness?.name || room.name || 'Unknown Company';

                        // Try to get logo from: room data first, then from companies maps (by ID, then by name)
                        const companyLogo = room.userBusinessLogo || room.userBusiness?.logo || room.userBusiness?.logoUrl
                            || room.userBusiness?.avatar || room.userBusiness?.profileImage || room.userBusiness?.imageUrl
                            || companiesMapById[companyId]
                            || companiesMapByName[companyName.toLowerCase()];

                        console.log('🔍 Admin - Ticket logo lookup:', { companyId, companyName, companyLogo });

                        return {
                            id: room.id.toString(),
                            companyId,
                            // Use userBusinessName (company name) instead of room.name (email)
                            companyName,
                            // Map logo from various possible fields + companies map fallback
                            companyLogo,
                            subject: 'Support Request',
                            // Use backend status if available, otherwise infer from last message
                            status: room.status
                                ? (room.status.toLowerCase() === 'closed' ? 'closed' as const : 'open' as const)
                                : ((lastMessage?.message?.includes('🔒') && lastMessage?.admin) ? 'closed' as const : 'open' as const),
                            priority: 'medium' as const,
                            lastMessage: lastMessage?.message || '',
                            lastMessageTime: lastMessage ? new Date(parseTimestamp(lastMessage.timestamp)) : new Date(),
                            unreadCount,
                            messages,
                            createdAt: new Date(parseTimestamp(room.createdAt))
                        };
                    })
                );

                set({
                    tickets,
                    isLoading: false,
                    selectedTicketId: tickets.length > 0 ? tickets[0].id : null
                });

                // Subscribe to all rooms after loading
                const { stompClient } = get();
                if (stompClient?.active) {
                    tickets.forEach(ticket => {
                        stompClient.subscribe(`/topic/rooms/${ticket.id}`, (message: IMessage) => {
                            try {
                                const data: ChatMessage = JSON.parse(message.body);
                                console.log('📨 Admin received message:', data);
                                get().addMessage(ticket.id, data);
                            } catch (error) {
                                console.error('Error parsing message:', error);
                            }
                        });
                    });
                }
            } else {
                console.error('Failed to fetch rooms:', response.status);
                set({ isLoading: false, tickets: [] });
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            set({ isLoading: false, tickets: [] });
        }
    },

    // Select a ticket
    selectTicket: (ticketId: string) => {
        set({ selectedTicketId: ticketId });
        get().markMessagesAsRead(ticketId);
        get().clearNotificationsForTicket(ticketId);
    },

    // Create new ticket
    createTicket: (companyId: string, subject: string) => {
        const newTicket: SupportTicket = {
            id: Date.now().toString(),
            companyId,
            companyName: 'New Company',
            subject,
            status: 'open',
            priority: 'medium',
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0,
            createdAt: new Date(),
            messages: []
        };
        set(state => ({
            tickets: [newTicket, ...state.tickets],
            selectedTicketId: newTicket.id
        }));
    },

    // Close ticket and notify business via WebSocket
    closeTicket: (ticketId: string) => {
        const { stompClient, isConnected } = get();

        // Update local state
        set(state => ({
            tickets: state.tickets.map(t =>
                t.id === ticketId ? { ...t, status: 'closed' as const } : t
            )
        }));

        // Send system message to notify business
        if (stompClient?.active && isConnected) {
            const payload = {
                roomId: parseInt(ticketId),
                message: 'Yêu cầu hỗ trợ đã được đóng. Nếu bạn cần hỗ trợ thêm, vui lòng gửi tin nhắn mới.',
                admin: true
            };

            stompClient.publish({
                destination: `/app/business/${ticketId}`,
                body: JSON.stringify(payload)
            });

            console.log('📤 Sent ticket closed notification:', payload);
        }
    },

    // Send message via STOMP
    sendMessage: (content: string, ticketId?: string) => {
        const { stompClient, isConnected, selectedTicketId, tickets } = get();
        const targetTicketId = ticketId || selectedTicketId;

        if (!stompClient?.active || !isConnected || !targetTicketId) {
            console.error('Cannot send message: Not connected or no ticket');
            return;
        }

        const ticket = tickets.find(t => t.id === targetTicketId);
        if (!ticket) return;

        const payload = {
            roomId: parseInt(targetTicketId),
            message: content,
            admin: true // Admin sending message
        };

        // Send to STOMP destination
        stompClient.publish({
            destination: `/app/business/${targetTicketId}`,
            body: JSON.stringify(payload)
        });

        console.log('📤 Admin sent message:', payload);
    },

    // Add message to a ticket
    addMessage: (ticketId: string, message: ChatMessage) => {
        const { selectedTicketId, isViewingSupport, tickets, addNotification } = get();
        // Only consider "viewing" if admin is on support page AND has this ticket selected
        const isViewingThisTicket = isViewingSupport && selectedTicketId === ticketId;

        // Find ticket to get company info for notification
        const ticket = tickets.find(t => t.id === ticketId);

        set(state => ({
            tickets: state.tickets.map(t => {
                if (t.id === ticketId) {
                    // Check if message already exists
                    const exists = t.messages.some(m => m.id === message.id);
                    if (exists) return t;

                    // Reopen ticket if it's closed and message is from business (not admin)
                    const newStatus = (!message.admin && t.status === 'closed')
                        ? 'open' as const
                        : t.status;

                    // Only increment unread count if:
                    // 1. Message is not from admin (it's from business user)
                    // 2. Admin is NOT currently viewing this ticket on support page
                    const shouldIncrementUnread = !message.admin && !isViewingThisTicket;

                    return {
                        ...t,
                        status: newStatus,
                        messages: [...t.messages, message],
                        lastMessage: message.message,
                        lastMessageTime: new Date(message.timestamp),
                        unreadCount: shouldIncrementUnread
                            ? t.unreadCount + 1
                            : t.unreadCount
                    };
                }
                return t;
            })
        }));

        // Add notification if message is from business user (not admin)
        // Always show notification in header bell icon
        if (!message.admin && ticket) {
            addNotification(ticketId, ticket.companyName, ticket.companyLogo);
        }
    },

    // Mark messages as read
    markMessagesAsRead: (ticketId: string) => {
        set(state => ({
            tickets: state.tickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return {
                        ...ticket,
                        unreadCount: 0
                    };
                }
                return ticket;
            })
        }));
    },

    // Get selected ticket
    getSelectedTicket: () => {
        const { tickets, selectedTicketId } = get();
        return tickets.find(t => t.id === selectedTicketId);
    },

    // Set connection status
    setConnectionStatus: (status: ConnectionStatus) => {
        set({ connectionStatus: status, isConnected: status === 'connected' });
    },

    // Add notification for new message
    addNotification: (ticketId: string, companyName: string, companyLogo?: string) => {
        const notification: AdminNotification = {
            id: `notif_${Date.now()}`,
            ticketId,
            companyName,
            companyLogo,
            timestamp: new Date(),
            read: false
        };
        set(state => ({
            notifications: [notification, ...state.notifications].slice(0, 20), // Keep max 20 notifications
            unreadNotificationCount: state.unreadNotificationCount + 1
        }));
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: () => {
        set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadNotificationCount: 0
        }));
    },

    // Clear all notifications
    clearNotifications: () => {
        set({ notifications: [], unreadNotificationCount: 0 });
    },

    // Clear notifications for a specific ticket
    clearNotificationsForTicket: (ticketId: string) => {
        set(state => {
            const notificationsToRemove = state.notifications.filter(n => n.ticketId === ticketId && !n.read);
            return {
                notifications: state.notifications.filter(n => n.ticketId !== ticketId),
                unreadNotificationCount: Math.max(0, state.unreadNotificationCount - notificationsToRemove.length)
            };
        });
    },

    // Open chat widget (optionally with a specific ticket)
    openChatWidget: (ticketId?: string) => {
        if (ticketId) {
            set({
                isChatWidgetOpen: true,
                shouldOpenChatWithTicket: ticketId,
                selectedTicketId: ticketId
            });
            // Clear notifications for this ticket
            get().clearNotificationsForTicket(ticketId);
            get().markMessagesAsRead(ticketId);
        } else {
            set({ isChatWidgetOpen: true, shouldOpenChatWithTicket: null });
        }
    },

    // Close chat widget
    closeChatWidget: () => {
        set({ isChatWidgetOpen: false, shouldOpenChatWithTicket: null });
    },

    // Set whether admin is viewing support page
    setViewingSupport: (viewing: boolean) => {
        set({ isViewingSupport: viewing });
    }
}));

export default useSupportChatStore;
