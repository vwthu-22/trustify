'use client'
import React from 'react';
import {
    Star, Shield, Users, Target, Heart, Globe,
    CheckCircle, TrendingUp, MessageSquare, Award
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AboutPage() {
    const t = useTranslations('about');

    const values = [
        { icon: Shield, titleKey: 'valueTrust', descKey: 'valueTrustDesc' },
        { icon: Users, titleKey: 'valueTransparency', descKey: 'valueTransparencyDesc' },
        { icon: Heart, titleKey: 'valueIntegrity', descKey: 'valueIntegrityDesc' },
        { icon: Globe, titleKey: 'valueOpenness', descKey: 'valueOpennessDesc' }
    ];

    const stats = [
        { value: '50,000+', labelKey: 'statReviews' },
        { value: '1,000+', labelKey: 'statBusinesses' },
        { value: '10,000+', labelKey: 'statUsers' },
        { value: '95%', labelKey: 'statSatisfaction' }
    ];

    const features = [
        { icon: Star, titleKey: 'featureReviews', descKey: 'featureReviewsDesc' },
        { icon: TrendingUp, titleKey: 'featureAnalytics', descKey: 'featureAnalyticsDesc' },
        { icon: MessageSquare, titleKey: 'featureFeedback', descKey: 'featureFeedbackDesc' },
        { icon: Award, titleKey: 'featureVerification', descKey: 'featureVerificationDesc' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 mt-14">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#0f1c2d] to-[#1a3a5c] text-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs sm:text-sm mb-4">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span>{t('tagline')}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
                        {t('heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-10 sm:py-14 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                {t('missionTitle')}
                            </h2>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                {t('missionDesc1')}
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {t('missionDesc2')}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6">
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-[#0f1c2d] mb-1">
                                            {stat.value}
                                        </div>
                                        <p className="text-gray-600 text-xs">{t(stat.labelKey)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-10 sm:py-14 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            {t('valuesTitle')}
                        </h2>
                        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                            {t('valuesSubtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                                    <div className="w-10 h-10 bg-[#5aa5df]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Icon className="w-5 h-5 text-[#5aa5df]" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{t(value.titleKey)}</h3>
                                    <p className="text-gray-600 text-xs">{t(value.descKey)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-10 sm:py-14 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            {t('whatWeDoTitle')}
                        </h2>
                        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                            {t('whatWeDoSubtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="flex gap-3 bg-gray-50 rounded-lg p-4">
                                    <div className="w-10 h-10 bg-[#5aa5df] rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{t(feature.titleKey)}</h3>
                                        <p className="text-gray-600 text-xs">{t(feature.descKey)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-10 sm:py-14 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            {t('howItWorksTitle')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="text-center">
                                <div className="w-10 h-10 bg-[#5aa5df] text-white rounded-full flex items-center justify-center text-base font-bold mx-auto mb-3">
                                    {step}
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">{t(`step${step}Title`)}</h3>
                                <p className="text-gray-600 text-xs">{t(`step${step}Desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-10 sm:py-14 bg-[#0f1c2d]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        {t('ctaDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/cmt"
                            className="inline-flex items-center justify-center gap-1.5 bg-[#5aa5df] hover:bg-[#4a95cf] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
                        >
                            {t('writeReview')}
                        </Link>
                        <Link
                            href="/intro_bus"
                            className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
                        >
                            {t('forBusinesses')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
