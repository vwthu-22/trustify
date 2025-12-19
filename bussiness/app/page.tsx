'use client';

import { useEffect } from 'react';
import { Star, MessageSquare, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useReviewStore } from '@/store/useReviewStore';
import { getBarColor, getIndividualStarColor } from '@/utils/ratingColors';

export default function DashboardPage() {
    const t = useTranslations('dashboard');
    const { reviews, stats, isLoading, error, fetchReviews } = useReviewStore();

    useEffect(() => {
        fetchReviews(0, 50); // Fetch first 50 reviews for stats
    }, [fetchReviews]);

    // Calculate star distribution from actual data
    const starDistribution = stats?.ratingDistribution
        ? [5, 4, 3, 2, 1].map(stars => {
            const count = stats.ratingDistribution[stars] || 0;
            const percentage = stats.totalReviews > 0
                ? Math.round((count / stats.totalReviews) * 100)
                : 0;
            return { stars, count, percentage };
        })
        : [];

    // Get recent reviews (last 5)
    const recentReviews = reviews.slice(0, 5);

    // Calculate response rate
    const responseRate = stats
        ? Math.round((stats.repliedCount / Math.max(stats.totalReviews, 1)) * 100)
        : 0;

    const kpiData = [
        {
            titleKey: 'averageRating',
            value: stats?.averageRating?.toFixed(1) || '0.0',
            change: '+0.3',
            icon: Star,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50'
        },
        {
            titleKey: 'totalReviews',
            value: stats?.totalReviews?.toLocaleString() || '0',
            change: `+${stats?.totalReviews || 0}`,
            icon: MessageSquare,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            titleKey: 'growthRate',
            value: `${responseRate}%`,
            changeKey: 'responseRate',
            icon: TrendingUp,
            color: 'text-green-500',
            bgColor: 'bg-green-50'
        },
        {
            titleKey: 'pendingReviews',
            value: stats?.pendingCount?.toString() || '0',
            change: t('needsAttention'),
            icon: Clock,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50'
        }
    ];

    if (isLoading && reviews.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchReviews(0, 50)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {t('retry') || 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

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
                        {starDistribution.length > 0 ? (
                            starDistribution.map((item) => (
                                <div key={item.stars} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-700">{item.stars}★</span>
                                        </div>
                                        <span className="text-gray-600">{item.count} {t('reviews') || 'reviews'}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all ${getBarColor(item.stars)}`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{item.percentage}%</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">{t('noData') || 'No data available'}</p>
                        )}
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t('recentReviews')}</h2>
                    <div className="space-y-4">
                        {recentReviews.length > 0 ? (
                            recentReviews.map((review) => (
                                <div key={review.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-900">{review.user.name}</span>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${getIndividualStarColor(i, review.rating)}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${review.status === 'replied'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {review.status === 'replied' ? t('replied') || 'Replied' : t('pending') || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">{t('noReviews') || 'No reviews yet'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('quickStats') || 'Quick Stats'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stats?.repliedCount || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">{t('replied') || 'Replied'}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{stats?.pendingCount || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">{t('pending') || 'Pending'}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats?.totalReviews || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">{t('totalReviews')}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
                        <p className="text-sm text-gray-600 mt-1">{t('averageRating')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}