'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check, X, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // TODO: Replace with your actual API endpoint
            const response = await fetch('/api/auth/send-verification-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send verification code');
            }

            // Show verification modal
            setShowVerificationModal(true);
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
            console.error('Error sending verification code:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // TODO: Replace with your actual API endpoint
            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            if (!response.ok) {
                throw new Error('Invalid verification code');
            }

            // Set auth cookie
            document.cookie = 'auth-token=logged-in; path=/; max-age=86400'; // 1 day

            // Redirect to dashboard
            window.location.href = '/';
        } catch (err) {
            setError('Invalid verification code. Please try again.');
            console.error('Error verifying code:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/send-verification-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend verification code');
            }

            alert('Verification code resent successfully!');
        } catch (err) {
            setError('Failed to resend code. Please try again.');
            console.error('Error resending code:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 flex items-center p-8">
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
                            <div className="text-sm text-gray-600">For Company</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Welcome back to<br />Trustify Company
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Sign in to access your company.
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
                            <div className="text-sm text-gray-600">For Company</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Work Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-2xl tracking-widest font-semibold"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
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
