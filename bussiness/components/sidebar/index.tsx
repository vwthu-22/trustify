'use client';
import React, { useState } from 'react';
import {
    Home, MessageSquare, Send, Share2, BarChart3, Puzzle, Settings,
    ChevronDown, ChevronRight, Star, Mail, Code, ShieldCheck,
    Building2, Crown, TrendingUp, Lock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
    href: string;
    label: string;
    icon: any;
    title: string;
    badge?: string | number;
    children?: MenuItem[];
    minPlan?: 'FREE' | 'PRO' | 'PREMIUM';
}

export default function Sidebar() {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>(['/reviews', '/analytics']);
    const currentPlan: 'FREE' | 'PRO' | 'PREMIUM' = 'FREE';

    const menuItems: MenuItem[] = [
        {
            href: '/',
            label: 'Dashboard',
            icon: Home,
            title: 'Performance Dashboard'
        },
        {
            href: '/connect',
            label: 'Connect',
            icon: Share2,
            title: 'Connect website'
        },
        {
            href: '/reviews',
            label: 'Reviews',
            icon: MessageSquare,
            title: 'Manage Reviews'
        },
        {
            href: '/analytics',
            label: 'Analytics',
            icon: BarChart3,
            title: 'Analytics Dashboard',
            children: [
                { href: '/analytics', label: 'Overview', icon: TrendingUp, title: 'Analytics Overview' },
                { href: '/analytics/sentiment', label: 'Sentiment Analysis', icon: BarChart3, title: 'Sentiment Analysis', minPlan: 'PRO' },
                { href: '/analytics/branches', label: 'Branch Comparison', icon: Building2, title: 'Branch Comparison', minPlan: 'PRO' }
            ]
        },
        {
            href: '/invitations',
            label: 'Get reviews',
            icon: Send,
            title: 'Review Invitations',
            children: [
                { href: '/invitations/send', label: 'Send invitations', icon: Mail, title: 'Send Invitations' },
                { href: '/invitations/campaigns', label: 'Campaigns', icon: Send, title: 'Campaigns' },
                { href: '/invitations/templates', label: 'Email templates', icon: Mail, title: 'Templates' }
            ]
        },
        {
            href: '/widgets',
            label: 'Share & promote',
            icon: Share2,
            title: 'Share & Promote',
            children: [
                { href: '/widgets', label: 'TrustBox Widgets', icon: Code, title: 'TrustBox' },
                { href: '/widgets/custom', label: 'Custom widgets', icon: Code, title: 'Custom Widgets', minPlan: 'PRO' }
            ]
        },
        {
            href: '/integrations',
            label: 'Integrations',
            icon: Puzzle,
            title: 'Integrations & API',
            minPlan: 'PRO'
        },
        {
            href: '/verification',
            label: 'Verification',
            icon: ShieldCheck,
            title: 'Business Verification',
            badge: 'Verify'
        },
        {
            href: '/branches',
            label: 'Branches',
            icon: Building2,
            title: 'Manage Branches'
        },
        {
            href: '/subscription',
            label: 'Subscription',
            icon: Crown,
            title: 'Subscription Plans'
        },
        {
            href: '/settings',
            label: 'Settings',
            icon: Settings,
            title: 'Account Settings'
        }
    ];

    const toggleExpand = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
        );
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const canAccess = (item: MenuItem) => {
        if (item.minPlan) {
            const planOrder = { FREE: 0, PRO: 1, PREMIUM: 2 };
            return planOrder[currentPlan] >= planOrder[item.minPlan];
        }
        return true;
    };

    const renderMenuItem = (item: MenuItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.href);
        const active = isActive(item.href);
        const locked = !canAccess(item);
        const Icon = item.icon;

        return (
            <div key={item.href}>
                {hasChildren ? (
                    <button
                        onClick={() => toggleExpand(item.href)}
                        disabled={locked}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition ${active
                                ? 'bg-[#2f6176] text-white'
                                : 'hover:bg-white/5 text-white/90 hover:text-white'
                            } ${locked ? 'opacity-50 cursor-not-allowed' : ''} ${depth > 0 ? 'pl-12' : ''
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span className="font-normal">{item.label}</span>
                            {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            {locked && <Lock className="w-4 h-4 ml-1" />}
                        </div>
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                ) : (
                    <div className="relative">
                        <Link
                            href={locked ? '#' : item.href}
                            prefetch={true}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${active
                                    ? 'bg-[#2f6176] text-white'
                                    : 'hover:bg-white/5 text-white/90 hover:text-white'
                                } ${locked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${depth > 0 ? 'pl-12' : ''
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-normal">{item.label}</span>

                            {locked && <Lock className="w-4 h-4 ml-auto" />}
                        </Link>
                        {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r"></div>
                        )}
                    </div>
                )}

                {hasChildren && isExpanded && (
                    <div className="mt-1 space-y-1">
                        {item.children!.map(child => renderMenuItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="w-64 bg-[#0f1c2d] text-white flex flex-col h-screen fixed">
            {/* Logo */}
            <div className="px-4 py-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <svg className="w-8 h-8 text-[#5aa5df]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xl font-bold">Trustify</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {menuItems.map(item => renderMenuItem(item))}
            </nav>

            {/* Bottom Section - Upgrade CTA */}
            <div className="p-4 border-t border-white/10 mt-auto">
                {currentPlan === 'FREE' && (
                    <div className="mb-3 py-2 px-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-semibold text-white">Upgrade to PRO</span>
                        </div>
                        <p className="text-xs text-white/70 mb-3">
                            AI analytics & advanced features
                        </p>
                    </div>
                )}
                <div className="mb-3">
                    <p className="text-sm text-white/80">
                        Your plan: <span className="font-semibold text-white capitalize">{currentPlan}</span>
                    </p>
                </div>
                <Link
                    href="/subscription"
                    className="block w-full py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm shadow-md text-center"
                >
                    {currentPlan === 'FREE' ? 'Upgrade now' : 'Manage Plan'}
                </Link>
            </div>
        </aside>
    );
}