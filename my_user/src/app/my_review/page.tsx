"use client"
import { useState } from 'react';
import { Star, Eye, ThumbsUp, Trash2, Flag } from 'lucide-react';

export default function UserProfilePage() {
  const [user] = useState({
    name: 'Thu Văn',
    country: 'Vietnam',
    avatar: null,
    reviewCount: 1,
    readCount: 10,
    usefulCount: 0
  });

  const [reviews] = useState([
    {
      id: 1,
      companyName: 'Credit Union of New Jersey',
      companyUrl: '#',
      rating: 5,
      date: 'October 1, 2025',
      removedDate: 'Nov 17, 2025',
      content: 'tôi cần 500ảdá',
      isRemoved: true,
      isUnprompted: true
    },
    {
      id: 2,
      companyName: 'DuGood Credit Union',
      companyUrl: '#',
      rating: 4,
      date: 'September 15, 2025',
      removedDate: 'Nov 17, 2025',
      content: 'Dịch vụ tốt, nhân viên nhiệt tình. Sẽ quay lại.',
      isRemoved: true,
      isUnprompted: false
    }
  ]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(user.name)}
                </div>
              )}

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-gray-600">{user.country}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                  <Star size={24} />
                  <span className="text-4xl font-bold">{user.reviewCount}</span>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">Review</a>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                  <Eye size={24} />
                  <span className="text-4xl font-bold">{user.readCount}</span>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">Read</a>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                  <ThumbsUp size={24} />
                  <span className="text-4xl font-bold">{user.usefulCount}</span>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">Useful</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

        {/* Review Cards */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-4">
              {/* Review Header */}
              <div>
                <p className="text-gray-700">
                  Review of <a href={review.companyUrl} className="text-blue-600 hover:underline">{review.companyName}</a>
                </p>
              </div>

              {/* Removed Notice */}
              {review.isRemoved && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                  <Flag size={20} className="text-gray-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <span className="text-gray-700">This review has been removed.</span>
                    <a href="#" className="text-blue-600 hover:underline ml-1">Read more</a>
                  </div>
                </div>
              )}

              {/* Review Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* User Info in Review */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.reviewCount} review</p>
                  </div>
                </div>

                {/* Rating and Date */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">{review.removedDate}</p>
                    {review.isRemoved && (
                      <p className="text-red-600 text-sm font-medium">Review removed</p>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-gray-900 text-lg mb-4">{review.content}</p>

                {/* Review Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                    {review.date}
                  </span>
                  {review.isUnprompted && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                      Unprompted review
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}