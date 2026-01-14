'use client'
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Clock, TrendingUp, AlertCircle, CheckCircle, Filter, Loader2 } from 'lucide-react';
import { useReviewStore } from '@/store/useReviewStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { getIndividualStarColor, getStarFillColor, getBarColor, STAR_FILL_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';
import TranslateButton from '@/components/TranslateButton';

export default function BusinessReviewDashboard() {
    const t = useTranslations('reviews');
    const [currentPage, setCurrentPage] = useState('all-reviews');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
    const [translatedReviews, setTranslatedReviews] = useState<{ [key: number]: { description: string | null } }>({});

    const {
        reviews,
        stats,
        isLoading,
        error,
        currentPage: apiPage,
        totalPages,
        fetchCompanyReviews,
        replyToReview,
        setPage
    } = useReviewStore();

    const { company, fetchCompanyProfile } = useCompanyStore();

    // Fetch profile first, then reviews
    useEffect(() => {
        const loadData = async () => {
            await fetchCompanyProfile();
        };
        loadData();
    }, [fetchCompanyProfile]);

    // Fetch reviews when company is available
    useEffect(() => {
        if (company?.id) {
            console.log('Reviews page - fetching with company.id:', company.id, 'as number:', Number(company.id));
            fetchCompanyReviews(Number(company.id), 0, 10);
        }
    }, [company?.id, fetchCompanyReviews]);

    // Filter reviews based on selected filter
    const filteredReviews = reviews.filter(review => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'pending') return review.status === 'pending';
        if (selectedFilter === 'replied') return review.status === 'replied';
        if (selectedFilter === 'positive') return review.rating >= 4;
        if (selectedFilter === 'negative') return review.rating <= 2;
        return true;
    });

    // Calculate local stats from filtered reviews
    const localStats = {
        totalReviews: stats?.totalReviews || reviews.length,
        avgRating: stats?.averageRating || (reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '0'),
        pendingReviews: stats?.pendingCount || reviews.filter(r => r.status === 'pending').length,
        repliedReviews: stats?.repliedCount || reviews.filter(r => r.status === 'replied').length
    };

    const sentimentData = {
        positive: reviews.filter(r => r.rating >= 4).length,
        negative: reviews.filter(r => r.rating <= 2).length
    };

    const handleReply = async (reviewId: number) => {
        const reply = replyText[reviewId];
        if (!reply?.trim()) return;

        const success = await replyToReview(reviewId, reply);
        if (success) {
            setReplyText(prev => ({ ...prev, [reviewId]: '' }));
        }
    };

    const handlePageChange = (page: number) => {
        if (company?.id) {
            setPage(page);
            fetchCompanyReviews(Number(company.id), page, 10);
        }
    };

    // Render stars with dynamic colors based on rating
    const renderStars = (rating: number) => {
        const fillColor = getStarFillColor(rating);
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? fillColor : STAR_FILL_COLORS.empty}
            />
        ));
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const renderAllReviewsPage = () => (
        <div className="space-y-3 sm:space-y-4">
            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">{t('totalReviews')}</p>
                            <p className="text-2xl font-bold text-gray-900">{localStats.totalReviews}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">{t('averageRating')}</p>
                            <p className="text-2xl font-bold text-gray-900">{localStats.avgRating}</p>
                            <div className="flex mt-1">{renderStars(Math.round(parseFloat(String(localStats.avgRating))))}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">{t('pending')}</p>
                            <p className="text-2xl font-bold text-orange-600">{localStats.pendingReviews}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">{t('replied')}</p>
                            <p className="text-2xl font-bold text-green-600">{localStats.repliedReviews}</p>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <Filter size={16} className="text-gray-600" />
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-xs sm:text-sm ${selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('all')}
                    </button>
                    <button
                        onClick={() => setSelectedFilter('pending')}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-xs sm:text-sm ${selectedFilter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('pending')}
                    </button>
                    <button
                        onClick={() => setSelectedFilter('replied')}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-xs sm:text-sm ${selectedFilter === 'replied' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('replied')}
                    </button>
                    <button
                        onClick={() => setSelectedFilter('positive')}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-xs sm:text-sm ${selectedFilter === 'positive' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('positiveFilter')}
                    </button>
                    <button
                        onClick={() => setSelectedFilter('negative')}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition text-xs sm:text-sm ${selectedFilter === 'negative' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('negativeFilter')}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">{t('loadingReviews')}</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h3 className="font-semibold text-red-900 mb-1">{t('errorLoading')}</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredReviews.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noReviewsFound')}</h3>
                    <p className="text-gray-600">
                        {selectedFilter === 'all'
                            ? t('noReviewsYet')
                            : t('noMatchFilter')}
                    </p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-2 sm:space-y-3">
                {filteredReviews.map(review => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <div className="flex items-start gap-2 sm:gap-3">
                                {/* Avatar */}
                                {review.user.avatarUrl ? (
                                    <img
                                        src={review.user.avatarUrl}
                                        alt={review.user.name}
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                                            {review.user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">{review.user.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="flex">{renderStars(review.rating)}</div>
                                        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {review.status === 'pending' ? (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center gap-0.5">
                                        <Clock size={12} />
                                        {t('pending')}
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-0.5">
                                        <CheckCircle size={12} />
                                        {t('replied')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-2">{translatedReviews[review.id]?.description || review.comment}</p>

                        <div className="flex items-center gap-3 mb-3">
                            <TranslateButton
                                texts={{
                                    description: review.comment
                                }}
                                onTranslatedTextsChange={(translated) => {
                                    if (translated) {
                                        setTranslatedReviews(prev => ({
                                            ...prev,
                                            [review.id]: {
                                                description: translated.description || null
                                            }
                                        }));
                                    } else {
                                        setTranslatedReviews(prev => {
                                            const newState = { ...prev };
                                            delete newState[review.id];
                                            return newState;
                                        });
                                    }
                                }}
                            />
                        </div>

                        {review.reply ? (
                            <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 mt-2 border-l-3 border-blue-500">
                                <div className="flex items-start gap-2">
                                    <MessageSquare size={14} className="text-blue-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-900 mb-0.5">{t('yourReply')}</p>
                                        <p className="text-xs text-gray-700">{review.reply}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 mt-2">
                                <label className="block text-xs font-semibold text-gray-900 mb-1.5">{t('replyToReview')}</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder={t('writeReply')}
                                    value={replyText[review.id] || ''}
                                    onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                                />
                                <button
                                    onClick={() => handleReply(review.id)}
                                    disabled={isLoading || !replyText[review.id]?.trim()}
                                    className="mt-2 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? t('sending') : t('sendReply')}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    <button
                        onClick={() => handlePageChange(apiPage - 1)}
                        disabled={apiPage === 0}
                        className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        {t('previous')}
                    </button>
                    <span className="px-2.5 py-1 text-xs text-gray-600">
                        {apiPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(apiPage + 1)}
                        disabled={apiPage >= totalPages - 1}
                        className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        {t('next')}
                    </button>
                </div>
            )}
        </div>
    );

    const renderPendingPage = () => (
        <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-orange-600 mt-1 shrink-0" size={20} />
                <div>
                    <h3 className="font-semibold text-orange-900 mb-1">{t('pendingReply', { count: localStats.pendingReviews })}</h3>
                    <p className="text-sm text-orange-700">{t('replyQuickly')}</p>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">{t('loadingReviews')}</span>
                </div>
            )}

            <div className="space-y-4">
                {reviews.filter(r => r.status === 'pending').map(review => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                {review.user.avatarUrl ? (
                                    <img
                                        src={review.user.avatarUrl}
                                        alt={review.user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <span className="text-orange-600 font-semibold">
                                            {review.user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">{renderStars(review.rating)}</div>
                                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">{review.comment}</p>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">{t('yourReply')}</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder={t('enterReply')}
                                value={replyText[review.id] || ''}
                                onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleReply(review.id)}
                                    disabled={isLoading || !replyText[review.id]?.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                                >
                                    {isLoading ? t('sending') : t('sendReply')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && reviews.filter(r => r.status === 'pending').length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('allCaughtUp')}</h3>
                        <p className="text-gray-600">{t('repliedAll')}</p>
                    </div>
                )}
            </div>
        </div>
    );

    // const renderAnalyticsPage = () => (
    //     <div className="space-y-6">
    //         <div className="bg-white rounded-lg shadow p-6">
    //             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
    //                 <TrendingUp className="text-blue-500" />
    //                 {t('sentimentAnalysis')}
    //             </h2>
    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //                 <div>
    //                     <div className="flex items-center justify-between mb-2">
    //                         <span className="text-gray-700">{t('positiveReviews')}</span>
    //                         <span className="font-bold text-green-600">
    //                             {sentimentData.positive} ({reviews.length > 0 ? ((sentimentData.positive / reviews.length) * 100).toFixed(0) : 0}%)
    //                         </span>
    //                     </div>
    //                     <div className="w-full bg-gray-200 rounded-full h-4">
    //                         <div
    //                             className="bg-green-500 h-4 rounded-full transition-all"
    //                             style={{ width: `${reviews.length > 0 ? (sentimentData.positive / reviews.length) * 100 : 0}%` }}
    //                         />
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <div className="flex items-center justify-between mb-2">
    //                         <span className="text-gray-700">{t('negativeReviews')}</span>
    //                         <span className="font-bold text-red-600">
    //                             {sentimentData.negative} ({reviews.length > 0 ? ((sentimentData.negative / reviews.length) * 100).toFixed(0) : 0}%)
    //                         </span>
    //                     </div>
    //                     <div className="w-full bg-gray-200 rounded-full h-4">
    //                         <div
    //                             className="bg-red-500 h-4 rounded-full transition-all"
    //                             style={{ width: `${reviews.length > 0 ? (sentimentData.negative / reviews.length) * 100 : 0}%` }}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         <div className="bg-white rounded-lg shadow p-6">
    //             <h2 className="text-xl font-bold text-gray-900 mb-6">{t('ratingDistribution')}</h2>
    //             <div className="space-y-4">
    //                 {[5, 4, 3, 2, 1].map((rating) => {
    //                     const count = stats?.ratingDistribution?.[rating] || reviews.filter(r => r.rating === rating).length;
    //                     const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    //                     const barColor = getBarColor(rating);
    //                     const starColor = getStarFillColor(rating);
    //                     return (
    //                         <div key={rating} className="flex items-center gap-4">
    //                             <div className="flex items-center gap-1 w-20">
    //                                 <span className="font-medium">{rating}</span>
    //                                 <Star size={16} className={starColor} />
    //                             </div>
    //                             <div className="flex-1">
    //                                 <div className="w-full bg-gray-200 rounded-full h-3">
    //                                     <div
    //                                         className={`${barColor} h-3 rounded-full transition-all`}
    //                                         style={{ width: `${percentage}%` }}
    //                                     />
    //                                 </div>
    //                             </div>
    //                             <span className="text-sm text-gray-600 w-20 text-right">{count} {t('reviews')}</span>
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="min-h-screen bg-gray-100 rounded-md" >
            <div className="bg-gradient-to-r from-[#0f1c2d] to-[#1a3a5c] text-white p-3 sm:p-4 rounded-md">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-lg sm:text-xl font-bold mb-1">{t('title')}</h1>
                    <p className="text-blue-100 text-xs sm:text-sm">{t('subtitle')}</p>
                </div>
            </div>

            {/* <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex gap-1 p-2">
                        <button
                            onClick={() => setCurrentPage('all-reviews')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${currentPage === 'all-reviews'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Star size={18} />
                            {t('allReviews')}
                        </button>
                         <button
                            onClick={() => setCurrentPage('pending')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${currentPage === 'pending'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Clock size={18} />
                            {t('pending')}
                            {localStats.pendingReviews > 0 && (
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                    {localStats.pendingReviews}
                                </span>
                            )}
                        </button> 
                         <button
                            onClick={() => setCurrentPage('analytics')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${currentPage === 'analytics'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <TrendingUp size={18} />
                            {t('analytics')}
                        </button> 
                    </nav>
                </div>
            </div> */}

            <div className="max-w-7xl mx-auto p-3 sm:p-4">
                {renderAllReviewsPage()}
            </div>
        </div>
    );
}