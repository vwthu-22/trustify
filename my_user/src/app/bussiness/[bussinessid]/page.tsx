'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, ExternalLink, Star, MessageCircle, Info, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, Filter, ChevronDown, Search, Pencil, Trash2, Flag, X } from 'lucide-react';
import Link from 'next/link';
import WriteReviewModal from '../../cmt/page';
import ThankYouModal from '../../thankyou/page';
import EditReviewModal from '../../components/EditReviewModal';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';
import useAuthStore from '@/stores/userAuthStore/user';
import { getStarColor, getBarColor, getRatingLabel, STAR_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';
import SuspensionBanner from '@/components/SuspensionBanner';

export default function CompanyReviewPage() {
    const params = useParams();
    const businessId = params.bussinessid as string;
    const t = useTranslations('company');
    const tReview = useTranslations('review');
    const tHeader = useTranslations('header');
    const tCommon = useTranslations('common');
    const tSuspension = useTranslations('suspension');

    const { currentCompany, isLoading, error, fetchCompanyById } = useCompanyStore();
    const {
        reviews,
        allReviews,
        isLoading: reviewsLoading,
        fetchReviewsByCompany,
        fetchAllReviewsByCompany,
        currentPage,
        totalPages,
        reportReview
    } = useReviewStore();
    const { user } = useAuthStore();

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

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<{
        id: number;
        title: string;
        description: string;
        rating: number;
        expDate: string;
        companyName?: string;
        companyLogo?: string;
        userEmail?: string;
    } | null>(null);

    // Report modal state
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportingReview, setReportingReview] = useState<any | null>(null);
    const [reportReason, setReportReason] = useState('');
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);
    const [reportModalError, setReportModalError] = useState<string | null>(null);

    // Handle report review
    const handleReportReview = async () => {
        if (!reportingReview || !reportReason.trim()) return;

        if (user?.status === 'SUSPENDED') {
            setReportModalError('ACCOUNT_SUSPENDED');
            return;
        }

        setIsSubmittingReport(true);
        setReportModalError(null);
        try {
            const success = await reportReview(reportingReview, reportReason.trim());

            if (success) {
                setReportSuccess(true);
                setTimeout(() => {
                    setIsReportModalOpen(false);
                    setReportingReview(null);
                    setReportReason('');
                    setReportSuccess(false);
                }, 2000);
            } else {
                // If the store failed but we didn't throw, check if it's because of suspension
                if (user?.status === 'SUSPENDED') {
                    setReportModalError('ACCOUNT_SUSPENDED');
                } else {
                    setReportModalError('Failed to submit report. Please try again.');
                }
            }
        } catch (err: any) {
            console.error('Report error in UI:', err);
            setReportModalError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmittingReport(false);
        }
    };

    const openReportModal = (review: any) => {
        setReportingReview(review);
        setIsReportModalOpen(true);
    };

    // Check if review belongs to current user
    const isOwnReview = (review: any) => {
        if (!user?.email) return false;
        const reviewEmail = review.userEmail || review.user?.email || review.email;
        return reviewEmail?.toLowerCase() === user.email.toLowerCase();
    };

    // Handle edit review
    const handleEditReview = (review: any) => {
        setEditingReview({
            id: review.id,
            title: review.title,
            description: review.description,
            rating: review.rating,
            expDate: review.expDate,
            companyName: currentCompany?.name || review.companyName,
            companyLogo: currentCompany?.logo,
            userEmail: user?.email || review.userEmail,
        });
        setIsEditModalOpen(true);
    };

    // Handle update success
    const handleUpdateSuccess = () => {
        // Refresh reviews after successful update
        if (businessId) {
            fetchReviewsByCompany(businessId, currentReviewPage, 10);
            fetchAllReviewsByCompany(businessId);
        }
    };

    useEffect(() => {
        if (businessId) {
            fetchCompanyById(businessId);
            fetchReviewsByCompany(businessId, currentReviewPage, 5);
        }
    }, [businessId, currentReviewPage, fetchCompanyById, fetchReviewsByCompany]);

    // Fetch all reviews for rating breakdown calculation using store
    useEffect(() => {
        if (businessId) {
            fetchAllReviewsByCompany(businessId);
        }
    }, [businessId, fetchAllReviewsByCompany]);

    // FIXED: Filter and search on ALL reviews, not just current page
    // Step 1: Filter by star rating from ALL reviews
    const filteredReviews = selectedFilters.length > 0
        ? allReviews.filter(review => selectedFilters.includes(review.rating))
        : allReviews;

    // Step 2: Search by keyword
    const searchedReviewsUnsorted = searchKeyword
        ? filteredReviews.filter(review =>
            (review.title && review.title.toLowerCase().includes(searchKeyword.toLowerCase())) ||
            (review.description && review.description.toLowerCase().includes(searchKeyword.toLowerCase()))
        )
        : filteredReviews;

    // Step 3: Sort reviews - user's own reviews first
    const allFilteredReviews = [...searchedReviewsUnsorted].sort((a, b) => {
        const aIsOwn = isOwnReview(a);
        const bIsOwn = isOwnReview(b);
        if (aIsOwn && !bIsOwn) return -1;
        if (!aIsOwn && bIsOwn) return 1;
        return 0;
    });

    // Step 4: Local pagination for filtered results
    const REVIEWS_PER_PAGE = 5;
    const [filteredPage, setFilteredPage] = useState(0);
    const filteredTotalPages = Math.ceil(allFilteredReviews.length / REVIEWS_PER_PAGE);
    const searchedReviews = allFilteredReviews.slice(
        filteredPage * REVIEWS_PER_PAGE,
        (filteredPage + 1) * REVIEWS_PER_PAGE
    );

    // Reset to page 0 when filters or search change
    useEffect(() => {
        setFilteredPage(0);
    }, [selectedFilters, searchKeyword]);

    // Determine if we're using filtered mode (any filter or search active)
    const isFilterMode = selectedFilters.length > 0 || searchKeyword.length > 0;

    const loadMoreReviews = () => {
        if (isFilterMode) {
            if (filteredPage < filteredTotalPages - 1) {
                setFilteredPage(prev => prev + 1);
            }
        } else {
            if (currentReviewPage < totalPages - 1) {
                setCurrentReviewPage(prev => prev + 1);
            }
        }
    };

    const loadPreviousReviews = () => {
        if (isFilterMode) {
            if (filteredPage > 0) {
                setFilteredPage(prev => prev - 1);
            }
        } else {
            if (currentReviewPage > 0) {
                setCurrentReviewPage(prev => prev - 1);
            }
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
            <div className="mx-auto px-4 sm:px-8 lg:px-52 py-4 sm:py-8">
                {/* First Grid - Company Info and Rating Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4 sm:mt-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Company Header */}
                        <div className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                                    {currentCompany.logo ? (
                                        <img src={currentCompany.logo} alt={currentCompany.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl sm:text-2xl font-bold text-white">{currentCompany.name?.charAt(0).toUpperCase() || 'C'}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentCompany.name}</h1>
                                        {currentCompany.claimed && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 border border-gray-300 rounded-full text-xs">
                                                <CheckCircle className="w-3 h-3" />
                                                {t('claimed')}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/category/${getIndustrySlug(currentCompany.industry || '')}`}
                                        className="text-black hover:underline text-xs sm:text-sm"
                                    >
                                        {currentCompany.industry || 'Company'}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setIsWriteModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full transition flex items-center gap-1.5 text-xs sm:text-sm"
                                >
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span className="hidden sm:inline">{tHeader('writeReview')}</span>
                                    <span className="sm:hidden">{tReview('review')}</span>
                                </button>

                                <a
                                    href={`https://${currentCompany.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 text-xs sm:text-sm"
                                >
                                    <span className="hidden sm:inline">{t('visitWebsite')}</span>
                                    <span className="sm:hidden">{t('website')}</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex justify-center text-center items-start gap-2 sm:gap-3">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-gray-700">{t('noIncentives')}</p>
                        </div>

                        {/* Company Details */}
                        <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('companyDetails')}</h3>
                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    {t('activeSubscription')}
                                </span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                                <h4 className="font-bold text-sm sm:text-base mb-1.5">{t('about')} {currentCompany.name}</h4>
                                <p className="text-xs text-gray-500 mb-2 sm:mb-3">{t('writtenByCompany')}</p>
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {currentCompany.description || t('noDescription')}
                                </p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{t('contactInfo')}</h3>
                            <div className="space-y-1.5 sm:space-y-2">
                                {currentCompany.address && (
                                    <div className="flex items-start gap-2 text-gray-700">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm">{currentCompany.address}</span>
                                    </div>
                                )}
                                {currentCompany.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                        <a href={`tel:${currentCompany.phone}`} className="text-gray-900 hover:text-blue-600 text-xs sm:text-sm">{currentCompany.phone}</a>
                                    </div>
                                )}
                                {currentCompany.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                        <a href={`mailto:${currentCompany.email}`} className="text-gray-900 hover:text-blue-600 text-xs sm:text-sm break-all">{currentCompany.email}</a>
                                    </div>
                                )}
                                {currentCompany.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                        <Link href={`https://${currentCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-blue-600 text-xs sm:text-sm break-all">{currentCompany.website}</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="lg:sticky lg:top-20 space-y-3 sm:space-y-4">
                            {/* Rating Card */}
                            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-3 sm:p-4">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl sm:text-4xl font-bold">{actualRating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                    <span className="font-semibold text-xs sm:text-sm">
                                        {getRatingLabel(actualRating)}
                                    </span>
                                </div>
                                <div className="flex mb-2 sm:mb-3">{renderStars(actualRating, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}</div>
                                <p className="text-xs text-gray-600 mb-3 sm:mb-4">{actualReviewCount.toLocaleString()} {tReview('reviews')}</p>

                                {/* Rating Breakdown */}
                                <div className="space-y-1.5 mb-3 sm:mb-4">
                                    {ratingFilters.map((item) => (
                                        <div key={item.stars} className="flex items-center gap-2">
                                            <span className="text-xs w-9 sm:w-10">{item.stars}-star</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${getBarColor(item.stars)}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link href="#" className="text-xs text-gray-600 hover:underline">{t('howTrustScore')}</Link>
                            </div>

                            {/* Reply Stats */}
                            {/* {replyStats.negativeTotal > 0 && (
                                <div className="bg-white border border-gray-200 shadow-md rounded-lg p-3 sm:p-4 hidden lg:block">
                                    <div className="flex items-start gap-2">
                                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-xs sm:text-sm mb-0.5">
                                                {t('repliedToNegativePrefix')} {replyStats.replyPercentage}% {t('repliedToNegativeSuffix')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            {/* How Company Uses - Hidden on mobile
                            <Link href="#" className="hidden lg:flex items-center gap-1 text-xs sm:text-sm text-gray-900 hover:underline">
                                How this company uses Trustify
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Link> */}
                        </div>
                    </div>
                </div>

                {/* Second Grid - Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-8  sm:mt-12">
                    {/* Left Sidebar - Filters */}
                    <div className="lg:col-span-1">
                        {/* Rating Header */}
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#5aa5df]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-2xl sm:text-3xl font-bold">{actualRating.toFixed(1)}</span>
                        </div>

                        {/* All Reviews */}
                        <div className="mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{t('allReviews')}</h2>
                            <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                                <span>{actualReviewCount.toLocaleString()} {t('total')}</span>
                                <span>•</span>
                                <button onClick={() => setIsWriteModalOpen(true)} className="text-blue-600 hover:underline">{tHeader('writeReview')}</button>
                            </div>
                        </div>

                        {/* Star Filters */}
                        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                {ratingFilters.map((filter) => (
                                    <label key={filter.stars} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedFilters.includes(filter.stars)}
                                            onChange={() => {
                                                setSelectedFilters(prev =>
                                                    prev.includes(filter.stars)
                                                        ? prev.filter(s => s !== filter.stars)
                                                        : [...prev, filter.stars]
                                                );
                                            }}
                                        />
                                        <span className="text-xs font-medium w-9 sm:w-10">{filter.stars}-star</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${getBarColor(filter.stars)}`}
                                                style={{ width: `${filter.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-600 w-8 sm:w-10 text-right">{filter.percentage}%</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Link href="#" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-900 hover:underline">
                            How Trustify labels reviews
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Right Content - Reviews */}
                    <div className="lg:col-span-2">
                        {/* Search Bar */}
                        <div className="relative mb-3 sm:mb-4">
                            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder={t('searchByKeyword')}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            />
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {/* Determine which reviews to show */}
                            {(() => {
                                const reviewsToRender = isFilterMode ? searchedReviews : reviews;

                                return reviewsLoading ? (
                                    <div className="text-center py-4 sm:py-6">
                                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                        <p className="text-gray-600 text-xs sm:text-sm">{t('loadingReviews')}</p>
                                    </div>
                                ) : reviewsToRender.length === 0 ? (
                                    <div className="text-center py-4 sm:py-6">
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {reviews.length === 0 ? t('noReviewsBeFirst') : t('noReviewsMatch')}
                                        </p>
                                    </div>
                                ) : (
                                    reviewsToRender.map((review) => {
                                        // Get user info from nested user object or direct fields
                                        const userName = review.userName || review.user?.name || review.userEmail?.split('@')[0] || review.email?.split('@')[0] || 'User';
                                        const userInitial = userName.charAt(0).toUpperCase() || 'U';
                                        const userAvatar = review.userAvatar || review.avatarUrl || review.user?.avatarUrl;
                                        const userEmail = review.userEmail || review.user?.email || review.email || 'User';
                                        const experienceDate = review.expDate ? new Date(review.expDate).toLocaleDateString() : '';

                                        return (
                                            <div key={review.id} className="border p-2.5 sm:p-3 border-gray-200 rounded-lg">
                                                {/* Review Header */}
                                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 overflow-hidden">
                                                            {userAvatar ? (
                                                                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                userInitial
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{userName}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex mb-2 sm:mb-3">{renderStars(review.rating, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}</div>

                                                {/* Review Content */}
                                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2">{review.title}</h5>
                                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{review.description}</p>

                                                {/* Experience Date */}
                                                {experienceDate && (
                                                    <p className="text-xs text-gray-500 mt-2 sm:mt-3">
                                                        <span className="font-medium">{t('experienceDate')}:</span> {experienceDate}
                                                    </p>
                                                )}

                                                {/* Company Reply */}
                                                {review.reply && (
                                                    <div className="mt-3 sm:mt-4 bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                                                        <div className="flex items-start gap-2 sm:gap-3">
                                                            <div className="mt-0.5">
                                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                                        {review.companyName || currentCompany.name || 'Company Response'}
                                                                    </span>
                                                                    {review.replyContent && (
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(review.replyContent).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                                                    {review.reply}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-3 pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-200">
                                                    {/* Edit Button - Only show for own reviews */}
                                                    {isOwnReview(review) && (
                                                        <button
                                                            onClick={() => handleEditReview(review)}
                                                            className="flex items-center gap-1 text-gray-600 hover:text-blue-700 text-xs font-medium transition"
                                                        >
                                                            <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            {tReview('editReview')}
                                                        </button>
                                                    )}

                                                    {/* Report Button - Show for other users' reviews */}
                                                    {!isOwnReview(review) && user && (
                                                        <button
                                                            onClick={() => openReportModal(review)}
                                                            className="flex items-center gap-1 text-gray-500 hover:text-red-600 text-xs font-medium transition"
                                                        >
                                                            <Flag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            Báo cáo
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                );
                            })()}
                        </div>

                        {/* Pagination Controls */}
                        {!reviewsLoading && ((isFilterMode && filteredTotalPages > 1) || (!isFilterMode && totalPages > 1)) && (
                            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                                <button
                                    onClick={loadPreviousReviews}
                                    disabled={isFilterMode ? filteredPage === 0 : currentReviewPage === 0}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto justify-center"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    {t('previous')}
                                </button>
                                <div className="text-xs text-gray-600 order-first sm:order-none">
                                    {t('page')} {isFilterMode ? filteredPage + 1 : currentReviewPage + 1} {t('of')} {isFilterMode ? filteredTotalPages : totalPages}
                                    {isFilterMode && (
                                        <span className="ml-1.5 text-blue-600">
                                            ({allFilteredReviews.length} {t('results')})
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={loadMoreReviews}
                                    disabled={isFilterMode ? filteredPage >= filteredTotalPages - 1 : currentReviewPage >= totalPages - 1}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto justify-center"
                                >
                                    {t('next')}
                                    <ChevronRight className="w-3.5 h-3.5" />
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
                companyLogo={currentCompany?.logo}
                companyUrl={currentCompany?.website}
            />
            {reviewData && (
                <ThankYouModal
                    isOpen={isThankYouModalOpen}
                    onClose={() => setIsThankYouModalOpen(false)}
                    reviewData={reviewData}
                />
            )}

            {/* Edit Review Modal */}
            <EditReviewModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingReview(null);
                }}
                onUpdateSuccess={handleUpdateSuccess}
                review={editingReview}
            />

            {/* Report Review Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => {
                                setIsReportModalOpen(false);
                                setReportingReview(null);
                                setReportReason('');
                                setReportModalError(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                            <Flag className="w-5 h-5 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900">{tReview('reportReview')}</h3>
                        </div>

                        {(user?.status === 'SUSPENDED' ||
                            user?.status === 'INACTIVE' ||
                            reportModalError === 'ACCOUNT_SUSPENDED' ||
                            (reportModalError && (
                                reportModalError.toLowerCase().includes('suspended') ||
                                reportModalError.toLowerCase().includes('active') ||
                                reportModalError.toLowerCase().includes('status') ||
                                reportModalError.toLowerCase().includes('inactive')
                            ))) ? (
                            <SuspensionBanner
                                message={tSuspension('reportBlocked')}
                                status={user?.status || (reportModalError?.toLowerCase().includes('suspended') ? 'SUSPENDED' : 'INACTIVE')}
                            />
                        ) : reportModalError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {reportModalError}
                            </div>
                        )}

                        {reportSuccess ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-700 font-medium">{tReview('reportSentSuccess')}</p>
                                <p className="text-gray-500 text-sm mt-1">{tReview('reportSentDesc')}</p>
                            </div>
                        ) : (
                            <>
                                {reportingReview && (
                                    <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-700 italic">
                                        "{reportingReview.title}" - {reportingReview.description?.substring(0, 100)}...
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {tReview('reportReason')} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        placeholder={tReview('reportPlaceholder')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={4}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setIsReportModalOpen(false);
                                            setReportingReview(null);
                                            setReportReason('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                                    >
                                        {tCommon('cancel')}
                                    </button>
                                    <button
                                        onClick={handleReportReview}
                                        disabled={!reportReason.trim() || isSubmittingReport || user?.status === 'SUSPENDED'}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingReport ? tReview('submittingReport') : tReview('submitReport')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}