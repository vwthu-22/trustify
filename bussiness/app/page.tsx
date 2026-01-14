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
        fetchReviews(0, 50);
    }, [fetchReviews]);

    const starDistribution = stats?.ratingDistribution
        ? [5, 4, 3, 2, 1].map(stars => {
            const count = stats.ratingDistribution[stars] || 0;
            const percentage = stats.totalReviews > 0
                ? Math.round((count / stats.totalReviews) * 100)
                : 0;
            return { stars, count, percentage };
        })
        : [];

    const recentReviews = reviews.slice(0, 5);

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
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-3 text-sm">{error}</p>
                    <button
                        onClick={() => fetchReviews(0, 50)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                        {t('retry') || 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpiData.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-500 truncate">{t(kpi.titleKey)}</p>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">{kpi.value}</p>
                                    <p className="text-xs text-green-600 mt-0.5 truncate">{kpi.changeKey ? t(kpi.changeKey) : kpi.change}</p>
                                </div>
                                <div className={`p-2 rounded-full ${kpi.bgColor} flex-shrink-0`}>
                                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Star Distribution */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2.5">{t('starDistribution')}</h2>
                    <div className="space-y-2">
                        {starDistribution.length > 0 ? (
                            starDistribution.map((item) => (
                                <div key={item.stars} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-700">{item.stars}★</span>
                                        <span className="text-gray-500">{item.count} {t('reviews') || 'reviews'}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full transition-all ${getBarColor(item.stars)}`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-6 text-sm">{t('noData') || 'No data available'}</p>
                        )}
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2.5">{t('recentReviews')}</h2>
                    <div className="space-y-2">
                        {recentReviews.length > 0 ? (
                            recentReviews.map((review) => (
                                <div key={review.id} className="p-2.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="font-medium text-gray-900 text-xs truncate">{review.user.name}</span>
                                                <div className="flex flex-shrink-0">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${getIndividualStarColor(i, review.rating)}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-1">{review.comment}</p>
                                        </div>
                                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full flex-shrink-0 ${review.status === 'replied'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {review.status === 'replied' ? t('replied') || 'Replied' : t('pending') || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-6 text-sm">{t('noReviews') || 'No reviews yet'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <h2 className="text-sm font-semibold text-gray-900 mb-2.5">{t('quickStats') || 'Quick Stats'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="text-center p-2.5 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{stats?.repliedCount || 0}</p>
                        <p className="text-xs text-gray-600">{t('replied') || 'Replied'}</p>
                    </div>
                    <div className="text-center p-2.5 bg-yellow-50 rounded-lg">
                        <p className="text-lg font-bold text-yellow-600">{stats?.pendingCount || 0}</p>
                        <p className="text-xs text-gray-600">{t('pending') || 'Pending'}</p>
                    </div>
                    <div className="text-center p-2.5 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{stats?.totalReviews || 0}</p>
                        <p className="text-xs text-gray-600">{t('totalReviews')}</p>
                    </div>
                    <div className="text-center p-2.5 bg-purple-50 rounded-lg">
                        <p className="text-lg font-bold text-purple-600">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
                        <p className="text-xs text-gray-600">{t('averageRating')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}