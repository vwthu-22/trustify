'use client'
import React, { useState, useEffect } from 'react';
import { X, Info, Sparkles } from 'lucide-react';
import useRatingStore from '@/stores/ratingStore/rating';
import useReviewStore from '@/stores/reviewStore/review';
import useUserAuthStore from '@/stores/userAuthStore/user';
import { useTranslations } from 'next-intl';
import SuspensionBanner from '@/components/SuspensionBanner';

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: (reviewData: any) => void;
    companyName?: string;
    companyId?: string;
    companySlug?: string;
    companyUrl?: string;
    companyLogo?: string;
}

export default function WriteReviewModal({
    isOpen,
    onClose,
    onSubmitSuccess,
    companyName,
    companyId,
    companySlug,
    companyUrl,
    companyLogo
}: WriteReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);
    const [experienceDate, setExperienceDate] = useState('');

    const t = useTranslations('reviewModal');

    const { submitRating, isLoading: ratingLoading, error: ratingError, clearError: clearRatingError } = useRatingStore();
    const { createReview, isLoading: reviewLoading, error: reviewError, successMessage, clearError: clearReviewError } = useReviewStore();
    const { user } = useUserAuthStore();

    const isLoading = ratingLoading || reviewLoading;
    const error = ratingError || reviewError;
    const clearError = () => {
        clearRatingError();
        clearReviewError();
    };

    const generateSuggestedTitle = (text: string): string => {
        if (!text.trim()) return '';
        const firstSentence = text.split(/[.!?]/)[0].trim();
        if (firstSentence.length <= 30) return firstSentence;
        const truncated = firstSentence.substring(0, 27);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 10 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
    };

    useEffect(() => {
        if (!isTitleManuallyEdited && reviewText.trim()) {
            const suggested = generateSuggestedTitle(reviewText);
            setReviewTitle(suggested);
        }
    }, [reviewText, isTitleManuallyEdited]);

    // Proactively check for suspension when modal opens
    useEffect(() => {
        const isUserSuspended = user?.status === 'SUSPENDED' || user?.status === 'INACTIVE';
        if (isOpen && isUserSuspended) {
            const { error: currentError } = useReviewStore.getState();
            if (!currentError || !currentError.toLowerCase().includes('suspension')) {
                // Set a manual error to trigger the banner if not already present
                useReviewStore.setState({ error: 'ACCOUNT_SUSPENDED' });
            }
        }
    }, [isOpen, user?.status]);

    const handleTitleChange = (value: string) => {
        setReviewTitle(value);
        setIsTitleManuallyEdited(true);
    };

    const handleSuggestTitle = () => {
        if (reviewText.trim()) {
            const suggested = generateSuggestedTitle(reviewText);
            setReviewTitle(suggested);
            setIsTitleManuallyEdited(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert(t('pleaseLogin'));
            return;
        }

        if (!companyName) {
            console.error('Company name is required');
            return;
        }

        if (!companyId) {
            console.error('Company ID is required for rating submission');
            alert(t('companyIdMissing'));
            return;
        }

        const companyIdentifier = companyName;
        console.log('Submitting rating with companyId:', companyId);
        const ratingSuccess = await submitRating(companyId, rating);

        if (!ratingSuccess) return;

        const reviewData = {
            title: reviewTitle,
            description: reviewText,
            email: user.email,
            companyName: companyIdentifier,
            rating,
            expDate: new Date(experienceDate).toISOString(),
        };

        const reviewSuccess = await createReview(reviewData);
        if (!reviewSuccess) return;

        onSubmitSuccess(reviewData);
        onClose();

        setRating(0);
        setReviewText('');
        setReviewTitle('');
        setIsTitleManuallyEdited(false);
        setExperienceDate('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative shadow-2xl">
                {/* Header - Compact */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                    <h2 className="text-base font-bold text-gray-900">{t('writeReview')}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="px-4 py-4">
                    {/* Company Info - Compact */}
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {companyLogo ? (
                                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-600 text-sm font-bold">
                                    {companyName?.charAt(0) || 'C'}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate">{companyName || 'Company'}</h3>
                            {companyUrl && <p className="text-xs text-gray-500 truncate">{companyUrl}</p>}
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        (error.includes('SUSPENDED') || user?.status === 'SUSPENDED' || user?.status === 'INACTIVE') ? (
                            <SuspensionBanner
                                onClear={clearError}
                                status={user?.status}
                            />
                        ) : (
                            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center justify-between text-sm shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                                <button onClick={clearError} className="text-red-700 hover:text-red-900 ml-2">
                                    <X size={14} />
                                </button>
                            </div>
                        )
                    )}

                    {successMessage && (
                        <div className="mb-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm shadow-sm">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Star Rating - Smaller */}
                        <div className="mb-4">
                            <div className="flex gap-0.5 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none group p-1"
                                        disabled={isLoading}
                                    >
                                        <svg
                                            className={`w-8 h-8 transition-all duration-300 ease-out
                                                ${star <= (hoverRating || rating)
                                                    ? 'text-[#5aa5df] fill-current'
                                                    : 'text-gray-300 fill-current'
                                                }
                                                group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:rotate-6
                                            `}
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-900 mb-1.5">
                                {t('tellUsMore')}
                            </label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder={t('whatDidYouLike')}
                                required
                                rows={4}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm disabled:bg-gray-100"
                            />
                        </div>

                        {/* Title */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-900">
                                    {t('giveTitle')}
                                </label>
                                {reviewText.trim() && (
                                    <button
                                        type="button"
                                        onClick={handleSuggestTitle}
                                        disabled={isLoading || !reviewText.trim()}
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        {t('suggestTitle')}
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={reviewTitle}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder={t('titlePlaceholder')}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-100"
                                />
                                {!isTitleManuallyEdited && reviewTitle && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {t('auto')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Experience Date */}
                        <div className="mb-3">
                            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-900 mb-1.5">
                                {t('dateOfExperience')}
                                <Info className="w-3.5 h-3.5 text-gray-400" />
                            </label>
                            <input
                                type="date"
                                value={experienceDate}
                                onChange={(e) => setExperienceDate(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-100"
                            />
                        </div>

                        {/* Terms */}
                        <p className="text-[11px] text-gray-500 mb-4">
                            {t('submissionConfirm')}{' '}
                            <a href="#" className="text-blue-600 hover:underline">{t('genuineExperience')}</a>{' '}
                            {t('noIncentive')}
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={rating === 0 || isLoading || user?.status === 'SUSPENDED'}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('submitting')}
                                </>
                            ) : (
                                t('submitReview')
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function WriteReviewButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Write a review
            </button>

            <WriteReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmitSuccess={() => { }}
                companyName="Example Company"
            />
        </>
    );
}