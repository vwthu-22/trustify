"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useCompanyStore from '@/stores/companyStore/company';

export default function Search_Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const t = useTranslations('home');
    const tHeader = useTranslations('header');
    const tSearch = useTranslations('search');

    const { companies, isLoading, searchCompanies } = useCompanyStore();

    // Handle scroll to show/hide search bar
    useEffect(() => {
        const handleScroll = () => {
            if (searchBarRef.current) {
                const rect = searchBarRef.current.getBoundingClientRect();
                const isVisible = rect.bottom > 0;
                setShowSearchBar(!isVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                searchCompanies(searchQuery);
                setShowDropdown(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setShowDropdown(false);
        }
    }, [searchQuery, searchCompanies]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCompanyClick = (companyId: string) => {
        setShowDropdown(false);
        setSearchQuery('');
        router.push(`/bussiness/${companyId}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.length >= 2) {
            router.push(`/write-review?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className='m-0 p-0'>
            <main className="bg-gray-50 relative overflow-hidden pt-14 sm:pt-16">
                {/* Decorative circles - smaller on mobile */}
                <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-90 animate-[orbit_15s_linear_infinite]"></div>
                <div className="absolute bottom-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-tr from-blue-300 to-blue-400 rounded-full transform translate-x-1/3 translate-y-1/3 opacity-90 animate-[orbit_10s_linear_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-br from-green-400 to-green-500 rounded-full transform -translate-x-1/2 animate-[orbit_18s_linear_infinite]"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10 animate-fade-in-up">
                        {t('heroTitle')}
                        <br />
                        <span className="text-base sm:text-lg md:text-xl mt-4 sm:mt-8 md:mt-12 block text-gray-600">
                            {t('heroSubtitle')}
                        </span>
                    </h1>

                    {/* Search Bar with Dropdown */}
                    <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-20 animate-fade-in-up-delay-1 px-2 sm:px-0" ref={searchBarRef}>
                        <div className="relative" ref={dropdownRef}>
                            <form onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder={tHeader('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                                    className="w-full bg-white px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm sm:text-base md:text-lg shadow-lg"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-2 sm:p-3 rounded-full transition"
                                >
                                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </form>

                            {/* Search Results Dropdown */}
                            {showDropdown && searchQuery.length >= 2 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                                    {isLoading ? (
                                        <div className="py-8 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                            <p className="text-gray-600">{tSearch('searching')}</p>
                                        </div>
                                    ) : companies.length > 0 ? (
                                        <div className="p-2">
                                            {companies.slice(0, 8).map((company) => (
                                                <button
                                                    key={company.id}
                                                    onClick={() => handleCompanyClick(company.id)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition text-left group"
                                                >
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {company.logo ? (
                                                            <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Building2 className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate text-sm sm:text-base">
                                                            {company.name}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                            {company.industry || company.website}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition flex-shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-600">{tSearch('noResults')} "{searchQuery}"</p>
                                            <Link
                                                href="/write-review"
                                                className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                {tSearch('writeReviewForNew')} →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-gray-700 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 animate-fade-in-up-delay-2">
                        <span className="text-sm sm:text-base">{t('boughtRecently')}</span>
                        <Link href="/write-review" className="text-[#5e5eff] hover:text-[#4d4dff] font-medium flex items-center gap-1 transition text-sm sm:text-base">
                            {tHeader('writeReview')}
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
