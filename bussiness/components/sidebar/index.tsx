'use client';
import React, { useState } from 'react';
import {
    Home, MessageSquare, Send, Share2, BarChart3, Puzzle, Settings,
    ChevronDown, ChevronRight, Star, Mail, Code, ShieldCheck,
    Building2, Crown, TrendingUp, Lock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useTranslations } from 'next-intl';

interface MenuItem {
    href: string;
    label: string;
    icon: any;
    title: string;
    badge?: string | number;
    children?: MenuItem[];
    requiredFeature?: string; // Feature name from backend
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedItems, setExpandedItems] = useState<string[]>(['/reviews', '/analytics']);
    const { hasFeature, planName, loading } = useFeatureAccess();
    const t = useTranslations('sidebar');

    const menuItems: MenuItem[] = [
        {
            href: '/',
            label: t('dashboard'),
            icon: Home,
            title: 'Performance Dashboard'
        },
        {
            href: '/connect',
            label: t('connect'),
            icon: Share2,
            title: 'Connect website'
        },
        {
            href: '/reviews',
            label: t('reviews'),
            icon: MessageSquare,
            title: 'Manage Reviews'
        },
        {
            href: '/analytics',
            label: t('analytics'),
            icon: BarChart3,
            title: 'Analytics Dashboard',
            requiredFeature: 'Advanced Analytics',
            children: [
                { href: '/analytics', label: 'Overview', icon: TrendingUp, title: 'Analytics Overview', requiredFeature: 'Advanced Analytics' },
                { href: '/analytics/sentiment', label: 'Sentiment Analysis', icon: BarChart3, title: 'Sentiment Analysis', requiredFeature: 'Advanced Analytics' },
                { href: '/analytics/branches', label: 'Branch Comparison', icon: Building2, title: 'Branch Comparison', requiredFeature: 'Advanced Analytics' }
            ]
        },
        {
            href: '/invitations',
            label: t('getReviews'),
            icon: Send,
            title: 'Review Invitations',
            requiredFeature: 'Team Invitations',
            children: [
                { href: '/invitations/send', label: 'Send invitations', icon: Mail, title: 'Send Invitations', requiredFeature: 'Team Invitations' },
                { href: '/invitations/campaigns', label: 'Campaigns', icon: Send, title: 'Campaigns', requiredFeature: 'Team Invitations' },
                { href: '/invitations/templates', label: 'Email templates', icon: Mail, title: 'Templates', requiredFeature: 'Team Invitations' }
            ]
        },
        {
            href: '/integrations',
            label: t('integrations'),
            icon: Puzzle,
            title: 'Integrations & API',
            requiredFeature: 'Integrations'
        },
        {
            href: '/manage',
            label: t('manageReviews'),
            icon: Settings,
            title: 'Review Management',
            requiredFeature: 'Review Management'
        },
        {
            href: '/verification',
            label: t('verification'),
            icon: ShieldCheck,
            title: 'Business Verification',
            badge: 'Verify'
        },
        {
            href: '/subscription',
            label: t('subscription'),
            icon: Crown,
            title: 'Subscription Plans'
        },
        {
            href: '/settings',
            label: t('settings'),
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
        if (!item.requiredFeature) return true;
        return hasFeature(item.requiredFeature);
    };

    const handleLockedClick = (e: React.MouseEvent, item: MenuItem) => {
        if (!canAccess(item)) {
            e.preventDefault();
            router.push('/subscription?upgrade=true&feature=' + encodeURIComponent(item.requiredFeature || ''));
        }
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
                        onClick={(e) => {
                            if (locked) {
                                handleLockedClick(e as any, item);
                            } else {
                                toggleExpand(item.href);
                            }
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition ${active
                            ? 'bg-[#2f6176] text-white'
                            : 'hover:bg-white/5 text-white/90 hover:text-white'
                            } ${locked ? 'opacity-60' : ''} ${depth > 0 ? 'pl-12' : ''
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
                            {locked && (
                                <span className="ml-auto flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                                    <Lock className="w-3 h-3" />
                                    Pro
                                </span>
                            )}
                        </div>
                        {!locked && (isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        ))}
                    </button>
                ) : (
                    <div className="relative">
                        <Link
                            href={locked ? '#' : item.href}
                            prefetch={true}
                            onClick={(e) => handleLockedClick(e, item)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${active
                                ? 'bg-[#2f6176] text-white'
                                : 'hover:bg-white/5 text-white/90 hover:text-white'
                                } ${locked ? 'opacity-60' : ''} ${depth > 0 ? 'pl-12' : ''
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-normal">{item.label}</span>

                            {locked && (
                                <span className="ml-auto flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                                    <Lock className="w-3 h-3" />
                                    Pro
                                </span>
                            )}
                        </Link>
                        {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r"></div>
                        )}
                    </div>
                )}

                {hasChildren && isExpanded && !locked && (
                    <div className="mt-1 space-y-1">
                        {item.children!.map(child => renderMenuItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <aside className="w-64 bg-[#0f1c2d] text-white flex flex-col h-screen fixed">
                <div className="px-4 py-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-[#5aa5df]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xl font-bold">Trustify</span>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </aside>
        );
    }

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
                {planName.toLowerCase() === 'free' && (
                    <Link
                        href="/subscription"
                        className="block mb-3 py-3 px-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-semibold text-white">Upgrade to PRO</span>
                        </div>
                        <p className="text-xs text-white/70">
                            Unlock analytics & advanced features
                        </p>
                    </Link>
                )}
                <div className="mb-3">
                    <p className="text-sm text-white/80">
                        Your plan: <span className="font-semibold text-white">{planName}</span>
                    </p>
                </div>
            </div>
        </aside>
    );
}
