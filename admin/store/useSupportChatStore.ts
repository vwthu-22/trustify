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
                                lastMessageTime: new Date(data.timestamp),
                                unreadCount: 1,
                                messages: [data],
                                createdAt: new Date()
                            };

                            set(state => ({
                                tickets: [newTicket, ...state.tickets]
                            }));
                        } else if (existingTicket) {
                            // Room exists, add message
                            get().addMessage(data.roomId.toString(), data);
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
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

                // Transform API response to tickets format
                const tickets: SupportTicket[] = await Promise.all(
                    rooms.map(async (room: any) => {
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
                                timestamp: msg.timestamp || new Date().toISOString()
                            }));
                        }

                        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                        // Set unreadCount to 0 on load - only new real-time messages should be counted as unread
                        const unreadCount = 0;

                        return {
                            id: room.id.toString(),
                            companyId: room.userBusinessId?.toString() || room.userBusiness?.id?.toString() || 'unknown',
                            // Use userBusinessName (company name) instead of room.name (email)
                            companyName: room.userBusinessName || room.userBusiness?.name || room.name || 'Unknown Company',
                            subject: 'Support Request',
                            // Infer status from last message - if it's the close notification, status is closed
                            status: (lastMessage?.message?.includes('🔒') && lastMessage?.admin) ? 'closed' as const : 'open' as const,
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
        set(state => ({
            tickets: state.tickets.map(ticket => {
                if (ticket.id === ticketId) {
                    // Check if message already exists
                    const exists = ticket.messages.some(m => m.id === message.id);
                    if (exists) return ticket;

                    // Reopen ticket if it's closed and message is from business (not admin)
                    const newStatus = (!message.admin && ticket.status === 'closed')
                        ? 'open' as const
                        : ticket.status;

                    return {
                        ...ticket,
                        status: newStatus,
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
