'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, ExternalLink, Star, MessageCircle, Info, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, Filter, ChevronDown, Search, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import WriteReviewModal from '../../cmt/page';
import ThankYouModal from '../../thankyou/page';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import { getStarColor, getBarColor, getRatingLabel, STAR_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';

export default function CompanyReviewPage() {
    const params = useParams();
    const businessId = params.bussinessid as string;
    const t = useTranslations('company');
    const tReview = useTranslations('review');
    const tHeader = useTranslations('header');
    const tCommon = useTranslations('common');

    const { currentCompany, isLoading, error, fetchCompanyById } = useCompanyStore();
    const {
        reviews,
        allReviews,
        isLoading: reviewsLoading,
        fetchReviewsByCompany,
        fetchAllReviewsByCompany,
        currentPage,
        totalPages
    } = useReviewStore();

    // Helper function to convert industry name to category slug
    const getIndustrySlug = (industry: string) => {
        const industryMap: { [key: string]: string } = {
            'Bank': 'bank',
            'Travel': 'travel',
            'Car Dealer': 'car-dealer',
            'Furniture Store': 'furniture-store',
            'Jewelry Store': 'jewelry-store',
            'Clothing Store': 'clothing-store',
            'Electronics & Technology': 'electronics',
            'Fitness and Nutrition Service': 'fitness'
        };
        return industryMap[industry] || 'bank'; // default to 'bank' if not found
    };

    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState(null);

    useEffect(() => {
        if (businessId) {
            fetchCompanyById(businessId);
            fetchReviewsByCompany(businessId, currentReviewPage, 10);
        }
    }, [businessId, currentReviewPage, fetchCompanyById, fetchReviewsByCompany]);

    // Fetch all reviews for rating breakdown calculation using store
    useEffect(() => {
        if (businessId) {
            fetchAllReviewsByCompany(businessId);
        }
    }, [businessId, fetchAllReviewsByCompany]);

    // Filter reviews by selected stars
    const filteredReviews = selectedFilters.length > 0
        ? reviews.filter(review => selectedFilters.includes(review.rating))
        : reviews;

    // Search reviews by keyword
    const searchedReviews = searchKeyword
        ? filteredReviews.filter(review =>
            review.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            review.description.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        : filteredReviews;

    const loadMoreReviews = () => {
        if (currentReviewPage < totalPages - 1) {
            setCurrentReviewPage(prev => prev + 1);
        }
    };

    const loadPreviousReviews = () => {
        if (currentReviewPage > 0) {
            setCurrentReviewPage(prev => prev - 1);
        }
    };

    const renderStars = (rating: number, size: string = 'w-5 h-5') => {
        const starColor = getStarColor(rating);

        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`${size} ${i < Math.floor(rating) ? starColor : STAR_COLORS.empty}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    const handleSubmitSuccess = (data: React.SetStateAction<null>) => {
        setReviewData(data);
        setIsThankYouModalOpen(true);
        // Refresh reviews after successful submission
        if (businessId) {
            fetchReviewsByCompany(businessId, 0, 10);
            // Also refresh all reviews to update rating statistics
            fetchAllReviewsByCompany(businessId);
        }
    };

    // Calculate actual rating and review count from allReviews
    const actualReviewCount = allReviews.length;
    const actualRating = actualReviewCount > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / actualReviewCount
        : 0;

    // Calculate rating breakdown from actual reviews
    const calculateRatingBreakdown = () => {
        if (allReviews.length === 0) {
            return [
                { stars: 5, count: 0, percentage: 0 },
                { stars: 4, count: 0, percentage: 0 },
                { stars: 3, count: 0, percentage: 0 },
                { stars: 2, count: 0, percentage: 0 },
                { stars: 1, count: 0, percentage: 0 }
            ];
        }

        // Count reviews for each star rating from all reviews
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        allReviews.forEach(review => {
            const rating = Math.floor(review.rating);
            if (rating >= 1 && rating <= 5) {
                counts[rating as keyof typeof counts]++;
            }
        });

        // Calculate percentages based on all reviews fetched
        const totalFetched = allReviews.length;
        return [5, 4, 3, 2, 1].map(stars => ({
            stars,
            count: counts[stars as keyof typeof counts],
            percentage: totalFetched > 0
                ? Math.round((counts[stars as keyof typeof counts] / totalFetched) * 100)
                : 0
        }));
    };

    const ratingFilters = calculateRatingBreakdown();

    // Calculate reply stats from reviews
    const calculateReplyStats = () => {
        if (allReviews.length === 0) {
            return { negativeTotal: 0, negativeReplied: 0, replyPercentage: 0 };
        }

        // Negative reviews are 1-2 stars
        const negativeReviews = allReviews.filter(r => r.rating <= 2);
        const negativeTotal = negativeReviews.length;
        // Count replied reviews (has reply field or status !== 'PENDING')
        const negativeReplied = negativeReviews.filter(r =>
            r.reply || r.replyContent || (r.status && r.status.toLowerCase() !== 'pending')
        ).length;
        const replyPercentage = negativeTotal > 0
            ? Math.round((negativeReplied / negativeTotal) * 100)
            : 0;

        return { negativeTotal, negativeReplied, replyPercentage };
    };

    const replyStats = calculateReplyStats();

    const topMentions = [
        'Location', 'Staff', 'Customer service', 'Service',
        'Booking process', 'Facilities', 'Solution', 'Application',
        'Holidays', 'Recommendation'
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('loadingDetails')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchCompanyById(businessId)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {tCommon('retry')}
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCompany) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">{t('companyNotFound')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* First Grid - Company Info and Rating Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-16 sm:mt-20">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Company Header */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {currentCompany.logo ? (
                                        <img src={currentCompany.logo} alt={currentCompany.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-sm sm:text-lg font-bold text-gray-800">{currentCompany.name?.substring(0, 7).toUpperCase() || 'COMPANY'}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{currentCompany.name}</h1>
                                        {currentCompany.claimed && (
                                            <span className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 border border-gray-300 rounded-full text-xs sm:text-sm">
                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                {t('claimed')}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/category/${getIndustrySlug(currentCompany.industry || '')}`}
                                        className="text-blue-600 hover:underline text-sm sm:text-base"
                                    >
                                        {currentCompany.industry || 'Company'}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <button
                                    onClick={() => setIsWriteModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-full transition flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span className="hidden sm:inline">{tHeader('writeReview')}</span>
                                    <span className="sm:hidden">{tReview('review')}</span>
                                </button>

                                <a
                                    href={`https://${currentCompany.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-gray-300 hover:bg-gray-50 px-3 sm:px-4 py-2 rounded-full transition flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <span className="hidden sm:inline">{t('visitWebsite')}</span>
                                    <span className="sm:hidden">{t('website')}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-gray-700">{t('noIncentives')}</p>
                        </div>

                        {/* Company Details */}
                        <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
                            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('companyDetails')}</h3>
                                <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                    {t('activeSubscription')}
                                </span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                                <h4 className="font-bold text-base sm:text-lg mb-2">{t('about')} {currentCompany.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{t('writtenByCompany')}</p>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                    {currentCompany.description || t('noDescription')}
                                </p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{t('contactInfo')}</h3>
                            <div className="space-y-2 sm:space-y-3">
                                {currentCompany.address && (
                                    <div className="flex items-start gap-2 sm:gap-3 text-gray-700">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm sm:text-base">{currentCompany.address}</span>
                                    </div>
                                )}
                                {currentCompany.website && (
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                        <Link href={`https://${currentCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-blue-600 text-sm sm:text-base break-all">{currentCompany.website}</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, shown at bottom for mobile */}
                    <div className="lg:col-span-1 order-first lg:order-last">
                        <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-6">
                            {/* Rating Card */}
                            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl sm:text-5xl font-bold">{actualRating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <span className="font-semibold text-sm sm:text-base">
                                        {getRatingLabel(actualRating)}
                                    </span>
                                </div>
                                <div className="flex mb-3 sm:mb-4">{renderStars(actualRating, 'w-4 h-4 sm:w-5 sm:h-5')}</div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{actualReviewCount.toLocaleString()} {tReview('reviews')}</p>

                                {/* Rating Breakdown */}
                                <div className="space-y-2 mb-4 sm:mb-6">
                                    {ratingFilters.map((item) => (
                                        <div key={item.stars} className="flex items-center gap-2 sm:gap-3">
                                            <span className="text-xs sm:text-sm w-10 sm:w-12">{item.stars}-star</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                <div
                                                    className={`h-1.5 sm:h-2 rounded-full ${getBarColor(item.stars)}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:underline">{t('howTrustScore')}</Link>
                            </div>

                            {/* Reply Stats */}
                            {replyStats.negativeTotal > 0 && (
                                <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-6 hidden lg:block">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-semibold text-sm sm:text-base mb-1">
                                                {replyStats.replyPercentage}% {t('repliedToNegative')}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                {replyStats.negativeReplied} / {replyStats.negativeTotal} negative reviews replied
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* How Company Uses - Hidden on mobile
                            <Link href="#" className="hidden lg:flex items-center gap-1 text-xs sm:text-sm text-gray-900 hover:underline">
                                How this company uses Trustify
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Link> */}
                        </div>
                    </div>
                </div>

                {/* Second Grid - Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10 sm:mt-20">
                    {/* Left Sidebar - Filters */}
                    <div className="lg:col-span-1">
                        {/* Rating Header */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#5aa5df]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-3xl sm:text-4xl font-bold">{actualRating.toFixed(1)}</span>
                        </div>

                        {/* All Reviews */}
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('allReviews')}</h2>
                            <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                <span>{actualReviewCount.toLocaleString()} {t('total')}</span>
                                <span>•</span>
                                <button onClick={() => setIsWriteModalOpen(true)} className="text-blue-600 hover:underline">{tHeader('writeReview')}</button>
                            </div>
                        </div>

                        {/* Star Filters */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                            <div className="space-y-2 sm:space-y-3">
                                {ratingFilters.map((filter) => (
                                    <label key={filter.stars} className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedFilters.includes(filter.stars)}
                                            onChange={() => {
                                                setSelectedFilters(prev =>
                                                    prev.includes(filter.stars)
                                                        ? prev.filter(s => s !== filter.stars)
                                                        : [...prev, filter.stars]
                                                );
                                            }}
                                        />
                                        <span className="text-xs sm:text-sm font-medium w-10 sm:w-12">{filter.stars}-star</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                            <div
                                                className={`h-1.5 sm:h-2 rounded-full ${getBarColor(filter.stars)}`}
                                                style={{ width: `${filter.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12 text-right">{filter.percentage}%</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Link href="#" className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-900 hover:underline">
                            How Trustify labels reviews
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                    </div>

                    {/* Right Content - Reviews */}
                    <div className="lg:col-span-2">
                        {/* Search Bar */}
                        <div className="relative mb-4 sm:mb-6">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder={t('searchByKeyword')}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>

                        {/* Filter Buttons */}
                        {/* <div className="flex gap-3 mb-6">
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                                <Filter className="w-4 h-4" />
                                <span className="font-medium">More filters</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                                <span className="font-medium">Most recent</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div> */}

                        {/* Top Mentions */}
                        {/* <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top mentions</h3>
                            <div className="flex flex-wrap gap-2">
                                {topMentions.map((mention) => (
                                    <button
                                        key={mention}
                                        className="px-5 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition text-sm"
                                    >
                                        {mention}
                                    </button>
                                ))}
                            </div>
                        </div> */}

                        {/* Reviews List */}
                        <div className="space-y-4 sm:space-y-6">
                            {reviewsLoading ? (
                                <div className="text-center py-6 sm:py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                    <p className="text-gray-600 text-sm sm:text-base">{t('loadingReviews')}</p>
                                </div>
                            ) : searchedReviews.length === 0 ? (
                                <div className="text-center py-6 sm:py-8">
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        {reviews.length === 0 ? t('noReviewsBeFirst') : t('noReviewsMatch')}
                                    </p>
                                </div>
                            ) : (
                                searchedReviews.map((review) => {
                                    const userName = review.userName || '';
                                    const userInitial = userName.charAt(0).toUpperCase();
                                    const experienceDate = review.expDate ? new Date(review.expDate).toLocaleDateString() : '';

                                    return (
                                        <div key={review.id} className="border p-3 sm:p-4 border-gray-200 rounded-lg sm:rounded-md">
                                            {/* Review Header */}
                                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                <div className="flex items-start gap-2 sm:gap-4">
                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-xl flex-shrink-0">
                                                        {userInitial}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-semibold text-gray-900 text-sm sm:text-lg truncate">{userName}</h4>
                                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{review.userEmail || 'User'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex mb-3 sm:mb-4">{renderStars(review.rating, 'w-4 h-4 sm:w-5 sm:h-5')}</div>

                                            {/* Review Content */}
                                            <h5 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">{review.title}</h5>
                                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">{review.description}</p>

                                            {/* Experience Date */}
                                            {experienceDate && (
                                                <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                                                    <span className="font-medium">{t('experienceDate')}:</span> {experienceDate}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!reviewsLoading && totalPages > 1 && (
                            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <button
                                    onClick={loadPreviousReviews}
                                    disabled={currentReviewPage === 0}
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto justify-center"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    {t('previous')}
                                </button>
                                <div className="text-xs sm:text-sm text-gray-600 order-first sm:order-none">
                                    {t('page')} {currentReviewPage + 1} {t('of')} {totalPages}
                                </div>
                                <button
                                    onClick={loadMoreReviews}
                                    disabled={currentReviewPage >= totalPages - 1}
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto justify-center"
                                >
                                    {t('next')}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <WriteReviewModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                onSubmitSuccess={handleSubmitSuccess}
                companyName={currentCompany?.name || 'Company'}
                companyId={currentCompany?.id}
                companySlug={currentCompany?.slug}
            />
            {reviewData && (
                <ThankYouModal
                    isOpen={isThankYouModalOpen}
                    onClose={() => setIsThankYouModalOpen(false)}
                    reviewData={reviewData}
                />
            )}
        </div>
    );
}