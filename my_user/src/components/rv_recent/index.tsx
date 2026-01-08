'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import useReviewStore from '@/stores/reviewStore/review';
import { getStarColor, STAR_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';

export default function AboutReviews() {
    const { highRatedReviews, fetchHighRatedReviews } = useReviewStore();
    const [isLoading, setIsLoading] = useState(true);
    const [scrollIndex, setScrollIndex] = useState(0);

    // Fetch reviews using store
    useEffect(() => {
        const loadReviews = async () => {
            setIsLoading(true);
            await fetchHighRatedReviews();
            setIsLoading(false);
        };
        loadReviews();
    }, [fetchHighRatedReviews]);

    // Displayed reviews (4 at a time on desktop)
    const displayedReviews = useMemo(() => {
        if (highRatedReviews.length <= 4) return highRatedReviews;
        const start = scrollIndex % highRatedReviews.length;
        const result = [];
        for (let i = 0; i < 4; i++) {
            result.push(highRatedReviews[(start + i) % highRatedReviews.length]);
        }
        return result;
    }, [highRatedReviews, scrollIndex]);

    const handlePrev = () => {
        setScrollIndex((prev) => (prev - 1 + highRatedReviews.length) % highRatedReviews.length);
    };

    const handleNext = () => {
        setScrollIndex((prev) => (prev + 1) % highRatedReviews.length);
    };

    const renderStars = (rating: number) => {
        const starColor = getStarColor(rating);

        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? starColor : STAR_COLORS.empty}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    const getUserInitial = (name?: string, email?: string) => {
        if (name) return name.charAt(0).toUpperCase();
        if (email) return email.charAt(0).toUpperCase();
        return 'U';
    };

    const getAvatarColor = (index: number) => {
        const colors = ['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];
        return colors[index % colors.length];
    };

    const t = useTranslations('aboutSection');

    return (
        <div className="py-5 sm:py-8 md:py-10">
            <div className="max-w-7xl mx-auto px-0 sm:px-3 lg:px-6">
                {/* About Section */}
                <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center">
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('title')}</h2>
                            <p className="text-xs sm:text-sm md:text-base text-gray-800 mb-3 sm:mb-4 leading-relaxed">
                                {t('description')}
                            </p>
                            <Link
                                href="/about"
                                className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition"
                            >
                                {t('whatWeDo')}
                            </Link>
                        </div>
                        <div className="bg-blue-900 text-white rounded-lg sm:rounded-xl p-4 sm:p-6 relative overflow-hidden">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2 relative z-10">Our new Trust Report has landed!</h3>
                            <p className="mb-3 sm:mb-4 text-blue-50 text-xs sm:text-sm relative z-10">
                                Find out which actions we've<br />taken to protect you and promote trust on our platform.
                            </p>
                            <div className="absolute -right-3 -top-3 w-16 h-16 sm:w-24 sm:h-24 bg-blue-400 rounded-full"></div>
                            <div className="absolute right-5 sm:right-6 top-6 sm:top-8 w-12 h-12 sm:w-18 sm:h-18 bg-white rounded-full overflow-hidden border-3 border-blue-200">
                                <div className="w-full h-full bg-gray-100"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Reviews */}
                {/* <div>
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                            Recent Reviews
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={highRatedReviews.length <= 4}
                                className="p-2 sm:p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={highRatedReviews.length <= 4}
                                className="p-2 sm:p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 min-w-[280px] sm:min-w-[300px] lg:min-w-0 animate-pulse"
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : highRatedReviews.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <p className="text-gray-600">No reviews found yet.</p>
                        </div>
                    ) : (
                       
                        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible scrollbar-hide">
                            {displayedReviews.map((review, index) => (
                                <Link
                                    key={`${review.id}-${index}`}
                                    href={review.companyId ? `/bussiness/${review.companyId}` : '#'}
                                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 min-w-[280px] sm:min-w-[300px] lg:min-w-0 snap-start flex-shrink-0 lg:flex-shrink block"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-bold text-sm sm:text-base`}>
                                            {getUserInitial(review.userName, review.userEmail)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                                {review.userName || 'Anonymous'}
                                            </h4>
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="font-medium text-gray-900 text-sm mb-1 truncate">
                                        {review.title}
                                    </h5>
                                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                                        {review.description}
                                    </p>
                                    {review.companyName && (
                                        <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                                                {review.company?.logoUrl ? (
                                                    <img src={review.company.logoUrl} alt={review.companyName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-600">
                                                        {review.companyName.substring(0, 2).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{review.companyName}</h5>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    );
}