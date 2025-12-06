import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

interface ReviewData {
    title: string;
    description: string;
    email: string;
    companyName: string;
    rating: number;
    expDate: string; // Format: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
}

interface Review {
    id: number;
    title: string;
    description: string;
    rating: number;
    expDate: string;
    userName?: string;
    userEmail?: string;
    companyName?: string;
    createdAt?: string;
}

interface ReviewState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    reviews: Review[];
    currentPage: number;
    totalPages: number;
    totalItems: number;

    // Actions
    createReview: (reviewData: ReviewData) => Promise<boolean>;
    fetchReviewsByCompany: (companyId: string, page?: number, size?: number) => Promise<void>;
    fetchMyReviews: (page?: number, size?: number) => Promise<void>;
    clearError: () => void;
    clearSuccess: () => void;
}

const useReviewStore = create<ReviewState>()(
    devtools(
        (set) => ({
            isLoading: false,
            error: null,
            successMessage: null,
            reviews: [],
            currentPage: 0,
            totalPages: 0,
            totalItems: 0,

            // Create a new review
            createReview: async (reviewData: ReviewData) => {
                console.log('=== Create Review Start ===');
                console.log('Review Data:', reviewData);

                set({ isLoading: true, error: null, successMessage: null });

                try {
                    const url = `${API_BASE_URL}/api/review/create`;
                    console.log('Submitting to:', url);

                    const response = await fetch(url, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                        body: JSON.stringify(reviewData),
                    });

                    console.log('Response Status:', response.status);
                    console.log('Response Content-Type:', response.headers.get('content-type'));

                    if (!response.ok) {
                        // Try to parse error as JSON, fallback to text
                        let errorMessage = 'Failed to create review';
                        try {
                            const errorData = await response.json();
                            console.error('Response Error (JSON):', errorData);
                            errorMessage = errorData.message || errorData.error || errorMessage;
                        } catch {
                            const errorText = await response.text();
                            console.error('Response Error (Text):', errorText);
                            errorMessage = errorText || errorMessage;
                        }
                        throw new Error(errorMessage);
                    }

                    // Handle both JSON and plain text responses
                    const contentType = response.headers.get('content-type');
                    let data;

                    if (contentType && contentType.includes('application/json')) {
                        data = await response.json();
                        console.log('Response Data (JSON):', data);
                    } else {
                        data = await response.text();
                        console.log('Response Data (Text):', data);
                    }

                    console.log('=== Create Review Success ===');

                    set({
                        isLoading: false,
                        successMessage: 'Review submitted successfully!'
                    });
                    return true;
                } catch (error) {
                    console.error('=== Create Review Error ===');
                    console.error('Error:', error);

                    let errorMessage = 'Failed to submit review';

                    if (error instanceof TypeError && error.message.includes('fetch')) {
                        errorMessage = 'Network error. Please check your connection and try again.';
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Fetch reviews by company ID
            fetchReviewsByCompany: async (companyId: string, page = 0, size = 4) => {
                console.log('=== Fetch Reviews By Company Start ===');
                console.log('Company ID:', companyId, 'Page:', page, 'Size:', size);

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/review/company/${companyId}?page=${page}&size=${size}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);
                    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Error Response Body:', errorText);

                        // Nếu lỗi 500, có thể do company chưa có review nào
                        if (response.status === 500) {
                            console.warn('⚠️ Backend returned 500. Possibly no reviews for this company yet.');
                            set({
                                reviews: [],
                                currentPage: 0,
                                totalPages: 0,
                                totalItems: 0,
                                isLoading: false,
                                error: null, // Không hiển thị error cho user
                            });
                            return;
                        }

                        throw new Error(`Failed to fetch reviews: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    console.log('Reviews Response:', data);

                    set({
                        reviews: data.reviews || [],
                        currentPage: data.currentPage || 0,
                        totalPages: data.totalPages || 0,
                        totalItems: data.totalItems || 0,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('=== Fetch Reviews Error ===');
                    console.error('Error:', error);

                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
                        isLoading: false,
                        reviews: [],
                    });
                }
            },

            // Fetch my reviews (user's own reviews)
            fetchMyReviews: async (page = 0, size = 10) => {
                console.log('=== Fetch My Reviews Start ===');
                console.log('Page:', page, 'Size:', size);

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/review/my-reviews?page=${page}&size=${size}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch my reviews: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('My Reviews Response:', data);

                    set({
                        reviews: data.reviews || [],
                        currentPage: data.currentPage || 0,
                        totalPages: data.totalPages || 0,
                        totalItems: data.totalItems || 0,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('=== Fetch My Reviews Error ===');
                    console.error('Error:', error);

                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch my reviews',
                        isLoading: false,
                        reviews: [],
                    });
                }
            },

            clearError: () => set({ error: null }),
            clearSuccess: () => set({ successMessage: null }),
        }),
        { name: 'review-store' }
    )
);

export default useReviewStore;
export type { Review, ReviewData };
