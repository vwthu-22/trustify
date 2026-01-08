'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Star, Building2, ArrowRight } from 'lucide-react';
import useCompanyStore from '@/stores/companyStore/company';
import { useTranslations } from 'next-intl';

const CATEGORIES = [
    { slug: 'bank', name: 'Bank', icon: '🏛️', description: 'Banks, Credit Unions & Financial Services' },
    { slug: 'travel', name: 'Travel', icon: '✈️', description: 'Airlines, Hotels & Travel Agencies' },
    { slug: 'car-dealer', name: 'Car Dealer', icon: '🚗', description: 'New & Used Car Dealerships' },
    { slug: 'furniture-store', name: 'Furniture Store', icon: '🛋️', description: 'Home & Office Furniture' },
    { slug: 'jewelry-store', name: 'Jewelry Store', icon: '💎', description: 'Jewelry & Watch Stores' },
    { slug: 'clothing-store', name: 'Clothing Store', icon: '👕', description: 'Fashion & Apparel' },
    { slug: 'electronics', name: 'Electronics & Technology', icon: '💻', description: 'Computers, Phones & Electronics' },
    { slug: 'fitness', name: 'Fitness & Nutrition', icon: '🏋️', description: 'Gyms, Trainers & Health Services' }
];

export default function CategoriesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const t = useTranslations('categories');
    const tHeader = useTranslations('header');

    const CATEGORIES = [
        { slug: 'bank', key: 'bank', icon: '🏛️', descKey: 'bankDesc' },
        { slug: 'travel', key: 'travel', icon: '✈️', descKey: 'travelDesc' },
        { slug: 'car-dealer', key: 'carDealer', icon: '🚗', descKey: 'carDealerDesc' },
        { slug: 'furniture-store', key: 'furniture', icon: '🛋️', descKey: 'furnitureDesc' },
        { slug: 'jewelry-store', key: 'jewelry', icon: '💎', descKey: 'jewelryDesc' },
        { slug: 'clothing-store', key: 'clothing', icon: '👕', descKey: 'clothingDesc' },
        { slug: 'electronics', key: 'electronics', icon: '💻', descKey: 'electronicsDesc' },
        { slug: 'fitness', key: 'fitness', icon: '🏋️', descKey: 'fitnessDesc' }
    ];

    const filteredCategories = CATEGORIES.filter(cat =>
        t(cat.key).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(cat.descKey).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-200 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
                        {t('title')}
                    </h1>
                    <p className="text-sm sm:text-base text-blue-100 text-center mb-6 max-w-2xl mx-auto">
                        {t('heroSubtitle')}
                    </p>

                    {/* Search Box */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={t('searchCategories')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-full text-gray-900 text-sm sm:text-base ring-blue-200 ring-1 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {filteredCategories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl sm:text-3xl">{category.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition">
                                        {t(category.key)}
                                    </h3>
                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                        {t(category.descKey)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-blue-600 text-xs font-medium">
                                <span>{t('browseCompanies')}</span>
                                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition" />
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">{t('noCategories')} "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        {t('cantFind')}
                    </h2>
                    <p className="text-gray-700 text-sm mb-5">
                        {t('searchDirectly')}
                    </p>
                    <Link
                        href="/write-review"
                        className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
                    >
                        <Star className="w-4 h-4" />
                        {tHeader('writeReview')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
