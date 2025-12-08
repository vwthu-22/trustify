'use client'
import React from 'react';
import { X, Info, Pencil, Trash2 } from 'lucide-react';
import useAuthStore from '@/stores/userAuthStore/user';
import useReviewStore from '@/stores/reviewStore/review';

interface ReviewData {
  rating: number;
  reviewTitle: string;
  reviewText: string;
  experienceDate: string;
  companyName: string;
  companyUrl?: string;
  userName?: string;
}

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData: ReviewData;
}

export default function ThankYouModal({
  isOpen,
  onClose,
  reviewData
}: ThankYouModalProps) {
  const { user } = useAuthStore();
  const { myReviews } = useReviewStore();

  if (!isOpen) return null;

  // Get user country and review count from stores
  const userCountry = user?.country || 'VN';
  const reviewCount = myReviews?.length || 0;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Stars */}
        <div className="absolute top-0 left-0 w-full h-32 overflow-hidden pointer-events-none">
          <div className="flex gap-2">
            {[...Array(15)].map((_, i) => (
              <svg
                key={i}
                className="w-12 h-12 text-[#5adfd6] fill-current"
                style={{
                  opacity: Math.random() * 0.5 + 0.5,
                  transform: `rotate(${Math.random() * 60 - 30}deg) scale(${Math.random() * 0.5 + 0.7})`,
                  marginTop: `${Math.random() * 20}px`
                }}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition z-20"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="px-6 py-12 relative z-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Thanks for your review!
          </h1>

          {/* Review Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {/* Company Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {reviewData.companyName.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{reviewData.companyName}</h3>
            </div>

            {/* Pending Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Your review is pending.{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Read more</a>
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {reviewData.userName ? reviewData.userName.charAt(0).toUpperCase() : user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{reviewData.userName || user?.name || 'User'}</h4>
                <p className="text-sm text-gray-600">{reviewCount} reviews • {userCountry}</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${i < reviewData.rating ? 'text-[#5aa5df]' : 'text-gray-300'} fill-current`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            {/* Review Title */}
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">{reviewData.reviewTitle}</h3>

            {/* Review Meta */}
            <div className="flex gap-3 mb-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {reviewData.experienceDate}
              </span>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Unprompted review
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition">
                <Pencil className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}