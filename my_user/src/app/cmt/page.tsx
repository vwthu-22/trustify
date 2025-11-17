'use client'
import React, { useState } from 'react';
import { X, Info, Edit } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (reviewData: any) => void;
  companyName?: string;
  companyUrl?: string;
  companyLogo?: string;
}

export default function WriteReviewModal({ 
  isOpen, 
  onClose,
  onSubmitSuccess,
  companyName = "DuGood Credit Union",
  companyUrl = "www.dugood.org",
  companyLogo 
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [experienceDate, setExperienceDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewData = {
      rating,
      reviewTitle,
      reviewText,
      experienceDate: new Date(experienceDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      companyName,
      companyUrl,
      userName: 'Thu Vân'
    };
    
    console.log('Submitting review:', reviewData);
    onSubmitSuccess(reviewData);
    onClose();
    
    // Reset form
    setRating(0);
    setReviewText('');
    setReviewTitle('');
    setExperienceDate('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header với Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Write a review</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Company Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-600 text-lg font-bold">
                  {companyName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{companyName}</h3>
              <p className="text-sm text-gray-600">{companyUrl}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-5">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating)
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
                Tell us more about your experience
              </label>
              <a href="#" className="text-blue-600 hover:underline text-sm mb-3 inline-block">
                Read our Guidelines for Reviewers
              </a>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you like or dislike? What is company doing well, or how can they improve?"
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
              />
              <a href="#" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                How to write a useful review
              </a>
            </div>

            {/* Review Title */}
            <div className="mb-5">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Give your review a title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="What is important for people to know"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Date of Experience */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                Date of experience
                <button type="button" className="p-1 hover:bg-gray-100 rounded-full transition">
                  <Info className="w-4 h-4 text-gray-500" />
                </button>
              </label>
              <input
                type="date"
                value={experienceDate}
                onChange={(e) => setExperienceDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>

            {/* Terms */}
            <div className="mb-5">
              <p className="text-xs text-gray-600">
                By submitting this review, you confirm it's{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  based on a genuine experience
                </a>{' '}
                and you haven't received an incentive to write it.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
            >
              Submit review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Component để sử dụng
export function WriteReviewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Write a review
      </button>

      <WriteReviewModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              companyName="DuGood Credit Union"
              companyUrl="www.dugood.org" onSubmitSuccess={function (reviewData: any): void {
                  throw new Error('Function not implemented.');
              } }      />
    </>
  );
}