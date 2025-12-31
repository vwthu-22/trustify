import { create } from 'zustand';

// Message interface
export interface ChatMessage {
    id: string;
    content: string;
    sender: 'admin' | 'company';
    senderName: string;
    senderAvatar?: string;
    timestamp: Date;
    read: boolean;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
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

// Connection status
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface SupportChatState {
    // Connection
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    socket: WebSocket | null;

    // Tickets
    tickets: SupportTicket[];
    selectedTicketId: string | null;
    isLoading: boolean;

    // Typing
    isTyping: boolean;
    typingCompanyId: string | null;

    // Actions - Connection
    connect: () => void;
    disconnect: () => void;

    // Actions - Tickets
    fetchTickets: () => Promise<void>;
    selectTicket: (ticketId: string) => void;
    createTicket: (companyId: string, subject: string) => void;
    closeTicket: (ticketId: string) => void;

    // Actions - Messages
    sendMessage: (content: string, ticketId?: string) => void;
    addMessage: (ticketId: string, message: ChatMessage) => void;
    markMessagesAsRead: (ticketId: string) => void;

    // Utility
    getSelectedTicket: () => SupportTicket | undefined;
    setConnectionStatus: (status: ConnectionStatus) => void;
}

// WebSocket server URL
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://your-backend.com/ws/admin';

// Mock tickets for demo
const mockTickets: SupportTicket[] = [
    {
        id: '1',
        companyId: 'comp-1',
        companyName: 'Tech Solutions',
        subject: 'Integration Issue',
        status: 'open',
        priority: 'high',
        lastMessage: 'We are having trouble connecting...',
        lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
        unreadCount: 2,
        createdAt: new Date(Date.now() - 86400000),
        messages: [
            {
                id: 'm1',
                content: 'Hi, we are having trouble connecting our website to the Trustify widget. The API key seems to be invalid.',
                sender: 'company',
                senderName: 'Tech Solutions',
                timestamp: new Date(Date.now() - 600000),
                read: true,
                type: 'text'
            },
            {
                id: 'm2',
                content: 'Hello! I can help you with that. Have you checked if your domain is whitelisted in the integration settings?',
                sender: 'admin',
                senderName: 'Admin Support',
                timestamp: new Date(Date.now() - 300000),
                read: true,
                type: 'text'
            }
        ]
    },
    {
        id: '2',
        companyId: 'comp-2',
        companyName: 'Sunrise Cafe',
        subject: 'Billing Question',
        status: 'open',
        priority: 'medium',
        lastMessage: 'Can I upgrade my plan mid-month?',
        lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
        unreadCount: 0,
        createdAt: new Date(Date.now() - 172800000),
        messages: [
            {
                id: 'm3',
                content: 'Hi! Can I upgrade my plan mid-month? Will I be charged the full price?',
                sender: 'company',
                senderName: 'Sunrise Cafe',
                timestamp: new Date(Date.now() - 3600000),
                read: true,
                type: 'text'
            }
        ]
    },
    {
        id: '3',
        companyId: 'comp-3',
        companyName: 'Green Earth',
        subject: 'Feature Request',
        status: 'open',
        priority: 'low',
        lastMessage: 'It would be great if we could...',
        lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
        unreadCount: 0,
        createdAt: new Date(Date.now() - 259200000),
        messages: [
            {
                id: 'm4',
                content: 'It would be great if we could export our reviews to CSV format. Is this feature planned?',
                sender: 'company',
                senderName: 'Green Earth',
                timestamp: new Date(Date.now() - 86400000),
                read: true,
                type: 'text'
            }
        ]
    },
    {
        id: '4',
        companyId: 'user-1',
        companyName: 'John Doe',
        subject: 'Account Access',
        status: 'closed',
        priority: 'medium',
        lastMessage: 'Thank you! Issue resolved.',
        lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
        unreadCount: 0,
        createdAt: new Date(Date.now() - 345600000),
        messages: [
            {
                id: 'm5',
                content: 'I forgot my password and can\'t access my account.',
                sender: 'company',
                senderName: 'John Doe',
                timestamp: new Date(Date.now() - 10800000),
                read: true,
                type: 'text'
            },
            {
                id: 'm6',
                content: 'I\'ve sent a password reset link to your email. Please check your inbox.',
                sender: 'admin',
                senderName: 'Admin Support',
                timestamp: new Date(Date.now() - 9000000),
                read: true,
                type: 'text'
            },
            {
                id: 'm7',
                content: 'Thank you! Issue resolved.',
                sender: 'company',
                senderName: 'John Doe',
                timestamp: new Date(Date.now() - 7200000),
                read: true,
                type: 'text'
            }
        ]
    }
];

export const useSupportChatStore = create<SupportChatState>((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    socket: null,
    tickets: [],
    selectedTicketId: null,
    isLoading: false,
    isTyping: false,
    typingCompanyId: null,

    // Connect to WebSocket server
    connect: () => {
        const { socket, connectionStatus } = get();

        if (socket || connectionStatus === 'connecting') {
            console.log('Already connected or connecting...');
            return;
        }

        set({ connectionStatus: 'connecting' });
        console.log('Admin connecting to WebSocket...', WS_BASE_URL);

        try {
            const ws = new WebSocket(WS_BASE_URL);

            ws.onopen = () => {
                console.log('✅ Admin WebSocket connected');
                set({
                    isConnected: true,
                    connectionStatus: 'connected',
                    socket: ws
                });
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Admin received:', data);

                    switch (data.type) {
                        case 'new_message':
                            // New message from a company
                            get().addMessage(data.ticketId, {
                                id: data.id || Date.now().toString(),
                                content: data.content,
                                sender: 'company',
                                senderName: data.senderName,
                                timestamp: new Date(data.timestamp || Date.now()),
                                read: false,
                                type: 'text'
                            });
                            break;

                        case 'new_ticket':
                            // New support ticket created
                            const newTicket: SupportTicket = {
                                id: data.ticketId,
                                companyId: data.companyId,
                                companyName: data.companyName,
                                subject: data.subject || 'New Support Request',
                                status: 'open',
                                priority: 'medium',
                                lastMessage: data.content,
                                lastMessageTime: new Date(),
                                unreadCount: 1,
                                createdAt: new Date(),
                                messages: [{
                                    id: Date.now().toString(),
                                    content: data.content,
                                    sender: 'company',
                                    senderName: data.companyName,
                                    timestamp: new Date(),
                                    read: false,
                                    type: 'text'
                                }]
                            };
                            set(state => ({
                                tickets: [newTicket, ...state.tickets]
                            }));
                            break;

                        case 'typing':
                            set({
                                isTyping: data.isTyping,
                                typingCompanyId: data.companyId
                            });
                            break;

                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onclose = (event) => {
                console.log('🔌 Admin WebSocket disconnected');
                set({
                    isConnected: false,
                    connectionStatus: 'disconnected',
                    socket: null
                });

                // Auto-reconnect
                if (event.code !== 1000) {
                    setTimeout(() => get().connect(), 5000);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                set({ connectionStatus: 'error', isConnected: false });
            };

            set({ socket: ws });
        } catch (error) {
            console.error('Failed to connect:', error);
            set({ connectionStatus: 'error' });
        }
    },

    // Disconnect
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close(1000, 'Admin disconnecting');
            set({ socket: null, isConnected: false, connectionStatus: 'disconnected' });
        }
    },

    // Fetch tickets (mock for now)
    fetchTickets: async () => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        set({
            tickets: mockTickets,
            isLoading: false,
            // Select first ticket by default
            selectedTicketId: mockTickets.length > 0 ? mockTickets[0].id : null
        });
    },

    // Select a ticket
    selectTicket: (ticketId: string) => {
        set({ selectedTicketId: ticketId });
        get().markMessagesAsRead(ticketId);
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

    // Close ticket
    closeTicket: (ticketId: string) => {
        set(state => ({
            tickets: state.tickets.map(t =>
                t.id === ticketId ? { ...t, status: 'closed' as const } : t
            )
        }));
    },

    // Send message
    sendMessage: (content: string, ticketId?: string) => {
        const { socket, isConnected, selectedTicketId, tickets } = get();
        const targetTicketId = ticketId || selectedTicketId;

        if (!targetTicketId) {
            console.error('No ticket selected');
            return;
        }

        const ticket = tickets.find(t => t.id === targetTicketId);
        if (!ticket) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            content,
            sender: 'admin',
            senderName: 'Admin Support',
            timestamp: new Date(),
            read: true,
            type: 'text'
        };

        // Add message locally
        get().addMessage(targetTicketId, message);

        // Send via WebSocket if connected
        if (socket && isConnected) {
            socket.send(JSON.stringify({
                type: 'admin_reply',
                ticketId: targetTicketId,
                companyId: ticket.companyId,
                content,
                timestamp: message.timestamp.toISOString()
            }));
        }
    },

    // Add message to a ticket
    addMessage: (ticketId: string, message: ChatMessage) => {
        set(state => ({
            tickets: state.tickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return {
                        ...ticket,
                        messages: [...ticket.messages, message],
                        lastMessage: message.content,
                        lastMessageTime: message.timestamp,
                        unreadCount: message.sender === 'company' && !message.read
                            ? ticket.unreadCount + 1
                            : ticket.unreadCount
                    };
                }
                return ticket;
            })
        }));
    },

    // Mark messages as read
    markMessagesAsRead: (ticketId: string) => {
        set(state => ({
            tickets: state.tickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return {
                        ...ticket,
                        unreadCount: 0,
                        messages: ticket.messages.map(m => ({ ...m, read: true }))
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
    }
}));

export default useSupportChatStore;
