'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, Clock, MoreVertical, Send, Paperclip, X, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useSupportChatStore, SupportTicket, ChatMessage } from '@/store/useSupportChatStore';
import { useTranslations } from 'next-intl';

export default function SupportPage() {
    const t = useTranslations('support');
    const tCommon = useTranslations('common');

    const {
        tickets,
        selectedTicketId,
        isConnected,
        connectionStatus,
        isTyping,
        typingCompanyId,
        isLoading,
        connect,
        fetchTickets,
        selectTicket,
        sendMessage,
        closeTicket,
        getSelectedTicket
    } = useSupportChatStore();

    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize on mount
    useEffect(() => {
        // For demo, use mock data. In production, uncomment connect()
        // connect();
        fetchTickets();

        // Simulate connected status
        useSupportChatStore.setState({ isConnected: true, connectionStatus: 'connected' });
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedTicketId, tickets]);

    const selectedTicket = getSelectedTicket();

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedTicketId) return;

        sendMessage(newMessage);
        setNewMessage('');
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffMs = now.getTime() - messageDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('justNow');
        if (diffMins < 60) return `${diffMins}${t('mAgo')}`;
        if (diffHours < 24) return `${diffHours}${t('hAgo')}`;
        if (diffDays < 7) return `${diffDays}${t('dAgo')}`;
        return messageDate.toLocaleDateString();
    };

    const formatMessageTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-600';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'open': return t('status.open');
            case 'closed': return t('status.closed');
            case 'pending': return t('status.pending');
            default: return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500';
            case 'medium': return 'border-l-yellow-500';
            case 'low': return 'border-l-green-500';
            default: return 'border-l-gray-300';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const totalUnread = tickets.reduce((sum, t) => sum + t.unreadCount, 0);

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Ticket List */}
            <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900">{t('tickets')}</h2>
                            {totalUnread > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-500">
                                {connectionStatus === 'connected' ? t('live') : t('offline')}
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${filterStatus === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {t('all')} ({tickets.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('open')}
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${filterStatus === 'open' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {t('open')} ({tickets.filter(t => t.status === 'open').length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('closed')}
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition ${filterStatus === 'closed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {t('closed')} ({tickets.filter(t => t.status === 'closed').length})
                        </button>
                    </div>
                </div>

                {/* Ticket List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm">{t('noTickets')}</p>
                        </div>
                    ) : (
                        filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => selectTicket(ticket.id)}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getPriorityColor(ticket.priority)} ${selectedTicketId === ticket.id ? 'bg-blue-50 hover:bg-blue-50' : ''
                                    } ${ticket.unreadCount > 0 ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-semibold text-sm ${ticket.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {ticket.companyName}
                                        </span>
                                        {ticket.unreadCount > 0 && (
                                            <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {ticket.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">{formatTime(ticket.lastMessageTime)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`text-sm ${ticket.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        {ticket.subject}
                                    </h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                                        {getStatusText(ticket.status)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{ticket.lastMessage}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {selectedTicket ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="font-bold text-white text-sm">{getInitials(selectedTicket.companyName)}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{selectedTicket.companyName}</h3>
                                    <p className="text-xs text-gray-500">
                                        {t('ticket')} #{selectedTicket.id} • {selectedTicket.subject}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedTicket.status === 'open' && (
                                    <button
                                        onClick={() => closeTicket(selectedTicket.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {t('closeTicket')}
                                    </button>
                                )}
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {selectedTicket.messages.map((message) => (
                                <div key={message.id} className={`flex gap-4 ${message.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${message.sender === 'admin'
                                            ? 'bg-blue-600'
                                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                        }`}>
                                        <span className="text-xs font-bold text-white">
                                            {message.sender === 'admin' ? 'AD' : getInitials(message.senderName)}
                                        </span>
                                    </div>
                                    <div className={`p-4 rounded-2xl shadow-sm max-w-[70%] ${message.sender === 'admin'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                        }`}>
                                        <p className="text-sm">{message.content}</p>
                                        <span className={`text-xs mt-2 block ${message.sender === 'admin' ? 'text-blue-100' : 'text-gray-400'
                                            }`}>
                                            {formatMessageTime(message.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && typingCompanyId === selectedTicket.companyId && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-bold text-white">
                                            {getInitials(selectedTicket.companyName)}
                                        </span>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        {selectedTicket.status === 'open' ? (
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t('typeReply')}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-sm">{t('ticketClosed')}</span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // No ticket selected
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">{t('noConversation')}</h3>
                            <p className="text-sm text-gray-500">{t('selectTicket')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
