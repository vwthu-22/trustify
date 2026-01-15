'use client';

import React, { useEffect, useMemo } from 'react';
import useCompanyStore from '@/stores/companyStore/company';

export default function BrandMarquee() {
    const { companies, fetchCompanies, isLoading } = useCompanyStore();

    useEffect(() => {
        // Fetch a good number of companies for the marquee
        fetchCompanies({ limit: 30 });
    }, [fetchCompanies]);

    // Filter companies that have logos - no duplicates
    const brandsList = useMemo(() => {
        return companies.filter(c => c.logo);
    }, [companies]);

    // Get unique companies (no duplicates) for display count
    const uniqueCompanies = useMemo(() => {
        return companies.filter(c => c.logo);
    }, [companies]);

    if (isLoading && brandsList.length === 0) {
        return (
            <div className="w-full h-20 flex items-center justify-center my-4">
                <div className="animate-pulse flex space-x-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (uniqueCompanies.length === 0) return null;

    return (
        <div className="brand-marquee-container w-full py-3 sm:py-4 overflow-hidden my-4 sm:my-6">
            <div className="flex animate-marquee whitespace-nowrap gap-4 sm:gap-8 items-center">
                {brandsList.map((brand, index) => (
                    <div
                        key={`${brand.id}-${index}`}
                        className="flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer flex-shrink-0"
                        title={brand.name}
                    >
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-10 sm:h-12 rounded-md w-auto max-w-[140px] object-contain"
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
