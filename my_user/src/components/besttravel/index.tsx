'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import { getStarColor, STAR_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';

export default function Travel() {
    const { travelCompanies, isLoading, fetchTravelCompanies } = useCompanyStore();
    const { companyRatings, fetchCompanyRatings } = useReviewStore();
    const t = useTranslations('home');

    useEffect(() => {
        fetchTravelCompanies(0, 3);
    }, [fetchTravelCompanies]);

    // Fetch ratings for travel companies
    useEffect(() => {
        if (travelCompanies && travelCompanies.length > 0) {
            const companyIds = travelCompanies.map(c => c.id);
            fetchCompanyRatings(companyIds);
        }
    }, [travelCompanies, fetchCompanyRatings]);

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
        <div className="rounded-md mt-5 sm:mt-6">
            <div className="px-0 sm:px-3 lg:px-4 rounded-lg py-3 sm:py-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h2 className="text-base sm:text-lg text-gray-900">{t('bestTravel')}</h2>
                    <Link
                        href="/category/travel"
                        className="px-2.5 sm:px-4 py-1 sm:py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition text-xs font-medium text-[#5e5eff]"
                    >
                        {t('seeMore')}
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-300 p-3 animate-pulse">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-4 sm:h-5 bg-gray-200 rounded mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded mb-1.5"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : travelCompanies.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 text-center">
                        <p className="text-gray-600 text-sm">{t('noTravelFound')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {travelCompanies.slice(0, 3).map((company) => {
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
        </div>
    );
}
