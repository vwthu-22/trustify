'use client';

import { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import usePaymentStore from '@/store/usePaymentStore';
import { useTranslations } from 'next-intl';

function VNPayReturnContent() {
    const t = useTranslations('payment');
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ Lấy store functions và state riêng biệt
    const getPaymentDetail = usePaymentStore(state => state.getPaymentDetail);
    const clearCurrentPayment = usePaymentStore(state => state.clearCurrentPayment);
    const currentPayment = usePaymentStore(state => state.currentPayment);
    const isLoading = usePaymentStore(state => state.isLoading);

    // Local state
    const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    // ✅ Refs để chặn duplicate calls
    const hasFetched = useRef(false);
    const isPolling = useRef(false);

    // Get txnRef
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const storedTxnRef = typeof window !== 'undefined' ? localStorage.getItem('vnpay_txnRef') : null;
    const txnRef = vnp_TxnRef || storedTxnRef;

    // ✅ Verify payment function
    const verifyPayment = useCallback(async (isManualRefresh = false) => {
        if (!txnRef) {
            setError('Transaction reference not found');
            setStatus('failed');
            return;
        }

        if (isPolling.current && !isManualRefresh) {
            return;
        }

        isPolling.current = true;

        try {
            const detail = await getPaymentDetail(txnRef);

            if (detail) {
                switch (detail.status) {
                    case 'SUCCESS':
                        setStatus('success');
                        clearCurrentPayment();
                        break;
                    case 'FAILED':
                        setStatus('failed');
                        setError('Payment was not successful');
                        break;
                    case 'PENDING':
                    default:
                        setStatus('pending');
                        break;
                }
            } else {
                setStatus('pending');
            }
        } finally {
            isPolling.current = false;
        }
    }, [txnRef, getPaymentDetail, clearCurrentPayment]);

    // ✅ Initial fetch - CHỈ 1 LẦN
    useEffect(() => {
        if (txnRef && !hasFetched.current) {
            hasFetched.current = true;
            verifyPayment();
        }
    }, [txnRef]); // eslint-disable-line react-hooks/exhaustive-deps

    // ✅ Polling với kiểm soát
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (status === 'pending' && pollCount < 5 && hasFetched.current) {
            timer = setTimeout(() => {
                console.log(`Polling attempt ${pollCount + 1}/5...`);
                verifyPayment();
                setPollCount(prev => prev + 1);
            }, 3000);
        }

        if (status === 'pending' && pollCount >= 5) {
            setError('Payment verification is taking longer than expected.');
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [status, pollCount]); // eslint-disable-line react-hooks/exhaustive-deps

    // Manual refresh
    const handleRefresh = async () => {
        setPollCount(0);
        setStatus('loading');
        isPolling.current = false;
        await verifyPayment(true);
    };

    // Format price
    const formatPrice = (price: number) => {
        return `${price.toLocaleString('vi-VN')}₫`;
    };

    // Loading state
    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{t('verifying')}</h2>
                    <p className="text-gray-600">{t('verifyingDesc')}</p>
                </div>
            </div>
        );
    }

    // Pending state
    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('processing')}</h1>
                    <p className="text-gray-600 mb-6">{t('processingDesc')}</p>

                    {txnRef && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-gray-600">{t('transactionId')}</p>
                            <p className="font-mono text-sm text-gray-900 break-all">{txnRef}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('checkingStatus')} ({pollCount}/5)</span>
                    </div>

                    {error && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-yellow-800">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleRefresh}
                            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            {t('checkAgain')}
                        </button>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {t('viewSubscription')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('success')}</h1>
                    <p className="text-gray-600 mb-6">{t('successDesc')}</p>

                    {currentPayment && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">{t('transactionId')}</p>
                                    <p className="font-semibold text-gray-900 text-sm break-all">{currentPayment.txnRef}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t('amount')}</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatPrice(currentPayment.amount || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-blue-900">{t('subscriptionActive')}</p>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {t('goToDashboard')}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // Failed state
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('failed')}</h1>
                <p className="text-gray-600 mb-6">{error || t('failedDesc')}</p>

                {txnRef && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600">{t('transactionId')}</p>
                        <p className="font-mono text-sm text-gray-900 break-all">{txnRef}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push('/subscription')}
                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        {t('tryAgain')}
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {t('goToDashboard')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VNPayReturnPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-gray-600">Processing payment...</span>
                </div>
            </div>
        }>
            <VNPayReturnContent />
        </Suspense>
    );
}
