'use client';
import React, { useState } from 'react';
import {
    Info, Mail, User, Star, Settings, ShieldCheck, Crown, X
} from 'lucide-react';

import { usePathname } from 'next/navigation';

// Đồng bộ menuItems với sidebar
const getPageTitle = (pathname: string): string => {
    const routes: { [key: string]: string } = {
        '/': 'Performance Dashboard',
        '/reviews': 'Reviews - All Reviews',
        '/reviews/pending': 'Reviews - Pending Response',
        '/reviews/replied': 'Reviews - Replied',
        '/analytics': 'Analytics - Overview',
        '/analytics/sentiment': 'Analytics - Sentiment Analysis',
        '/analytics/topics': 'Analytics - Topics Analysis',
        '/analytics/branches': 'Analytics - Branch Comparison',
        '/invitations': 'Get Reviews - Overview',
        '/invitations/send': 'Get Reviews - Send Invitations',
        '/invitations/campaigns': 'Get Reviews - Campaigns',
        '/invitations/templates': 'Get Reviews - Email Templates',
        '/widgets': 'Share & Promote - TrustBox Widgets',
        '/widgets/custom': 'Share & Promote - Custom Widgets',
        '/integrations': 'Integrations & API',
        '/verification': 'Business Verification',
        '/branches': 'Manage Branches',
        '/subscription': 'Subscription Plans',
        '/settings': 'Account Settings',
        '/connect': 'Connect Website'
    };

    return routes[pathname] || 'Dashboard';
};

export default function Header() {
    const pathname = usePathname();
    const pageTitle = getPageTitle(pathname);

    const [showHelpDropdown, setShowHelpDropdown] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [unreadMessages] = useState(3);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-xl text-black">
                {pageTitle}
            </h1>

            <div className="flex items-center gap-3">
                {/* Help Center Button */}
                <button
                    onClick={() => setShowHelpDropdown(!showHelpDropdown)}
                    className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                    title="Help Center"
                >
                    <Info className="w-5 h-5 text-blue-600" />
                </button>

                {/* Help Dropdown */}
                {showHelpDropdown && (
                    <div className="absolute right-48 top-16 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900">Help Center</h3>
                        </div>
                        <div className="p-2">
                            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Info className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Documentation</p>
                                    <p className="text-xs text-gray-600">Learn how to use Trustify</p>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Mail className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Video Tutorials</p>
                                    <p className="text-xs text-gray-600">Watch step-by-step guides</p>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Star className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">FAQ</p>
                                    <p className="text-xs text-gray-600">Common questions answered</p>
                                </div>
                            </a>
                        </div>
                    </div>
                )}

                {/* Support Messages Button */}
                <button
                    onClick={() => setShowSupportModal(!showSupportModal)}
                    className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                    title="Contact Support"
                >
                    <Mail className="w-5 h-5 text-blue-600" />
                    {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {unreadMessages}
                        </span>
                    )}
                </button>

                {/* Support Modal with Blur Effect */}
                {showSupportModal && (
                    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Contact Support</h3>
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-4">
                                    {/* Support Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type of Request
                                        </label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="question">General Question</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="complaint">Complaint</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="billing">Billing Issue</option>
                                        </select>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Brief description of your issue"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Please describe your issue in detail..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="priority" value="low" defaultChecked className="w-4 h-4" />
                                                <span className="text-sm text-gray-700">Low</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="priority" value="medium" className="w-4 h-4" />
                                                <span className="text-sm text-gray-700">Medium</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="priority" value="high" className="w-4 h-4" />
                                                <span className="text-sm text-gray-700">High</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Response Time Info */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-900">
                                            <strong>Expected Response Time:</strong>
                                        </p>
                                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                            <li>• Free Plan: Within 48 hours</li>
                                            <li>• Pro Plan: Within 24 hours</li>
                                            <li>• Premium Plan: Within 4 hours (Priority Support)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex gap-3">
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Support request sent! We will respond within 24 hours.');
                                        setShowSupportModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Profile Button */}
                <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                    title="Account"
                >
                    <User className="w-5 h-5 text-blue-600" />
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                    <div className="absolute right-6 top-16 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                            <p className="font-bold text-gray-900">Nguyễn Văn A</p>
                            <p className="text-sm text-gray-600">admin@company.com</p>
                            <div className="mt-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                    Free Plan
                                </span>
                            </div>
                        </div>
                        <div className="p-2">
                            <a href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                <Settings className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">Account Settings</span>
                            </a>
                            <a href="/subscription" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                <Crown className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">Upgrade Plan</span>
                            </a>
                            <a href="/verification" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">Verification Status</span>
                            </a>
                            <hr className="my-2" />
                            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg text-red-600">
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}