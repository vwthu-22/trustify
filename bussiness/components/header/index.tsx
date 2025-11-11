'use client';
import React, { ReactNode } from 'react';
import {
    Home, MessageSquare, Send, Share2, BarChart3, Puzzle, Settings,
    ChevronDown, Info, Mail, User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const menuItems = [
        { href: '/', label: 'Home', icon: Home, title: 'Performance - Overview' },
        { href: '/manage', label: 'Manage reviews', icon: MessageSquare, title: 'Manage Reviews - Overview' },
        { href: '/#', label: 'Get reviews', icon: Send, title: 'Get Reviews - Overview' },
        { href: '/#', label: 'Share & promote', icon: Share2, title: 'Share & Promote - Overview' },
        { href: '/analytics', label: 'Analytics', icon: BarChart3, title: 'Analytics - Overview' },
        { href: '/#', label: 'Integrations', icon: Puzzle, title: 'Integrations - Overview' },
        { href: '/#', label: 'Settings', icon: Settings, title: 'Settings - Overview' }
    ];
    const activeItem = menuItems.find(item => item.href === pathname) || menuItems[0];

    return (

        <div>
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activeItem.title}
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
        </div>
    );
}
