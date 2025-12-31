'use client';
import React, { useState } from 'react';
import {
    Home, MessageSquare, Send, Share2, BarChart3, Puzzle, Settings,
    ChevronDown, ChevronRight, Mail, ShieldCheck,
    Building2, Crown, Headphones
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface MenuItem {
    href: string;
    label: string;
    icon: any;
    title: string;
    badge?: string | number;
    children?: MenuItem[];

}

export default function Sidebar() {
    const pathname = usePathname();

    const [expandedItems, setExpandedItems] = useState<string[]>(['/reviews', '/analytics']);

    const t = useTranslations('sidebar');

    const menuItems: MenuItem[] = [
        {
            href: '/',
            label: t('dashboard'),
            icon: Home,
            title: t('titleDashboard')
        },
        // {
        //     href: '/connect',
        //     label: t('connect'),
        //     icon: Share2,
        //     title: t('titleConnect')
        // },
        {
            href: '/reviews',
            label: t('reviews'),
            icon: MessageSquare,
            title: t('titleReviews')
        },
        {
            href: '/analytics',
            label: t('analytics'),
            icon: BarChart3,
            title: t('titleAnalytics')
        },
        {
            href: '/send',
            label: t('labelSendInvitations'),
            icon: Mail,
            title: t('titleSendInvitations')
        },
        {
            href: '/campaigns',
            label: t('labelCampaigns'),
            icon: Send,
            title: t('titleCampaigns')
        },
        // {
        //     href: '/integrations',
        //     label: t('integrations'),
        //     icon: Puzzle,
        //     title: t('titleIntegrations')
        // },

        {
            href: '/verification',
            label: t('verification'),
            icon: ShieldCheck,
            title: t('titleVerification')
        },
        {
            href: '/subscription',
            label: t('subscription'),
            icon: Crown,
            title: t('titleSubscription')
        },
        {
            href: '/support',
            label: t('support') || 'Hỗ trợ',
            icon: Headphones,
            title: t('titleSupport') || 'Chat với hỗ trợ'
        },
        {
            href: '/settings',
            label: t('settings'),
            icon: Settings,
            title: t('titleSettings')
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



    const renderMenuItem = (item: MenuItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.href);
        const active = isActive(item.href);

        const Icon = item.icon;

        return (
            <div key={item.href}>
                {hasChildren ? (
                    <button
                        onClick={() => toggleExpand(item.href)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition ${active
                            ? 'bg-[#2f6176] text-white'
                            : 'hover:bg-white/5 text-white/90 hover:text-white'
                            } ${depth > 0 ? 'pl-12' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span className="font-normal">{item.label}</span>
                            {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}

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
                            href={item.href}
                            prefetch={true}

                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${active
                                ? 'bg-[#2f6176] text-white'
                                : 'hover:bg-white/5 text-white/90 hover:text-white'
                                } ${depth > 0 ? 'pl-12' : ''}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-normal">{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}
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
        // bg-[#0f1c2d]
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
                <Link
                    href="/subscription"
                    className="block mb-3 py-3 px-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-semibold text-white">{t('upgradeToPro')}</span>
                    </div>
                    <p className="text-xs text-white/70">
                        {t('unlockFeatures')}
                    </p>
                </Link>
            </div>
        </aside>
    );
}
