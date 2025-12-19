'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ArrowLeft, Shield, Lock, Loader2, AlertCircle } from 'lucide-react';
import usePlanStore, { Plan } from '@/store/usePlanStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import usePaymentStore from '@/store/usePaymentStore';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan');
    const billingPeriod = (searchParams.get('period') || 'month') as 'month' | 'year';

    // Stores
    const { plans, isLoading, fetchPlans } = usePlanStore();
    const { company, fetchCompanyProfile } = useCompanyStore();
    const { createPayment, isCreating, error: paymentError, clearError } = usePaymentStore();

    // Local state
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    // Combined error
    const error = localError || paymentError;

    // Fetch plans and company on mount
    useEffect(() => {
        fetchPlans();
        fetchCompanyProfile();
        clearError();
    }, [fetchPlans, fetchCompanyProfile, clearError]);

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

    const handleVNPayPayment = async () => {
        setLocalError(null);
        clearError();

        if (!agreedToTerms) {
            setLocalError('Please agree to the terms and conditions');
            return;
        }

        if (!company?.id) {
            setLocalError('Company information not found. Please try again.');
            return;
        }

        // Call store action
        const result = await createPayment(Number(company.id), selectedPlan.id);

        if (result?.paymentUrl) {
            // Redirect to VNPay gateway
            window.location.href = result.paymentUrl;
        }
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Free';
        return `${price.toLocaleString('vi-VN')}₫`;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to plans
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column - Order Summary */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Plan Details */}
                            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg">{selectedPlan.name} Plan</h3>
                                    <p className="text-sm text-gray-600">{selectedPlan.description || 'Premium subscription plan'}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Billing: {billingPeriod === 'month' ? 'Monthly' : 'Yearly'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl text-gray-900">{formatPrice(finalPrice)}</p>
                                    {billingPeriod === 'year' && savings > 0 && (
                                        <p className="text-sm text-green-600">Save {formatPrice(savings)}</p>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            {selectedPlan.features && selectedPlan.features.length > 0 && (
                                <div className="py-6 border-b border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4">Included Features</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedPlan.features.map((feature) => (
                                            <div key={feature.id} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{feature.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="py-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatPrice(selectedPlan.price)}</span>
                                </div>
                                {billingPeriod === 'year' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Yearly discount (17%)</span>
                                            <span className="font-medium text-green-600">-{formatPrice(savings)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Billing period</span>
                                            <span className="font-medium text-gray-900">×10 months</span>
                                        </div>
                                    </>
                                )}
                                <div className="pt-3 border-t border-gray-200 flex justify-between">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-bold text-2xl text-gray-900">{formatPrice(finalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            {/* VNPay Badge */}
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <img
                                    src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                    alt="VNPay"
                                    className="h-8"
                                />
                            </div>

                            {/* Security Badge */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-blue-600" />
                                <p className="text-xs text-blue-900">
                                    Secure payment via VNPay
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Terms */}
                            <div className="mb-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        I agree to the{' '}
                                        <a href="/terms" className="text-blue-600 hover:underline">Terms</a>
                                        {' '}and{' '}
                                        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handleVNPayPayment}
                                disabled={isCreating || !agreedToTerms}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Redirecting...
                                    </>
                                ) : (
                                    <>
                                        Pay {formatPrice(finalPrice)}
                                    </>
                                )}
                            </button>

                            {/* Info */}
                            <p className="text-xs text-gray-500 text-center mt-4">
                                You'll be redirected to VNPay to complete payment
                            </p>

                            {/* Money Back */}
                            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-green-900 text-xs">30-Day Money Back</p>
                                    <p className="text-xs text-green-700">Full refund if not satisfied</p>
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
