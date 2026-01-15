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
// The 'name' field must match EXACTLY what's stored in the database 'industry' column
const CATEGORY_MAP: { [key: string]: { name: string; key: string } } = {
  'bank': { name: 'bank', key: 'bank' },
  'travel': { name: 'travel', key: 'travel' },
  'car-dealer': { name: 'car-dealer', key: 'carDealer' },
  'furniture-store': { name: 'furniture-store', key: 'furniture' },
  'jewelry-store': { name: 'jewelry-store', key: 'jewelry' },
  'clothing-store': { name: 'clothing-store', key: 'clothing' },
  'electronics': { name: 'electronics', key: 'electronics' },
  'fitness': { name: 'fitness', key: 'fitness' }
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
        size={16}
        className={`${i < Math.floor(rating) ? starColor : STAR_FILL_COLORS.empty}`}
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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header - Compact */}
      <div className="border-b" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5">
          <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {t('bestIn')} {tCat(category.key)}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {/* Header with Sort - Refined */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {isLoading ? '...' : `${sortedCompanies.length} ${t('companies')}`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-2.5 py-1.5 cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            >
              <option value="highest-rated">{t('highestRated')}</option>
              <option value="most-reviewed">{t('mostReviewed')}</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Loading State - Compact */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg p-4 animate-pulse" style={{ background: 'var(--card-bg)' }}>
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedCompanies.length === 0 ? (
          <div className="rounded-lg p-8 text-center" style={{ background: 'var(--card-bg)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('noCompaniesInCategory')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCompanies.map((company) => {
              const ratingData = company.ratingData;

              return (
                <Link
                  key={company.id}
                  href={`/bussiness/${company.id}`}
                  className="block rounded-lg p-4 hover:shadow-md transition-all"
                  style={{ background: 'var(--card-bg)', borderWidth: '1px', borderColor: 'var(--card-border)' }}
                >
                  <div className="flex gap-4">
                    {/* Logo - Compact */}
                    <div className="flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-14 h-14 object-cover rounded-lg" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                          <span className="text-xl font-bold text-white">{company.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    {/* Content - Refined */}
                    <div className="flex-1 min-w-0">
                      {company.verified && (
                        <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded mb-1">
                          {tReview('verified')}
                        </span>
                      )}

                      <h3 className="text-base font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                        {company.name}
                      </h3>

                      <div className="flex items-center gap-1 hover:text-blue-600 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                        <span className="truncate">{company.website}</span>
                        <ExternalLink size={12} className="flex-shrink-0" />
                      </div>

                      {/* Rating - Compact */}
                      {ratingData.reviewCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(ratingData.rating)}
                          </div>
                          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {ratingData.rating.toFixed(1)}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {ratingData.reviewCount.toLocaleString()} {tReview('reviews')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(0)}
                          </div>
                          <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>{tReview('noReviews')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination - Compact */}
        {!isLoading && sortedCompanies.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            >
              {t('previous')}
            </button>
            <span className="px-3 py-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('page')} {page + 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={sortedCompanies.length < 4}
              className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
