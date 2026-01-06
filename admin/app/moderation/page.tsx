'use client'

import { useEffect } from 'react'
import { Flag, Trash2, CheckCircle, RefreshCw } from 'lucide-react'
import { useModerationStore } from '@/store/useModerationStore'

export default function ModerationPage() {
    const { reports, isLoading, error, fetchReports, dismissReport, deleteReview } = useModerationStore();

    useEffect(() => {
        fetchReports();
    }, []);

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

    // Filter reports by status
    const pendingReports = reports.filter(r => r.status === 'PENDING');
    const resolvedReports = reports.filter(r => r.status === 'RESOLVED' || r.status === 'DISMISSED');

    // Sort pending reports by number of reports (descending)
    const sortedPendingReports = [...pendingReports].sort((a, b) => {
        const countA = reports.filter(r => r.reviewId === a.reviewId).length;
        const countB = reports.filter(r => r.reviewId === b.reviewId).length;
        return countB - countA; // More reports first
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <div className="flex gap-3">
                    <button
                        onClick={fetchReports}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Làm mới
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    {error}
                    <button onClick={fetchReports} className="ml-2 underline">Thử lại</button>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    {/* Pending Reports */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Flag className="w-5 h-5 text-red-500" />
                            Chờ xử lý
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                {pendingReports.length}
                            </span>
                        </h2>

                        {pendingReports.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                                <Flag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Không có báo cáo nào đang chờ xử lý</p>
                            </div>
                        ) : (
                            sortedPendingReports.map((report) => (
                                <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {report.reviewerName || report.reviewerEmail || 'Người dùng ẩn danh'}
                                            </span>
                                            <span className="text-gray-400 text-sm">đánh giá</span>
                                            <span className="font-medium text-blue-600">{report.companyName}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{formatTimeAgo(report.createdAt)}</span>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700 italic">
                                        <p className="font-medium mb-1">"{report.reviewTitle}"</p>
                                        <div className="text-gray-800 whitespace-pre-wrap">"{report.reviewContent}"</div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-medium border border-red-100">
                                            Lý do: {report.reason}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium border border-gray-200">
                                            {reports.filter(r => r.reviewId === report.reviewId).length} lượt báo cáo
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => dismissReport(report)}
                                            className="flex-1 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Giữ lại
                                        </button>
                                        <button
                                            onClick={() => deleteReview(report)}
                                            className="flex-1 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> Xóa đánh giá
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Resolved Reports - Hidden temporarily as requested
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Đã xử lý
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                {resolvedReports.length}
                            </span>
                        </h2>

                        {resolvedReports.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Chưa có báo cáo nào được xử lý</p>
                            </div>
                        ) : (
                            resolvedReports.slice(0, 5).map((report) => (
                                <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 opacity-75">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {report.reviewerName || 'User'}
                                            </span>
                                            <span className="text-gray-400 text-sm">đánh giá</span>
                                            <span className="font-medium text-blue-600">{report.companyName}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${report.status === 'RESOLVED'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {report.status === 'RESOLVED' ? 'Đã xóa' : 'Đã giữ lại'}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic">
                                        "{report.reviewTitle}"
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    */}
                </div>
            )}
        </div>
    )
}
