'use client'
import React, { useEffect } from 'react';
import Suggest from '@/components/suggest';
import Bank from '@/components/bestbank';
import Travel from '@/components/besttravel';
import RecentReview from '@/components/rv_recent';
import SearchHD from '@/components/search';
import useAuthStore from '@/stores/userAuthStore/user';
import { useTranslations } from 'next-intl';

import BrandMarquee from '@/components/brand_marquee';

export default function Home() {
  const { fetchUserInfo, isAuthenticated, user, isLoading } = useAuthStore();
  const t = useTranslations('home');

  useEffect(() => {
    // Luôn gọi fetchUserInfo khi vào trang home để kiểm tra authentication
    const loadUserInfo = async () => {
      try {
        console.log('Home page: Checking authentication status...');
        await fetchUserInfo();
        console.log('Home page: User info loaded successfully');
      } catch (error) {
        console.log('Home page: User not authenticated or error:', error);
        // Không cần redirect, cho phép user vẫn xem trang home
      }
    };

    loadUserInfo();
  }, [fetchUserInfo]);

  return (
    <div className='mx-0 px-0'>
      <SearchHD />

      {/* Hiển thị welcome message nếu user đã login */}
      {isAuthenticated && user && !isLoading && (
        <div className="bg-green-50 border-b border-green-100 py-2 sm:py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-green-800 text-sm sm:text-base">
              <span className="font-semibold">{t('welcome')} {user.name}!</span>
              <span className="ml-1 sm:ml-2 text-green-600 hidden sm:inline">{t('shareExperience')}</span>
            </p>
          </div>
        </div>
      )}

      {/* Responsive container - mobile full width, desktop with margins */}
      <div className='px-4 sm:px-6 lg:px-32 xl:mx-16 2xl:mx-32'>
        <Suggest />
        <Bank />
        <BrandMarquee />
        <Travel />
        <RecentReview />
      </div>
    </div>
  );
}
