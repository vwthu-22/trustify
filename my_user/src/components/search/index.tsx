"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
            <main className="bg-gray-50 relative overflow-hidden pt-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-90 animate-[orbit_15s_linear_infinite]"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tr from-blue-300 to-blue-400 rounded-full transform translate-x-1/3 translate-y-1/3 opacity-90 animate-[orbit_10s_linear_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-400 to-green-500 rounded-full transform -translate-x-1/2 animate-[orbit_18s_linear_infinite]"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 animate-fade-in-up">
                        Find a company you can trust
                        <br />
                        <span className="text-xl mt-12 text-none  text-center">
                            Discover, read, and write reviews
                        </span>
                    </h1>
                    <div className="max-w-3xl mx-auto mb-20 animate-fade-in-up-delay-1" ref={searchBarRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search company or category"
                                className="w-full bg-white px-6 py-4 pr-16 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5e5eff] hover:bg-[#4d4dff] text-white p-3 rounded-full transition">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-gray-700 bg-white px-6 py-3 rounded-full border border-gray-200 animate-fade-in-up-delay-2">
                        <span>Bought something recently?</span>
                        <Link href="#" className="text-[#5e5eff] hover:text-[#4d4dff] font-medium flex items-center gap-1 transition">
                            Write a review
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

