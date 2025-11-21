'use client';
import React from 'react';
import {
    Home, MessageSquare, Send, Share2, BarChart3, Puzzle, Settings,
    Info, Mail, User, Star, TrendingUp, Code, ShieldCheck, Building2, Crown
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
        '/settings': 'Account Settings'
    };

    return routes[pathname] || 'Dashboard';
};

export default function Header() {
    const pathname = usePathname();
    const pageTitle = getPageTitle(pathname);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-xl text-black">
                {pageTitle}
            </h1>

            <div className="flex items-center gap-3">
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition">
                    <Info className="w-5 h-5 text-blue-600" />
                </button>
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition">
                    <Mail className="w-5 h-5 text-blue-600" />
                </button>
                <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition">
                    <User className="w-5 h-5 text-blue-600" />
                </button>
            </div>
        </header>
    );
}