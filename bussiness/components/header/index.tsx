'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Info, User, Star, Settings, ShieldCheck, Crown, PartyPopper, X
} from 'lucide-react';

import { usePathname, useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useChatStore } from '@/store/useChatStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('header');

    // Đồng bộ menuItems với sidebar
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
            '/support': t('pageSupport') || 'Hỗ trợ'
        };

        return routes[path] || t('pageDashboard');
    };

    const pageTitle = getPageTitle(pathname);

    const { company, fetchCompanyProfile, logout } = useCompanyStore();
    const { notifications, unreadNotifications, markAllNotificationsAsRead } = useChatStore();

    const [showHelpDropdown, setShowHelpDropdown] = useState(false);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [showVerificationCelebration, setShowVerificationCelebration] = useState(false);
    const previousVerifyStatusRef = useRef<string | undefined>(undefined);

    // Refs for click outside detection
    const helpDropdownRef = useRef<HTMLDivElement>(null);
    const companyDropdownRef = useRef<HTMLDivElement>(null);

    // Public routes - don't fetch profile
    const publicRoutes = ['/login', '/auth', '/magic-link', '/verify'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Fetch company profile on mount and periodically
    useEffect(() => {
        if (!isPublicRoute) {
            fetchCompanyProfile();
        }

        // Poll for updates every 30 seconds
        const interval = setInterval(() => {
            if (!isPublicRoute) {
                fetchCompanyProfile();
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [fetchCompanyProfile, isPublicRoute]);

    // Detect when company gets verified (document verification) and show celebration
    useEffect(() => {
        if (company) {
            // If previous status was not APPROVED and now it is, show celebration
            if (previousVerifyStatusRef.current !== 'APPROVED' && company.verifyStatus === 'APPROVED') {
                setShowVerificationCelebration(true);
            }
            previousVerifyStatusRef.current = company.verifyStatus;
        }
    }, [company?.verifyStatus]);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close help dropdown if clicked outside
            if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target as Node)) {
                setShowHelpDropdown(false);
            }
            // Close company dropdown if clicked outside
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
        await logout();
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-xl text-black">
                {pageTitle}
            </h1>

            <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Notification Bell */}
                <div ref={helpDropdownRef} className="relative">
                    <button
                        onClick={() => setShowHelpDropdown(!showHelpDropdown)}
                        className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                        title={t('notifications') || 'Notifications'}
                    >
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadNotifications}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showHelpDropdown && (
                        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">{t('notifications') || 'Notifications'}</h3>
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {t('markAllRead') || 'Mark all as read'}
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-gray-500">
                                        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">{t('noNotifications') || 'No notifications'}</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 10).map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                                        >
                                            <div className={`p-2 rounded-full flex-shrink-0 ${notification.type === 'admin_message' ? 'bg-purple-100' :
                                                notification.type === 'new_review' ? 'bg-yellow-100' : 'bg-gray-100'
                                                }`}>
                                                {notification.type === 'admin_message' ? (
                                                    <ShieldCheck className={`w-4 h-4 text-purple-600`} />
                                                ) : notification.type === 'new_review' ? (
                                                    <Star className={`w-4 h-4 text-yellow-600`} />
                                                ) : (
                                                    <Info className={`w-4 h-4 text-gray-600`} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                                                <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-200 text-center">
                                <button
                                    onClick={() => router.push('/support')}
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                    {t('viewAllNotifications') || 'View all notifications'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Company Profile Button */}
                <div ref={companyDropdownRef} className="relative">
                    <button
                        onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                        className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center"
                        title={t('companyAccount')}
                    >
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
                    </button>

                    {/* Company Dropdown */}
                    {showCompanyDropdown && (
                        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                        {company?.logo ? (
                                            <img
                                                src={company.logo}
                                                alt={company.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : company?.name ? (
                                            <span className="text-white font-bold text-lg">
                                                {company.name.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <User className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{company?.name || 'Loading...'}</p>
                                        <p className="text-sm text-gray-600 truncate">{company?.email || ''}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${company?.plan === 'Premium' ? 'bg-purple-100 text-purple-700' :
                                        company?.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {company?.plan || 'Free'} {t('plan')}
                                    </span>
                                    {company?.verified && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            {t('verified')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-2">
                                <a href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                    <Settings className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">{t('companySettings')}</span>
                                </a>
                                <a href="/subscription" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                    <Crown className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">{t('upgradePlan')}</span>
                                </a>
                                <a href="/verification" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                    <ShieldCheck className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">{t('verificationStatus')}</span>
                                </a>
                                <hr className="my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg text-red-600"
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
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center relative overflow-hidden">
                        {/* Confetti animation background */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></div>
                            <div className="absolute top-0 left-3/4 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.8s' }}></div>
                            <div className="absolute top-10 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '1.1s' }}></div>
                            <div className="absolute top-10 left-2/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.9s' }}></div>
                        </div>

                        <button
                            onClick={() => setShowVerificationCelebration(false)}
                            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-4">
                            <PartyPopper className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('verificationSuccess') || 'Chúc mừng!'}
                            </h2>
                            <PartyPopper className="w-6 h-6 text-yellow-500 transform scale-x-[-1]" />
                        </div>

                        <p className="text-gray-600 mb-6">
                            {t('verificationSuccessMessage') || 'Công ty của bạn đã được xác thực thành công! Bạn sẽ nhận được badge Verified trên trang công ty.'}
                        </p>

                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" />
                                {t('verified') || 'Đã xác thực'}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowVerificationCelebration(false)}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                        >
                            {t('awesome') || 'Tuyệt vời!'}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}