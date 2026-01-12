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
        isTyping,
        isLoading,
        roomId,
        connect,
        disconnect,
        sendMessage,
        sendMessageViaRest,
        addMessage,
        markMessagesAsRead
    } = useChatStore();

    const [newMessage, setNewMessage] = useState('');
    const [hasAutoReplied, setHasAutoReplied] = useState(false); // Track if bot has replied
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load message history when component mounts or roomId changes
    useEffect(() => {
        if (roomId && roomId !== 0) {
            useChatStore.getState().loadMessageHistory(roomId, '');
        }
    }, [roomId, company?.id]);

    // Check if admin has replied (excluding System bot messages)
    useEffect(() => {
        const hasRealAdminReply = messages.some(msg => msg.admin && msg.sender !== 'System');
        if (hasRealAdminReply) {
            setHasAutoReplied(false); // Reset when admin replies
        }
    }, [messages]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark messages as read when viewing
    useEffect(() => {
        markMessagesAsRead();
    }, [messages.length]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageToSend = newMessage;
        setNewMessage(''); // Clear input immediately for better UX
        inputRef.current?.focus();

        console.log('📤 Attempting to send message:', messageToSend);
        console.log('   isConnected:', isConnected);

        // Check if this is the first user message (no real admin replies yet, excluding System bot)
        const hasRealAdminReplied = messages.some(msg => msg.admin && msg.sender !== 'System');
        const isFirstMessage = !hasRealAdminReplied && !hasAutoReplied;

        // Try to send via WebSocket first
        if (isConnected) {
            console.log('   → Sending via WebSocket');
            sendMessage(messageToSend, false); // false = not admin
        } else {
            // Fallback: send via REST API (credentials sent via HttpOnly cookie)
            console.log('   → Sending via REST API');
            await sendMessageViaRest(messageToSend, '', false);
        }

        // Send auto-reply bot message if this is the first message
        if (isFirstMessage) {
            setHasAutoReplied(true); // Mark as replied
            setTimeout(() => {
                const botMessage: ChatMessage = {
                    id: Date.now(),
                    roomId: typeof roomId === 'number' ? roomId : 0,
                    sender: 'System',
                    message: t('autoReplyMessage') || 'Cảm ơn bạn đã liên hệ! Đội ngũ hỗ trợ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
                    timestamp: new Date().toISOString(),
                    admin: true
                };
                addMessage(botMessage);
            }, 1000); // Delay 1 second for more natural feel
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReconnect = () => {
        if (company?.id) {
            connect('', company.id);
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

    return (
        <div className="h-[calc(100vh-6rem)]">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                {/* Chat Header */}
                <div className="px-3 sm:px-4 py-2.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{t('adminSupport')}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-xs text-gray-500">{isConnected ? t('connected') : t('disconnected')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8">
                            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('startConversation')}</h3>
                            <p className="text-xs text-gray-500">{t('sendMessageToStart')}</p>
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
                                                {message.admin ? (
                                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600">
                                                        <ShieldCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                        {company?.logo ? (
                                                            <img
                                                                src={company.logo}
                                                                alt={company.name || 'User'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : company?.name ? (
                                                            <span className="text-white text-xs font-bold">
                                                                {company.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        ) : (
                                                            <User className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                )}

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
                <div className="px-3 py-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            <Smile className="w-4 h-4" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t('typeMessage')}
                            className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 text-center">
                        {t('responseTime')}
                    </p>
                </div>
            </div>
        </div>
    );
}
