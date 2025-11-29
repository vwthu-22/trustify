'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star, SlidersHorizontal, MapPin, ExternalLink } from 'lucide-react';
import useCompanyStore from '@/stores/companyStore/company';

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={i < Math.floor(rating) ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'}
      />
    ));
  };

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition">
              <SlidersHorizontal size={18} />
              <span>All filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition">
              <Star size={18} />
              <span>Rating</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Companies ({isLoading ? '...' : companies.length.toLocaleString()})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer"
                >
                  <option value="most-relevant">Most relevant</option>
                  <option value="highest-rated">Highest rated</option>
                  <option value="most-reviewed">Most reviewed</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : companies.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600">No companies found in this category.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {companies.map((company) => (
                  <div key={company.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-20 h-20 object-contain" />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-1 p-3">
                              {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-white rounded-sm"></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        {company.verified && (
                          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded mb-2">
                            VERIFIED
                          </span>
                        )}

                        <h3 className="text-xl font-bold text-gray-900 mb-1">{company.name}</h3>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1 mb-3"
                        >
                          {company.website}
                          <ExternalLink size={14} />
                        </a>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded">
                            {renderStars(company.rating || 0)}
                          </div>
                          <span className="font-bold text-gray-900">{(company.rating || 0).toFixed(1)}</span>
                          <span className="text-gray-600">·</span>
                          <a href="#" className="text-gray-900 hover:underline font-medium">
                            {(company.reviewCount || 0).toLocaleString()} reviews
                          </a>
                        </div>

                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                          <span>{company.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && companies.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {page + 1}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={companies.length < 4}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <span className="text-green-500">↪</span>
          {subtitle}
        </p>
      </div>
    </a>
  );
}
