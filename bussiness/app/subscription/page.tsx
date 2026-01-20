'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Check, Zap, Shield, Loader2, Star, Calendar, Clock } from 'lucide-react';
import usePlanStore from '@/store/usePlanStore';
import useCompanyStore from '@/store/useCompanyStore';
import { useSubscriptionStore, type ResSubscription } from '@/store/useSubscriptionStore';
import { useTranslations } from 'next-intl';

export default function SubscriptionPage() {
    const router = useRouter();
    const { plans, isLoading, error, fetchPlans } = usePlanStore();
    const { company } = useCompanyStore();
    const { companySubscriptions, isLoading: loadingSubscriptions, fetchCompanySubscriptions } = useSubscriptionStore();
    const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
    const t = useTranslations('subscription');

    // Fetch plans on mount
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Fetch company subscriptions from store
    useEffect(() => {
        if (company?.id) {
            fetchCompanySubscriptions(company.id);
        }
    }, [company?.id, fetchCompanySubscriptions]);

    // Get active subscription for a plan
    const getActiveSubscription = (planName: string): ResSubscription | null => {
        const now = new Date();
        const active = companySubscriptions.find(sub => {
            const endDate = new Date(sub.endDate);
            return sub.planName === planName && endDate > now;
        });
        return active || null;
    };

    // Check if subscription is expired
    const isSubscriptionExpired = (endDate: string): boolean => {
        return new Date(endDate) <= new Date();
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (endDate: string): number => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const handleUpgrade = (planId: number) => {
        router.push(`/checkout?plan=${planId}&period=${billingPeriod}`);
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        const finalPrice = billingPeriod === 'year' ? price * 10 : price;
        return `${finalPrice.toLocaleString('vi-VN')}₫`;
    };

    const getSavings = (price: number) => {
        if (price === 0 || billingPeriod === 'month') return null;
        const savings = price * 2;
        return `Save ${savings.toLocaleString('vi-VN')}₫/year`;
    };

    // Dynamic icons based on plan price (free < paid plans)
    const getPlanIcon = (plan: typeof plans[0], index: number) => {
        if (plan.price === 0) {
            return <Shield className="h-8 w-8 text-gray-600" />;
        }
        // For paid plans, use different icons
        const paidIcons = [
            <Zap key="zap" className="h-8 w-8 text-purple-600" />,
            <Crown key="crown" className="h-8 w-8 text-yellow-600" />,
            <Star key="star" className="h-8 w-8 text-blue-600" />
        ];
        return paidIcons[index % paidIcons.length];
    };

    const getPlanColor = (plan: typeof plans[0], index: number) => {
        if (plan.price === 0) return 'bg-gray-100';
        const colors = ['bg-purple-100', 'bg-yellow-100', 'bg-blue-100'];
        return colors[index % colors.length];
    };

    // Determine grid layout based on number of plans
    const getGridClass = () => {
        const count = plans.length;
        if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto';
        if (count === 3) return 'grid-cols-1 md:grid-cols-3';
        // 4+ plans: responsive grid
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    };

    // Mark recommended plan (highest price that's not free, or last paid plan)
    const getRecommendedPlanId = () => {
        const paidPlans = plans.filter(p => p.price > 0);
        if (paidPlans.length === 0) return null;
        // Sort by price and get the middle-to-high priced plan
        const sorted = [...paidPlans].sort((a, b) => a.price - b.price);
        // If 2+ paid plans, recommend the second one (better value), otherwise the first
        return sorted.length >= 2 ? sorted[1].id : sorted[0].id;
    };

    const recommendedPlanId = getRecommendedPlanId();

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('choosePlan')}</h2>
                <p className="text-gray-500 text-xs sm:text-sm">{t('selectPlan')}</p>
            </div>

            {/* Loading State */}
            {(isLoading || loadingSubscriptions) && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading plans...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchPlans}
                        className="mt-2 text-sm text-red-600 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Plans Grid - Dynamic Layout */}
            {!isLoading && !error && plans.length > 0 && (
                <div className={`grid gap-3 sm:gap-4 ${getGridClass()}`}>
                    {plans.map((plan, index) => {
                        const activeSub = getActiveSubscription(plan.name);
                        const isActive = activeSub !== null;
                        const isExpired = activeSub ? isSubscriptionExpired(activeSub.endDate) : false;
                        const isRecommended = plan.id === recommendedPlanId;
                        const daysRemaining = activeSub ? getDaysRemaining(activeSub.endDate) : 0;

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-lg shadow-sm border-2 p-4 sm:p-5 transition-all flex flex-col ${isRecommended
                                    ? 'border-blue-500 shadow-lg md:scale-[1.02]'
                                    : isActive && !isExpired
                                        ? 'border-green-500'
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {isRecommended && !isActive && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow whitespace-nowrap">
                                            {t('recommended')}
                                        </span>
                                    </div>
                                )}

                                {isActive && !isExpired && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-3 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full shadow whitespace-nowrap">
                                            Active
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-4">
                                    <div className={`inline-flex p-2 rounded-full mb-3 ${getPlanColor(plan, index)}`}>
                                        {getPlanIcon(plan, index)}
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                                    <p className="text-xs text-gray-600 mb-3 min-h-[32px]">{plan.description || 'Perfect for your needs'}</p>
                                    <div className="mb-1">
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                                        {plan.price > 0 && (
                                            <span className="text-gray-600 text-sm">/{billingPeriod === 'month' ? 'month' : 'year'}</span>
                                        )}
                                    </div>
                                    {getSavings(plan.price) && (
                                        <p className="text-xs text-blue-600 font-semibold">{getSavings(plan.price)}</p>
                                    )}
                                </div>

                                {/* Subscription Status or Upgrade Button */}
                                {isActive && !isExpired ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-semibold text-green-900">Active Subscription</span>
                                        </div>
                                        <div className="space-y-1 text-xs text-green-700">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                <span>Expires: {formatDate(activeSub.endDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {daysRemaining} days remaining
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUpgrade(plan.id)}
                                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${isRecommended
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : plan.price === 0
                                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        {plan.price === 0 ? t('getStartedFree') : isExpired ? 'Renew Now' : t('upgradeNow')}
                                    </button>
                                )}

                                {/* Features list - grows to fill space */}
                                <div className="space-y-3 flex-1">
                                    {plan.features && plan.features.length > 0 ? (
                                        plan.features.map((feature) => (
                                            <div key={feature.id} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{feature.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center">Basic features included</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* No Plans */}
            {!isLoading && !error && plans.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">{t('noPlans')}</p>
                </div>
            )}
        </div>
    );
}
