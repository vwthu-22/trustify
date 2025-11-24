'use client'

import { Save, Globe, Mail, Shield, Plus, X } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-8">
                    {/* General Settings */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-500" />
                            General Settings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                                <input type="text" defaultValue="Trustify" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                <input type="email" defaultValue="support@trustify.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Business Categories */}
                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-gray-500" />
                            Business Categories
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Technology', 'Retail', 'Food & Beverage', 'Health & Wellness', 'Logistics', 'Finance'].map((cat) => (
                                <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                    {cat}
                                    <button className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            <button className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500">
                                <Plus className="w-3 h-3" /> Add Category
                            </button>
                        </div>
                    </div>

                    {/* Content Filters */}
                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-gray-500" />
                            Content Filters
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blacklisted Keywords (comma separated)</label>
                                <textarea
                                    defaultValue="scam, fake, hate, violence, gambling"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="auto-filter" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <label htmlFor="auto-filter" className="text-sm text-gray-700">Enable Auto-Filtering</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="notify-admin" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <label htmlFor="notify-admin" className="text-sm text-gray-700">Notify Admin on Flagged Content</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
