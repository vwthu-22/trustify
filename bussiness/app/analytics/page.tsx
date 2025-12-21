'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Star, MessageSquare, Users, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

const kpiData = [
    { title: 'Avg Rating', value: '4.5', change: '+0.3', trend: 'up', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { title: 'Total Reviews', value: '1,234', change: '+89', trend: 'up', icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Response Rate', value: '95%', change: '+5%', trend: 'up', icon: Users, color: 'text-green-500', bgColor: 'bg-green-50' },
    { title: 'Avg Response Time', value: '2.5h', change: '-0.5h', trend: 'up', icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-50' }
];

const monthlyData = [
    { month: 'Jan', reviews: 180, rating: 4.2, responseRate: 88 },
    { month: 'Feb', reviews: 210, rating: 4.3, responseRate: 90 },
    { month: 'Mar', reviews: 245, rating: 4.4, responseRate: 92 },
    { month: 'Apr', reviews: 220, rating: 4.4, responseRate: 91 },
    { month: 'May', reviews: 280, rating: 4.5, responseRate: 94 },
    { month: 'Jun', reviews: 299, rating: 4.5, responseRate: 95 }
];

const sentimentData = [
    { sentiment: 'Positive', percentage: 65, count: 802, color: 'bg-green-500' },
    { sentiment: 'Neutral', percentage: 20, count: 247, color: 'bg-gray-400' },
    { sentiment: 'Negative', percentage: 15, count: 185, color: 'bg-red-500' }
];

const topPerformers = [
    { name: 'Hà Nội Branch', rating: 4.8, reviews: 450, change: '+12%' },
    { name: 'TP.HCM Branch', rating: 4.6, reviews: 680, change: '+8%' },
    { name: 'Đà Nẵng Branch', rating: 4.5, reviews: 290, change: '+5%' }
];

export default function AnalyticsOverviewPage() {
    const t = useTranslations('analytics');
    const [timeRange, setTimeRange] = useState('30');

    return (
        <div className="space-y-8">
            {/* Time Range Filter */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="7">{t('last7Days')}</option>
                    <option value="30">{t('last30Days')}</option>
                    <option value="90">{t('last90Days')}</option>
                    <option value="365">{t('lastYear')}</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {kpi.trend === 'up' ? (
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-600" />
                                        )}
                                        <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {kpi.change}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                                    <Icon className={`h-8 w-8 ${kpi.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">{t('monthlyTrends')}</h3>
                    <div className="space-y-4">
                        <div className="flex items-end justify-between gap-2 h-48">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100%' }}>
                                        <div
                                            className="absolute bottom-0 w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                                            style={{ height: `${(data.reviews / 300) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">1,434</p>
                                <p className="text-xs text-gray-600">{t('totalReviews')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">4.5</p>
                                <p className="text-xs text-gray-600">{t('avgRating')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">+24%</p>
                                <p className="text-xs text-gray-600">{t('growth')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sentiment Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">{t('sentimentDistribution')}</h3>
                    <div className="space-y-4">
                        {sentimentData.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">{item.sentiment}</span>
                                    <span className="text-gray-600">{item.count} reviews ({item.percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className={`${item.color} h-4 rounded-full transition-all flex items-center justify-end pr-2`}
                                        style={{ width: `${item.percentage}%` }}
                                    >
                                        <span className="text-xs font-bold text-white">{item.percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-3xl font-bold text-green-600">85%</p>
                                <p className="text-sm text-gray-600 mt-1">{t('satisfactionScore')}</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-3xl font-bold text-blue-600">92%</p>
                                <p className="text-sm text-gray-600 mt-1">{t('recommendationRate')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('topPerformingBranches')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topPerformers.map((branch, index) => (
                        <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                    {branch.change}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{branch.name}</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-2xl font-bold text-gray-900">{branch.rating}</span>
                                </div>
                                <p className="text-sm text-gray-600">{branch.reviews} reviews</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}