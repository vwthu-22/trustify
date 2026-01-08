'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Star, SlidersHorizontal, MapPin, ExternalLink } from 'lucide-react';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import Link from 'next/link';
import { getStarFillColor, STAR_FILL_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';

// Constant mapping - defined outside component to avoid recreating on each render
const CATEGORY_MAP: { [key: string]: { name: string; key: string } } = {
  'bank': { name: 'Bank', key: 'bank' },
  'travel': { name: 'Travel', key: 'travel' },
  'car-dealer': { name: 'Car Dealer', key: 'carDealer' },
  'furniture-store': { name: 'Furniture Store', key: 'furniture' },
  'jewelry-store': { name: 'Jewelry Store', key: 'jewelry' },
  'clothing-store': { name: 'Clothing Store', key: 'clothing' },
  'electronics': { name: 'Electronics & Technology', key: 'electronics' },
  'fitness': { name: 'Fitness and Nutrition Service', key: 'fitness' }
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const t = useTranslations('categoryPage');
  const tCat = useTranslations('categories');
  const tHome = useTranslations('home');
  const tReview = useTranslations('review');

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('most-relevant');

  const { companies, isLoading, error, fetchCompaniesByIndustry } = useCompanyStore();
  const { companyRatings, fetchCompanyRatings } = useReviewStore();

  const category = CATEGORY_MAP[slug];

  useEffect(() => {
    if (!category) {
      router.push('/404');
    }
  }, [category, router]);

  useEffect(() => {
    if (category && slug) {
      fetchCompaniesByIndustry(category.name, page, 4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, page]);

  // Fetch ratings for companies when they load
  useEffect(() => {
    if (companies && companies.length > 0) {
      const companyIds = companies.map(c => c.id);
      fetchCompanyRatings(companyIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);

  // Helper function to get rating data for a company
  const getCompanyRating = (companyId: string) => {
    return companyRatings[companyId] || { rating: 0, reviewCount: 0 };
  };

  const renderStars = (rating: number) => {
    const starColor = getStarFillColor(rating);

    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`sm:w-[18px] sm:h-[18px] ${i < Math.floor(rating) ? starColor : STAR_FILL_COLORS.empty}`}
      />
    ));
  };

  // Sort companies based on sortBy selection
  const sortedCompanies = useMemo(() => {
    if (!companies || companies.length === 0) return [];

    const companiesWithRatings = companies.map(company => ({
      ...company,
      ratingData: companyRatings[company.id] || { rating: 0, reviewCount: 0 }
    }));

    switch (sortBy) {
      case 'highest-rated':
        return [...companiesWithRatings].sort((a, b) => b.ratingData.rating - a.ratingData.rating);
      case 'most-reviewed':
        return [...companiesWithRatings].sort((a, b) => b.ratingData.reviewCount - a.ratingData.reviewCount);
      case 'newest':
        // Assuming newer companies have higher IDs, or sort by createdAt if available
        return [...companiesWithRatings].sort((a, b) => Number(b.id) - Number(a.id));
      case 'most-relevant':
      default:
        // Default order from API
        return companiesWithRatings;
    }
  }, [companies, companyRatings, sortBy]);

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('bestIn')} {tCat(category.key)}</h1>

          {/* Filter Buttons - Scrollable on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <SlidersHorizontal size={14} className="sm:w-4 sm:h-4" />
              <span>{t('allFilters')}</span>
            </button>
            <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <Star size={14} className="sm:w-4 sm:h-4" />
              <span>{t('rating')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Header with Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">
            {t('companies')} ({isLoading ? '...' : sortedCompanies.length.toLocaleString()})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 sm:py-1.5 bg-white cursor-pointer text-xs sm:text-sm"
            >
              <option value="highest-rated">{t('highestRated')}</option>
              <option value="most-reviewed">{t('mostReviewed')}</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedCompanies.length === 0 ? (
          <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
            <p className="text-gray-600 text-sm">{t('noCompaniesInCategory')}</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sortedCompanies.map((company) => {
              const ratingData = company.ratingData;

              return (
                <Link
                  key={company.id}
                  href={`/bussiness/${company.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl" />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                          <span className="text-2xl sm:text-3xl font-bold text-white">{company.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {company.verified && (
                        <span className="inline-block text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded mb-1 sm:mb-2">
                          {tReview('verified')}
                        </span>
                      )}

                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{company.name}</h3>

                      <div className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-xs sm:text-sm mb-2 sm:mb-3">
                        <span className="truncate">{company.website}</span>
                        <ExternalLink size={12} className="flex-shrink-0" />
                      </div>

                      {/* Rating - using data from store */}
                      {ratingData.reviewCount > 0 ? (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                          <div className="flex items-center gap-0.5">
                            {renderStars(ratingData.rating)}
                          </div>
                          <span className="font-bold text-gray-900 text-sm sm:text-base">{ratingData.rating.toFixed(1)}</span>
                          <span className="text-gray-600 text-xs sm:text-sm">·</span>
                          <span className="text-gray-900 font-medium text-xs sm:text-sm">
                            {ratingData.reviewCount.toLocaleString()} {tReview('reviews')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2 sm:mb-4">
                          <div className="flex items-center gap-0.5">
                            {renderStars(0)}
                          </div>
                          <span className="text-gray-500 text-xs sm:text-sm italic">{tReview('noReviews')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && sortedCompanies.length > 0 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              {t('previous')}
            </button>
            <span className="px-3 sm:px-4 py-2 text-gray-600 text-sm">
              {t('page')} {page + 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={sortedCompanies.length < 4}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
