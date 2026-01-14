'use client'

import { useState, useEffect } from 'react'
import { FileText, Check, X, ExternalLink, Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import useCompanyManagementStore, { VerificationRequest } from '@/store/useCompanyManagementStore'
import { useTranslations } from 'next-intl'

export default function VerificationPage() {
    const t = useTranslations('verification')
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
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

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
            alert(t('success.approve'))
        }
    }

    // Handle reject
    const handleReject = async () => {
        if (!rejectingId) return

        const success = await rejectCompany(rejectingId, rejectReason)
        if (success) {
            setShowRejectModal(false)
            setRejectingId(null)
            alert(t('success.reject'))
        }
    }

    // Format timestamp
    const formatTime = (timestamp: string) => {
        if (!timestamp) return t('timeAgo.unknown')
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return t('timeAgo.minsAgo', { count: diffMins })
        if (diffHours < 24) return t('timeAgo.hoursAgo', { count: diffHours })
        return t('timeAgo.daysAgo', { count: diffDays })
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
                    <p className="text-gray-500 mt-1">{t('description')}</p>
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
                        {t('pending', { count: pendingVerifications.length })}
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{error}</p>
                    <button onClick={clearError} className="ml-auto text-red-600 hover:underline text-sm">
                        {t('errorDismiss')}
                    </button>
                </div>
            )}

            {pendingVerifications.length === 0 && !error ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
                    <p className="text-gray-500">{t('empty.description')}</p>
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
                                            {request.company?.contactEmail || t('noEmail')} • {t('submitted', { time: formatTime(request.submittedAt) })}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {request.documentUrl && (
                                                <button
                                                    onClick={() => setSelectedDoc(request.documentUrl || null)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-100 cursor-pointer transition-all border border-blue-100"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    {t('viewDocument')}
                                                </button>
                                            )}
                                            {request.documents?.map((doc, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedDoc(doc)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer transition-all border border-gray-100"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    {t('documentNumber', { index: index + 1 })}
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
                                        {t('reject')}
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
                                        {t('approve')}
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
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('rejectModal.title')}</h3>
                        <p className="text-gray-600 mb-4">{t('rejectModal.description')}</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder={t('rejectModal.placeholder')}
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
                                {t('rejectModal.cancel')}
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
                                {t('rejectModal.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {selectedDoc && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 sm:p-8 animate-in fade-in transition-all duration-300"
                    onClick={() => setSelectedDoc(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center animate-in zoom-in duration-300">
                        <button
                            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all group"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDoc(null);
                            }}
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div
                            className="bg-white p-2 rounded-xl shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[200px] w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Debug: Show URL */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-md truncate z-10">
                                {selectedDoc}
                            </div>

                            <img
                                src={selectedDoc}
                                alt="Verification Document"
                                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                                onLoad={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.opacity = '1';
                                    console.log('✅ Image loaded successfully:', selectedDoc);
                                }}
                                onError={(e) => {
                                    console.error('❌ Image failed to load:', selectedDoc);
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    // Show error message
                                    const parent = target.parentElement;
                                    if (parent) {
                                        const errorDiv = document.createElement('div');
                                        errorDiv.className = 'text-red-600 text-center p-8';
                                        errorDiv.innerHTML = `
                                            <p class="text-lg font-semibold mb-2">Failed to load image</p>
                                            <p class="text-sm text-gray-600 mb-4">The document URL may be invalid or the image is not accessible.</p>
                                            <a href="${selectedDoc}" target="_blank" class="text-blue-600 hover:underline text-sm">Try opening in new tab</a>
                                        `;
                                        parent.appendChild(errorDiv);
                                    }
                                }}
                                style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                            />

                            <div className="absolute top-4 right-4 flex gap-2">
                                <a
                                    href={selectedDoc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-900 shadow-lg transition-all"
                                    title={t('viewFullSize') || 'View full size'}
                                    onClick={() => console.log('🔗 Opening in new tab:', selectedDoc)}
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
