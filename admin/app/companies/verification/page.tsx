'use client'

import { useState, useEffect } from 'react'
import { FileText, Check, X, ExternalLink, Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import useCompanyManagementStore, { VerificationRequest } from '@/store/useCompanyManagementStore'

export default function VerificationPage() {
    const {
        pendingVerifications,
        isLoadingVerifications,
        processingVerificationId,
        error,
        fetchPendingVerifications,
        approveCompany,
        rejectCompany,
        clearError
    } = useCompanyManagementStore()

    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectingId, setRejectingId] = useState<number | null>(null)
    const [rejectReason, setRejectReason] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        fetchPendingVerifications()
    }, [fetchPendingVerifications])

    // Open reject modal
    const openRejectModal = (companyId: number) => {
        setRejectingId(companyId)
        setRejectReason('')
        setShowRejectModal(true)
    }

    // Handle approve
    const handleApprove = async (companyId: number) => {
        const success = await approveCompany(companyId)
        if (success) {
            alert('Company approved successfully!')
        }
    }

    // Handle reject
    const handleReject = async () => {
        if (!rejectingId) return

        const success = await rejectCompany(rejectingId, rejectReason)
        if (success) {
            setShowRejectModal(false)
            setRejectingId(null)
            alert('Company rejected successfully!')
        }
    }

    // Format timestamp
    const formatTime = (timestamp: string) => {
        if (!timestamp) return 'Unknown'
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        return `${diffDays} days ago`
    }

    // Get company ID from request
    const getCompanyId = (request: VerificationRequest) => {
        return request.company?.id || request.id
    }

    // Get company name from request
    const getCompanyName = (request: VerificationRequest) => {
        return request.company?.name || `Company #${request.id}`
    }

    if (isLoadingVerifications) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 mt-1">Review and approve business verification documents</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchPendingVerifications()}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {pendingVerifications.length} Pending
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{error}</p>
                    <button onClick={clearError} className="ml-auto text-red-600 hover:underline text-sm">
                        Dismiss
                    </button>
                </div>
            )}

            {pendingVerifications.length === 0 && !error ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No pending verification requests</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingVerifications.map((request) => {
                        const companyId = getCompanyId(request)
                        const companyName = getCompanyName(request)
                        const isProcessing = processingVerificationId === companyId

                        return (
                            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {request.company?.logoUrl ? (
                                            <img
                                                src={request.company.logoUrl}
                                                alt={companyName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{companyName}</h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {request.company?.contactEmail || 'No email'} • Submitted {formatTime(request.submittedAt)}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {request.documentUrl && (
                                                <button
                                                    onClick={() => request.documentUrl && setPreviewUrl(request.documentUrl)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    View Document
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </button>
                                            )}
                                            {request.documents?.map((doc, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setPreviewUrl(doc)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    Document {index + 1}
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openRejectModal(companyId)}
                                        disabled={isProcessing}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isProcessing && rejectingId === companyId ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <X className="w-4 h-4" />
                                        )}
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(companyId)}
                                        disabled={isProcessing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isProcessing && rejectingId !== companyId ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                        Approve
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Verification</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false)
                                    setRejectingId(null)
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim() || processingVerificationId !== null}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {processingVerificationId === rejectingId ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <X className="w-4 h-4" />
                                )}
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewUrl(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        onClick={() => setPreviewUrl(null)}
                    >
                        <X className="w-8 h-8 text-white" />
                    </button>

                    <div
                        className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Try to determine content type or just render img with error fallback */}
                        <img
                            src={previewUrl}
                            alt="Document Preview"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onError={(e) => {
                                // Fallback for non-image files (like PDF) - open in new tab
                                e.currentTarget.style.display = 'none';
                                window.open(previewUrl, '_blank');
                                setPreviewUrl(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
