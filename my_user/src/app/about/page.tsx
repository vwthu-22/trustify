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
            <section className="bg-gradient-to-br from-[#0f1c2d] to-[#1a3a5c] text-white py-16 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{t('tagline')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                        {t('heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                                {t('missionTitle')}
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {t('missionDesc1')}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                {t('missionDesc2')}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8">
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl sm:text-4xl font-bold text-[#0f1c2d] mb-2">
                                            {stat.value}
                                        </div>
                                        <p className="text-gray-600 text-sm">{t(stat.labelKey)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            {t('valuesTitle')}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('valuesSubtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                                    <div className="w-14 h-14 bg-[#5aa5df]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-7 h-7 text-[#5aa5df]" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{t(value.titleKey)}</h3>
                                    <p className="text-gray-600 text-sm">{t(value.descKey)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            {t('whatWeDoTitle')}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t('whatWeDoSubtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="flex gap-4 bg-gray-50 rounded-xl p-6">
                                    <div className="w-12 h-12 bg-[#5aa5df] rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{t(feature.titleKey)}</h3>
                                        <p className="text-gray-600 text-sm">{t(feature.descKey)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            {t('howItWorksTitle')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="text-center">
                                <div className="w-12 h-12 bg-[#5aa5df] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    {step}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{t(`step${step}Title`)}</h3>
                                <p className="text-gray-600 text-sm">{t(`step${step}Desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-[#0f1c2d]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {t('ctaDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/cmt"
                            className="inline-flex items-center justify-center gap-2 bg-[#5aa5df] hover:bg-[#4a95cf] text-white px-8 py-3 rounded-full font-semibold transition"
                        >
                            {t('writeReview')}
                        </Link>
                        <Link
                            href="/intro_bus"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition"
                        >
                            {t('forBusinesses')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
