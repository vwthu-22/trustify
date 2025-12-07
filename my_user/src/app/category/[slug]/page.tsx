'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star, SlidersHorizontal, MapPin, ExternalLink } from 'lucide-react';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import Link from 'next/link';
import { getStarFillColor, STAR_FILL_COLORS } from '@/utils/ratingColors';

const CATEGORIES = {
  'bank': {
    name: 'Bank',
    title: 'Best in Bank',
  },
  'travel': {
    name: 'Travel',
    title: 'Best in Travel',
  },
  'car-dealer': {
    name: 'Car Dealer',
    title: 'Best in Car Dealer',
  },
  'furniture-store': {
    name: 'Furniture Store',
    title: 'Best in Furniture Store',
  },
  'jewelry-store': {
    name: 'Jewelry Store',
    title: 'Best in Jewelry Store',
  },
  'clothing-store': {
    name: 'Clothing Store',
    title: 'Best in Clothing Store',
  },
  'electronics': {
    name: 'Electronics & Technology',
    title: 'Best in Electronics',
  },
  'fitness': {
    name: 'Fitness and Nutrition Service',
    title: 'Best in Fitness',
  }
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('most-relevant');

  const { companies, isLoading, error, fetchCompaniesByIndustry } = useCompanyStore();
  const { companyRatings, fetchCompanyRatings } = useReviewStore();

  const category = CATEGORIES[slug as keyof typeof CATEGORIES];

  useEffect(() => {
    if (!category) {
      router.push('/404');
    }
  }, [category, router]);

  useEffect(() => {
    if (category) {
      const industryName = category.name;
      fetchCompaniesByIndustry(industryName, page, 4);
    }
  }, [slug, page, category, fetchCompaniesByIndustry]);

  // Fetch ratings for companies when they load
  useEffect(() => {
    if (companies && companies.length > 0) {
      const companyIds = companies.map(c => c.id);
      fetchCompanyRatings(companyIds);
    }
  }, [companies, fetchCompanyRatings]);

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

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-14 sm:pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{category.title}</h1>

          {/* Filter Buttons - Scrollable on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition text-sm whitespace-nowrap flex-shrink-0">
              <SlidersHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>All filters</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition text-sm whitespace-nowrap flex-shrink-0">
              <Star size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Rating</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header with Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Companies ({isLoading ? '...' : companies.length.toLocaleString()})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-white cursor-pointer text-sm"
            >
              <option value="most-relevant">Most relevant</option>
              <option value="highest-rated">Highest rated</option>
              <option value="most-reviewed">Most reviewed</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 sm:p-6 animate-pulse">
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
            <p className="text-gray-600">No companies found in this category.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {companies.map((company) => {
              const ratingData = getCompanyRating(company.id);

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
                        <img src={company.logo} alt={company.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg font-bold text-gray-800">{company.name.substring(0, 7).toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {company.verified && (
                        <span className="inline-block text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded mb-1 sm:mb-2">
                          VERIFIED
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
                            {ratingData.reviewCount.toLocaleString()} reviews
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2 sm:mb-4">
                          <div className="flex items-center gap-0.5">
                            {renderStars(0)}
                          </div>
                          <span className="text-gray-500 text-xs sm:text-sm italic">No reviews yet</span>
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
        {!isLoading && companies.length > 0 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              Previous
            </button>
            <span className="px-3 sm:px-4 py-2 text-gray-600 text-sm">
              Page {page + 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={companies.length < 4}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
