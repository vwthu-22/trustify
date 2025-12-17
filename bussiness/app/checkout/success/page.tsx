'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react';

export default function CheckoutSuccessPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Your subscription has been activated successfully
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                                <p className="font-semibold text-gray-900">#ORD-{Date.now()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Plan</p>
                                <p className="font-semibold text-gray-900">Professional</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Billing Period</p>
                                <p className="font-semibold text-gray-900">Monthly</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold text-blue-900 mb-4">What's Next?</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-900">Check Your Email</p>
                                    <p className="text-sm text-blue-700">
                                        We've sent you a confirmation email with your invoice and subscription details
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-900">Access Your Features</p>
                                    <p className="text-sm text-blue-700">
                                        All premium features are now available in your dashboard
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View Subscription
                        </button>
                    </div>

                    {/* Support */}
                    <p className="text-sm text-gray-500 mt-6">
                        Need help? Contact our{' '}
                        <a href="/support" className="text-blue-600 hover:underline">support team</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
