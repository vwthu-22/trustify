'use client';
import React from 'react';
import {
    Home, MessageSquare, Send, Share2, BarChart3, Puzzle, Settings,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Home', icon: Home, title: 'Performance - Overview' },
        { href: '/manage', label: 'Manage reviews', icon: MessageSquare, title: 'Manage Reviews - Overview' },
        { href: '#', label: 'Get reviews', icon: Send, title: 'Get Reviews - Overview' },
        { href: '#', label: 'Share & promote', icon: Share2, title: 'Share & Promote - Overview' },
        { href: '/analytics', label: 'Analytics', icon: BarChart3, title: 'Analytics - Overview' },
        { href: '#', label: 'Integrations', icon: Puzzle, title: 'Integrations - Overview' },
        { href: '#', label: 'Settings', icon: Settings, title: 'Settings - Overview' }
    ];


    return (
        <div>
            <aside className="w-64 bg-[#0f1c2d] text-white flex flex-col h-screen fixed">
                {/* Company Info */}
                <div className="p-4 border-b border-white/10">
                    <button className="flex items-center justify-between w-full text-left group hover:opacity-80 transition">
                        <div>
                            <p className="text-sm font-medium text-white">FundedNext Ltd</p>
                            <p className="text-xs text-white/60">fundednext.com</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                    </button>
                </div>

                {/* Logo */}
                <div className="px-4 py-6">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-[#5aa5df]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xl font-bold">Trustify</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <div key={item.href} className="relative">
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition w-full ${isActive
                                        ? 'bg-[#2f6176] text-white'
                                        : 'hover:bg-white/5 text-white/90 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-normal">{item.label}</span>
                                </Link>

                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r"></div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/10 mt-auto">
                    <div className="mb-3">
                        <p className="text-sm text-white/80">
                            Your plan: <span className="font-semibold text-white">Minimum</span>
                        </p>
                    </div>
                    <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm shadow-md">
                        Upgrade now
                    </button>
                </div>
            </aside>
        </div>
    );
}
