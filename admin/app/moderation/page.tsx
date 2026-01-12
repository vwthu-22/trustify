'use client'

import { useEffect, useState } from 'react'
import { Flag, Trash2, CheckCircle, RefreshCw, MessageSquare, Star, AlertCircle, CheckSquare, Square } from 'lucide-react'
import { useModerationStore } from '@/store/useModerationStore'
import { useTranslations } from 'next-intl'
import { getIndividualStarColor } from '@/utils/ratingColors'

type TabType = 'pending' | 'reports'

export default function ModerationPage() {
    const t = useTranslations('moderation');
    const tCommon = useTranslations('common');

    const {
        reports,
        pendingReviews,
        isLoading,
        isPendingLoading,
        error,
        fetchReports,
        dismissReport,
        deleteReview,
        fetchPendingReviews,
        approveReview,
        rejectReview,
        bulkApproveReviews,
        bulkRejectReviews
    } = useModerationStore();

    const [activeTab, setActiveTab] = useState<TabType>('pending')
    const [selectedReviews, setSelectedReviews] = useState<number[]>([])


    useEffect(() => {
        setSelectedReviews([]); // Reset selection when switching tabs
        if (activeTab === 'pending') {
            fetchPendingReviews();
        } else {
            fetchReports();
        }
    }, [activeTab]);

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('justNow');
        if (diffMins < 60) return t('minsAgo', { count: diffMins });
        if (diffHours < 24) return t('hoursAgo', { count: diffHours });
        return t('daysAgo', { count: diffDays });
    };

    // Render stars
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((starIndex) => (
                    <Star
                        key={starIndex}
                        className={`w-4 h-4 ${getIndividualStarColor(starIndex, rating)}`}
                    />
                ))}
            </div>
        );
    };

    // Filter reports by status
    const pendingReports = reports.filter(r => r.status === 'PENDING');

    // Sort pending reports by number of reports (descending)
    const sortedPendingReports = [...pendingReports].sort((a, b) => {
        const countA = reports.filter(r => r.reviewId === a.reviewId).length;
        const countB = reports.filter(r => r.reviewId === b.reviewId).length;
        return countB - countA; // More reports first
    });

    const handleRefresh = () => {
        if (activeTab === 'pending') {
            fetchPendingReviews();
        } else {
            fetchReports();
        }
    };

    // Bulk selection handlers
    const toggleSelectReview = (reviewId: number) => {
        setSelectedReviews(prev =>
            prev.includes(reviewId)
                ? prev.filter(id => id !== reviewId)
                : [...prev, reviewId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedReviews.length === pendingReviews.length) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(pendingReviews.map(r => r.id));
        }
    };

    const handleBulkApprove = async () => {
        if (selectedReviews.length === 0) return;
        await bulkApproveReviews(selectedReviews);
        setSelectedReviews([]);
    };

    const handleBulkReject = async () => {
        if (selectedReviews.length === 0) return;
        await bulkRejectReviews(selectedReviews);
        setSelectedReviews([]);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header with Tabs */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/30">
                    <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 gap-4">
                        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl gap-1 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2.5 ${activeTab === 'pending'
                                    ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                    }`}
                            >
                                <MessageSquare className={`w-4.5 h-4.5 ${activeTab === 'pending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                <span className="text-sm">{t('pendingTab')}</span>
                                {pendingReviews.length > 0 && (
                                    <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-black rounded-lg shadow-sm">
                                        {pendingReviews.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2.5 ${activeTab === 'reports'
                                    ? 'bg-white text-red-600 shadow-md transform scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                    }`}
                            >
                                <Flag className={`w-4.5 h-4.5 ${activeTab === 'reports' ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className="text-sm">{t('reportsTab')}</span>
                                {pendingReports.length > 0 && (
                                    <span className="px-2.5 py-0.5 bg-red-600 text-white text-[11px] font-black rounded-lg shadow-sm">
                                        {pendingReports.length}
                                    </span>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading || isPendingLoading}
                            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 shadow-sm active:scale-95"
                        >
                            <RefreshCw className={`w-4.5 h-4.5 text-blue-600 ${(isLoading || isPendingLoading) ? 'animate-spin' : ''}`} />
                            <span className="text-sm">{t('refresh')}</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-8 mt-6 bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Tab Content */}
                <div className="p-8">
                    {/* Pending Reviews Tab */}
                    {activeTab === 'pending' && (
                        <div className="space-y-6">
                            {isPendingLoading ? (
                                <div className="flex flex-col items-center justify-center h-80 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-blue-400" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 font-medium animate-pulse">{tCommon('loading')}</p>
                                </div>
                            ) : pendingReviews.length === 0 ? (
                                <div className="bg-gray-50/50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-100">
                                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <p className="text-gray-500 text-xl font-black mb-2">{t('noPendingReviews')}</p>
                                    <p className="text-gray-400 text-sm">{t('allProcessed')}</p>
                                </div>
                            ) : (
                                <>
                                    {/* Bulk Action Bar - Sticky/Floating Style */}
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-blue-200/50 sticky top-4 z-20">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="flex items-center gap-3 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all group backdrop-blur-md"
                                            >
                                                {selectedReviews.length === pendingReviews.length ? (
                                                    <CheckSquare className="w-5.5 h-5.5 text-white" />
                                                ) : (
                                                    <Square className="w-5.5 h-5.5 text-white/40 group-hover:text-white/60" />
                                                )}
                                                <span className="text-sm font-bold text-white">
                                                    {selectedReviews.length === pendingReviews.length ? t('deselectAll') : t('selectAll')}
                                                </span>
                                            </button>
                                            <div className="h-8 w-px bg-white/10 hidden md:block" />
                                            {selectedReviews.length > 0 && (
                                                <span className="px-5 py-1.5 bg-white text-blue-700 text-xs font-black rounded-xl shadow-inner">
                                                    {t('selectedCount', { count: selectedReviews.length })}
                                                </span>
                                            )}
                                        </div>
                                        {selectedReviews.length > 0 && (
                                            <div className="flex gap-3 w-full md:w-auto">
                                                <button
                                                    onClick={handleBulkApprove}
                                                    className="flex-1 md:flex-none px-6 py-2.5 text-sm font-black text-blue-700 bg-white hover:bg-blue-50 active:scale-95 rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-lg"
                                                >
                                                    <CheckCircle className="w-4.5 h-4.5" />
                                                    {t('bulkApprove', { count: selectedReviews.length })}
                                                </button>
                                                <button
                                                    onClick={handleBulkReject}
                                                    className="flex-1 md:flex-none px-6 py-2.5 text-sm font-black text-white bg-white/10 hover:bg-white/20 active:scale-95 border border-white/30 rounded-2xl transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                    {t('bulkReject', { count: selectedReviews.length })}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Cards Grid */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {pendingReviews.map((review) => (
                                            <div key={review.id} className="group bg-white rounded-[2rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 p-6 flex flex-col relative overflow-hidden">
                                                {/* Watermark/Bg Decoration */}
                                                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 rotate-12">
                                                    <MessageSquare className="w-32 h-32 text-blue-900" />
                                                </div>

                                                <div className="flex justify-between items-start mb-6 relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => toggleSelectReview(review.id)}
                                                            className="flex-shrink-0 active:scale-90 transition-transform"
                                                        >
                                                            {selectedReviews.includes(review.id) ? (
                                                                <CheckSquare className="w-7 h-7 text-blue-600" />
                                                            ) : (
                                                                <Square className="w-7 h-7 text-gray-200 group-hover:text-blue-200 hover:text-blue-300 transition-colors" />
                                                            )}
                                                        </button>
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-200">
                                                            {review.userName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                                <span className="font-bold text-gray-900">{review.userName}</span>
                                                                <span className="text-gray-400 text-xs tracking-wide uppercase font-medium">{t('review')} {t('on')}</span>
                                                                <span className="font-bold text-blue-600 truncate">{review.companyName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                {renderStars(review.rating)}
                                                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{formatTimeAgo(review.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100">
                                                        {t('pendingStatus')}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50/80 rounded-2xl p-5 mb-6 flex-grow border border-gray-100/50 relative z-10">
                                                    <p className="font-bold text-gray-900 mb-2.5 text-base leading-tight">"{review.title}"</p>
                                                    <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                                                        {review.description}
                                                    </p>
                                                </div>

                                                <div className="flex gap-4 relative z-10">
                                                    <button
                                                        onClick={() => approveReview(review.id)}
                                                        className="flex-1 py-3 text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-200/50"
                                                    >
                                                        <CheckCircle className="w-4.5 h-4.5" /> {t('approve')}
                                                    </button>
                                                    <button
                                                        onClick={() => rejectReview(review.id)}
                                                        className="flex-1 py-3 text-sm font-black text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 active:scale-95 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-rose-200/50"
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" /> {t('reject')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-80 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-red-600 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Flag className="w-6 h-6 text-red-400" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 font-medium animate-pulse">{tCommon('loading')}</p>
                                </div>
                            ) : pendingReports.length === 0 ? (
                                <div className="bg-gray-50/50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-100">
                                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
                                        <Flag className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <p className="text-gray-500 text-xl font-black mb-2">{t('noReports')}</p>
                                    <p className="text-gray-400 text-sm">{t('allResolved')}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {sortedPendingReports.map((report) => (
                                        <div key={report.id} className="group bg-white rounded-[2.5rem] border border-red-100 hover:border-red-200 hover:shadow-2xl hover:shadow-red-100/20 transition-all duration-500 p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
                                            {/* Report Badge */}
                                            <div className="absolute -top-3 -right-3 px-6 py-4 bg-red-600 text-white rounded-bl-3xl shadow-xl z-10 flex items-center gap-2">
                                                <Flag className="w-4 h-4" />
                                                <span className="text-xs font-black tracking-widest uppercase">
                                                    {t('reportsCount', { count: reports.filter(r => r.reviewId === report.reviewId).length })}
                                                </span>
                                            </div>

                                            {/* Left side: Review Info */}
                                            <div className="flex-grow min-w-0 flex flex-col">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-inner border border-red-200/50">
                                                        <MessageSquare className="w-7 h-7 text-red-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                            <span className="font-black text-gray-900 text-lg">
                                                                {report.reviewerName || t('anonymousUser')}
                                                            </span>
                                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{t('on')}</span>
                                                            <span className="font-black text-blue-600 text-lg">{report.companyName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            {renderStars(report.reviewRating)}
                                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <span className="text-xs font-bold text-gray-400 uppercase">{formatTimeAgo(report.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-3xl p-6 mb-6 border border-gray-100">
                                                    <p className="font-black text-gray-900 mb-3 text-lg leading-tight">"{report.reviewTitle}"</p>
                                                    <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                                                        {report.reviewContent}
                                                    </p>
                                                </div>

                                                {/* Reason section */}
                                                <div className="bg-red-50/50 border border-red-100 rounded-3xl p-5 mb-2 relative">
                                                    <div className="flex items-center gap-2.5 mb-2">
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                        <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">{t('reasonLabel')}</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-red-900/80 leading-relaxed pl-7 italic">
                                                        "{report.reason}"
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right side/Bottom: Actions */}
                                            <div className="flex flex-row md:flex-col gap-4 min-w-[200px] justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8">
                                                <button
                                                    onClick={() => dismissReport(report)}
                                                    className="flex-1 py-4 px-6 text-sm font-black text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 active:scale-95 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm group"
                                                >
                                                    <CheckCircle className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                                                    {t('keepReview')}
                                                </button>
                                                <button
                                                    onClick={() => deleteReview(report)}
                                                    className="flex-1 py-4 px-6 text-sm font-black text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 active:scale-95 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-200/50"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                    {t('deleteReview')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

