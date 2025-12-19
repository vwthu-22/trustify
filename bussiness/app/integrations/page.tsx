'use client';

import { useState } from 'react';
import { Puzzle, Code, Zap, CheckCircle, ExternalLink, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'ecommerce' | 'crm' | 'email' | 'analytics' | 'other';
    isConnected: boolean;
    isPro: boolean;
}

const integrations: Integration[] = [
    {
        id: 'shopify',
        name: 'Shopify',
        description: 'Automatically collect reviews from Shopify orders',
        icon: '🛍️',
        category: 'ecommerce',
        isConnected: false,
        isPro: false
    },
    {
        id: 'woocommerce',
        name: 'WooCommerce',
        description: 'Integrate with your WooCommerce store',
        icon: '🛒',
        category: 'ecommerce',
        isConnected: false,
        isPro: false
    },
    {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Sync customer data with Salesforce CRM',
        icon: '☁️',
        category: 'crm',
        isConnected: false,
        isPro: true
    },
    {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Connect with HubSpot for marketing automation',
        icon: '🎯',
        category: 'crm',
        isConnected: false,
        isPro: true
    },
    {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Send review invitations via Mailchimp',
        icon: '📧',
        category: 'email',
        isConnected: false,
        isPro: false
    },
    {
        id: 'google-analytics',
        name: 'Google Analytics',
        description: 'Track review widget performance',
        icon: '📊',
        category: 'analytics',
        isConnected: true,
        isPro: false
    },
    {
        id: 'zapier',
        name: 'Zapier',
        description: 'Connect with 3000+ apps via Zapier',
        icon: '⚡',
        category: 'other',
        isConnected: false,
        isPro: true
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Get notifications for new reviews in Slack',
        icon: '💬',
        category: 'other',
        isConnected: false,
        isPro: false
    }
];

export default function IntegrationsPage() {
    const t = useTranslations('integrations');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showApiDocs, setShowApiDocs] = useState(false);

    const categories = [
        { id: 'all', name: 'All Integrations', count: integrations.length },
        { id: 'ecommerce', name: 'E-commerce', count: integrations.filter(i => i.category === 'ecommerce').length },
        { id: 'crm', name: 'CRM', count: integrations.filter(i => i.category === 'crm').length },
        { id: 'email', name: 'Email', count: integrations.filter(i => i.category === 'email').length },
        { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
        { id: 'other', name: 'Other', count: integrations.filter(i => i.category === 'other').length }
    ];

    const filteredIntegrations = selectedCategory === 'all'
        ? integrations
        : integrations.filter(i => i.category === selectedCategory);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Puzzle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('available')}</p>
                            <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('connected')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {integrations.filter(i => i.isConnected).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Zap className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('proOnly')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {integrations.filter(i => i.isPro).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {category.name} ({category.count})
                    </button>
                ))}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                    <div
                        key={integration.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-4xl">{integration.icon}</div>
                            {integration.isPro && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    PRO
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{integration.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                        {integration.isConnected ? (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                <CheckCircle className="h-4 w-4" />
                                {t('connected')}
                            </div>
                        ) : (
                            <button
                                disabled={integration.isPro}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${integration.isPro
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {integration.isPro ? t('upgradeToConnect') : t('connect')}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* API Documentation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('apiDocumentation')}</h3>
                        <p className="text-sm text-gray-600 mt-1">{t('buildCustom')}</p>
                    </div>
                    <button
                        onClick={() => setShowApiDocs(!showApiDocs)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Code className="h-4 w-4" />
                        {t('viewApiDocs')}
                    </button>
                </div>

                {showApiDocs && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-2">API Endpoint</p>
                            <code className="text-sm text-blue-600">https://api.trustify.com/v1/</code>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-2">Authentication</p>
                            <code className="text-sm text-gray-700">
                                Authorization: Bearer YOUR_API_KEY
                            </code>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-3">Example: Get Reviews</p>
                            <pre className="text-sm text-gray-700 overflow-x-auto">
                                {`GET /reviews
{
  "limit": 10,
  "offset": 0,
  "branch": "hanoi"
}`}
                            </pre>
                        </div>

                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <ExternalLink className="h-4 w-4" />
                            {t('viewFullDocs')}
                        </a>
                    </div>
                )}
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Lock className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{t('unlockPremium')}</h3>
                        <p className="text-white/90 mb-4">
                            Upgrade to PRO to access Salesforce, HubSpot, Zapier and more
                        </p>
                        <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                            {t('upgradeToPro')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
