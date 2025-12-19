'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import usePaymentStore from '@/store/usePaymentStore';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

function VNPayReturnContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Stores & Hooks
    const { getPaymentDetail, currentPayment, isLoading, clearCurrentPayment } = usePaymentStore();
    const { refreshProfile } = useFeatureAccess();

    // Local state
    const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    // Get txnRef from URL (VNPay gửi về) hoặc localStorage
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const storedTxnRef = typeof window !== 'undefined' ? localStorage.getItem('vnpay_txnRef') : null;
    const txnRef = vnp_TxnRef || storedTxnRef;

    // Verify payment status with backend
    const verifyPayment = useCallback(async () => {
        if (!txnRef) {
            setError('Transaction reference not found');
            setStatus('failed');
            return;
        }

        // Gọi store action để lấy payment detail
        const detail = await getPaymentDetail(txnRef);

        if (detail) {
            switch (detail.status) {
                case 'SUCCESS':
                    setStatus('success');
                    // Refresh profile để cập nhật plan/features mới
                    await refreshProfile();
                    // Clear localStorage
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
            // Nếu chưa có data, có thể IPN chưa xử lý xong
            setStatus('pending');
        }
    }, [txnRef, getPaymentDetail, clearCurrentPayment, refreshProfile]);

    // Initial verification
    useEffect(() => {
        verifyPayment();
    }, [verifyPayment]);

    // Poll for status updates (nếu PENDING)
    useEffect(() => {
        if (status === 'pending' && pollCount < 5) {
            const timer = setTimeout(async () => {
                console.log(`Polling attempt ${pollCount + 1}/5...`);
                await verifyPayment();
                setPollCount(prev => prev + 1);
            }, 2000); // Poll mỗi 2 giây

            return () => clearTimeout(timer);
        }

        // Nếu poll 5 lần vẫn pending, có thể có vấn đề
        if (status === 'pending' && pollCount >= 5) {
            setError('Payment verification is taking longer than expected. Please check your payment history.');
        }
    }, [status, pollCount, verifyPayment]);

    // Manual refresh
    const handleRefresh = async () => {
        setPollCount(0);
        setStatus('loading');
        await verifyPayment();
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
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
                    <p className="text-gray-600">Please wait while we confirm your payment with the server...</p>
                </div>
            </div>
        );
    }

    // Pending state - đang chờ IPN xử lý
    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Processing</h1>
                    <p className="text-gray-600 mb-6">
                        Your payment is being processed. This usually takes a few seconds.
                    </p>

                    {txnRef && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-gray-600">Transaction ID</p>
                            <p className="font-mono text-sm text-gray-900 break-all">{txnRef}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Checking status... ({pollCount}/5)</span>
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
                            Check Again
                        </button>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View Subscription
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

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">Your subscription has been activated.</p>

                    {currentPayment && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Transaction ID</p>
                                    <p className="font-semibold text-gray-900 text-sm break-all">{currentPayment.txnRef}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Amount</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatPrice(currentPayment.amount || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-blue-900">
                            <strong>Your subscription is now active!</strong> All premium features are available in your dashboard.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Go to Dashboard
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

                <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
                <p className="text-gray-600 mb-6">{error || 'Something went wrong with your payment'}</p>

                {txnRef && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-900 break-all">{txnRef}</p>
                    </div>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-red-900">
                        Your payment could not be processed. No charges have been made to your account.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push('/subscription')}
                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Back to Dashboard
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
