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
        bulkRejectReviews,
        bulkDismissReports
    } = useModerationStore();

    const [activeTab, setActiveTab] = useState<TabType>('pending')
    const [selectedReviews, setSelectedReviews] = useState<number[]>([])
    const [selectedReports, setSelectedReports] = useState<number[]>([])


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

    const toggleSelectReport = (reportId: number) => {
        setSelectedReports(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const toggleSelectAllReports = () => {
        if (selectedReports.length === pendingReports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(pendingReports.map(r => r.id));
        }
    };

    const handleBulkKeep = async () => {
        if (selectedReports.length === 0) return;
        const reportsToDismiss = pendingReports.filter(r => selectedReports.includes(r.id));
        await bulkDismissReports(reportsToDismiss);
        setSelectedReports([]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/20">
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
                        <div className="flex bg-gray-100/60 p-1 rounded-xl gap-1 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'pending'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                                    }`}
                            >
                                <MessageSquare className={`w-4 h-4 ${activeTab === 'pending' ? 'text-blue-500' : 'text-gray-400'}`} />
                                <span className="text-sm">{t('pendingTab')}</span>
                                {pendingReviews.length > 0 && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">
                                        {pendingReviews.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'reports'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                                    }`}
                            >
                                <Flag className={`w-4 h-4 ${activeTab === 'reports' ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className="text-sm">{t('reportsTab')}</span>
                                {pendingReports.length > 0 && (
                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-md">
                                        {pendingReports.length}
                                    </span>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading || isPendingLoading}
                            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                        >
                            <RefreshCw className={`w-4 h-4 text-blue-500 ${(isLoading || isPendingLoading) ? 'animate-spin' : ''}`} />
                            <span className="text-sm">{t('refresh')}</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 bg-rose-50/50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{error}</span>
                    </div>
                )}

                {/* Tab Content */}
                <div className="p-6">
                    {/* Pending Reviews Tab */}
                    {activeTab === 'pending' && (
                        <div className="space-y-5">
                            {isPendingLoading ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-50 border-t-blue-500 animate-spin"></div>
                                    <p className="text-gray-400 text-xs font-medium">{tCommon('loading')}</p>
                                </div>
                            ) : pendingReviews.length === 0 ? (
                                <div className="bg-gray-50/50 rounded-2xl p-12 text-center border border-dashed border-gray-100">
                                    <CheckCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 text-base font-semibold">{t('noPendingReviews')}</p>
                                    <p className="text-gray-400 text-xs mt-1">{t('allProcessed')}</p>
                                </div>
                            ) : (
                                <>
                                    {/* Bulk Action Bar - More Compact */}
                                    <div className="bg-blue-600 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg shadow-blue-100 sticky top-2 z-20">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                                            >
                                                {selectedReviews.length === pendingReviews.length ? (
                                                    <CheckSquare className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-white/40" />
                                                )}
                                                <span className="text-sm font-semibold text-white">
                                                    {selectedReviews.length === pendingReviews.length ? t('deselectAll') : t('selectAll')}
                                                </span>
                                            </button>
                                            {selectedReviews.length > 0 && (
                                                <span className="px-3 py-1 bg-white text-blue-600 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                                    {t('selectedCount', { count: selectedReviews.length })}
                                                </span>
                                            )}
                                        </div>
                                        {selectedReviews.length > 0 && (
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={handleBulkApprove}
                                                    className="flex-1 md:flex-none px-5 py-2 text-sm font-bold text-blue-600 bg-white hover:bg-blue-50 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    {t('bulkApprove', { count: selectedReviews.length })}
                                                </button>
                                                <button
                                                    onClick={handleBulkReject}
                                                    className="flex-1 md:flex-none px-5 py-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {t('bulkReject', { count: selectedReviews.length })}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Cards Grid - More Compact */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                        {pendingReviews.map((review) => (
                                            <div key={review.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 p-5 flex flex-col relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-4 relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleSelectReview(review.id)}
                                                            className="flex-shrink-0 active:scale-90 transition-transform"
                                                        >
                                                            {selectedReviews.includes(review.id) ? (
                                                                <CheckSquare className="w-6 h-6 text-blue-500" />
                                                            ) : (
                                                                <Square className="w-6 h-6 text-gray-200 group-hover:text-blue-100 transition-colors" />
                                                            )}
                                                        </button>
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-base font-bold overflow-hidden border border-blue-100/50">
                                                            {review.userAvatar ? (
                                                                <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                review.userName.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                                                <span className="font-semibold text-gray-900 text-sm">{review.userName}</span>
                                                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">{t('review')} {t('on')}</span>
                                                                <span className="font-semibold text-blue-500 text-sm truncate">{review.companyName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {renderStars(review.rating)}
                                                                <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{formatTimeAgo(review.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-wider rounded-lg border border-amber-100/50">
                                                        {t('pendingStatus')}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50/50 rounded-xl p-4 mb-4 flex-grow border border-gray-100/50 relative z-10">
                                                    <p className="font-semibold text-gray-900 mb-1.5 text-sm leading-tight">"{review.title}"</p>
                                                    <p className="text-gray-600 text-xs whitespace-pre-wrap leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                        {review.description}
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 relative z-10">
                                                    <button
                                                        onClick={() => approveReview(review.id)}
                                                        className="flex-1 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-100"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> {t('approve')}
                                                    </button>
                                                    <button
                                                        onClick={() => rejectReview(review.id)}
                                                        className="flex-1 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-100"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> {t('reject')}
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
                        <div className="space-y-5">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-red-50 border-t-red-500 animate-spin"></div>
                                    <p className="text-gray-400 text-xs font-medium">{tCommon('loading')}</p>
                                </div>
                            ) : pendingReports.length === 0 ? (
                                <div className="bg-gray-50/50 rounded-2xl p-12 text-center border border-dashed border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                        <Flag className="w-6 h-6 text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 text-base font-semibold">{t('noReports')}</p>
                                    <p className="text-gray-400 text-xs mt-1">{t('allResolved')}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Bulk Action Bar for Reports */}
                                    <div className="bg-emerald-600 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg shadow-emerald-100 sticky top-2 z-20">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={toggleSelectAllReports}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                                            >
                                                {selectedReports.length === pendingReports.length && pendingReports.length > 0 ? (
                                                    <CheckSquare className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-white/40" />
                                                )}
                                                <span className="text-sm font-semibold text-white">
                                                    {selectedReports.length === pendingReports.length && pendingReports.length > 0 ? t('deselectAll') : t('selectAll')}
                                                </span>
                                            </button>
                                            {selectedReports.length > 0 && (
                                                <span className="px-3 py-1 bg-white text-emerald-600 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                                    {t('selectedCount', { count: selectedReports.length })}
                                                </span>
                                            )}
                                        </div>
                                        {selectedReports.length > 0 && (
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={handleBulkKeep}
                                                    className="flex-1 md:flex-none px-5 py-2 text-sm font-bold text-emerald-600 bg-white hover:bg-emerald-50 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    {t('bulkKeep', { count: selectedReports.length })}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {sortedPendingReports.map((report) => (
                                            <div key={report.id} className="group bg-white rounded-2xl border border-red-50 hover:border-red-100 hover:shadow-md transition-all duration-300 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                                                {/* Selection Checkbox */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <button
                                                        onClick={() => toggleSelectReport(report.id)}
                                                        className="flex-shrink-0 active:scale-90 transition-transform"
                                                    >
                                                        {selectedReports.includes(report.id) ? (
                                                            <CheckSquare className="w-6 h-6 text-emerald-500" />
                                                        ) : (
                                                            <Square className="w-6 h-6 text-gray-200 group-hover:text-emerald-100 transition-colors" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Card Content with Padding for Checkbox */}
                                                <div className="pl-6 w-full flex flex-col md:flex-row gap-6">
                                                    {/* Report Badge */}
                                                    <div className="absolute top-0 right-0 px-4 py-2 bg-red-50 text-red-600 rounded-bl-2xl border-l border-b border-red-100 flex items-center gap-1.5">
                                                        <Flag className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                                            {t('reportsCount', { count: reports.filter(r => r.reviewId === report.reviewId).length })}
                                                        </span>
                                                    </div>

                                                    {/* Left side: Review Info */}
                                                    <div className="flex-grow min-w-0 flex flex-col">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center border border-red-100/50 overflow-hidden text-red-600 font-bold">
                                                                {report.reviewerAvatar ? (
                                                                    <img src={report.reviewerAvatar} alt={report.reviewerName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    report.reviewerName.charAt(0).toUpperCase()
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                                                    <span className="font-semibold text-gray-900 text-base">
                                                                        {report.reviewerName || t('anonymousUser')}
                                                                    </span>
                                                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('on')}</span>
                                                                    <span className="font-semibold text-blue-500 text-base leading-none">{report.companyName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {renderStars(report.reviewRating)}
                                                                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{formatTimeAgo(report.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50/50 rounded-2xl p-4 mb-4 border border-gray-100/50">
                                                            <p className="font-semibold text-gray-900 mb-1.5 text-sm">"{report.reviewTitle}"</p>
                                                            <p className="text-gray-600 text-xs whitespace-pre-wrap leading-relaxed">
                                                                {report.reviewContent}
                                                            </p>
                                                        </div>

                                                        {/* Reason section */}
                                                        <div className="bg-red-50/30 border border-red-100/50 rounded-xl p-3.5 relative">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                                <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider">{t('reasonLabel')}</span>
                                                            </div>
                                                            <p className="text-xs font-medium text-red-900/70 leading-relaxed pl-6 italic">
                                                                "{report.reason}"
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Sidebar style */}
                                                    <div className="flex flex-row md:flex-col gap-3 min-w-[160px] justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                                                        <button
                                                            onClick={() => dismissReport(report)}
                                                            className="flex-1 py-3 px-4 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                            {t('keepReview')}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteReview(report)}
                                                            className="flex-1 py-3 px-4 text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-red-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            {t('deleteReview')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

