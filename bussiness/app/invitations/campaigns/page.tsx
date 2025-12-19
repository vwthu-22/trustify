'use client';

import { useState } from 'react';
import { Plus, Play, Pause, Trash2, Eye, Calendar, Users, Mail, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Campaign {
    id: number;
    name: string;
    status: 'active' | 'paused' | 'completed';
    sent: number;
    total: number;
    responses: number;
    startDate: string;
    endDate: string;
}

const mockCampaigns: Campaign[] = [
    {
        id: 1,
        name: 'Summer Sale Feedback',
        status: 'active',
        sent: 450,
        total: 600,
        responses: 120,
        startDate: '2024-06-01',
        endDate: '2024-06-30'
    },
    {
        id: 2,
        name: 'New Product Launch',
        status: 'active',
        sent: 280,
        total: 300,
        responses: 85,
        startDate: '2024-06-15',
        endDate: '2024-07-15'
    },
    {
        id: 3,
        name: 'Q1 Customer Survey',
        status: 'completed',
        sent: 1000,
        total: 1000,
        responses: 340,
        startDate: '2024-03-01',
        endDate: '2024-03-31'
    },
    {
        id: 4,
        name: 'VIP Customer Appreciation',
        status: 'paused',
        sent: 50,
        total: 150,
        responses: 18,
        startDate: '2024-06-10',
        endDate: '2024-07-10'
    }
];

export default function CampaignsPage() {
    const t = useTranslations('campaigns');
    const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
    const [showNewCampaign, setShowNewCampaign] = useState(false);

    const toggleCampaignStatus = (id: number) => {
        setCampaigns(campaigns.map(c =>
            c.id === id
                ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
                : c
        ));
    };

    const deleteCampaign = (id: number) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            setCampaigns(campaigns.filter(c => c.id !== id));
        }
    };

    const getStatusColor = (status: Campaign['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'paused': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <button
                    onClick={() => setShowNewCampaign(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    {t('newCampaign')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t('totalCampaigns')}</p>
                            <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Play className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t('active')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {campaigns.filter(c => c.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Mail className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t('totalSent')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {campaigns.reduce((sum, c) => sum + c.sent, 0)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t('totalResponses')}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {campaigns.reduce((sum, c) => sum + c.responses, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
                {campaigns.map(campaign => (
                    <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(campaign.status)}`}>
                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{campaign.startDate} to {campaign.endDate}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {campaign.status !== 'completed' && (
                                    <button
                                        onClick={() => toggleCampaignStatus(campaign.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                                    >
                                        {campaign.status === 'active' ? (
                                            <Pause className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <Play className="h-5 w-5 text-gray-600" />
                                        )}
                                    </button>
                                )}
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Eye className="h-5 w-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => deleteCampaign(campaign.id)}
                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{t('invitationsSent')}</span>
                                    <span className="text-gray-600">{campaign.sent} / {campaign.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all"
                                        style={{ width: `${(campaign.sent / campaign.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{t('responseRate')}</span>
                                    <span className="text-gray-600">
                                        {campaign.responses} ({Math.round((campaign.responses / campaign.sent) * 100)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full transition-all"
                                        style={{ width: `${(campaign.responses / campaign.sent) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{campaign.sent}</p>
                                <p className="text-xs text-gray-600">{t('sent')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{campaign.responses}</p>
                                <p className="text-xs text-gray-600">{t('responses')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {Math.round((campaign.responses / campaign.sent) * 100)}%
                                </p>
                                <p className="text-xs text-gray-600">{t('rate')}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Campaign Modal */}
            {showNewCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-gray-900">{t('createCampaign')}</h3>
                            <button
                                onClick={() => setShowNewCampaign(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Plus className="h-6 w-6 rotate-45" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Spring Sale Feedback"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Audience
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>All Customers</option>
                                    <option>Recent Purchasers</option>
                                    <option>VIP Customers</option>
                                    <option>Specific Branch</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Template
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>Standard Template</option>
                                    <option>Friendly Template</option>
                                    <option>Professional Template</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowNewCampaign(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    Create Campaign
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}