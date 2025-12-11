'use client';

import React, { useState, useRef } from 'react';
import { Check, X, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';

export default function LoginPage() {
    const router = useRouter();
    const { sendVerificationCode, verifyCode, isLoading, error: storeError } = useCompanyStore();

    const [email, setEmail] = useState('');
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await sendVerificationCode(email);
        if (success) {
            setShowVerificationModal(true);
            setOtpDigits(['', '', '', '', '', '']);
            // Focus first input after modal opens
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newDigits = [...otpDigits];
        newDigits[index] = value;
        setOtpDigits(newDigits);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newDigits = [...otpDigits];
            for (let i = 0; i < pastedData.length && i < 6; i++) {
                newDigits[i] = pastedData[i];
            }
            setOtpDigits(newDigits);
            // Focus the next empty input or the last one
            const nextEmptyIndex = newDigits.findIndex(d => !d);
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus();
            } else {
                inputRefs.current[5]?.focus();
            }
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpDigits.join('');
        if (code.length !== 6) return;

        const success = await verifyCode(email, code);
        if (success) {
            router.push('/');
        }
    };

    const handleResendCode = async () => {
        await sendVerificationCode(email);
        setOtpDigits(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    };

    return (
        <div className="bg-gray-50 flex items-center p-8 max-h-screen">
            {/* Left Sidebar - Benefits */}
            <aside className="hidden rounded-lg lg:block w-2/5 bg-white p-10 relative overflow-hidden max-h-[1000px] ">
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>

                <div className="relative ">

                    <div className="flex items-center gap-2 mb-12">
                        <svg className="w-8 h-8 text-[#0095b6]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <div>
                            <div className="text-2xl font-bold">Trustify</div>
                            <div className="text-sm text-gray-600">For Business</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Welcome back to<br />Trustify Business
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Sign in to manage your company reviews.
                            </p>
                        </div>

                        <div className="pt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Manage Reviews</h3>
                                    <p className="text-sm text-gray-600">Respond to customer feedback and build trust</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                                    <p className="text-sm text-gray-600">Track performance and insights in real-time</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Grow Your Business</h3>
                                    <p className="text-sm text-gray-600">Leverage reviews to increase conversions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Right Side - Login Form */}
            <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <svg className="w-8 h-8 text-[#0095b6]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <div>
                            <div className="text-2xl font-bold">Trustify</div>
                            <div className="text-sm text-gray-600">For Business</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="contact@company.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {storeError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {storeError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition text-lg flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending code...
                                    </>
                                ) : (
                                    <>
                                        Send verification code
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-xs text-gray-500 text-center">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Verification Code Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slideUp">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowVerificationModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Icon */}
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Check your email
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            We've sent a verification code to<br />
                            <span className="font-semibold text-gray-900">{email}</span>
                        </p>

                        {/* Verification Form */}
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                    Verification Code
                                </label>
                                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            maxLength={1}
                                            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    ))}
                                </div>
                            </div>

                            {storeError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {storeError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    'Verify and Sign In'
                                )}
                            </button>
                        </form>

                        {/* Resend Code */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                Didn't receive the code?
                            </p>
                            <button
                                onClick={handleResendCode}
                                disabled={isLoading}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:text-blue-400"
                            >
                                Resend code
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
