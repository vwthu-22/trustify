'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';

const API_BASE_URL = 'https://ed74c01b59d3.ngrok-free.app';

export default function LoginSignupPage() {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuthStore();
    
    // Hiển thị lỗi nếu có
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            let errorMessage = '';
            switch(error) {
                case 'no_state':
                    errorMessage = 'Authentication failed: No state code received';
                    break;
                case 'exchange_failed':
                    errorMessage = 'Failed to exchange authentication token';
                    break;
                case 'callback_failed':
                    errorMessage = 'Authentication callback failed';
                    break;
                default:
                    errorMessage = 'An error occurred during authentication';
            }
            console.error('Login error:', errorMessage);
            // Có thể thêm toast notification ở đây
            alert(errorMessage);
        }
    }, [searchParams]);

    // Nếu đã đăng nhập, redirect về trang chủ
    useEffect(() => {
        if (isAuthenticated) {
            console.log('User already authenticated, redirecting to home...');
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleGGlogin = () => {
        console.log('Redirecting to Google OAuth...');
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    };

    const handleFBlogin = () => {
        console.log('Redirecting to Facebook OAuth...');
        window.location.href = `${API_BASE_URL}/oauth2/authorization/facebook`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center mt-16 px-4">
            <div className="max-w-2xl w-full">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 text-center mb-10">
                    Read reviews. Write reviews. Find companies.
                </h1>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
                        Log in or sign up below
                    </h2>
                    <div className="space-y-4 max-w-md mx-auto">
                        {/* Google Login Button */}
                        <button
                            onClick={handleGGlogin}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Continue with Google</p>
                            </div>
                        </button>

                        {/* Facebook Login Button */}
                        <button 
                            onClick={handleFBlogin}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-sm"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Continue with Facebook</span>
                        </button>

                        {/* Email Option */}
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setShowEmailForm(prev => !prev)}
                                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition"
                            >
                                Continue with email
                            </button>
                        </div>
                        
                        {/* Email Form */}
                        {showEmailForm && (
                            <div className="mt-4 space-y-3 animate-fadeIn">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                <input
                                    type="text"
                                    placeholder="Tên người dùng"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition shadow-sm">
                                    Tiếp tục
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Business Section */}
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                        Are you a business?
                    </h2>
                    <p className="text-md text-gray-600 mb-5">
                        Set up your business account on Trustify for free
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-sm">
                            Log in
                        </button>
                        <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full transition">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};