'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/userAuthStore/user';
import { Star, Eye, ThumbsUp, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  companyName: string;
  companyUrl: string;
  rating: number;
  date: string;
  content: string;
  status: 'active' | 'removed';
  isPrompted: boolean;
}

export default function MyReviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
  
  
    
    // Nếu chưa login, redirect về trang login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [user, isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Fetch reviews của user
    const fetchReviews = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('https://5b976f85f49c.ngrok-free.app/api/user/reviews', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? 'fill-green-500 text-green-500' : 'text-gray-300'}
      />
    ));
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            

            <div className="flex gap-8">
              <div className="text-center">
                <div className="flex items-center gap-1 text-blue-600">
                  <Star size={20} />
                  <span className="text-2xl font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600">Review</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-blue-600">
                  <Eye size={20} />
                  <span className="text-2xl font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600">Read</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-blue-600">
                  <ThumbsUp size={20} />
                  <span className="text-2xl font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600">Useful</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
          
          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't written any reviews yet.</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Write your first review
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  {review.status === 'removed' && (
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 flex items-start gap-2">
                      <span className="text-gray-600 text-sm">
                        ⚠️ This review has been removed. <a href="#" className="text-blue-600 hover:underline">Read more</a>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Review of <a href={review.companyUrl} className="text-blue-600 hover:underline">{review.companyName}</a>
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                        {review.status === 'removed' && (
                          <span className="text-sm text-red-600 font-medium">Review removed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{review.content}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">{review.date}</span>
                    {!review.isPrompted && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        Unprompted review
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <button className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}