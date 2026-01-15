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
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? starColor : STAR_COLORS.empty}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    return (
        <div className="rounded-md mt-4 sm:mt-6">
            {/* Pick up where you left off */}
            <div className="px-0 sm:px-3 lg:px-4 rounded-lg py-3 sm:py-4">
                <h2 className="text-base sm:text-lg text-gray-900 mb-3">{t('pickUpWhereLeft')}</h2>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-300 p-3 animate-pulse">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-4 sm:h-5 bg-gray-200 rounded mb-1.5"></div>
                                <div className="h-3 bg-gray-200 rounded mb-1.5"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : topCompanies.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 text-center">
                        <p className="text-gray-600 text-sm">{t('noTopRated')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {topCompanies.map((company) => {
                            const ratingData = getCompanyRating(company.id);

                            return (
                                <Link
                                    key={company.id}
                                    href={`/bussiness/${company.id}`}
                                    className="bg-white rounded-xl border border-gray-300 p-2.5 sm:p-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-1.5 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg sm:text-xl font-bold text-white">
                                                {company.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-sm sm:text-base text-gray-900 mb-0.5 truncate">{company.name}</h3>
                                    <p className="text-gray-500 text-xs mb-1.5 truncate">{company.website}</p>
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <div className="flex">
                                            {renderStars(ratingData.rating)}
                                        </div>
                                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">{ratingData.rating.toFixed(1)}</span>
                                        <span className="text-gray-500 text-xs">({ratingData.reviewCount.toLocaleString()})</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* What are you looking for? */}
            <div className=" py-5 sm:py-8 -mx-4 sm:mx-0 px-4 sm:px-0 sm:rounded-lg">
                <div className="max-w-7xl mx-auto px-0 sm:px-3 lg:px-6">
                    <h2 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">{t('whatLookingFor')}</h2>

                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-3">
                        {categoryKeys.map((category) => {
                            const isActive = pathname?.includes(category.slug);
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl transition-all duration-300 transform hover:-translate-y-1.5 hover:rotate-2 hover:shadow-md hover:bg-white border border-transparent hover:border-blue-100 ${isActive
                                        ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm'
                                        : 'text-gray-700'
                                        }`}
                                >
                                    <span className="text-lg sm:text-xl md:text-2xl">{category.icon}</span>
                                    <p className="text-center text-[9px] sm:text-[10px] font-medium leading-tight">{tCat(category.key)}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="rounded-xl sm:rounded-2xl py-3 sm:py-4 px-3 sm:px-5 md:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 sm:mt-0" style={{ background: 'linear-gradient(to right, var(--gradient-from), var(--gradient-to))' }}>
                <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-0.5">
                        {t('lookingToGrow')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700">
                        {t('strengthenReputation')}
                    </p>
                </div>
                <Link
                    href={"/intro_bus"}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm transition whitespace-nowrap w-full sm:w-auto text-center font-semibold"
                >
                    {t('getStarted')}
                </Link>
            </div>
        </div>
    );
}
