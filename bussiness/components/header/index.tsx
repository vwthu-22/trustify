'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Info, Mail, User, Star, Settings, ShieldCheck, Crown, X
} from 'lucide-react';

import { usePathname, useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
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
            '/connect': t('pageConnect')
        };

        return routes[path] || t('pageDashboard');
    };

    const pageTitle = getPageTitle(pathname);

    const { company, fetchCompanyProfile, logout } = useCompanyStore();

    const [showHelpDropdown, setShowHelpDropdown] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [unreadMessages] = useState(3);

    // Refs for click outside detection
    const helpDropdownRef = useRef<HTMLDivElement>(null);
    const companyDropdownRef = useRef<HTMLDivElement>(null);

    // Public routes - don't fetch profile
    const publicRoutes = ['/login', '/auth', '/magic-link', '/verify'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Fetch company profile on mount if not already loaded (only on protected routes)
    useEffect(() => {
        if (!company && !isPublicRoute) {
            fetchCompanyProfile();
        }
    }, [company, fetchCompanyProfile, isPublicRoute]);

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

                {/* Help Center Button */}
                <div ref={helpDropdownRef} className="relative">
                    <button
                        onClick={() => setShowHelpDropdown(!showHelpDropdown)}
                        className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                        title={t('helpCenter')}
                    >
                        <Info className="w-5 h-5 text-blue-600" />
                    </button>

                    {/* Help Dropdown */}
                    {showHelpDropdown && (
                        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-bold text-gray-900">{t('helpCenter')}</h3>
                            </div>
                            <div className="p-2">
                                <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Info className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{t('documentation')}</p>
                                        <p className="text-xs text-gray-600">{t('documentationDesc')}</p>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Mail className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{t('videoTutorials')}</p>
                                        <p className="text-xs text-gray-600">{t('videoTutorialsDesc')}</p>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Star className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{t('faq')}</p>
                                        <p className="text-xs text-gray-600">{t('faqDesc')}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Support Messages Button */}
                <button
                    onClick={() => setShowSupportModal(!showSupportModal)}
                    className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                    title={t('contactSupport')}
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
                                <h3 className="text-xl font-bold text-gray-900">{t('contactSupport')}</h3>
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
                                            {t('typeOfRequest')}
                                        </label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="question">{t('generalQuestion')}</option>
                                            <option value="technical">{t('technicalIssue')}</option>
                                            <option value="complaint">{t('complaint')}</option>
                                            <option value="feature">{t('featureRequest')}</option>
                                            <option value="billing">{t('billingIssue')}</option>
                                        </select>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('subject')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('subjectPlaceholder')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('message')}
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder={t('messagePlaceholder')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('priority')}
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="priority" value="low" defaultChecked className="w-4 h-4" />
                                                <span className="text-sm text-gray-700">{t('low')}</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="priority" value="medium" className="w-4 h-4" />
                                                <span className="text-sm text-gray-700">{t('medium')}</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="priority" value="high" className="w-4 h-4" />
                                                <span className="text-sm text-gray-700">{t('high')}</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Response Time Info */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-900">
                                            <strong>{t('expectedResponse')}</strong>
                                        </p>
                                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                            <li>• {t('freePlanResponse')}</li>
                                            <li>• {t('proPlanResponse')}</li>
                                            <li>• {t('premiumPlanResponse')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex gap-3">
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={() => {
                                        alert(t('messageSent'));
                                        setShowSupportModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {t('sendMessage')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Company Profile Button */}
                <div ref={companyDropdownRef} className="relative">
                    <button
                        onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                        className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                        title={t('companyAccount')}
                    >
                        <User className="w-5 h-5 text-blue-600" />
                    </button>

                    {/* Company Dropdown */}
                    {showCompanyDropdown && (
                        <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200">
                                <p className="font-bold text-gray-900">{company?.name || 'Loading...'}</p>
                                <p className="text-sm text-gray-600">{company?.email || ''}</p>
                                <div className="mt-2 flex items-center gap-2">
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
        </header>
    );
}