"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Search_Header() {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className='m-0 p-0'>
            <main className="bg-gray-50 relative overflow-hidden pt-14 sm:pt-16">
                {/* Decorative circles - smaller on mobile */}
                <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-90 animate-[orbit_15s_linear_infinite]"></div>
                <div className="absolute bottom-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-tr from-blue-300 to-blue-400 rounded-full transform translate-x-1/3 translate-y-1/3 opacity-90 animate-[orbit_10s_linear_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-br from-green-400 to-green-500 rounded-full transform -translate-x-1/2 animate-[orbit_18s_linear_infinite]"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10 animate-fade-in-up">
                        Find a company you can trust
                        <br />
                        <span className="text-base sm:text-lg md:text-xl mt-4 sm:mt-8 md:mt-12 block text-gray-600">
                            Discover, read, and write reviews
                        </span>
                    </h1>

                    {/* Search Bar */}
                    <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-20 animate-fade-in-up-delay-1 px-2 sm:px-0" ref={searchBarRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search company or category"
                                className="w-full bg-white px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm sm:text-base md:text-lg shadow-lg"
                            />
                            <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-2 sm:p-3 rounded-full transition">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-gray-700 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 animate-fade-in-up-delay-2">
                        <span className="text-sm sm:text-base">Bought something recently?</span>
                        <Link href="#" className="text-[#5e5eff] hover:text-[#4d4dff] font-medium flex items-center gap-1 transition text-sm sm:text-base">
                            Write a review
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
