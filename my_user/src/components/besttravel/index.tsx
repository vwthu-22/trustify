'use client'
import React from 'react';
import { ChevronLeft, ChevronRight, Landmark, Plane, Car, Sofa, Gem, Shirt, Laptop, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function Travel() {
    return (
        <div className=" rounded-md mt-10">
            <div className="px-4 sm:px-6 lg:px-6 rounded-lg py-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl text-gray-900">Best in Travel</h2>
                    <div className="flex items-center gap-2">
                        <button className="ml-2 px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium text-[#5e5eff]">
                            See more
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ width: "max-content" }}>
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
                </div>
            </div>
        </div>
    );
};