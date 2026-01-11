'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Paperclip, Minimize2, Maximize2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useSupportChatStore, SupportTicket, ChatMessage } from '@/store/useSupportChatStore';
import { useTranslations } from 'next-intl';

export default function ChatWidget() {
    const t = useTranslations('support');

    const {
        tickets,
        selectedTicketId,
        isConnected,
        isTyping,
        typingCompanyId,
        isLoading,
        selectTicket,
        sendMessage,
        getSelectedTicket,
        addMessage,
        unreadNotificationCount,
        isChatWidgetOpen,
        shouldOpenChatWithTicket,
        openChatWidget,
        closeChatWidget
    } = useSupportChatStore();

    const [isMinimized, setIsMinimized] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle opening specific ticket from notification
    useEffect(() => {
        if (shouldOpenChatWithTicket && isChatWidgetOpen) {
            setShowChat(true);
        }
    }, [shouldOpenChatWithTicket, isChatWidgetOpen]);



    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (isChatWidgetOpen && !isMinimized && showChat) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedTicketId, tickets, isChatWidgetOpen, isMinimized, showChat]);

    const selectedTicket = getSelectedTicket();

    // Filter tickets by search
    const filteredTickets = tickets.filter(ticket =>
        ticket.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectTicket = (ticketId: string) => {
        selectTicket(ticketId);
        setShowChat(true);
    };

    const handleBackToList = () => {
        setShowChat(false);
        selectTicket('');
    };

    const handleClose = () => {
        closeChatWidget();
        setShowChat(false);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedTicketId) return;

        if (isConnected) {
            sendMessage(newMessage, selectedTicketId);
        } else {
            const newMsg: ChatMessage = {
                id: Date.now(),
                roomId: parseInt(selectedTicketId),
                sender: 'Admin',
                message: newMessage,
                admin: true,
                timestamp: new Date().toISOString()
            };
            addMessage(selectedTicketId, newMsg);
        }
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

        if (diffMins < 1) return t('justNow');
        if (diffMins < 60) return `${diffMins}m`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
        return messageDate.toLocaleDateString('vi-VN');
    };

    const formatMessageTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Use unreadNotificationCount as the primary source for the global badge to avoid double-counting
    // (unreadNotificationCount is persistent via localStorage and synced with ticket unread counts)
    const displayCount = unreadNotificationCount;

    if (!isChatWidgetOpen) {
        return (
            <button
                onClick={() => openChatWidget()}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
            >
                <MessageSquare className="w-6 h-6 text-white" />
                {displayCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {displayCount > 9 ? '9+' : displayCount}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'w-80 h-14' : 'w-[380px] h-[600px]'}`}>
            {/* Header - List View */}
            {!showChat && (
                <div className="flex-none flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md z-10 h-[60px] rounded-t-2xl">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center relative">
                            <MessageSquare className="w-5 h-5 text-white" />
                            {displayCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                                    {displayCount > 9 ? '9+' : displayCount}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base leading-tight">{t('tickets') || "Support Tickets"}</span>
                            <span className="text-xs opacity-90 font-medium flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`}></span>
                                {isConnected ? t('systemOperational') : t('connecting')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4 text-white" /> : <Minimize2 className="w-4 h-4 text-white" />}
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header - Chat View */}
            {showChat && selectedTicket && (
                <div className="flex-none flex items-center justify-between px-3 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md z-10 h-[60px] rounded-t-2xl">
                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                        {/* Back Button */}
                        <button
                            onClick={handleBackToList}
                            className="p-2 -ml-1 text-white hover:bg-white/20 rounded-full transition-all flex-shrink-0"
                            title={t('back')}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-md relative bg-gradient-to-br from-blue-400 to-blue-600">
                            {selectedTicket.companyLogo ? (
                                <img
                                    src={selectedTicket.companyLogo}
                                    alt={selectedTicket.companyName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className="text-white text-sm font-bold">
                                    {getInitials(selectedTicket.companyName)}
                                </span>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="font-bold text-base leading-tight truncate">
                                {selectedTicket.companyName}
                            </span>
                            <span className="text-xs opacity-90 leading-tight flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`}></span>
                                {isConnected ? t('online') : t('offline')}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4 text-white" /> : <Minimize2 className="w-4 h-4 text-white" />}
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {!isMinimized && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {/* Conversation List View */}
                    {!showChat && (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Search */}
                            <div className="flex-none p-3 border-b border-gray-100">
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Ticket List */}
                            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : filteredTickets.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">{t('noTickets')}</p>
                                    </div>
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            onClick={() => handleSelectTicket(ticket.id)}
                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${ticket.unreadCount > 0 ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : ''}`}
                                        >
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 relative">
                                                <span className="text-white text-sm font-bold absolute inset-0 flex items-center justify-center">
                                                    {getInitials(ticket.companyName)}
                                                </span>
                                                {ticket.companyLogo && (
                                                    <img
                                                        src={ticket.companyLogo}
                                                        alt={ticket.companyName}
                                                        className="w-full h-full object-cover relative z-10"
                                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <span className={`font-bold text-sm ${ticket.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {ticket.companyName}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[11px] ${ticket.unreadCount > 0 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                                                            {formatTime(ticket.lastMessageTime)}
                                                        </span>
                                                        {ticket.unreadCount > 0 && (
                                                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-0.5">
                                                    <p className={`text-sm truncate pr-2 ${ticket.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                                        {ticket.lastMessage}
                                                    </p>
                                                    {ticket.unreadCount > 0 && (
                                                        <span className="min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
                                                            {ticket.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chat View */}
                    {showChat && selectedTicket && (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                                {selectedTicket.messages.map((message) => {
                                    const isAdmin = message.admin;

                                    return (
                                        <div key={message.id} className={`flex gap-2 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                                            {/* Avatar */}
                                            {isAdmin ? (
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                                                    <ShieldCheck className="w-4 h-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 relative">
                                                    <span className="text-white text-xs font-bold absolute inset-0 flex items-center justify-center">
                                                        {getInitials(selectedTicket.companyName)}
                                                    </span>
                                                    {selectedTicket.companyLogo && (
                                                        <img
                                                            src={selectedTicket.companyLogo}
                                                            alt={selectedTicket.companyName}
                                                            className="w-full h-full object-cover relative z-10"
                                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${isAdmin
                                                ? 'bg-blue-600 text-white rounded-tr-md'
                                                : 'bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-100'
                                                }`}>
                                                <p>{message.message}</p>
                                                <p className={`text-xs mt-1 ${isAdmin ? 'text-blue-200' : 'text-gray-400'}`}>
                                                    {formatMessageTime(new Date(message.timestamp))}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Typing indicator */}
                                {isTyping && typingCompanyId === selectedTicket.companyId && (
                                    <div className="flex gap-2">
                                        <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{getInitials(selectedTicket.companyName)}</span>
                                        </div>
                                        <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-md shadow-sm border border-gray-100">
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
                            <div className="flex-none p-3 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t('typeReply')}
                                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}