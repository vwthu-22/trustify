'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { exchangeToken } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Lấy state từ query param "state"
      const state = searchParams.get('state');
      
      console.log('Auth Callback: Received state:', state);

      if (!state) {
        console.error('Auth Callback: No state parameter found');
        router.push('/login?error=no_state');
        return;
      }

      try {
        console.log('Auth Callback: Exchanging token...');
        
        // Gọi exchange-token để backend set cookie
        const success = await exchangeToken(state);
        
        if (success) {
          console.log('Auth Callback: Token exchange successful');
          // Redirect về trang chủ
          router.push('/');
        } else {
          console.error('Auth Callback: Token exchange failed');
          router.push('/login?error=exchange_failed');
        }
      } catch (error) {
        console.error('Auth Callback: Error during callback handling:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [searchParams, exchangeToken, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
        {/* Animated Logo */}
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
        
        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600 mb-4">
          Please wait while we verify your account
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}