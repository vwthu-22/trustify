'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Building2, Check, ArrowLeft, Shield, Lock, Loader2 } from 'lucide-react';
import usePlanStore, { Plan } from '@/store/usePlanStore';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan');
    const billingPeriod = (searchParams.get('period') || 'month') as 'month' | 'year';

    const { plans, isLoading, fetchPlans } = usePlanStore();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    // Fetch plans on mount
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Find selected plan when plans are loaded
    useEffect(() => {
        if (plans.length > 0 && planId) {
            const found = plans.find(p => p.id.toString() === planId);
            if (found) {
                setSelectedPlan(found);
            } else {
                // Plan not found, redirect
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        setIsProcessing(true);

        // TODO: Integrate with payment gateway
        // For now, simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            router.push('/checkout/success');
        }, 2000);
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
                                <span className="font-semibold">Secure Checkout</span> - Your payment information is encrypted and secure
                            </p>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'card'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'
                                        }`} />
                                    <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-700'
                                        }`}>
                                        Credit/Debit Card
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'bank'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Building2 className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'bank' ? 'text-blue-600' : 'text-gray-600'
                                        }`} />
                                    <p className={`text-sm font-medium ${paymentMethod === 'bank' ? 'text-blue-900' : 'text-gray-700'
                                        }`}>
                                        Bank Transfer
                                    </p>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {paymentMethod === 'card' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Bank Transfer Details</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Bank:</span> Vietcombank</p>
                                            <p><span className="font-medium">Account Number:</span> 1234567890</p>
                                            <p><span className="font-medium">Account Name:</span> TRUSTIFY VIETNAM</p>
                                            <p><span className="font-medium">Transfer Content:</span> TRUSTIFY-{selectedPlan.name.toUpperCase()}-[YOUR_EMAIL]</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-3">
                                            Your subscription will be activated after we confirm your payment (usually within 24 hours)
                                        </p>
                                    </div>
                                )}

                                {/* Terms and Conditions */}
                                <div className="pt-4">
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
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Complete Payment
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
