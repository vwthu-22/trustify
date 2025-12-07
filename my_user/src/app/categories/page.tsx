'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Star, Building2, ArrowRight } from 'lucide-react';
import useCompanyStore from '@/stores/companyStore/company';

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

    const filteredCategories = CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-200 text-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
                        Browse Categories
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 text-center mb-8 max-w-2xl mx-auto">
                        Find trusted companies across all industries. Read reviews and make informed decisions.
                    </p>

                    {/* Search Box */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full text-gray-900 text-base sm:text-lg ring-blue-200 ring-1 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredCategories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-4xl sm:text-5xl">{category.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                                <span>Browse companies</span>
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No categories found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                        Can't find what you're looking for?
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Search for any company directly and share your experience.
                    </p>
                    <Link
                        href="/write-review"
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition"
                    >
                        <Star className="w-5 h-5" />
                        Write a Review
                    </Link>
                </div>
            </div>
        </div>
    );
}
