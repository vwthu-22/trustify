'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function MagicLinkCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyMagicLink, isLoading, error } = useCompanyStore();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            setStatus('error');
            setErrorMessage('Invalid magic link - no code provided');
            return;
        }

        // Verify the magic link
        const verify = async () => {
            const success = await verifyMagicLink(code);

            if (success) {
                setStatus('success');
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setStatus('error');
                setErrorMessage(error || 'Invalid or expired magic link');
            }
        };

        verify();
    }, [searchParams, verifyMagicLink, router, error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Verifying...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we verify your magic link.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Successfully Signed In!
                        </h2>
                        <p className="text-gray-600">
                            Redirecting you to the dashboard...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Verification Failed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
