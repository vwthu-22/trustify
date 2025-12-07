'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import useCompanyStore from '@/stores/companyStore/company';

export default function WriteReviewPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { companies, isLoading, searchCompanies } = useCompanyStore();

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                searchCompanies(searchQuery);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, searchCompanies]);

    const handleCompanyClick = (companyId: string) => {
        router.push(`/bussiness/${companyId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                        <Star className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Write a Review
                    </h1>
                    <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
                        Share your experience and help others make better decisions. Your voice matters!
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Find a Company
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Search for the company you want to review
                    </p>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Type company name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base sm:text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Search Results */}
                    {searchQuery.length >= 2 && (
                        <div className="mt-4">
                            {isLoading ? (
                                <div className="py-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                                    <p className="text-gray-600">Searching...</p>
                                </div>
                            ) : companies.length > 0 ? (
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {companies.slice(0, 10).map((company) => (
                                        <button
                                            key={company.id}
                                            onClick={() => handleCompanyClick(company.id)}
                                            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition text-left group"
                                        >
                                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <Building2 className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 truncate">
                                                    {company.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {company.industry || company.website}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-600">No companies found for "{searchQuery}"</p>
                                    <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                                </div>
                            )}
                        </div>
                    )}

                    {searchQuery.length === 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-4 font-medium">Or browse by category:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Bank', 'Travel', 'Electronics', 'Fitness', 'Clothing'].map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`/category/${cat.toLowerCase()}`}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                                <Link
                                    href="/categories"
                                    className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full text-sm text-green-700 font-medium transition"
                                >
                                    View all categories →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* How it works */}
            <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 font-bold text-xl">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Find the company</h3>
                        <p className="text-sm text-gray-600">Search for the business you want to review</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 font-bold text-xl">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Rate your experience</h3>
                        <p className="text-sm text-gray-600">Give it a star rating from 1 to 5</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 font-bold text-xl">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Share your story</h3>
                        <p className="text-sm text-gray-600">Write about your experience to help others</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
