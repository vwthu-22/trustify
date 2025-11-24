'use client';

import { useState } from 'react';
import { Crown, Check, Zap, TrendingUp, Shield, Sparkles } from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    price: number;
    period: 'month' | 'year';
    description: string;
    features: string[];
    popular?: boolean;
    current?: boolean;
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'month',
        description: 'Perfect for getting started',
        current: true,
        features: [
            'Unlimited reviews collection',
            'Basic review management',
            'Email notifications',
            'Basic widgets (3 types)',
            'Standard email templates',
            'Community support',
            'Trustify branding on widgets'
        ]
    },
    {
        id: 'pro',
        name: 'Professional',
        price: 299000,
        period: 'month',
        description: 'For growing businesses',
        popular: true,
        features: [
            'Everything in Free, plus:',
            'AI Sentiment Analysis',
            'Topic & Keyword Analysis',
            'Branch Comparison Analytics',
            'Custom widgets (unlimited)',
            'Remove Trustify branding',
            'Advanced email templates',
            'API Access',
            'Integrations (Shopify, WooCommerce, etc.)',
            'Priority email support',
            'Advanced reporting'
        ]
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 599000,
        period: 'month',
        description: 'For enterprise businesses',
        features: [
            'Everything in Pro, plus:',
            'Competitor Analysis',
            'White-label solution',
            'Custom campaigns',
            'Dedicated account manager',
            'Strategic consulting',
            'Custom integrations',
            'Advanced API limits',
            'SLA guarantee',
            '24/7 Priority support',
            'Custom reporting',
            'Multi-language support'
        ]
    }
];

export default function SubscriptionPage() {
    const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
    const currentPlan = plans.find(p => p.current);

    const getPrice = (plan: Plan) => {
        if (plan.price === 0) return 'Free';
        const price = billingPeriod === 'year' ? plan.price * 10 : plan.price;
        return `${price.toLocaleString('vi-VN')}₫`;
    };

    const getSavings = (plan: Plan) => {
        if (plan.price === 0 || billingPeriod === 'month') return null;
        const savings = plan.price * 2;
        return `Save ${savings.toLocaleString('vi-VN')}₫/year`;
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

            {/* Current Plan Banner */}
            {currentPlan && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Crown className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="font-semibold text-blue-900">Current Plan: {currentPlan.name}</p>
                                <p className="text-sm text-blue-700">
                                    {currentPlan.price === 0 ? 'Free forever' : `${currentPlan.price.toLocaleString('vi-VN')}₫/month`}
                                </p>
                            </div>
                        </div>
                        {currentPlan.id !== 'premium' && (
                            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                Upgrade Now
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${plan.popular
                                ? 'border-green-500 shadow-xl scale-105'
                                : plan.current
                                    ? 'border-blue-500'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="px-4 py-1 bg-green-600 text-white text-sm font-bold rounded-full shadow-lg">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {plan.current && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                                    Current Plan
                                </span>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <div className={`inline-flex p-3 rounded-full mb-4 ${plan.id === 'free' ? 'bg-gray-100' :
                                    plan.id === 'pro' ? 'bg-purple-100' :
                                        'bg-blue-100'
                                }`}>
                                {plan.id === 'free' ? <Shield className="h-8 w-8 text-gray-600" /> :
                                    plan.id === 'pro' ? <Zap className="h-8 w-8 text-purple-600" /> :
                                        <Crown className="h-8 w-8 text-blue-600" />}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                            <div className="mb-2">
                                <span className="text-4xl font-bold text-gray-900">{getPrice(plan)}</span>
                                {plan.price > 0 && (
                                    <span className="text-gray-600">/{billingPeriod === 'month' ? 'month' : 'year'}</span>
                                )}
                            </div>
                            {getSavings(plan) && (
                                <p className="text-sm text-green-600 font-semibold">{getSavings(plan)}</p>
                            )}
                        </div>

                        <button
                            disabled={plan.current}
                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${plan.current
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}
                        >
                            {plan.current ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
                        </button>

                        <div className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Feature Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                                <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                                <th className="text-center py-4 px-4 font-semibold text-green-600">Pro</th>
                                <th className="text-center py-4 px-4 font-semibold text-blue-600">Premium</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { feature: 'Review Collection', free: '✅', pro: '✅', premium: '✅' },
                                { feature: 'Basic Widgets', free: '3 types', pro: 'Unlimited', premium: 'Unlimited' },
                                { feature: 'Email Templates', free: 'Standard', pro: 'Advanced', premium: 'Custom' },
                                { feature: 'AI Sentiment Analysis', free: '❌', pro: '✅', premium: '✅' },
                                { feature: 'Branch Analytics', free: '❌', pro: '✅', premium: '✅' },
                                { feature: 'API Access', free: '❌', pro: 'Standard', premium: 'Advanced' },
                                { feature: 'Integrations', free: 'Basic', pro: 'All', premium: 'All + Custom' },
                                { feature: 'White Label', free: '❌', pro: '❌', premium: '✅' },
                                { feature: 'Support', free: 'Community', pro: 'Priority', premium: '24/7 Dedicated' },
                                { feature: 'Competitor Analysis', free: '❌', pro: '❌', premium: '✅' }
                            ].map((row, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-4 px-4 text-gray-700 font-medium">{row.feature}</td>
                                    <td className="py-4 px-4 text-center text-gray-700">{row.free}</td>
                                    <td className="py-4 px-4 text-center text-gray-700">{row.pro}</td>
                                    <td className="py-4 px-4 text-center text-gray-700">{row.premium}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                        <p className="text-sm text-gray-700">
                            Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                        <p className="text-sm text-gray-700">
                            We accept all major credit cards, bank transfers, and Vietnamese payment methods.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                        <p className="text-sm text-gray-700">
                            The Free plan is available forever. Pro and Premium plans offer a 14-day free trial.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
                        <p className="text-sm text-gray-700">
                            Yes, you can cancel your subscription at any time. No questions asked.
                        </p>
                    </div>
                </div>
            </div>

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
