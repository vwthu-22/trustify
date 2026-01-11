'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Info, User, Star, Settings, ShieldCheck, Crown, PartyPopper, X, Menu
} from 'lucide-react';

import { usePathname, useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useChatStore } from '@/store/useChatStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface HeaderProps {
    onMenuClick?: () => void;
    isMobile?: boolean;
}

export default function Header({ onMenuClick, isMobile = false }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('header');

    const getPageTitle = (path: string): string => {
        const routes: { [key: string]: string } = {
            '/': t('pageDashboard'),
            '/reviews': t('pageReviewsAll'),
            '/reviews/pending': t('pageReviewsPending'),
            '/reviews/replied': t('pageReviewsReplied'),
            '/analytics': t('pageAnalyticsOverview'),
            '/analytics/sentiment': t('pageAnalyticsSentiment'),
            '/analytics/topics': t('pageAnalyticsTopics'),
            '/analytics/branches': t('pageAnalyticsBranches'),
            '/invitations': t('pageInvitations'),
            '/invitations/send': t('pageInvitationsSend'),
            '/invitations/campaigns': t('pageInvitationsCampaigns'),
            '/invitations/templates': t('pageInvitationsTemplates'),
            '/integrations': t('pageIntegrations'),
            '/verification': t('pageVerification'),
            '/branches': t('pageBranches'),
            '/subscription': t('pageSubscription'),
            '/settings': t('pageSettings'),
            '/connect': t('pageConnect'),
            '/send': t('pageSend'),
            '/support': t('pageSupport') || 'Hỗ trợ'
        };

        return routes[path] || t('pageDashboard');
    };

    const pageTitle = getPageTitle(pathname);

    const { company, fetchCompanyProfile, logout } = useCompanyStore();
    const { notifications, unreadNotifications, markAllNotificationsAsRead } = useChatStore();
    const { currentSubscription, fetchCurrentSubscription, clearSubscription } = useSubscriptionStore();

    const [showHelpDropdown, setShowHelpDropdown] = useState(false);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [showVerificationCelebration, setShowVerificationCelebration] = useState(false);
    const previousVerifiedRef = useRef<boolean | undefined>(undefined);

    const helpDropdownRef = useRef<HTMLDivElement>(null);
    const companyDropdownRef = useRef<HTMLDivElement>(null);

    const publicRoutes = ['/login', '/auth', '/magic-link', '/verify'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    useEffect(() => {
        if (!company && !isPublicRoute) {
            fetchCompanyProfile();
        }
        // Fetch subscription when company is loaded
        if (company && !isPublicRoute) {
            fetchCurrentSubscription();
        }
    }, [company, fetchCompanyProfile, fetchCurrentSubscription, isPublicRoute]);

    useEffect(() => {
        if (isPublicRoute) return;
        const interval = setInterval(() => {
            fetchCompanyProfile();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchCompanyProfile, isPublicRoute]);

    useEffect(() => {
        if (company) {
            if (previousVerifiedRef.current === false && company.verified === true) {
                setShowVerificationCelebration(true);
            }
            previousVerifiedRef.current = company.verified;
        }
    }, [company?.verified]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target as Node)) {
                setShowHelpDropdown(false);
            }
            if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
                setShowCompanyDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        clearSubscription(); // Clear subscription data
        await logout();
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                {isMobile && (
                    <button
                        onClick={onMenuClick}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition lg:hidden"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                )}
                <h1 className="text-base sm:text-lg font-medium text-gray-800">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Notification Bell */}
                <div ref={helpDropdownRef} className="relative">
                    <button
                        onClick={() => setShowHelpDropdown(!showHelpDropdown)}
                        className="relative p-1.5 bg-blue-50 hover:bg-blue-100 rounded-full transition"
                        title={t('notifications') || 'Notifications'}
                    >
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadNotifications}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showHelpDropdown && (
                        <div className="absolute right-0 top-10 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 text-sm">{t('notifications') || 'Notifications'}</h3>
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {t('markAllRead') || 'Mark all as read'}
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">{t('noNotifications') || 'No notifications'}</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 10).map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-2 px-3 py-2 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                                        >
                                            <div className={`p-1.5 rounded-full flex-shrink-0 ${notification.type === 'admin_message' ? 'bg-purple-100' :
                                                notification.type === 'new_review' ? 'bg-yellow-100' : 'bg-gray-100'
                                                }`}>
                                                {notification.type === 'admin_message' ? (
                                                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                                                ) : notification.type === 'new_review' ? (
                                                    <Star className="w-3 h-3 text-yellow-600" />
                                                ) : (
                                                    <Info className="w-3 h-3 text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-xs">{notification.title}</p>
                                                <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-2 border-t border-gray-200 text-center">
                                <button
                                    onClick={() => router.push('/support')}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    {t('viewAllNotifications') || 'View all'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Company Profile Button */}
                <div ref={companyDropdownRef} className="relative">
                    <button
                        onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                        className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center"
                        title={t('companyAccount')}
                    >
                        {company?.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-cover"
                            />
                        ) : company?.name ? (
                            <span className="text-white font-bold text-xs">
                                {company.name.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <User className="w-4 h-4 text-white" />
                        )}
                    </button>

                    {/* Company Dropdown */}
                    {showCompanyDropdown && (
                        <div className="absolute right-0 top-10 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                        {company?.logo ? (
                                            <img
                                                src={company.logo}
                                                alt={company.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : company?.name ? (
                                            <span className="text-white font-bold text-sm">
                                                {company.name.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{company?.name || 'Loading...'}</p>
                                        <p className="text-xs text-gray-500 truncate">{company?.email || ''}</p>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currentSubscription?.planName === 'Premium' ? 'bg-purple-100 text-purple-700' :
                                        currentSubscription?.planName === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {currentSubscription?.planName || company?.plan || 'Free'}
                                    </span>
                                    {company?.verifyStatus === 'APPROVED' && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-0.5">
                                            <ShieldCheck className="w-3 h-3" />
                                            {t('verified')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-1.5">
                                <a href="/settings" className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg">
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{t('companySettings')}</span>
                                </a>
                                <a href="/subscription" className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg">
                                    <Crown className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{t('upgradePlan')}</span>
                                </a>
                                <a href="/verification" className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg">
                                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{t('verificationStatus')}</span>
                                </a>
                                <hr className="my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 rounded-lg text-red-600"
                                >
                                    <span className="text-sm font-medium">{t('signOut')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Celebration Modal */}
            {showVerificationCelebration && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 text-center relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
                            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></div>
                            <div className="absolute top-0 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.8s' }}></div>
                        </div>

                        <button
                            onClick={() => setShowVerificationCelebration(false)}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <PartyPopper className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-bold text-gray-900">
                                {t('verificationSuccess') || 'Chúc mừng!'}
                            </h2>
                            <PartyPopper className="w-5 h-5 text-yellow-500 transform scale-x-[-1]" />
                        </div>

                        <p className="text-gray-600 text-sm mb-5">
                            {t('verificationSuccessMessage') || 'Công ty của bạn đã được xác thực thành công!'}
                        </p>

                        <button
                            onClick={() => setShowVerificationCelebration(false)}
                            className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm"
                        >
                            {t('awesome') || 'Tuyệt vời!'}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}