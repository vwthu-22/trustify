'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

function VNPayReturnContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [paymentInfo, setPaymentInfo] = useState<{
        txnRef: string;
        amount: number;
        message: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Get VNPay params from URL
                const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
                const vnp_TxnRef = searchParams.get('vnp_TxnRef');
                const vnp_Amount = searchParams.get('vnp_Amount');

                console.log('VNPay return params:', {
                    vnp_ResponseCode,
                    vnp_TxnRef,
                    vnp_Amount
                });

                // Check response code (00 = success)
                if (vnp_ResponseCode === '00') {
                    // Verify with backend by fetching payment detail
                    if (vnp_TxnRef) {
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/payment/detail/${vnp_TxnRef}`, {
                                credentials: 'include',
                                headers: {
                                    'ngrok-skip-browser-warning': 'true',
                                },
                            });

                            if (response.ok) {
                                const data = await response.json();
                                console.log('Payment detail:', data);

                                if (data.status === 'SUCCESS') {
                                    setPaymentInfo({
                                        txnRef: data.txnRef,
                                        amount: data.amount,
                                        message: 'Payment completed successfully!',
                                    });
                                    setStatus('success');

                                    // Clear localStorage
                                    localStorage.removeItem('vnpay_txnRef');
                                    localStorage.removeItem('vnpay_planId');
                                    return;
                                }
                            }
                        } catch (err) {
                            console.error('Error verifying payment:', err);
                        }
                    }

                    // Fallback if backend verification fails but VNPay says success
                    setPaymentInfo({
                        txnRef: vnp_TxnRef || 'N/A',
                        amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0, // VNPay amount is in đồng * 100
                        message: 'Payment completed successfully!',
                    });
                    setStatus('success');
                } else {
                    // Payment failed
                    const errorMessages: Record<string, string> = {
                        '07': 'Transaction suspected of fraud',
                        '09': 'Card/Account not registered for Internet Banking',
                        '10': 'Incorrect authentication information more than 3 times',
                        '11': 'Payment timeout',
                        '12': 'Card/Account is locked',
                        '13': 'Incorrect OTP',
                        '24': 'Transaction cancelled',
                        '51': 'Insufficient balance',
                        '65': 'Transaction limit exceeded',
                        '75': 'Bank under maintenance',
                        '79': 'Incorrect payment password',
                        '99': 'Other error',
                    };

                    setError(errorMessages[vnp_ResponseCode || '99'] || 'Payment failed');
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Payment verification error:', err);
                setError('Unable to verify payment status');
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
                    <p className="text-gray-600">Please wait while we confirm your payment...</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">{paymentInfo?.message}</p>

                    {paymentInfo && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Transaction ID</p>
                                    <p className="font-semibold text-gray-900 text-sm break-all">{paymentInfo.txnRef}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Amount</p>
                                    <p className="font-semibold text-gray-900">
                                        {paymentInfo.amount.toLocaleString('vi-VN')}₫
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
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // Failed status
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
                <p className="text-gray-600 mb-6">{error || 'Something went wrong with your payment'}</p>

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
