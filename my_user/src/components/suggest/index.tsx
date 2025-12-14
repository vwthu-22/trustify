'use client'
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import { getStarColor, STAR_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';

const categoryKeys = [
    { slug: 'bank', key: 'bank', icon: '🏛️' },
    { slug: 'travel', key: 'travel', icon: '✈️' },
    { slug: 'car-dealer', key: 'carDealer', icon: '🚗' },
    { slug: 'furniture-store', key: 'furniture', icon: '🛋️' },
    { slug: 'jewelry-store', key: 'jewelry', icon: '💎' },
    { slug: 'clothing-store', key: 'clothing', icon: '👕' },
    { slug: 'electronics', key: 'electronics', icon: '💻' },
    { slug: 'fitness', key: 'fitness', icon: '🏋️' }
];

export default function Suggest() {
    const pathname = usePathname();
    const { companies, isLoading, fetchCompanies } = useCompanyStore();
    const { companyRatings, fetchCompanyRatings } = useReviewStore();
    const t = useTranslations('home');
    const tCat = useTranslations('categories');

    useEffect(() => {
        fetchCompanies({ limit: 50 });
    }, [fetchCompanies]);

    // Sort by rating and take random 3 from top 10
    const topCompanies = useMemo(() => {
        if (!companies || companies.length === 0) return [];
        const sorted = [...companies].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const top10 = sorted.slice(0, 10);
        const shuffled = [...top10].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }, [companies]);

    // Fetch ratings for top companies
    useEffect(() => {
        if (topCompanies && topCompanies.length > 0) {
            const companyIds = topCompanies.map(c => c.id);
            fetchCompanyRatings(companyIds);
        }
    }, [topCompanies, fetchCompanyRatings]);

    // Helper function to get rating data
    const getCompanyRating = (companyId: string) => {
        return companyRatings[companyId] || { rating: 0, reviewCount: 0 };
    };

    const renderStars = (rating: number) => {
        const starColor = getStarColor(rating);

        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(rating) ? starColor : STAR_COLORS.empty}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    return (
        <div className="rounded-md mt-6 sm:mt-10">
            {/* Pick up where you left off */}
            <div className="px-0 sm:px-4 lg:px-6 rounded-lg py-4 sm:py-6">
                <h2 className="text-xl sm:text-2xl text-gray-900 mb-4">{t('pickUpWhereLeft')}</h2>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-300 p-4 animate-pulse">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : topCompanies.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-300 p-6 sm:p-8 text-center">
                        <p className="text-gray-600">{t('noTopRated')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {topCompanies.map((company) => {
                            const ratingData = getCompanyRating(company.id);

                            return (
                                <Link
                                    key={company.id}
                                    href={`/bussiness/${company.id}`}
                                    className="bg-white rounded-2xl border border-gray-300 p-3 sm:p-4 hover:shadow-md hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-sm sm:text-lg font-bold text-gray-800">
                                                {company.name.substring(0, 7).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg text-gray-900 mb-1 truncate">{company.name}</h3>
                                    <p className="text-gray-500 text-xs sm:text-sm mb-2 truncate">{company.website}</p>
                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                        <div className="flex">
                                            {renderStars(ratingData.rating)}
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{ratingData.rating.toFixed(1)}</span>
                                        <span className="text-gray-500 text-xs sm:text-sm">({ratingData.reviewCount.toLocaleString()})</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* What are you looking for? */}
            <div className="bg-white py-8 sm:py-12 -mx-4 sm:mx-0 px-4 sm:px-0 sm:rounded-lg">
                <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
                    <h2 className="text-xl sm:text-2xl text-gray-900 mb-4 sm:mb-6">{t('whatLookingFor')}</h2>

                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-4">
                        {categoryKeys.map((category) => {
                            const isActive = pathname?.includes(category.slug);
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className={`flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg transition ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <span className="text-xl sm:text-2xl md:text-3xl">{category.icon}</span>
                                    <p className="text-center text-[10px] sm:text-xs font-medium leading-tight">{tCat(category.key)}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-pink-200 via-pink-100 to-purple-100 rounded-2xl sm:rounded-3xl py-4 sm:py-6 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 sm:mt-0">
                <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {t('lookingToGrow')}
                    </h3>
                    <p className="text-sm sm:text-md text-gray-700">
                        {t('strengthenReputation')}
                    </p>
                </div>
                <Link
                    href={"/intro_bus"}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base md:text-lg transition whitespace-nowrap w-full sm:w-auto text-center"
                >
                    {t('getStarted')}
                </Link>
            </div>
        </div>
    );
}
