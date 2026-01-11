'use client'

import { useEffect, useState } from 'react'
import { Flag, Trash2, CheckCircle, RefreshCw, MessageSquare, Star, AlertCircle, CheckSquare, Square } from 'lucide-react'
import { useModerationStore } from '@/store/useModerationStore'

type TabType = 'pending' | 'reports'

export default function ModerationPage() {
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

        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        return `${diffDays} ngày trước`;
    };

    // Render stars
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
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
        <div className="space-y-6">
            {/* Header with Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex gap-1">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'pending'
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Duyệt bình luận
                                {pendingReviews.length > 0 && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        {pendingReviews.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'reports'
                                    ? 'bg-red-50 text-red-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Flag className="w-4 h-4" />
                                Báo cáo vi phạm
                                {pendingReports.length > 0 && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                        {pendingReports.length}
                                    </span>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading || isPendingLoading}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${(isLoading || isPendingLoading) ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Tab Content */}
                <div className="p-6">
                    {/* Pending Reviews Tab */}
                    {activeTab === 'pending' && (
                        <div className="space-y-4">
                            {isPendingLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : pendingReviews.length === 0 ? (
                                <div className="bg-gray-50 rounded-xl p-12 text-center">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 text-lg font-medium">Không có bình luận nào chờ duyệt</p>
                                    <p className="text-gray-400 text-sm mt-1">Tất cả bình luận đã được xử lý</p>
                                </div>
                            ) : (
                                <>
                                    {/* Bulk Action Bar */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-all"
                                            >
                                                {selectedReviews.length === pendingReviews.length ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-gray-400" />
                                                )}
                                                <span className="text-sm font-medium text-gray-700">
                                                    {selectedReviews.length === pendingReviews.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                                </span>
                                            </button>
                                            {selectedReviews.length > 0 && (
                                                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                                                    {selectedReviews.length} đã chọn
                                                </span>
                                            )}
                                        </div>
                                        {selectedReviews.length > 0 && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleBulkApprove}
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all flex items-center gap-2 shadow-md"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Duyệt hàng loạt ({selectedReviews.length})
                                                </button>
                                                <button
                                                    onClick={handleBulkReject}
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all flex items-center gap-2 shadow-md"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Từ chối hàng loạt ({selectedReviews.length})
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Cards */}
                                    {pendingReviews.map((review) => (
                                        <div key={review.id} className="bg-white rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all p-5 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    {/* Checkbox */}
                                                    <button
                                                        onClick={() => toggleSelectReview(review.id)}
                                                        className="flex-shrink-0"
                                                    >
                                                        {selectedReviews.includes(review.id) ? (
                                                            <CheckSquare className="w-6 h-6 text-blue-600" />
                                                        ) : (
                                                            <Square className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors" />
                                                        )}
                                                    </button>
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                        {review.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">{review.userName}</span>
                                                            <span className="text-gray-400 text-sm">đánh giá</span>
                                                            <span className="font-semibold text-blue-600">{review.companyName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {renderStars(review.rating)}
                                                            <span className="text-xs text-gray-500">{formatTimeAgo(review.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                                    Chờ duyệt
                                                </span>
                                            </div>

                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg mb-4">
                                                <p className="font-semibold text-gray-900 mb-2">"{review.title}"</p>
                                                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {review.description}
                                                </p>
                                            </div>

                                            <div className="flex gap-3 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() => approveReview(review.id)}
                                                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Phê duyệt
                                                </button>
                                                <button
                                                    onClick={() => rejectReview(review.id)}
                                                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Từ chối
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                            ) : pendingReports.length === 0 ? (
                                <div className="bg-gray-50 rounded-xl p-12 text-center">
                                    <Flag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 text-lg font-medium">Không có báo cáo nào chờ xử lý</p>
                                    <p className="text-gray-400 text-sm mt-1">Tất cả báo cáo đã được giải quyết</p>
                                </div>
                            ) : (
                                sortedPendingReports.map((report) => (
                                    <div key={report.id} className="bg-white rounded-xl border-2 border-red-100 hover:border-red-200 transition-all p-5 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                                    <Flag className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {report.reviewerName || report.reviewerEmail || 'Người dùng ẩn danh'}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">đánh giá</span>
                                                        <span className="font-semibold text-blue-600">{report.companyName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {renderStars(report.reviewRating)}
                                                        <span className="text-xs text-gray-500">{formatTimeAgo(report.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                    <Flag className="w-3 h-3" />
                                                    {reports.filter(r => r.reviewId === report.reviewId).length} báo cáo
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg mb-3 border border-red-100">
                                            <p className="font-semibold text-gray-900 mb-2">"{report.reviewTitle}"</p>
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                                {report.reviewContent}
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                <span className="text-xs font-semibold text-yellow-800">Lý do báo cáo:</span>
                                            </div>
                                            <p className="text-sm text-yellow-900 ml-6">{report.reason}</p>
                                        </div>

                                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => dismissReport(report)}
                                                className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Giữ lại bình luận
                                            </button>
                                            <button
                                                onClick={() => deleteReview(report)}
                                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" /> Xóa bình luận
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
