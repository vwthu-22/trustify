'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Set auth cookie
        document.cookie = 'auth-token=logged-in; path=/; max-age=86400'; // 1 day

        // Redirect to dashboard
        window.location.href = '/';
    };

    return (
        <div className="bg-gray-50 flex items-center p-8">
            {/* Left Sidebar - Benefits */}
            <aside className="hidden rounded-lg lg:block w-2/5 bg-white p-10 relative overflow-hidden max-h-[1000px] ">
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>

                <div className="relative z-10">

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
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Work Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-lg mt-6"
                            >
                                Sign in
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
        </div>
    );
}
