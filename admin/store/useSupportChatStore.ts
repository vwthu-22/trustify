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

    // Utility
    getSelectedTicket: () => SupportTicket | undefined;
    setConnectionStatus: (status: ConnectionStatus) => void;
}

// Backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';
const WS_URL = `${API_BASE_URL}/ws`;

export const useSupportChatStore = create<SupportChatState>((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    stompClient: null,
    tickets: [],
    selectedTicketId: null,
    isLoading: false,
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

                // Subscribe to all rooms for admin
                // Admin will subscribe to each room dynamically when tickets are loaded
                const { tickets } = get();
                tickets.forEach(ticket => {
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const rooms = await response.json();

                // Transform API response to tickets format
                const tickets: SupportTicket[] = await Promise.all(
                    rooms.map(async (room: any) => {
                        // Fetch messages for each room
                        const messagesResponse = await fetch(`${API_BASE_URL}/api/chat/rooms/${room.id}/messages`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
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
                                timestamp: msg.timestamp || new Date().toISOString()
                            }));
                        }

                        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                        const unreadCount = messages.filter(m => !m.admin).length;

                        return {
                            id: room.id.toString(),
                            companyId: room.userBusiness?.id?.toString() || 'unknown',
                            companyName: room.name || 'Unknown Company',
                            subject: 'Support Request',
                            status: 'open' as const,
                            priority: 'medium' as const,
                            lastMessage: lastMessage?.message || '',
                            lastMessageTime: lastMessage ? new Date(lastMessage.timestamp) : new Date(),
                            unreadCount,
                            messages,
                            createdAt: new Date(room.createdAt || Date.now())
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
        set(state => ({
            tickets: state.tickets.map(ticket => {
                if (ticket.id === ticketId) {
                    // Check if message already exists
                    const exists = ticket.messages.some(m => m.id === message.id);
                    if (exists) return ticket;

                    return {
                        ...ticket,
                        messages: [...ticket.messages, message],
                        lastMessage: message.message,
                        lastMessageTime: new Date(message.timestamp),
                        unreadCount: !message.admin
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
    }
}));

export default useSupportChatStore;
