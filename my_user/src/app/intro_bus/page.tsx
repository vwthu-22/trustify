'use client'
import React from 'react';
import { Star, TrendingUp, BarChart3, Shield, Lightbulb, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function BusinessIntro() {
  const t = useTranslations('introBusiness');
  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      {/* Hero Section - Why consumers rely on Trustify */}
      <section className="bg-white py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8 sm:mb-10">
            {t('whyConsumersRely')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">+300m</div>
              <p className="text-xs text-gray-600">
                {t('reviewsCount')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">71%</div>
              <p className="text-xs text-gray-600">
                {t('consumersTrust')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">+6.5m</div>
              <p className="text-xs text-gray-600">
                {t('newReviews')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Gold Release Features */}
      <section className="bg-gray-50 pt-10 sm:pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8 sm:mb-10">
            {t('goldFeatures')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{t('enhancedInsights')}</h3>
              <p className="text-xs text-gray-600">
                {t('enhancedInsightsDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{t('customQueries')}</h3>
              <p className="text-xs text-gray-600">
                {t('customQueriesDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{t('awardCustomization')}</h3>
              <p className="text-xs text-gray-600">
                {t('awardCustomizationDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{t('followUpQuestions')}</h3>
              <p className="text-xs text-gray-600">
                {t('followUpQuestionsDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{t('reviewHighlights')}</h3>
              <p className="text-xs text-gray-600">
                {t('reviewHighlightsDesc')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{t('visitorInsights')}</h3>
              <p className="text-xs text-gray-600">
                {t('visitorInsightsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Go Further Section */}
      <section className="bg-gray-50 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full blur-3xl opacity-30"></div>
              <div className="relative">
                <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto h-auto">
                  <circle cx="200" cy="200" r="180" fill="#5aa5df" opacity="0.1" />
                  <path d="M200 50 L250 150 L350 165 L275 240 L290 340 L200 285 L110 340 L125 240 L50 165 L150 150 Z" fill="#5aa5df" />
                  <rect x="50" y="100" width="40" height="40" fill="#5aa5df" opacity="0.3" />
                  <rect x="310" y="280" width="40" height="40" fill="#5aa5df" opacity="0.3" />
                  <circle cx="80" cy="300" r="30" fill="#5aa5df" opacity="0.2" />
                  <circle cx="340" cy="120" r="40" fill="#5aa5df" opacity="0.2" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {t('goFurther')}
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[10px]">•</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {t('verifyInfo')}
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[10px]">•</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {t('getMoreReviews')}
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[10px]">•</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {t('aiAnalytics')}
                  </p>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mb-4">{t('wantLearnMore')}</p>
              <Link
                href="/business/signup"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition"
              >
                {t('bookDemo')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trustify Data Solutions */}
      <section className="bg-white py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {t('dataSolutions')}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {t('dataSolutionsDesc')}
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition">
                {t('learnMore')}
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-5 sm:p-6">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5aa5df] fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-sm">5 stars</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-gray-200 rounded"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Marketing Widgets */}
      <section className="bg-white py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {t('findPricing')}
              </h2>
              <p className="text-sm text-gray-700 mb-5">
                {t('findPricingDesc')}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition"
              >
                {t('viewPricing')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-5 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                {t('marketingWidgets')}
              </h2>
              <p className="mb-5 text-blue-50 text-sm">
                {t('marketingWidgetsDesc')}
              </p>
              <button className="bg-white hover:bg-gray-100 text-blue-600 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition">
                {t('exploreWidgets')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};