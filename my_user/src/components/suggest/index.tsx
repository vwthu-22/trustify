'use client'
import React from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';
import Link from 'next/link';

export default function Suggest() {
    return (
        <div className=" rounded-md mt-10">
            <div className="px-4 sm:px-6 lg:px-6 rounded-lg py-6">
                <h2 className="text-2xl  text-gray-900 mb-4">Pick up where you left off</h2>
                <Link href={'/bussiness'} className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ width: "max-content" }}>
                    <div className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md hover:-translate-y-2 transition-all duration-300 pe-32 cursor-pointer">
                        <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-lg font-bold text-gray-800">LANDING</span>
                        </div>
                        <h3 className="text-lg text-gray-900 mb-1">Landing</h3>
                        <p className="text-gray-500 text-sm mb-2">hellolanding.com</p>
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="font-semibold text-gray-900">4.7</span>
                            <span className="text-gray-500 text-sm">2464</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md hover:-translate-y-2 transition-all duration-300 pe-32 cursor-pointer">
                        <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-lg font-bold text-gray-800">LANDING</span>
                        </div>
                        <h3 className="text-lg text-gray-900 mb-1">Landing</h3>
                        <p className="text-gray-500 text-sm mb-2">hellolanding.com</p>
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="font-semibold text-gray-900">4.7</span>
                            <span className="text-gray-500 text-sm">2464</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-md hover:-translate-y-2 transition-all duration-300 pe-32 cursor-pointer">
                        <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-lg font-bold text-gray-800">LANDING</span>
                        </div>
                        <h3 className="text-lg text-gray-900 mb-1">Landing</h3>
                        <p className="text-gray-500 text-sm mb-2">hellolanding.com</p>
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="font-semibold text-gray-900">4.7</span>
                            <span className="text-gray-500 text-sm">2464</span>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl text-gray-900">What are you looking for?</h2>
                        <div className="flex items-center gap-2">
                            <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <button className="ml-2 px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium text-[#5e5eff]">
                                See more
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <Link href="#" className="flex flex-col items-center justify-center gap-1.5 hover:bg-gray-50 p-3 rounded-lg transition">
                            <svg className='w-8 h-8 text-gray-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM4 8.23607V9H20V8.23607L12 4.23607L4 8.23607ZM12 8C11.4477 8 11 7.55228 11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7C13 7.55228 12.5523 8 12 8Z"></path></svg>
                            <p className='text-center text-xs font-medium text-gray-700'>Bank</p>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-pink-200 via-pink-100 to-purple-100 rounded-3xl py-4 md:py-6 px-6 md:px-8 flex items-center justify-between">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        Looking to grow your business?
                    </h3>
                    <p className="text-md text-gray-700">
                        Strengthen your reputation with reviews on Trustify.
                    </p>
                </div>
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full text-lg transition whitespace-nowrap ml-4">
                    Get started
                </button>
            </div>
        </div>
    );
};