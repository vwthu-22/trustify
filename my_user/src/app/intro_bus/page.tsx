'use client'
import React from 'react';
import { Star, TrendingUp, BarChart3, Shield, Lightbulb, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BusinessIntro() {
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Hero Section - Why consumers rely on Trustpilot */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why consumers rely on Trustpilot
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">+300m</div>
              <p className="text-sm text-gray-600">
                reviews have been left on Trustpilot across +1M million domains
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">71%</div>
              <p className="text-sm text-gray-600">
                of US consumers are more inclined to trust Trustpilot reviews over those found other to buy from a brand
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">+6.5m</div>
              <p className="text-sm text-gray-600">
                new reviews are written on Trustpilot in 2024*
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Gold Release Features */}
      <section className="bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            New Gold Release Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Insights</h3>
              <p className="text-sm text-gray-600">
                Explore up to five years of review history with AI-powered summaries and actionable insights.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customizable queries</h3>
              <p className="text-sm text-gray-600">
                Customize queries and uncover actionable insights to drive business growth.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Award-boosting customization</h3>
              <p className="text-sm text-gray-600">
                Increase visibility and credibility with customizable award widgets that showcase your achievements.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review follow-up questions</h3>
              <p className="text-sm text-gray-600">
                Engage customers and gain deeper insights with follow-up questions to gather more feedback.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Highlights</h3>
              <p className="text-sm text-gray-600">
                Showcase branding on competitive and emerging terms to amplify your reach.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visitor Insights</h3>
              <p className="text-sm text-gray-600">
                Review analytics provide detailed insights into customer sentiment, traffic sources, and conversion rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Go Further Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full blur-3xl opacity-30"></div>
              <div className="relative">
                <svg viewBox="0 0 400 400" className="w-full h-auto">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Go further with Trustpilot solutions
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">•</span>
                  </div>
                  <p className="text-gray-700">
                    Build a more complete representation of your business by <span className="font-semibold">verifying all your information</span> with Trustpilot for better your trustmark.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">•</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Get more reviews</span> by inviting your customers to share their experience.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">•</span>
                  </div>
                  <p className="text-gray-700">
                    Use cutting-edge <span className="font-semibold">AI-powered TrustAnalytics</span> at every stage of the purchasing journey.
                  </p>
                </li>
              </ul>
              <p className="text-gray-600 mb-6">Want to learn more?</p>
              <Link
                href="/business/signup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                Book a demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot Data Solutions */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trustpilot Data Solutions, powered by TrustLayer™
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Embolden B2C, consumer sentiment and target signals into more strategic business insights, with more solutions built on TrustLayer™ as a foundational layer of unfiltered, transparent, crowd-sourced that provide a holistic view of target-based user-centric metrics.
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition">
                Learn more
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-[#5aa5df] fill-current" />
                      ))}
                    </div>
                    <span className="font-bold">5 stars</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Salesforce Integration */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Salesforce Integration</h3>
              <p className="text-gray-700 mb-6">
                Seamlessly connect Trustpilot with Salesforce to unify your customer data and leverage insights across your CRM and customer success platforms.
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition">
                See integration
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Trustpilot is a founding member of the Coalition for Trusted reviews
              </h3>
              <p className="text-gray-700 mb-6">
                Trustpilot, Amazon, Google, Meta, TripAdvisor, Trustly, Yelp, Zalando, and others have come together to fight fake reviews and protect the integrity of online customer review worldwide.
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition">
                Read more about it
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Marketing Widgets */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Find the right Pricing plan for your business
              </h2>
              <p className="text-gray-700 mb-8">
                Choose from flexible pricing options designed to fit businesses of all sizes.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                View pricing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">
                Trustpilot's Marketing widgets
              </h2>
              <p className="mb-8 text-blue-50">
                Showcase your reviews anywhere with customizable widgets that build trust and drive conversions.
              </p>
              <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-full font-semibold transition">
                Explore widgets
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};