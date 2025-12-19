'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Check, ArrowLeft, Shield, Lock, Loader2, CreditCard, AlertCircle } from 'lucide-react';
import usePlanStore, { Plan } from '@/store/usePlanStore';
import { useCompanyStore } from '@/store/useCompanyStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// VNPay bank codes
const BANK_OPTIONS = [
    { code: '', name: 'Choose bank at VNPay', description: 'Select at payment gateway' },
    { code: 'NCB', name: 'NCB Bank', description: 'National Citizen Bank' },
    { code: 'VNPAYQR', name: 'VNPay QR', description: 'Scan QR to pay' },
    { code: 'VNBANK', name: 'ATM Card', description: 'Domestic ATM/Bank account' },
    { code: 'INTCARD', name: 'International Card', description: 'Visa, Mastercard, JCB' },
];

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan');
    const billingPeriod = (searchParams.get('period') || 'month') as 'month' | 'year';

    const { plans, isLoading, fetchPlans } = usePlanStore();
    const { company, fetchCompanyProfile } = useCompanyStore();

    const [selectedBankCode, setSelectedBankCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch plans and company on mount
    useEffect(() => {
        fetchPlans();
        fetchCompanyProfile();
    }, [fetchPlans, fetchCompanyProfile]);

    // Find selected plan when plans are loaded
    useEffect(() => {
        if (plans.length > 0 && planId) {
            const found = plans.find(p => p.id.toString() === planId);
            if (found) {
                setSelectedPlan(found);
            } else {
                router.push('/subscription');
            }
        }
    }, [plans, planId, router]);

    // Loading state
    if (isLoading || !selectedPlan) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-gray-600">Loading checkout...</span>
                </div>
            </div>
        );
    }

    const finalPrice = billingPeriod === 'year' ? selectedPlan.price * 10 : selectedPlan.price;
    const savings = billingPeriod === 'year' ? selectedPlan.price * 2 : 0;

    const handleVNPayPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!agreedToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        if (!company?.id) {
            setError('Company information not found. Please try again.');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    companyId: Number(company.id),
                    planId: selectedPlan.id,
                    bankCode: selectedBankCode || undefined,
                }),
            });

            const data = await response.json();
            console.log('VNPay create payment response:', data);

            // Check for success - API may return 'OK' or 'SUCCESS'
            if ((data.status === 'SUCCESS' || data.status === 'OK') && data.paymentUrl) {
                // Store txnRef for later verification
                localStorage.setItem('vnpay_txnRef', data.txnRef);
                localStorage.setItem('vnpay_planId', selectedPlan.id.toString());

                // Redirect to VNPay payment gateway
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.message || 'Failed to create payment');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        return `${price.toLocaleString('vi-VN')}₫`;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to plans
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Payment Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Security Badge */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-blue-600" />
                            <p className="text-sm text-blue-900">
                                <span className="font-semibold">Secure Checkout</span> - Powered by VNPay secure payment gateway
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-red-900 font-medium">Payment Error</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* VNPay Payment */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <img
                                    src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                    alt="VNPay"
                                    className="h-8"
                                />
                                <h2 className="text-xl font-bold text-gray-900">VNPay Payment</h2>
                            </div>

                            <form onSubmit={handleVNPayPayment} className="space-y-6">
                                {/* Bank Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Payment Method
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {BANK_OPTIONS.map((bank) => (
                                            <button
                                                key={bank.code}
                                                type="button"
                                                onClick={() => setSelectedBankCode(bank.code)}
                                                className={`p-4 border-2 rounded-lg text-left transition-all ${selectedBankCode === bank.code
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {bank.code === 'INTCARD' ? (
                                                        <CreditCard className={`w-6 h-6 ${selectedBankCode === bank.code ? 'text-blue-600' : 'text-gray-500'}`} />
                                                    ) : (
                                                        <Building2 className={`w-6 h-6 ${selectedBankCode === bank.code ? 'text-blue-600' : 'text-gray-500'}`} />
                                                    )}
                                                    <div>
                                                        <p className={`font-medium ${selectedBankCode === bank.code ? 'text-blue-900' : 'text-gray-900'}`}>
                                                            {bank.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{bank.description}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                            <p>Click "Pay with VNPay" to proceed to secure payment gateway</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                            <p>Complete your payment on VNPay</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                            <p>You'll be redirected back after payment confirmation</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="pt-2">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I agree to the{' '}
                                            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                                        </span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing || !agreedToTerms}
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Redirecting to VNPay...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Pay {formatPrice(finalPrice)} with VNPay
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            {/* Plan Details */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedPlan.name} Plan</h3>
                                        <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Billing Period</p>
                                    <p className="font-semibold text-gray-900">
                                        {billingPeriod === 'month' ? 'Monthly' : 'Yearly'}
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Included Features</h4>
                                <div className="space-y-2">
                                    {selectedPlan.features && selectedPlan.features.length > 0 ? (
                                        <>
                                            {selectedPlan.features.slice(0, 5).map((feature) => (
                                                <div key={feature.id} className="flex items-start gap-2">
                                                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{feature.name}</span>
                                                </div>
                                            ))}
                                            {selectedPlan.features.length > 5 && (
                                                <p className="text-sm text-blue-600 font-medium">
                                                    +{selectedPlan.features.length - 5} more features
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500">No features listed</p>
                                    )}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(selectedPlan.price)}
                                    </span>
                                </div>

                                {billingPeriod === 'year' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Yearly discount (17%)</span>
                                            <span className="font-medium text-green-600">
                                                -{formatPrice(savings)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Billing period</span>
                                            <span className="font-medium text-gray-900">×10 months</span>
                                        </div>
                                    </>
                                )}

                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-2xl text-gray-900">
                                        {formatPrice(finalPrice)}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Billed {billingPeriod === 'month' ? 'monthly' : 'annually'}
                                </p>
                            </div>

                            {/* Money Back Guarantee */}
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-green-900 text-sm">30-Day Money Back Guarantee</p>
                                        <p className="text-xs text-green-700 mt-1">
                                            Not satisfied? Get a full refund within 30 days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="text-gray-600">Loading checkout...</span>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
