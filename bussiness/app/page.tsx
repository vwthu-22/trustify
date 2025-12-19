'use client';

import { Star, MessageSquare, TrendingUp, Clock, Package, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

const starDistribution = [
    { stars: 5, count: 740, percentage: 60 },
    { stars: 4, count: 309, percentage: 25 },
    { stars: 3, count: 123, percentage: 10 },
    { stars: 2, count: 37, percentage: 3 },
    { stars: 1, count: 25, percentage: 2 }
];

const recentReviews = [
    { id: 1, author: 'Nguyễn Văn A', rating: 5, time: '2 hours ago', branch: 'Hà Nội', text: 'Sản phẩm tuyệt vời, giao hàng nhanh chóng!', sentiment: 'positive' },
    { id: 2, author: 'Trần Thị B', rating: 4, time: '5 hours ago', branch: 'TP.HCM', text: 'Chất lượng tốt nhưng giá hơi cao.', sentiment: 'neutral' },
    { id: 3, author: 'Lê Văn C', rating: 5, time: '1 day ago', branch: 'Đà Nẵng', text: 'Dịch vụ khách hàng xuất sắc!', sentiment: 'positive' }
];

const topicsPositive = [
    { topic: 'Product Quality', score: 85, count: 340 },
    { topic: 'Customer Service', score: 82, count: 290 },
    { topic: 'Value for Money', score: 78, count: 250 }
];

const topicsNegative = [
    { topic: 'Delivery Time', score: 45, count: 180, trend: 'down' },
    { topic: 'Pricing', score: 38, count: 120, trend: 'down' },
    { topic: 'Packaging', score: 52, count: 95, trend: 'up' }
];

export default function DashboardPage() {
    const t = useTranslations('dashboard');

    const kpiData = [
        { titleKey: 'averageRating', value: '4.5', change: '+0.3', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
        { titleKey: 'totalReviews', value: '1,234', change: '+89', icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { titleKey: 'growthRate', value: '+15%', changeKey: 'vsLastMonth', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-50' },
        { titleKey: 'avgResponseTime', value: '2.5h', change: '-0.5h', icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-50' }
    ];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{t(kpi.titleKey)}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                                    <p className="text-sm text-green-600 mt-1">{kpi.changeKey ? t(kpi.changeKey) : kpi.change}</p>
                                </div>
                                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                                    <Icon className={`h-8 w-8 ${kpi.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Star Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t('starDistribution')}</h2>
                    <div className="space-y-4">
                        {starDistribution.map((item) => (
                            <div key={item.stars} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">{item.stars}★</span>
                                    </div>
                                    <span className="text-gray-600">{item.count} reviews</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Trend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t('reviewTrends')}</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">+15%</p>
                                <p className="text-sm text-gray-600 mt-1">{t('thisMonth')}</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">289</p>
                                <p className="text-sm text-gray-600 mt-1">{t('lastMonth')}</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">4.5</p>
                                <p className="text-sm text-gray-600 mt-1">{t('averageRating')}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <p className="text-sm text-gray-600 mb-2">{t('monthlyProgress')}</p>
                            <div className="flex items-end gap-2 h-32">
                                {[60, 70, 65, 80, 85, 90].map((height, i) => (
                                    <div key={i} className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height: `${height}%` }}></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Topics & Issues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Positive Topics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t('topPositiveTopics')}</h2>
                    <div className="space-y-4">
                        {topicsPositive.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{item.topic}</span>
                                    <span className="text-sm font-bold text-green-600">{item.score}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">{item.count} mentions</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Negative Topics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t('topicsNeedImprovement')}</h2>
                    <div className="space-y-4">
                        {topicsNegative.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{item.topic}</span>
                                    <span className="text-sm font-bold text-red-600">{item.score}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">{item.count} mentions</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}