'use client';

import React, { useState } from 'react';
import { Check, X, Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { useCompanyStore } from '@/store/useCompanyStore';

export default function LoginPage() {
    const { sendMagicLink, isLoading, error: storeError, magicLinkSent, resetMagicLinkState, clearError } = useCompanyStore();

    const [email, setEmail] = useState('');

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        await sendMagicLink(email);
    };

    const handleBackToEmail = () => {
        resetMagicLinkState();
        clearError();
    };

    const handleResendLink = async () => {
        clearError();
        await sendMagicLink(email);
    };

    return (
        <div className="bg-gray-50 flex items-center p-8 max-h-screen  ">
            {/* Left Sidebar - Benefits */}
            <aside className="hidden rounded-lg lg:block w-3/5 bg-white p-10 relative overflow-hidden max-h-[1000px] ">
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
                        {!magicLinkSent ? (
                            // Email Input Form
                            <form onSubmit={handleSendMagicLink} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in with Magic Link</h2>
                                    <p className="text-gray-600 text-sm">Enter your email and we'll send you a login link</p>
                                </div>

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
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition text-md flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending magic link...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            Send magic link to gmail
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    By signing in, you agree to our{' '}
                                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                                </p>
                            </form>
                        ) : (
                            // Magic Link Sent - Check Email Message
                            <div className="text-center space-y-6">
                                {/* Success Icon */}
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <Mail className="w-10 h-10 text-green-600" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Check your email
                                    </h2>
                                    <p className="text-gray-600">
                                        We've sent a magic link to<br />
                                        <span className="font-semibold text-gray-900">{email}</span>
                                    </p>
                                </div>

                                {/* Instructions */}
                                <div className="bg-blue-50 rounded-xl p-4 text-left">
                                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        How to sign in:
                                    </h3>
                                    <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
                                        <li>Open your email inbox</li>
                                        <li>Find the email from Trustify</li>
                                        <li>Click the magic link in the email</li>
                                        <li>You'll be automatically signed in</li>
                                    </ol>
                                </div>

                                {/* Note */}
                                <p className="text-xs text-gray-500">
                                    Link expires in 15 minutes and can only be used once.
                                </p>

                                {storeError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {storeError}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="space-y-3 pt-4">
                                    <button
                                        onClick={handleResendLink}
                                        disabled={isLoading}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Resending...
                                            </>
                                        ) : (
                                            'Resend Magic Link'
                                        )}
                                    </button>

                                    <button
                                        onClick={handleBackToEmail}
                                        className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Use a different email
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

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
