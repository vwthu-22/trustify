'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, ExternalLink, Star, MessageCircle, Info, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, Filter, ChevronDown, Search, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import WriteReviewModal from '../../cmt/page';
import ThankYouModal from '../../thankyou/page';
import useCompanyStore from '@/stores/companyStore/company';
import useReviewStore from '@/stores/reviewStore/review';

export default function CompanyReviewPage() {
    const params = useParams();
    const businessId = params.bussinessid as string;

    const { currentCompany, isLoading, error, fetchCompanyById } = useCompanyStore();
    const { reviews, isLoading: reviewsLoading, fetchReviewsByCompany, currentPage, totalPages } = useReviewStore();

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
        let starColor = 'text-gray-300';
        if (rating >= 1 && rating <= 2) {
            starColor = 'text-red-500';
        } else if (rating > 2 && rating <= 3.5) {
            starColor = 'text-yellow-500';
        } else if (rating > 3.5) {
            starColor = 'text-[#5aa5df]';
        }

        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`${size} ${i < Math.floor(rating) ? starColor : 'text-gray-300'}`}
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
        }
    };

    const ratingFilters = [
        { stars: 5, percentage: 76 },
        { stars: 4, percentage: 5 },
        { stars: 3, percentage: 1 },
        { stars: 2, percentage: 2 },
        { stars: 1, percentage: 16 }
    ];

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
                    <p className="text-gray-600">Loading company details...</p>
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
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCompany) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">Company not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Company Header */}
                        <div className="mb-8">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {currentCompany.logo ? (
                                        <img src={currentCompany.logo} alt={currentCompany.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-lg font-bold text-gray-800">{currentCompany.name?.substring(0, 7).toUpperCase() || 'COMPANY'}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900">{currentCompany.name}</h1>
                                        {currentCompany.claimed && (
                                            <span className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                Claimed profile
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Link href="#reviews" className="text-gray-900 hover:underline font-medium">
                                            Reviews {(currentCompany.reviewCount || 0).toLocaleString()}
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">{renderStars(currentCompany.rating || 0, 'w-5 h-5')}</div>
                                            <span className="font-bold text-lg">{(currentCompany.rating || 0).toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <Link href="#" className="text-blue-600 hover:underline">{currentCompany.industry || 'Company'}</Link>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsWriteModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Write a review
                                </button>

                                <a
                                    href={`https://${currentCompany.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-full font-semibold transition flex items-center gap-2"
                                >
                                    Visit website
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">Companies on Trustify aren't allowed to offer incentives or pay to hide reviews.</p>
                        </div>

                        {/* Company Details */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-2xl font-bold text-gray-900">Company details</h3>
                                <span className="flex items-center gap-1 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Active Trustify subscription
                                </span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                <h4 className="font-bold text-lg mb-2">About {currentCompany.name}</h4>
                                <p className="text-sm text-gray-500 mb-4">Written by the company</p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {currentCompany.description || 'No description available.'}
                                </p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact info</h3>
                            <div className="space-y-3">
                                {currentCompany.address && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin className="w-5 h-5" />
                                        <span>{currentCompany.address}</span>
                                    </div>
                                )}
                                {currentCompany.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-gray-700" />
                                        <Link href={`https://${currentCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-blue-600">{currentCompany.website}</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            {/* Rating Card */}
                            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-bold">{(currentCompany.rating || 0).toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="font-semibold">
                                        {currentCompany.rating >= 4.5 ? 'Excellent' : currentCompany.rating >= 3.5 ? 'Great' : currentCompany.rating >= 2.5 ? 'Average' : 'Poor'}
                                    </span>
                                </div>
                                <div className="flex mb-4">{renderStars(currentCompany.rating || 0, 'w-5 h-5')}</div>
                                <p className="text-sm text-gray-600 mb-6">{(currentCompany.reviewCount || 0).toLocaleString()} reviews</p>

                                {/* Rating Breakdown */}
                                <div className="space-y-2 mb-6">
                                    {ratingFilters.map((item) => (
                                        <div key={item.stars} className="flex items-center gap-3">
                                            <span className="text-sm w-12">{item.stars}-star</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${item.stars === 5 ? 'bg-[#5aa5df]' : item.stars === 4 ? 'bg-blue-400' : item.stars === 3 ? 'bg-yellow-400' : item.stars === 2 ? 'bg-orange-400' : 'bg-red-500'}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link href="#" className="text-sm text-gray-600 hover:underline">How is the TrustScore calculated?</Link>
                            </div>

                            {/* Reply Stats */}
                            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold mb-1">Replied to 82% of negative reviews</p>
                                        <p className="text-sm text-gray-600">Typically replies within 1 week</p>
                                    </div>
                                </div>
                            </div>

                            {/* How Company Uses */}
                            <Link href="#" className="block text-sm text-gray-900 hover:underline flex items-center gap-1">
                                How this company uses Trustify
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
                    {/* Left Sidebar - Filters */}
                    <div className="lg:col-span-1">
                        {/* Rating Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <svg className="w-8 h-8 text-[#5aa5df]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-4xl font-bold">{(currentCompany.rating || 0).toFixed(1)}</span>
                        </div>

                        {/* All Reviews */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">All reviews</h2>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>{(currentCompany.reviewCount || 0).toLocaleString()} total</span>
                                <span>•</span>
                                <button onClick={() => setIsWriteModalOpen(true)} className="text-blue-600 hover:underline">Write a review</button>
                            </div>
                        </div>

                        {/* Star Filters */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <div className="space-y-3">
                                {ratingFilters.map((filter) => (
                                    <label key={filter.stars} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedFilters.includes(filter.stars)}
                                            onChange={() => {
                                                setSelectedFilters(prev =>
                                                    prev.includes(filter.stars)
                                                        ? prev.filter(s => s !== filter.stars)
                                                        : [...prev, filter.stars]
                                                );
                                            }}
                                        />
                                        <span className="text-sm font-medium w-12">{filter.stars}-star</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${filter.stars === 5 ? 'bg-[#5aa5df]' :
                                                    filter.stars === 4 ? 'bg-blue-400' :
                                                        filter.stars === 3 ? 'bg-yellow-400' :
                                                            filter.stars === 2 ? 'bg-orange-400' :
                                                                'bg-red-500'
                                                    }`}
                                                style={{ width: `${filter.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{filter.percentage}%</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Link href="#" className="flex items-center gap-2 text-sm text-gray-900 hover:underline">
                            How Trustify labels reviews
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Right Content - Reviews */}
                    <div className="lg:col-span-2">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by keyword..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-3 mb-6">
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                                <Filter className="w-4 h-4" />
                                <span className="font-medium">More filters</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                                <span className="font-medium">Most recent</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Top Mentions */}
                        <div className="mb-8">
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
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {reviewsLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                    <p className="text-gray-600">Loading reviews...</p>
                                </div>
                            ) : searchedReviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        {reviews.length === 0 ? 'No reviews yet. Be the first to review!' : 'No reviews match your search.'}
                                    </p>
                                </div>
                            ) : (
                                searchedReviews.map((review) => {
                                    const userName = review.userName || 'Anonymous';
                                    const userInitial = userName.charAt(0).toUpperCase();
                                    const reviewDate = review.expDate ? new Date(review.expDate).toLocaleDateString() : 'Recently';

                                    return (
                                        <div key={review.id} className="border p-3 border-gray-200 rounded-md">
                                            {/* Review Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                                        {userInitial}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-lg">{userName}</h4>
                                                        <p className="text-sm text-gray-500">{review.userEmail || 'User'}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">{reviewDate}</span>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex mb-4">{renderStars(review.rating)}</div>

                                            {/* Review Content */}
                                            <h5 className="font-semibold text-gray-900 text-lg mb-3">{review.title}</h5>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review.description}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!reviewsLoading && searchedReviews.length > 0 && (
                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={loadPreviousReviews}
                                    disabled={currentReviewPage === 0}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <div className="text-sm text-gray-600">
                                    Page {currentReviewPage + 1} of {totalPages}
                                </div>
                                <button
                                    onClick={loadMoreReviews}
                                    disabled={currentReviewPage >= totalPages - 1}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
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