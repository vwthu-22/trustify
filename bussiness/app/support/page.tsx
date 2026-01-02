'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ShieldCheck, Paperclip, Smile, MoreVertical, RefreshCw, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useChatStore, ChatMessage } from '@/store/useChatStore';

export default function SupportChatPage() {
    const t = useTranslations('support');
    const { company } = useCompanyStore();

    // Chat store
    const {
        messages,
        isConnected,
        connectionStatus,
        isTyping,
        isLoading,
        roomId,
        connect,
        disconnect,
        sendMessage,
        markMessagesAsRead,
        setRoomId
    } = useChatStore();

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get token from localStorage
    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('company_token') || '';
        }
        return '';
    };

    // Connect to WebSocket when component mounts
    useEffect(() => {
        const token = getToken();

        if (token) {
            // Connect with company ID - backend will create room if needed on first message
            // The connect function will try to fetch existing room first
            const chatRoomId = company?.id || 0;
            connect(token, chatRoomId);
        }

        return () => {
            disconnect();
        };
    }, [company?.id]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark messages as read when viewing
    useEffect(() => {
        markMessagesAsRead();
    }, [messages.length]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !isConnected) return;

        sendMessage(newMessage, false); // false = not admin
        setNewMessage('');
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReconnect = () => {
        const token = getToken();
        if (company?.id && token) {
            connect(token, company.id);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp: string) => {
        const today = new Date();
        const messageDate = new Date(timestamp);

        if (messageDate.toDateString() === today.toDateString()) {
            return t('today');
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return t('yesterday');
        }

        return messageDate.toLocaleDateString('vi-VN');
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-400 animate-pulse';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return t('connected');
            case 'connecting': return t('connecting');
            case 'error': return t('error');
            default: return t('disconnected');
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{t('adminSupport')}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></span>
                                <span className="text-xs text-gray-500">{getConnectionStatusText()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {connectionStatus === 'error' && (
                            <button
                                onClick={handleReconnect}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                                title={t('reconnect')}
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        )}
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12">
                            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">{t('startConversation')}</h3>
                            <p className="text-sm text-gray-500">{t('sendMessageToStart')}</p>
                        </div>
                    ) : (
                        <>
                            {/* Group messages by date */}
                            {messages.map((message, index) => {
                                const showDateSeparator = index === 0 ||
                                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

                                const isUserMessage = !message.admin;

                                return (
                                    <React.Fragment key={message.id}>
                                        {showDateSeparator && (
                                            <div className="flex items-center justify-center">
                                                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                                    {formatDate(message.timestamp)}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex items-end gap-2 max-w-[70%] ${isUserMessage ? 'flex-row-reverse' : ''}`}>
                                                {/* Avatar */}
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.admin
                                                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                                    }`}>
                                                    {message.admin ? (
                                                        <ShieldCheck className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-white" />
                                                    )}
                                                </div>

                                                {/* Message Bubble */}
                                                <div className={`rounded-2xl px-4 py-2.5 ${isUserMessage
                                                    ? 'bg-blue-600 text-white rounded-br-md'
                                                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed">{message.message}</p>
                                                    <p className={`text-xs mt-1 ${isUserMessage ? 'text-blue-200' : 'text-gray-400'
                                                        }`}>
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </>
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Smile className="w-5 h-5" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t('typeMessage')}
                            className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {t('responseTime')}
                    </p>
                </div>
            </div>
        </div>
    );
}
