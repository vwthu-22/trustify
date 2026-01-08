'use client';

import React, { useEffect, useMemo } from 'react';
import useCompanyStore from '@/stores/companyStore/company';

export default function BrandMarquee() {
    const { companies, fetchCompanies, isLoading } = useCompanyStore();

    useEffect(() => {
        // Fetch a good number of companies for the marquee
        fetchCompanies({ limit: 30 });
    }, [fetchCompanies]);

    // Filter companies that have logos and duplicate for infinite effect
    const brandsList = useMemo(() => {
        const withLogos = companies.filter(c => c.logo);
        // If we don't have enough companies, just return whatever we have duplicated
        return [...withLogos, ...withLogos];
    }, [companies]);

    if (isLoading && brandsList.length === 0) {
        return (
            <div className="w-full h-32 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 my-8">
                <div className="animate-pulse flex space-x-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-12 w-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (brandsList.length === 0) return null;

    return (
        <div className="w-full py-3 sm:py-4 overflow-hidden bg-white rounded-xl sm:rounded-2xl border border-gray-100 my-4 sm:my-6 shadow-sm">
            <div className="flex animate-marquee whitespace-nowrap gap-8 sm:gap-14 items-center">
                {brandsList.map((brand, index) => (
                    <div
                        key={`${brand.id}-${index}`}
                        className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105 cursor-pointer px-1"
                        title={brand.name}
                    >
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-6 sm:h-8 w-auto max-w-[100px] object-contain transition-opacity opacity-70 hover:opacity-100"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=random&color=fff`;
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
