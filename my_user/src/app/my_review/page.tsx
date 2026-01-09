"use client"
import { useState, useEffect } from 'react';
import { Star, Eye, ThumbsUp, Trash2, Flag, ArrowLeft, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';
import useReviewStore from '@/stores/reviewStore/review';
import { getStarFillColor, STAR_FILL_COLORS } from '@/utils/ratingColors';
import { useTranslations } from 'next-intl';
import EditReviewModal from '../components/EditReviewModal';

export default function MyReviewPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { myReviews, isLoading, error, currentPage, totalPages, totalItems, fetchReviewsByEmail } = useReviewStore();
  const t = useTranslations('myReviews');
  const tReview = useTranslations('review');
  const tProfile = useTranslations('profile');

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch reviews when user is available
  useEffect(() => {
    if (user?.email) {
      fetchReviewsByEmail(user.email, 0, 10);
    }
  }, [user?.email, fetchReviewsByEmail]);

  const handlePageChange = (newPage: number) => {
    if (user?.email && newPage >= 0 && newPage < totalPages) {
      fetchReviewsByEmail(user.email, newPage, 10);
    }
  };

  // Handle edit review
  const handleEditReview = (review: any) => {
    setEditingReview({
      id: review.id,
      title: review.title,
      description: review.description,
      rating: review.rating,
      expDate: review.expDate,
      companyName: review.companyName,
      companyLogo: review.companyLogo,
      userEmail: user?.email || review.userEmail,
    });
    setIsEditModalOpen(true);
  };

  // Handle update success
  const handleUpdateSuccess = () => {
    // Refresh reviews after successful update
    if (user?.email) {
      fetchReviewsByEmail(user.email, currentPage, 10);
    }
  };

  // Match star colors with other pages
  const renderStars = (rating: number) => {
    const starColor = getStarFillColor(rating);

    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`sm:w-4 sm:h-4 ${i < Math.floor(rating) ? starColor : STAR_FILL_COLORS.empty}`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-3 transition text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{tProfile('backToHome')}</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {getInitials(user.name)}
                </div>
              )}

              {/* User Info */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">{user.name}</h1>
                <p className="text-gray-600 text-xs sm:text-sm">{user.country || 'No country set'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 sm:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-0.5">
                  <Star size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">{totalItems}</span>
                </div>
                <span className="text-xs text-gray-600">{tProfile('reviews')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">

        <div className="mx-4 sm:mx-20 lg:mx-40">
          {/* Review Cards */}
          <div className="space-y-3 sm:space-y-4">
            {myReviews.map((review: any) => (
              <div key={review.id} className="space-y-2 sm:space-y-3">
                {/* Review Header */}
                <div>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    {t('reviewOf')}{' '}
                    <Link
                      href={review.companyId ? `/bussiness/${review.companyId}` : '#'}
                      className="text-blue-600 hover:underline"
                    >
                      {review.companyName || t('unknownCompany')}
                    </Link>
                  </p>
                </div>

                {/* Review Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  {/* User Info in Review */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{totalItems} {tProfile('reviews')}</p>
                    </div>
                  </div>

                  {/* Rating and Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200 gap-1.5">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-1.5 font-semibold text-gray-900 text-sm">{review.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-gray-600 text-xs">
                        {review.createdAt && formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{review.title}</h3>
                  )}

                  {/* Review Content */}
                  <p className="text-gray-700 text-xs sm:text-sm mb-2 leading-relaxed">
                    {review.description}
                  </p>

                  {/* Experience Date */}
                  {review.expDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      <span className="font-medium">{t('experienceDate')}:</span> {formatDate(review.expDate)}
                    </p>
                  )}

                  {/* Company Reply */}
                  {review.reply && (
                    <div className="mt-3 mb-3 bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="mt-0.5">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                            {review.companyName ? `${review.companyName} replied` : 'Company Response'}
                          </p>
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                            {review.reply}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-700 text-xs font-medium transition"
                    >
                      <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {tReview('editReview')}
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement delete functionality
                        console.log('Delete review:', review.id);
                      }}
                      className="flex items-center gap-1 text-gray-600 hover:text-red-700 text-xs font-medium transition"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {tReview('deleteReview')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-xs text-gray-700">
                {t('page')} {currentPage + 1} {t('of')} {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

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
    </div>
  );
}