'use client'
import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import useReviewStore from '@/stores/reviewStore/review';
import { useTranslations } from 'next-intl';

interface EditReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateSuccess: () => void;
    review: {
        id: number;
        title: string;
        description: string;
        rating: number;
        expDate: string;
        companyName?: string;
        userEmail?: string;
    } | null;
}

export default function EditReviewModal({
    isOpen,
    onClose,
    onUpdateSuccess,
    review
}: EditReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [experienceDate, setExperienceDate] = useState('');

    const t = useTranslations('reviewModal');
    const tReview = useTranslations('review');

    const { updateReview, isLoading, error, successMessage, clearError } = useReviewStore();

    // Initialize form with review data when modal opens
    useEffect(() => {
        if (review && isOpen) {
            setRating(review.rating);
            setReviewTitle(review.title);
            setReviewText(review.description);
            // Convert ISO date to YYYY-MM-DD for input
            if (review.expDate) {
                const date = new Date(review.expDate);
                const formattedDate = date.toISOString().split('T')[0];
                setExperienceDate(formattedDate);
            }
        }
    }, [review, isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            clearError();
        }
    }, [isOpen, clearError]);

    if (!isOpen || !review) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateData = {
            id: review.id,
            title: reviewTitle,
            description: reviewText,
            email: review.userEmail || '',
            companyName: review.companyName || '',
            rating,
            expDate: new Date(experienceDate).toISOString(),
        };

        console.log('Updating review with data:', updateData);
        const success = await updateReview(review.id, updateData);

        if (success) {
            onUpdateSuccess();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">{tReview('editReview')}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="px-6 py-6">
                    {/* Company Info */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 text-lg font-bold">
                                {review.companyName?.charAt(0) || 'C'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{review.companyName || 'Company'}</h3>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={clearError} className="text-red-700 hover:text-red-900">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Rating */}
                        <div className="mb-5">
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                                {t('rating') || 'Rating'}
                            </label>
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        disabled={isLoading}
                                    >
                                        <svg
                                            className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                ? 'text-[#5aa5df] fill-current'
                                                : 'text-gray-300 fill-current'
                                                }`}
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-5">
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                                {t('tellUsMore')}
                            </label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder={t('whatDidYouLike')}
                                required
                                rows={6}
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm disabled:bg-gray-100"
                            />
                        </div>

                        {/* Review Title */}
                        <div className="mb-5">
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                                {t('giveTitle')}
                            </label>
                            <input
                                type="text"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                                placeholder={t('titlePlaceholder')}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-100"
                            />
                        </div>

                        {/* Experience Date */}
                        <div className="mb-5">
                            <label className="block text-base font-semibold text-gray-900 mb-2">
                                {t('dateOfExperience')}
                            </label>
                            <input
                                type="date"
                                value={experienceDate}
                                onChange={(e) => setExperienceDate(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-100"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 py-3 rounded-lg font-semibold transition"
                            >
                                {t('cancel') || 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={rating === 0 || isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('updating') || 'Updating...'}
                                    </>
                                ) : (
                                    tReview('saveChanges') || 'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
