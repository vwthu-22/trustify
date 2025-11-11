'use client'
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AboutReviews() {
    return (
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-3xl p-8 md:p-12 mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">We're Trustify</h2>
                            <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                                We're a review platform that's open to everyone. Our vision is to become the universal symbol of trust — by empowering people to shop with confidence, and helping companies improve.
                            </p>
                            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold transition">
                                What we do
                            </button>
                        </div>
                        <div className="bg-blue-900 text-white rounded-2xl p-8 relative overflow-hidden">
                            <h3 className="text-2xl font-bold mb-3">Our new Trust Report has landed!</h3>
                            <p className="mb-6 text-blue-50">
                                Find out which actions we've taken to protect you and promote trust on our platform.
                            </p>
                            <button className="border-2 border-white hover:bg-white hover:text-blue-900 text-white px-6 py-3 rounded-full font-semibold transition">
                                Take a look
                            </button>
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-400 rounded-full"></div>
                            <div className="absolute right-8 top-12 w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-blue-200">
                                <div className="w-full h-full bg-gray-100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Recent reviews</h2>
                        <div className="flex gap-2">
                            <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-start gap-3 mb-4">
                                <img
                                    src={'/avatars/anne.jpg'}
                                    alt={'Anne Brawley'}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Anne Brawley</h4>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                                I am so glad I decided to use Premier Pet Travel to transport my Frenchie from Malaga to Johannesburg last week. We arrived there on Tuesday at 16h00 and the staff were incredibly welcoming and professional. The entire process was smooth and stress-free.
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <img
                                    src={'/logos/premier.png'}
                                    alt={'Premier Pet Travel'}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <h5 className="font-semibold text-gray-900 text-sm">Premier Pet Travel</h5>
                                    <p className="text-gray-500 text-xs">premierpettravel.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-start gap-3 mb-4">
                                <img
                                    src={'/avatars/anne.jpg'}
                                    alt={'Anne Brawley'}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Anne Brawley</h4>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                                I am so glad I decided to use Premier Pet Travel to transport my Frenchie from Malaga to Johannesburg last week. We arrived there on Tuesday at 16h00 and the staff were incredibly welcoming and professional. The entire process was smooth and stress-free.
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <img
                                    src={'/logos/premier.png'}
                                    alt={'Premier Pet Travel'}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <h5 className="font-semibold text-gray-900 text-sm">Premier Pet Travel</h5>
                                    <p className="text-gray-500 text-xs">premierpettravel.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-start gap-3 mb-4">
                                <img
                                    src={'/avatars/anne.jpg'}
                                    alt={'Anne Brawley'}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Anne Brawley</h4>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                                I am so glad I decided to use Premier Pet Travel to transport my Frenchie from Malaga to Johannesburg last week. We arrived there on Tuesday at 16h00 and the staff were incredibly welcoming and professional. The entire process was smooth and stress-free.
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <img
                                    src={'/logos/premier.png'}
                                    alt={'Premier Pet Travel'}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <h5 className="font-semibold text-gray-900 text-sm">Premier Pet Travel</h5>
                                    <p className="text-gray-500 text-xs">premierpettravel.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-start gap-3 mb-4">
                                <img
                                    src={'/avatars/anne.jpg'}
                                    alt={'Anne Brawley'}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Anne Brawley</h4>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                                I am so glad I decided to use Premier Pet Travel to transport my Frenchie from Malaga to Johannesburg last week. We arrived there on Tuesday at 16h00 and the staff were incredibly welcoming and professional. The entire process was smooth and stress-free.
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <img
                                    src={'/logos/premier.png'}
                                    alt={'Premier Pet Travel'}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <h5 className="font-semibold text-gray-900 text-sm">Premier Pet Travel</h5>
                                    <p className="text-gray-500 text-xs">premierpettravel.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-start gap-3 mb-4">
                                <img
                                    src={'/avatars/anne.jpg'}
                                    alt={'Anne Brawley'}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">Anne Brawley</h4>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.7) ? 'text-[#00b67a]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                                I am so glad I decided to use Premier Pet Travel to transport my Frenchie from Malaga to Johannesburg last week. We arrived there on Tuesday at 16h00 and the staff were incredibly welcoming and professional. The entire process was smooth and stress-free.
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <img
                                    src={'/logos/premier.png'}
                                    alt={'Premier Pet Travel'}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <h5 className="font-semibold text-gray-900 text-sm">Premier Pet Travel</h5>
                                    <p className="text-gray-500 text-xs">premierpettravel.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};