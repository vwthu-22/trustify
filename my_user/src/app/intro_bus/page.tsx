'use client'
import React from 'react';
import {
  Star, TrendingUp, BarChart3, Shield, MessageSquare, Mail,
  Send, Crown, Headphones, Settings, ArrowRight, CheckCircle,
  Sparkles, Users, Building2, Award
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function BusinessIntro() {
  const t = useTranslations('introBusiness');

  const features = [
    {
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
      titleKey: 'dashboardTitle',
      descKey: 'dashboardDesc'
    },
    {
      icon: MessageSquare,
      color: 'bg-green-100 text-green-600',
      titleKey: 'reviewsTitle',
      descKey: 'reviewsDesc'
    },
    {
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-600',
      titleKey: 'aiAnalyticsTitle',
      descKey: 'aiAnalyticsDesc'
    },
    {
      icon: Mail,
      color: 'bg-orange-100 text-orange-600',
      titleKey: 'invitationsTitle',
      descKey: 'invitationsDesc'
    },
    {
      icon: Send,
      color: 'bg-pink-100 text-pink-600',
      titleKey: 'campaignsTitle',
      descKey: 'campaignsDesc'
    },
    {
      icon: Shield,
      color: 'bg-teal-100 text-teal-600',
      titleKey: 'verificationTitle',
      descKey: 'verificationDesc'
    }
  ];

  const benefits = [
    { icon: TrendingUp, textKey: 'benefitGrowth' },
    { icon: Users, textKey: 'benefitTrust' },
    { icon: Award, textKey: 'benefitReputation' },
    { icon: Sparkles, textKey: 'benefitInsights' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0f1c2d] to-[#1a3a5c] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{t('trustedPlatform')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://trustify-bussiness.vercel.app/login"
              className="inline-flex items-center justify-center gap-2 bg-[#5aa5df] hover:bg-[#4a95cf] text-white px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              {t('getStarted')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16 -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#0f1c2d] mb-2">1000+</div>
                <p className="text-gray-600">{t('statBusinesses')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#0f1c2d] mb-2">50,000+</div>
                <p className="text-gray-600">{t('statReviews')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#0f1c2d] mb-2">95%</div>
                <p className="text-gray-600">{t('statSatisfaction')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition group"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t(feature.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Analytics Highlight */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {t('aiPowered')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {t('aiSectionTitle')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('aiSectionDesc')}
              </p>
              <ul className="space-y-3">
                {['aiFeature1', 'aiFeature2', 'aiFeature3', 'aiFeature4'].map((key, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('aiAnalysisTitle')}</p>
                    <p className="text-sm text-gray-500">{t('aiAnalysisSubtitle')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">{t('sentiment')}</span>
                    <span className="font-semibold text-green-600">85% {t('positive')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">{t('avgRating')}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">4.7</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-700">{t('suggestions')}</span>
                    <span className="font-semibold text-purple-600">5 {t('items')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t('benefitsTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-14 h-14 bg-[#5aa5df]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#5aa5df]" />
                  </div>
                  <p className="text-gray-700 font-medium">{t(benefit.textKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">{t('pricingTitle')}</h2>
              </div>
              <p className="text-gray-600 mb-6">{t('pricingDesc')}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Free</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Pro</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Premium</span>
              </div>
              <Link
                href="https://trustify-bussiness.vercel.app/subscription"
                className="inline-flex items-center gap-2 bg-[#0f1c2d] hover:bg-[#1a3a5c] text-white px-6 py-3 rounded-full font-semibold transition"
              >
                {t('viewPlans')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-[#5aa5df] to-[#4a95cf] rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Headphones className="w-8 h-8" />
                <h2 className="text-2xl font-bold">{t('supportTitle')}</h2>
              </div>
              <p className="text-blue-100 mb-6">{t('supportDesc')}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('supportFeature1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('supportFeature2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('supportFeature3')}</span>
                </li>
              </ul>
              <Link
                href="https://trustify-bussiness.vercel.app/support"
                className="inline-flex items-center gap-2 bg-white text-[#5aa5df] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition"
              >
                {t('contactSupport')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0f1c2d] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="w-16 h-16 text-[#5aa5df] mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          <Link
            href="https://trustify-bussiness.vercel.app/login"
            className="inline-flex items-center gap-2 bg-[#5aa5df] hover:bg-[#4a95cf] text-white px-10 py-4 rounded-full text-lg font-semibold transition"
          >
            {t('startNow')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}