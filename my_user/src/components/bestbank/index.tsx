'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import useCompanyStore from '@/stores/companyStore/company';

export default function Bank() {
    const { bankCompanies, isLoading, fetchBankCompanies } = useCompanyStore();

    useEffect(() => {
        fetchBankCompanies(0, 3);
    }, [fetchBankCompanies]);

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-[#00b67a]' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    return (
        <div className="rounded-md mt-12">
            <div className="px-4 sm:px-6 lg:px-6 rounded-lg py-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl text-gray-900">Best in Bank</h2>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/category/bank"
                            className="ml-2 px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium text-[#5e5eff]"
                        >
                            See more
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ width: "max-content" }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-300 p-4 pe-32 animate-pulse">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : bankCompanies.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-300 p-8 text-center">
                        <p className="text-gray-600">No banks found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ width: "max-content" }}>
                        {bankCompanies.slice(0, 3).map((company) => (
                            <Link
                                key={company.id}
                                href={`/bussiness/${company.id}`}
                                className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md hover:-translate-y-2 transition-all duration-300 pe-32 cursor-pointer"
                            >
                                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-lg font-bold text-gray-800">
                                            {company.name.substring(0, 7).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg text-gray-900 mb-1 truncate">{company.name}</h3>
                                <p className="text-gray-500 text-sm mb-2 truncate">{company.website}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {renderStars(company.rating || 0)}
                                    </div>
                                    <span className="font-semibold text-gray-900">{(company.rating || 0).toFixed(1)}</span>
                                    <span className="text-gray-500 text-sm">{(company.reviewCount || 0).toLocaleString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}