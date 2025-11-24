'use client'

import { AlertTriangle, Flag, Trash2, Ban, CheckCircle, MessageSquare } from 'lucide-react'

export default function ModerationPage() {
    const reportedReviews = [
        { id: 1, user: 'John Doe', company: 'Tech Solutions', reason: 'Spam / Advertising', content: 'Buy cheap crypto here! www.scam.com', reporter: 'Alice Smith', date: '10 mins ago' },
        { id: 2, user: 'Jane Smith', company: 'Sunrise Cafe', reason: 'Hate Speech', content: 'This place is terrible, I hate everyone here!', reporter: 'Bob Jones', date: '1 hour ago' },
    ]

    const aiFlagged = [
        { id: 3, user: 'Mike Brown', company: 'Global Logistics', reason: 'Fake Review Pattern', confidence: '98%', content: 'Best service ever! Highly recommended! A+++', date: '30 mins ago' },
        { id: 4, user: 'Sarah Wilson', company: 'Elite Fitness', reason: 'Inappropriate Language', confidence: '85%', content: 'The trainer was a complete *****!', date: '2 hours ago' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
                    <p className="text-gray-500 mt-1">Manage reported content and AI-flagged reviews</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Filter Status
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reported Reviews */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-500" />
                        User Reported
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">2 New</span>
                    </h2>

                    {reportedReviews.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{item.user}</span>
                                    <span className="text-gray-400 text-sm">reviewed</span>
                                    <span className="font-medium text-blue-600">{item.company}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700 italic">
                                "{item.content}"
                            </div>

                            <div className="flex items-center gap-2 mb-4 text-xs">
                                <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-medium">Reason: {item.reason}</span>
                                <span className="text-gray-500">Reported by {item.reporter}</span>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button className="flex-1 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center justify-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Keep
                                </button>
                                <button className="flex-1 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                                <button className="flex-1 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded transition-colors flex items-center justify-center gap-1">
                                    <Ban className="w-4 h-4" /> Ban User
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Flagged */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        AI Flagged
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">2 New</span>
                    </h2>

                    {aiFlagged.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{item.user}</span>
                                    <span className="text-gray-400 text-sm">reviewed</span>
                                    <span className="font-medium text-blue-600">{item.company}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700 italic">
                                "{item.content}"
                            </div>

                            <div className="flex items-center gap-2 mb-4 text-xs">
                                <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded font-medium">Flag: {item.reason}</span>
                                <span className="text-gray-500">Confidence: {item.confidence}</span>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button className="flex-1 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center justify-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Ignore
                                </button>
                                <button className="flex-1 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1">
                                    <Trash2 className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
