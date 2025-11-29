'use client'
import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useCompanyStore from '@/stores/companyStore/company';

const categories = [
    { slug: 'bank', name: 'Bank', icon: '🏛️' },
    { slug: 'travel', name: 'Travel', icon: '✈️' },
    { slug: 'car-dealer', name: 'Car Dealer', icon: '🚗' },
    { slug: 'furniture-store', name: 'Furniture', icon: '🛋️' },
    { slug: 'jewelry-store', name: 'Jewelry', icon: '💎' },
    { slug: 'clothing-store', name: 'Clothing', icon: '👕' },
    { slug: 'electronics', name: 'Electronics', icon: '💻' },
    { slug: 'fitness', name: 'Fitness and Nutrition', icon: '🏋️' }
];

export default function Suggest() {
    const pathname = usePathname();
    const { companies, isLoading, fetchCompanies } = useCompanyStore();

    useEffect(() => {
        // Fetch all companies, will sort and filter client-side
        fetchCompanies({ limit: 50 });
    }, [fetchCompanies]);

    // Sort by rating and take random 3 from top 10
    const topCompanies = useMemo(() => {
        if (!companies || companies.length === 0) return [];

        // Sort by rating descending
        const sorted = [...companies].sort((a, b) => (b.rating || 0) - (a.rating || 0));

        // Take top 10
        const top10 = sorted.slice(0, 10);

        // Shuffle and take 3
        const shuffled = [...top10].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }, [companies]);

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-[#5aa5df]' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    return (
        <div className="rounded-md mt-10">
            {/* Pick up where you left off */}
            <div className="px-4 sm:px-6 lg:px-6 rounded-lg py-6">
                <h2 className="text-2xl text-gray-900 mb-4">Pick up where you left off</h2>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-300 p-4 animate-pulse">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : topCompanies.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-300 p-8 text-center">
                        <p className="text-gray-600">No top rated companies found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topCompanies.map((company) => (
                            <Link
                                key={company.id}
                                href={`/bussiness/${company.id}`}
                                className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-lg font-bold text-gray-800">
                                            {company.name.substring(0, 7).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg text-gray-900 mb-1 truncate">{company.name}</h3>
                                <p className="text-gray-500 text-sm mb-2 truncate">{company.website}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {renderStars(company.rating || 0)}
                                    </div>
                                    <span className="font-semibold text-gray-900">{(company.rating || 0).toFixed(1)}</span>
                                    <span className="text-gray-500 text-sm">{(company.reviewCount || 0).toLocaleString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* What are you looking for? */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl text-gray-900">What are you looking for?</h2>
                        <div className="flex items-center gap-2">
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((category) => {
                            const isActive = pathname?.includes(category.slug);
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <span className="text-3xl">{category.icon}</span>
                                    <p className="text-center text-xs font-medium">{category.name}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-pink-200 via-pink-100 to-purple-100 rounded-3xl py-4 md:py-6 px-6 md:px-8 flex items-center justify-between">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        Looking to grow your business?
                    </h3>
                    <p className="text-md text-gray-700">
                        Strengthen your reputation with reviews on Trustify.
                    </p>
                </div>
                <Link href={"/intro_bus"} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full text-lg transition whitespace-nowrap ml-4">
                    Get started
                </Link>
            </div>
        </div>
    );
}