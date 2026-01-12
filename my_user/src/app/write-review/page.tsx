'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star, Building2, ArrowRight, Info, X } from 'lucide-react';
import Link from 'next/link';
import useCompanyStore from '@/stores/companyStore/company';
import useUserAuthStore from '@/stores/userAuthStore/user';
import SuspensionBanner from '@/components/SuspensionBanner';
import { useTranslations } from 'next-intl';

export default function WriteReviewPage() {
    const { user } = useUserAuthStore();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { searchResults, isSearching, searchCompanies, clearSearchResults } = useCompanyStore();
    const t = useTranslations('writeReview');
    const tCat = useTranslations('categories');
    const tCommon = useTranslations('common');

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                searchCompanies(searchQuery);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            clearSearchResults();
        }
    }, [searchQuery, searchCompanies, clearSearchResults]);

    const handleCompanyClick = (companyId: string) => {
        router.push(`/bussiness/${companyId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                        <Star className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                        {t('title')}
                    </h1>
                    <p className="text-sm sm:text-base text-green-100 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                {(user?.status === 'SUSPENDED' || user?.status === 'INACTIVE') && (
                    <SuspensionBanner status={user?.status} />
                )}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {t('findCompany')}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {t('searchCompany')}
                    </p>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={t('typeCompanyName')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                        />
                    </div>

                    {/* Search Results */}
                    {searchQuery.length >= 2 && (
                        <div className="mt-3">
                            {isSearching ? (
                                <div className="py-6 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                                    <p className="text-gray-600 text-sm">{t('searching')}</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {searchResults.slice(0, 10).map((company) => (
                                        <button
                                            key={company.id}
                                            onClick={() => handleCompanyClick(company.id)}
                                            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold text-white">{company.name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-600 truncate">
                                                    {company.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {company.industry || company.website}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-600">{t('noCompaniesFound')} "{searchQuery}"</p>
                                    <p className="text-sm text-gray-500 mt-1">{t('tryDifferent')}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {searchQuery.length === 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-4 font-medium">{t('orBrowseByCategory')}</p>
                            <div className="flex flex-wrap gap-2">
                                {[{ key: 'bank', slug: 'bank' }, { key: 'travel', slug: 'travel' }, { key: 'electronics', slug: 'electronics' }, { key: 'fitness', slug: 'fitness' }, { key: 'clothing', slug: 'clothing' }].map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/category/${cat.slug.toLowerCase()}`}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
                                    >
                                        {tCat(cat.key)}
                                    </Link>
                                ))}
                                <Link
                                    href="/categories"
                                    className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full text-sm text-green-700 font-medium transition"
                                >
                                    {t('viewAllCategories')} →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* How it works */}
            <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('howItWorks')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 font-bold text-xl">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{t('step1Title')}</h3>
                        <p className="text-sm text-gray-600">{t('step1Desc')}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 font-bold text-xl">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{t('step2Title')}</h3>
                        <p className="text-sm text-gray-600">{t('step2Desc')}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 font-bold text-xl">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{t('step3Title')}</h3>
                        <p className="text-sm text-gray-600">{t('step3Desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
