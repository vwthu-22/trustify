'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function VerifyPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!code) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        verifyEmail(code);
    }, [code]);

    const verifyEmail = async (verificationCode: string) => {
        try {
            await authApi.verifyEmail(verificationCode);

            setStatus('success');
            setMessage('Email verified successfully! Redirecting to dashboard...');

            // Backend sets access_token cookie automatically
            // Redirect to dashboard - it will fetch profile on its own
            setTimeout(() => {
                window.location.href = '/'; // Use window.location for full page reload
            }, 1000);

        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Failed to verify email. The link may be expired or invalid.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    {status === 'verifying' && (
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
                    {status === 'verifying' && 'Verifying Email'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                {/* Message */}
                <p className={`text-center mb-6 ${status === 'success' ? 'text-green-700' :
                    status === 'error' ? 'text-red-700' :
                        'text-gray-600'
                    }`}>
                    {message}
                </p>

                {/* Actions */}
                {status === 'error' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800 text-center">
                            You can now log in with your email and password.
                        </p>
                    </div>
                )}

                {status === 'verifying' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 text-center">
                            Please wait while we verify your email address...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
