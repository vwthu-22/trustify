'use client';
import React, { useState } from 'react';
import {
    Home, MessageSquare, Puzzle, BarChart3, Settings,
    ChevronDown, ChevronRight, Mail, ShieldCheck,
    Crown, Headphones, X, Lock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useChatStore } from '@/store/useChatStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { hasFeatureAccess, getRequiredPlan } from '@/lib/featureAccess';

interface MenuItem {
    href: string;
    label: string;
    icon: any;
    title: string;
    badge?: string | number;
    children?: MenuItem[];
    requiresFeature?: 'verification' | 'aiAnalytics' | 'integrations';
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

export default function Sidebar({ isOpen = false, onClose, isMobile = false }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedItems, setExpandedItems] = useState<string[]>(['/reviews', '/analytics']);
    const t = useTranslations('sidebar');
    const { unreadCount } = useChatStore();
    const { company } = useCompanyStore();

    const userPlan = company?.plan || 'Free';

    const menuItems: MenuItem[] = [
        {
            href: '/',
            label: t('dashboard'),
            icon: Home,
            title: t('titleDashboard')
        },
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
            title: t('titleAnalytics'),
            requiresFeature: 'aiAnalytics'
        },
        {
            href: '/send',
            label: t('labelSendInvitations'),
            icon: Mail,
            title: t('titleSendInvitations')
        },
        {
            href: '/integrations',
            label: t('labelIntegrations'),
            icon: Puzzle,
            title: t('titleIntegrations'),
            requiresFeature: 'integrations'
        },
        {
            href: '/verification',
            label: t('verification'),
            icon: ShieldCheck,
            title: t('titleVerification'),
            requiresFeature: 'verification'
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
            title: t('titleSupport') || 'Chat với hỗ trợ',
            badge: unreadCount > 0 ? unreadCount : undefined
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

    const handleLinkClick = (item: MenuItem, e?: React.MouseEvent) => {
        // Check if feature is locked
        if (item.requiresFeature && !hasFeatureAccess(userPlan, item.requiresFeature)) {
            e?.preventDefault();
            // Redirect to subscription page
            router.push('/subscription');
            if (isMobile && onClose) {
                onClose();
            }
            return;
        }

        if (isMobile && onClose) {
            onClose();
        }
    };

    const isFeatureLocked = (item: MenuItem): boolean => {
        if (!item.requiresFeature) return false;
        return !hasFeatureAccess(userPlan, item.requiresFeature);
    };

    const renderMenuItem = (item: MenuItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.href);
        const active = isActive(item.href);
        const Icon = item.icon;
        const locked = isFeatureLocked(item);

        return (
            <div key={item.href}>
                {hasChildren ? (
                    <button
                        onClick={() => toggleExpand(item.href)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition text-sm ${active
                            ? 'bg-[#2f6176] text-white'
                            : 'hover:bg-white/5 text-white/90 hover:text-white'
                            } ${depth > 0 ? 'pl-10' : ''}`}
                    >
                        <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span className="font-normal">{item.label}</span>
                            {item.badge && (
                                <span className="px-1.5 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        )}
                    </button>
                ) : (
                    <div className="relative">
                        <Link
                            href={locked ? '/subscription' : item.href}
                            prefetch={true}
                            onClick={(e) => handleLinkClick(item, e)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-sm ${active
                                ? 'bg-[#2f6176] text-white'
                                : locked
                                    ? 'hover:bg-white/5 text-white/50 hover:text-white/70'
                                    : 'hover:bg-white/5 text-white/90 hover:text-white'
                                } ${depth > 0 ? 'pl-10' : ''}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="font-normal">{item.label}</span>
                            {locked && (
                                <Lock className="w-3 h-3 ml-auto text-yellow-400" />
                            )}
                            {!locked && item.badge && (
                                <span className="ml-auto px-1.5 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                        {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-300 rounded-r"></div>
                        )}
                    </div>
                )}

                {hasChildren && isExpanded && (
                    <div className="mt-0.5 space-y-0.5">
                        {item.children!.map(child => renderMenuItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Mobile: slide-in sidebar
    // Desktop: fixed sidebar
    const sidebarClasses = isMobile
        ? `fixed inset-y-0 left-0 z-50 w-56 bg-[#0f1c2d] text-white flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`
        : 'w-56 bg-[#0f1c2d] text-white flex-col h-screen fixed hidden lg:flex';

    return (
        <aside className={sidebarClasses}>
            {/* Logo */}
            <div className="px-3 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#5aa5df] flex items-center justify-center rounded">
                        <span className="text-white font-bold text-sm">★</span>
                    </div>
                    <span className="text-lg font-bold">Trustify</span>
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                {menuItems.map(item => renderMenuItem(item))}
            </nav>
        </aside>
    );
}
