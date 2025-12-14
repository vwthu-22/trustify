'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import { getStarColor, STAR_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';

export default function Bank() {
    const { bankCompanies, isLoading, fetchBankCompanies } = useCompanyStore();
    const { companyRatings, fetchCompanyRatings } = useReviewStore();
    const t = useTranslations('home');

    useEffect(() => {
        fetchBankCompanies(0, 3);
    }, [fetchBankCompanies]);

    // Fetch ratings for bank companies
    useEffect(() => {
        if (bankCompanies && bankCompanies.length > 0) {
            const companyIds = bankCompanies.map(c => c.id);
            fetchCompanyRatings(companyIds);
        }
    }, [bankCompanies, fetchCompanyRatings]);

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
        <div className="rounded-md mt-8 sm:mt-12">
            <div className="px-0 sm:px-4 lg:px-6 rounded-lg py-4 sm:py-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl text-gray-900">{t('bestBanks')}</h2>
                    <Link
                        href="/category/bank"
                        className="px-3 sm:px-5 py-1.5 sm:py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition text-xs sm:text-sm font-medium text-[#5e5eff]"
                    >
                        {t('seeMore')}
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-300 p-4 animate-pulse">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-5 sm:h-6 bg-gray-200 rounded mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : bankCompanies.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-300 p-6 sm:p-8 text-center">
                        <p className="text-gray-600">{t('noBanksFound')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {bankCompanies.slice(0, 3).map((company) => {
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
        </div>
    );
}
