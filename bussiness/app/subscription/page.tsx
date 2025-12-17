'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Check, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';
import usePlanStore from '@/store/usePlanStore';

export default function SubscriptionPage() {
    const router = useRouter();
    const { plans, isLoading, error, fetchPlans } = usePlanStore();
    const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

    // Fetch plans on mount
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // TODO: Get current plan from user's subscription
    const currentPlanId = null; // Replace with actual user's current plan ID

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

    const getPlanIcon = (index: number) => {
        const icons = [
            <Shield key="shield" className="h-8 w-8 text-gray-600" />,
            <Zap key="zap" className="h-8 w-8 text-purple-600" />,
            <Crown key="crown" className="h-8 w-8 text-blue-600" />
        ];
        return icons[index % icons.length];
    };

    const getPlanColor = (index: number) => {
        const colors = ['bg-gray-100', 'bg-purple-100', 'bg-blue-100'];
        return colors[index % colors.length];
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
                <p className="text-gray-500 mt-2">Select the perfect plan for your business needs</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
                <span className={`font-medium ${billingPeriod === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
                    Monthly
                </span>
                <button
                    onClick={() => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month')}
                    className={`relative w-14 h-7 rounded-full transition-colors ${billingPeriod === 'year' ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                >
                    <div
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${billingPeriod === 'year' ? 'translate-x-7' : 'translate-x-0'
                            }`}
                    />
                </button>
                <span className={`font-medium ${billingPeriod === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
                    Yearly
                </span>
                {billingPeriod === 'year' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                        Save 17%
                    </span>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
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

            {/* Plans Grid */}
            {!isLoading && !error && plans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => {
                        const isCurrentPlan = plan.id === currentPlanId;
                        const isPopular = index === 1; // Middle plan is popular

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${isPopular
                                        ? 'border-green-500 shadow-xl scale-105'
                                        : isCurrentPlan
                                            ? 'border-blue-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 bg-green-600 text-white text-sm font-bold rounded-full shadow-lg">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                                            Current Plan
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className={`inline-flex p-3 rounded-full mb-4 ${getPlanColor(index)}`}>
                                        {getPlanIcon(index)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                                    <div className="mb-2">
                                        <span className="text-4xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                                        {plan.price > 0 && (
                                            <span className="text-gray-600">/{billingPeriod === 'month' ? 'month' : 'year'}</span>
                                        )}
                                    </div>
                                    {getSavings(plan.price) && (
                                        <p className="text-sm text-green-600 font-semibold">{getSavings(plan.price)}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => !isCurrentPlan && handleUpgrade(plan.id)}
                                    disabled={isCurrentPlan}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${isCurrentPlan
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : isPopular
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
                                </button>

                                <div className="space-y-3">
                                    {plan.features && plan.features.length > 0 ? (
                                        plan.features.map((feature) => (
                                            <div key={feature.id} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{feature.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center">No features listed</p>
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
                    <p className="text-gray-600">No subscription plans available at the moment.</p>
                </div>
            )}

            {/* Contact Sales */}
            <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-2xl font-bold mb-2">Need a Custom Plan?</h3>
                <p className="text-gray-300 mb-6">
                    Contact our sales team for enterprise solutions and custom pricing
                </p>
                <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                    Contact Sales
                </button>
            </div>
        </div>
    );
}
