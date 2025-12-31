'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ShieldCheck, Paperclip, Smile, MoreVertical, RefreshCw } from 'lucide-react';
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
        connect,
        disconnect,
        sendMessage,
        markMessagesAsRead,
        addMessage
    } = useChatStore();

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Connect to WebSocket when component mounts
    useEffect(() => {
        if (company?.id) {
            // For demo purposes, we'll simulate connection
            // In production, uncomment the line below:
            // connect(company.id.toString());

            // Simulate connected status for demo
            useChatStore.setState({ isConnected: true, connectionStatus: 'connected' });

            // Add initial demo messages if empty
            if (messages.length === 0) {
                const demoMessages: ChatMessage[] = [
                    {
                        id: '1',
                        content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
                        sender: 'admin',
                        senderName: 'Admin Support',
                        timestamp: new Date(Date.now() - 3600000),
                        read: true,
                        type: 'text'
                    },
                    {
                        id: '2',
                        content: 'Chào bạn, tôi muốn hỏi về gói subscription Premium.',
                        sender: 'user',
                        senderName: company?.name || 'Company',
                        timestamp: new Date(Date.now() - 3500000),
                        read: true,
                        type: 'text'
                    },
                    {
                        id: '3',
                        content: 'Vâng, gói Premium bao gồm: Không giới hạn review responses, AI sentiment analysis, Priority support 24/7, và Custom branding. Bạn có muốn biết thêm chi tiết về tính năng nào không?',
                        sender: 'admin',
                        senderName: 'Admin Support',
                        timestamp: new Date(Date.now() - 3400000),
                        read: true,
                        type: 'text'
                    }
                ];
                demoMessages.forEach(msg => addMessage(msg));
            }
        }

        return () => {
            // disconnect();
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
        if (!newMessage.trim()) return;

        // For demo: Add message locally
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: newMessage,
            sender: 'user',
            senderName: company?.name || 'Company',
            timestamp: new Date(),
            read: true,
            type: 'text'
        };
        addMessage(userMessage);

        // In production, use this instead:
        // sendMessage(newMessage);

        setNewMessage('');
        inputRef.current?.focus();

        // Simulate admin typing and response (demo only)
        useChatStore.setState({ isTyping: true });
        setTimeout(() => {
            useChatStore.setState({ isTyping: false });
            const adminResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
                sender: 'admin',
                senderName: 'Admin Support',
                timestamp: new Date(),
                read: false,
                type: 'text'
            };
            addMessage(adminResponse);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReconnect = () => {
        if (company?.id) {
            connect(company.id.toString());
        }
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const messageDate = new Date(date);

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
            case 'connected': return 'bg-green-400';
            case 'connecting': return 'bg-yellow-400 animate-pulse';
            case 'error': return 'bg-red-400';
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
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {t('online')}
                            </p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {messages.length === 0 ? (
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

                                return (
                                    <React.Fragment key={message.id}>
                                        {showDateSeparator && (
                                            <div className="flex items-center justify-center">
                                                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                                    {formatDate(message.timestamp)}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex items-end gap-2 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                                {/* Avatar */}
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.sender === 'admin'
                                                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                                    }`}>
                                                    {message.sender === 'admin' ? (
                                                        <ShieldCheck className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-white" />
                                                    )}
                                                </div>

                                                {/* Message Bubble */}
                                                <div className={`rounded-2xl px-4 py-2.5 ${message.sender === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-md'
                                                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
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
                            disabled={!isConnected}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || !isConnected}
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
