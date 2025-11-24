'use client'

import { Search, MessageSquare, User, Clock, MoreVertical, Send, Paperclip } from 'lucide-react'

export default function SupportPage() {
    const tickets = [
        { id: 1, user: 'Tech Solutions', subject: 'Integration Issue', preview: 'We are having trouble connecting...', time: '5m ago', status: 'Open', unread: true },
        { id: 2, user: 'Sunrise Cafe', subject: 'Billing Question', preview: 'Can I upgrade my plan mid-month?', time: '1h ago', status: 'Open', unread: false },
        { id: 3, user: 'John Doe', subject: 'Account Access', preview: 'I forgot my password and...', time: '2h ago', status: 'Closed', unread: false },
        { id: 4, user: 'Green Earth', subject: 'Feature Request', preview: 'It would be great if we could...', time: '1d ago', status: 'Open', unread: false },
    ]

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Ticket List */}
            <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Support Tickets</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${ticket.unread ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold text-sm ${ticket.unread ? 'text-gray-900' : 'text-gray-700'}`}>{ticket.user}</span>
                                <span className="text-xs text-gray-400">{ticket.time}</span>
                            </div>
                            <h3 className={`text-sm mb-1 ${ticket.unread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{ticket.subject}</h3>
                            <p className="text-xs text-gray-500 truncate">{ticket.preview}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">TS</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Tech Solutions</h3>
                            <p className="text-xs text-gray-500">Ticket #1024 • Integration Issue</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-xs font-bold text-blue-600">TS</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
                            <p className="text-gray-700 text-sm">Hi, we are having trouble connecting our website to the Trustify widget. The API key seems to be invalid.</p>
                            <span className="text-xs text-gray-400 mt-2 block">10:30 AM</span>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-xs font-bold text-white">AD</span>
                        </div>
                        <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                            <p className="text-white text-sm">Hello! I can help you with that. Have you checked if your domain is whitelisted in the integration settings?</p>
                            <span className="text-blue-100 text-xs mt-2 block">10:35 AM</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            placeholder="Type your reply..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
