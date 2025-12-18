import { create } from 'zustand';
import { reviewApi } from '@/lib/api';
import { companyApi } from '@/lib/api';

// Types matching API response
export interface ReviewUser {
    id: number;
    name: string;
    avatarUrl?: string;
}

export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: ReviewUser;
    // Additional fields for UI
    status?: 'pending' | 'replied' | 'flagged';
    reply?: string;
    replyDate?: string;
}

export interface ReviewFilters {
    status?: 'all' | 'pending' | 'replied' | 'flagged';
    rating?: number;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    pendingCount: number;
    repliedCount: number;
    ratingDistribution: { [key: number]: number };
}

interface ReviewStore {
    // State
    reviews: Review[];
    stats: ReviewStats | null;
    filters: ReviewFilters;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    companyId: number | null;

    // Actions
    fetchReviews: (page?: number, size?: number) => Promise<void>;
    fetchCompanyReviews: (companyId: number, page?: number, size?: number) => Promise<void>;
    calculateStats: () => void;
    replyToReview: (reviewId: number, reply: string) => Promise<boolean>;
    flagReview: (reviewId: number, reason: string) => Promise<boolean>;
    setFilters: (filters: ReviewFilters) => void;
    setPage: (page: number) => void;
    clearError: () => void;
    setCompanyId: (companyId: number) => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
    reviews: [],
    stats: null,
    filters: {},
    isLoading: false,
    error: null,
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
    companyId: null,

    fetchReviews: async (page = 0, size = 10) => {
        const { companyId } = get();
        if (!companyId) {
            // Try to get company ID from profile
            try {
                const profile = await companyApi.getProfile();
                if (profile?.id) {
                    set({ companyId: profile.id });
                    await get().fetchCompanyReviews(profile.id, page, size);
                }
            } catch (error) {
                set({ error: 'Could not determine company ID', isLoading: false });
            }
            return;
        }
        await get().fetchCompanyReviews(companyId, page, size);
    },

    fetchCompanyReviews: async (companyId: number, page = 0, size = 10) => {
        set({ isLoading: true, error: null, companyId });
        try {
            const response = await reviewApi.getCompanyReviews(companyId, page, size);

            // Map API response to our Review type
            const reviews: Review[] = (response.reviews || []).map((r: any) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                user: r.user,
                status: r.reply ? 'replied' : 'pending',
                reply: r.reply,
                replyDate: r.replyDate,
            }));

            set({
                reviews,
                currentPage: response.currentPage || 0,
                totalPages: response.totalPages || 1,
                totalItems: response.totalItems || reviews.length,
                isLoading: false,
            });

            // Calculate stats after fetching
            get().calculateStats();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch reviews',
                isLoading: false,
            });
        }
    },

    calculateStats: () => {
        const { reviews, totalItems } = get();
        if (reviews.length === 0) {
            set({ stats: null });
            return;
        }

        const totalReviews = totalItems;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        const pendingCount = reviews.filter(r => r.status === 'pending').length;
        const repliedCount = reviews.filter(r => r.status === 'replied').length;

        const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
                ratingDistribution[r.rating]++;
            }
        });

        set({
            stats: {
                totalReviews,
                averageRating: Math.round(averageRating * 10) / 10,
                pendingCount,
                repliedCount,
                ratingDistribution,
            },
        });
    },

    replyToReview: async (reviewId: number, reply: string) => {
        set({ isLoading: true, error: null });
        try {
            await reviewApi.replyToReview(reviewId, reply);

            // Update local state
            const reviews = get().reviews.map(r =>
                r.id === reviewId
                    ? { ...r, status: 'replied' as const, reply, replyDate: new Date().toISOString() }
                    : r
            );

            set({ reviews, isLoading: false });
            get().calculateStats();
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to reply',
                isLoading: false,
            });
            return false;
        }
    },

    flagReview: async (reviewId: number, reason: string) => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Implement API call when endpoint is available
            await new Promise(resolve => setTimeout(resolve, 500));

            const reviews = get().reviews.map(r =>
                r.id === reviewId ? { ...r, status: 'flagged' as const } : r
            );

            set({ reviews, isLoading: false });
            get().calculateStats();
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to flag review',
                isLoading: false,
            });
            return false;
        }
    },

    setFilters: (filters: ReviewFilters) => {
        set({ filters });
        get().fetchReviews(0);
    },

    setPage: (page: number) => {
        set({ currentPage: page });
        get().fetchReviews(page);
    },

    clearError: () => set({ error: null }),

    setCompanyId: (companyId: number) => set({ companyId }),
}));
