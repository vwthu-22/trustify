'use client'
import React, { useState } from 'react';
import { CheckCircle, ExternalLink, Star, MessageCircle, Info, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, ThumbsUp, Share2, Flag, Filter, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';

export default function CompanyReviewPage() {
  const renderStars = (rating: number, size: string = 'w-5 h-5') => {
    // Xác định màu dựa trên rating
    let starColor = 'text-gray-300';
    if (rating >= 1 && rating <= 2) {
      starColor = 'text-red-500'; // Đỏ cho 1-2 sao
    } else if (rating > 2 && rating <= 3.5) {
      starColor = 'text-yellow-500'; // Vàng cho >2 đến 3.5 sao
    } else if (rating > 3.5) {
      starColor = 'text-[#00b67a]'; // Xanh cho >3.5 sao
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

  /* comment */
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

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

  const reviews = [
    {
      id: 1,
      userName: 'Shanell Perry Jones',
      userInitial: 'S',
      country: 'US',
      reviewCount: 1,
      date: '2 days ago',
      rating: 1,
      title: 'Landing property members think twice before you give this company your money',
      content: '**Review for Landing Properties**\n\nThe The Lynx 6000 Randolph Blvd, San Antonio, TX 78233'
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Company Header */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-gray-800">LANDING</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Landing</h1>
                    <span className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Claimed profile
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Link href="#reviews" className="text-gray-900 hover:underline font-medium">
                      Reviews 2,856
                    </Link>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(4.4, 'w-5 h-5')}</div>
                      <span className="font-bold text-lg">4.4</span>
                    </div>
                  </div>
                  <Link href="#" className="text-blue-600 hover:underline">Furnished Apartment Building</Link>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Write a review
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-full font-semibold transition flex items-center gap-2">
                  Visit website
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">Companies on Trustify aren't allowed to offer incentives or pay to hide reviews.</p>
            </div>

            {/* Review Summary */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">Review summary</h2>
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">Based on reviews, created with AI</p>
              <p className="text-gray-700 leading-relaxed mb-2">
                Reviewers overwhelmingly had a great experience with this company. Customers consistently praise the apartments, describing them as perfectly clean, elegantly decorated, and often exceeding expectations set by online photos. People appreciate the comfort and comprehensive amenities provided, noting that the apartments are well-equipped with everything needed for a comfortable stay, from kitchenwar...
                <button className="text-blue-600 hover:underline ml-1">See more</button>
              </p>
            </div>

            {/* Based on these reviews */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Based on these reviews</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>

              {/* Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
                {[
                  { name: 'tyron hill', initial: 'TH', days: '7 days ago', rating: 4, text: 'The unit is housed in a fairly new apartment complex and the unit was clean. The host responded in a timely manner to our questions which made check in stress free. The only reason for the 4/5 star...', replied: true },
                  { name: 'Dennis Ruiz', initial: 'D', days: 'Oct 6, 2025', rating: 4, text: "Location for me was great… I wasn't far from both work and the downtown area. Everywhere I wanted to be at was within reasonable distance. The place was well kept and very clean. The instructions gi...", replied: true },
                  { name: 'Lilian', initial: 'LI', days: '4 days ago', rating: 4, text: 'Very comfortable, clean, and perfect for business trips. Location is close to campus, and near university neighborhood which is a bit of comfort even though it wasn\'t ready...', replied: false }
                ].map((review, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:-translate-y-2 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${idx === 0 ? 'bg-yellow-400 text-gray-900' : idx === 1 ? 'bg-blue-500' : 'bg-yellow-300 text-gray-900'}`}>
                        {review.initial}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <p className="text-xs text-gray-500">{review.days}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">{renderStars(review.rating, 'w-4 h-4')}</div>
                    <p className="text-sm text-gray-700 mb-3">
                      {review.text}
                      <button className="text-blue-600 hover:underline ml-1">See more</button>
                    </p>
                    {review.replied && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <MessageCircle className="w-3 h-3" />
                        Company replied
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <button className="flex items-center gap-1 hover:text-gray-900">
                        <ThumbsUp className="w-4 h-4" />
                        Useful
                      </button>
                      <button className="flex items-center gap-1 hover:text-gray-900">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button className="hover:text-gray-900">
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition font-medium text-blue-600 flex items-center justify-center gap-2">
                See all 2,856 reviews
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <p className="text-sm text-gray-500 mt-4 flex items-center gap-1">
                We perform checks on reviews
                <Info className="w-4 h-4" />
              </p>
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

              <div className="flex gap-2 mb-6">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">Furnished Apartment Building</span>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">Apartment Building</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">Pet-Friendly Accommodation</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-lg mb-2">About Landing</h4>
                <p className="text-sm text-gray-500 mb-4">Written by the company</p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Landing is a nationwide platform offering fully-furnished apartments with the quality and consistency of a hotel, but better. With thousands of curated homes available for flexible stays of a week, a month, or longer in cities across the U.S., Landing takes the hassle out of travel.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Every apartment comes with everything you need, featuring "larger than hotel" spaces, full kitchens, fast Wi-Fi, premium amenities, and 24/7 support. Whether you're traveling for work, relocating, or just exploring somewhere new, Landing provides a seamless experience wherever you go.
                </p>
                <button className="mt-4 px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                  See more
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  <span>Hải Bối, Đông Anh, Hà Nội, Việt Nam</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-700" />
                  <Link href="tel:4152311701" className="text-gray-900 underline hover:text-blue-600">(415) 231-1701</Link>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-700" />
                  <Link href="mailto:trustify@hellolanding.com" className="text-gray-900 underline hover:text-blue-600">trustify@hellolanding.com</Link>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-700" />
                  <Link href="https://hellolanding.com" className="text-gray-900 underline hover:text-blue-600">hellolanding.com</Link>
                </div>
              </div>
            </div>

            {/* People Also Looked At */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">People also looked at</h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: 'Blueground', url: 'www.theblueground.com', rating: 4.2, reviews: '2K', logo: 'BG' },
                  { name: 'SpareRoom', url: 'spareroom.com', rating: 4.5, reviews: '2K', logo: 'SR' },
                  { name: 'Furnished Finder', url: 'www.furnishedfinder.com', rating: 2, reviews: '1K', logo: 'FF' },
                  { name: 'Ministays', url: 'ministays.com', rating: 4.6, reviews: '17', logo: 'MS' }
                ].map((company, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <span className="font-bold text-gray-600">{company.logo}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-center mb-1">{company.name}</h4>
                    <p className="text-sm text-gray-600 text-center mb-3">{company.url}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex">{renderStars(company.rating, 'w-4 h-4')}</div>
                      <span className="font-semibold text-sm">{company.rating}</span>
                      <span className="text-sm text-gray-500">({company.reviews})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Rating Card */}
              <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">4.4</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">Excellent</span>
                </div>
                <div className="flex mb-4">{renderStars(4.4, 'w-5 h-5')}</div>
                <p className="text-sm text-gray-600 mb-6">3K reviews</p>

                {/* Rating Breakdown */}
                <div className="space-y-2 mb-6">
                  {[
                    { stars: 5, percentage: 76 },
                    { stars: 4, percentage: 5 },
                    { stars: 3, percentage: 1 },
                    { stars: 2, percentage: 2 },
                    { stars: 1, percentage: 16 }
                  ].map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm w-12">{item.stars}-star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.stars === 5 ? 'bg-[#00b67a]' : item.stars === 4 ? 'bg-green-400' : item.stars === 3 ? 'bg-yellow-400' : item.stars === 2 ? 'bg-orange-400' : 'bg-red-500'}`}
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
          <div className="lg:col-span-1 ">
            {/* Rating Header */}
            <div className="flex items-center gap-3 mb-6 ">
              <svg className="w-8 h-8 text-[#00b67a]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-4xl font-bold">4.4</span>
            </div>

            {/* All Reviews */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All reviews</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <span>2,856 total</span>
                <span>•</span>
                <Link href="#" className="text-blue-600 hover:underline">Write a review</Link>
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
                        className={`h-2 rounded-full ${filter.stars === 5 ? 'bg-[#00b67a]' :
                          filter.stars === 4 ? 'bg-green-400' :
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

            {/* Facebook Widget */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="relative h-32">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"
                  alt="Landing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xl">L</span>
                  </div>
                  <div className="text-white">
                    <h4 className="font-bold">Landing</h4>
                    <p className="text-xs">7,725 followers</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Follow Page
                </button>
              </div>
            </div>

            <Link href="#" className="flex items-center gap-2 text-sm text-gray-900 hover:underline">
              How Trustpilot labels reviews
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
              {reviews.map((review) => (
                <div key={review.id} className="border p-3 border-gray-200 rounded-md">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {review.userInitial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{review.userName}</h4>
                        <p className="text-sm text-gray-500">{review.country} • {review.reviewCount} review</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-4">{renderStars(review.rating)}</div>

                  {/* Review Content */}
                  <h5 className="font-semibold text-gray-900 text-lg mb-3">{review.title}</h5>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};