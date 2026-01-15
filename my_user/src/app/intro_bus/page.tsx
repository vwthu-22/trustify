'use client'
import React from 'react';
import {
  Star, TrendingUp, BarChart3, Shield, MessageSquare, Mail,
  ArrowRight, CheckCircle, Sparkles, Users, Award, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function BusinessIntro() {
  const t = useTranslations('introBusiness');

  const features = [
    {
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      titleKey: 'dashboardTitle',
      descKey: 'dashboardDesc'
    },
    {
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      titleKey: 'reviewsTitle',
      descKey: 'reviewsDesc'
    },
    {
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      titleKey: 'aiAnalyticsTitle',
      descKey: 'aiAnalyticsDesc'
    },
    {
      icon: Mail,
      color: 'from-orange-500 to-orange-600',
      titleKey: 'invitationsTitle',
      descKey: 'invitationsDesc'
    },
    {
      icon: Shield,
      color: 'from-teal-500 to-teal-600',
      titleKey: 'verificationTitle',
      descKey: 'verificationDesc'
    }
  ];

  const benefits = [
    { icon: TrendingUp, textKey: 'benefitGrowth', color: 'text-blue-500' },
    { icon: Users, textKey: 'benefitTrust', color: 'text-green-500' },
    { icon: Award, textKey: 'benefitReputation', color: 'text-purple-500' },
    { icon: Sparkles, textKey: 'benefitInsights', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero Section - Compact */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white mb-4 border border-white/30">
            <Zap className="w-3 h-3" />
            <span>{t('trustedPlatform')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            {t('heroTitle')}
          </h1>
          <p className="text-base text-blue-100 max-w-2xl mx-auto mb-6">
            {t('heroSubtitle')}
          </p>

          {/* Stats - Inline */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">1000+</div>
              <p className="text-xs sm:text-sm text-blue-200">{t('statBusinesses')}</p>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">50K+</div>
              <p className="text-xs sm:text-sm text-blue-200">{t('statReviews')}</p>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">95%</div>
              <p className="text-xs sm:text-sm text-blue-200">{t('statSatisfaction')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Compact Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First row: 3 features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            {features.slice(0, 3).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
                  style={{ background: 'var(--card-bg)', borderWidth: '1px', borderColor: 'var(--card-border)' }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t(feature.descKey)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Second row: 2 features centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {features.slice(3, 5).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index + 3}
                  className="group relative rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
                  style={{ background: 'var(--card-bg)', borderWidth: '1px', borderColor: 'var(--card-border)' }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t(feature.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Section - Simplified */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side */}
              <div className="p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs font-medium mb-4 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  {t('aiPowered')}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {t('aiSectionTitle')}
                </h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {t('aiSectionDesc')}
                </p>
                <ul className="space-y-2">
                  {['aiFeature1', 'aiFeature2', 'aiFeature3', 'aiFeature4'].map((key, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Side - Stats */}
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t('aiAnalysisTitle')}</p>
                    <p className="text-sm text-purple-100">{t('aiAnalysisSubtitle')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{t('sentiment')}</span>
                      <span className="text-base font-bold">85% {t('positive')}</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{t('avgRating')}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-base font-bold">4.7</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{t('suggestions')}</span>
                      <span className="text-base font-bold">5 {t('items')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Compact */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {t('benefitsTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="rounded-xl p-4 shadow-sm text-center hover:shadow-lg transition-all" style={{ background: 'var(--card-bg)', borderWidth: '1px', borderColor: 'var(--card-border)' }}>
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${benefit.color}`} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{t(benefit.textKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-10 text-center shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {t('ctaTitle')}
            </h2>
            <p className="text-sm text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('ctaDesc')}
            </p>
            <Link
              href="/intro_bus/register_bussiness"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t('startNow')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}