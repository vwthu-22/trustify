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
    companyId?: string;
    createdAt?: string;
}

interface CompanyRatingData {
    rating: number;
    reviewCount: number;
}

interface ReviewState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    reviews: Review[];
    myReviews: Review[]; // User's own reviews by email
    allReviews: Review[]; // All reviews for a company (for rating breakdown)
    highRatedReviews: Review[]; // 5-star reviews for recent reviews section
    currentPage: number;
    totalPages: number;
    totalItems: number;
    companyRatings: Record<string, CompanyRatingData>; // ratings for multiple companies

    // Actions
    createReview: (reviewData: ReviewData) => Promise<boolean>;
    fetchReviewsByCompany: (companyId: string, page?: number, size?: number) => Promise<void>;
    fetchAllReviewsByCompany: (companyId: string) => Promise<void>; // for rating breakdown
    fetchHighRatedReviews: () => Promise<void>; // for recent 5-star reviews
    fetchMyReviews: (page?: number, size?: number) => Promise<void>;
    fetchReviewsByEmail: (email: string, page?: number, size?: number) => Promise<void>; // for my_review page
    fetchCompanyRatings: (companyIds: string[]) => Promise<void>; // for category page
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
            myReviews: [],
            allReviews: [],
            highRatedReviews: [],
            currentPage: 0,
            totalPages: 0,
            totalItems: 0,
            companyRatings: {},

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

            // Fetch ALL reviews for a company (for rating breakdown calculation)
            fetchAllReviewsByCompany: async (companyId: string) => {
                try {
                    const url = `${API_BASE_URL}/api/review/company/${companyId}?page=0&size=1000`;

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({ allReviews: data.reviews || [] });
                    } else {
                        set({ allReviews: [] });
                    }
                } catch (error) {
                    console.error('Failed to fetch all reviews:', error);
                    set({ allReviews: [] });
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

            // Fetch reviews by user email (for my_review page)
            // API: GET /api/review/user/{email}
            fetchReviewsByEmail: async (email: string, page = 0, size = 10) => {
                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/review/user/${email}?page=${page}&size=${size}`;
                    console.log('Fetching reviews from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        // Backend API not ready yet - show empty state gracefully
                        console.log('Review API returned error, showing empty state');
                        set({
                            myReviews: [],
                            currentPage: 0,
                            totalPages: 0,
                            totalItems: 0,
                            isLoading: false,
                            error: null,
                        });
                        return;
                    }

                    const data = await response.json();
                    console.log('My Reviews Response:', data);

                    set({
                        myReviews: data.reviews || [],
                        currentPage: data.currentPage || 0,
                        totalPages: data.totalPages || 0,
                        totalItems: data.totalItems || 0,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('Fetch reviews by email error:', error);
                    // Show empty state instead of error
                    set({
                        myReviews: [],
                        currentPage: 0,
                        totalPages: 0,
                        totalItems: 0,
                        isLoading: false,
                        error: null,
                    });
                }
            },

            // Fetch high-rated reviews (5-star) for recent reviews section
            // Since /api/review/all doesn't exist, we fetch from companies
            fetchHighRatedReviews: async () => {
                try {
                    // First, get some companies
                    const companiesResponse = await fetch(
                        `${API_BASE_URL}/api/company?page=0&size=10`,
                        {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'ngrok-skip-browser-warning': 'true',
                                'bypass-tunnel-reminder': 'true',
                            },
                        }
                    );

                    if (!companiesResponse.ok) {
                        set({ highRatedReviews: [] });
                        return;
                    }

                    const companiesData = await companiesResponse.json();
                    const companies = companiesData.companies || companiesData || [];

                    // Fetch reviews for each company
                    const allFiveStarReviews: Review[] = [];

                    for (const company of companies.slice(0, 5)) {
                        try {
                            const reviewResponse = await fetch(
                                `${API_BASE_URL}/api/review/company/${company.id}?page=0&size=20`,
                                {
                                    method: 'GET',
                                    credentials: 'include',
                                    headers: {
                                        'ngrok-skip-browser-warning': 'true',
                                        'bypass-tunnel-reminder': 'true',
                                    },
                                }
                            );

                            if (reviewResponse.ok) {
                                const reviewData = await reviewResponse.json();
                                const reviews = reviewData.reviews || [];

                                // Filter for 5-star reviews and add company info
                                const fiveStarReviews = reviews
                                    .filter((r: Review) => r.rating >= 5)
                                    .map((r: Review) => ({
                                        ...r,
                                        companyId: company.id,
                                        companyName: r.companyName || company.name,
                                    }));

                                allFiveStarReviews.push(...fiveStarReviews);
                            }
                        } catch (error) {
                            console.error(`Failed to fetch reviews for company ${company.id}:`, error);
                        }
                    }

                    // Shuffle and take first 8
                    const shuffled = allFiveStarReviews.sort(() => Math.random() - 0.5);
                    set({ highRatedReviews: shuffled.slice(0, 8) });
                } catch (error) {
                    console.error('Failed to fetch high-rated reviews:', error);
                    set({ highRatedReviews: [] });
                }
            },

            clearError: () => set({ error: null }),
            clearSuccess: () => set({ successMessage: null }),

            // Fetch ratings for multiple companies (for category pages)
            fetchCompanyRatings: async (companyIds: string[]) => {
                if (!companyIds || companyIds.length === 0) return;

                const ratingPromises = companyIds.map(async (companyId) => {
                    try {
                        const response = await fetch(
                            `${API_BASE_URL}/api/review/company/${companyId}?page=0&size=100`,
                            {
                                method: 'GET',
                                credentials: 'include',
                                headers: {
                                    'ngrok-skip-browser-warning': 'true',
                                    'bypass-tunnel-reminder': 'true',
                                },
                            }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            const reviews = data.reviews || [];
                            const reviewCount = reviews.length;
                            const avgRating = reviewCount > 0
                                ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount
                                : 0;

                            return {
                                companyId,
                                rating: avgRating,
                                reviewCount
                            };
                        }
                    } catch (error) {
                        console.error(`Failed to fetch reviews for company ${companyId}:`, error);
                    }
                    return { companyId, rating: 0, reviewCount: 0 };
                });

                const results = await Promise.all(ratingPromises);

                const ratingsMap: Record<string, CompanyRatingData> = {};
                results.forEach(result => {
                    if (result) {
                        ratingsMap[result.companyId] = {
                            rating: result.rating,
                            reviewCount: result.reviewCount
                        };
                    }
                });

                set((state) => ({
                    companyRatings: { ...state.companyRatings, ...ratingsMap }
                }));
            },
        }),
        { name: 'review-store' }
    )
);

export default useReviewStore;
export type { Review, ReviewData };
