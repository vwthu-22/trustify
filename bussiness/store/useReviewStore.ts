import { create } from 'zustand';

// Types
export interface Review {
    id: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string;
    content: string;
    status: 'pending' | 'replied' | 'flagged';
    reply?: string;
    repliedAt?: string;
    createdAt: string;
    source: 'website' | 'email' | 'invitation';
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

    // Actions
    fetchReviews: (filters?: ReviewFilters) => Promise<void>;
    fetchStats: () => Promise<void>;
    replyToReview: (reviewId: string, reply: string) => Promise<boolean>;
    flagReview: (reviewId: string, reason: string) => Promise<boolean>;
    setFilters: (filters: ReviewFilters) => void;
    setPage: (page: number) => void;
    clearError: () => void;
}

// Mock data for development
const mockReviews: Review[] = [
    {
        id: '1',
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@email.com',
        rating: 5,
        title: 'Dịch vụ tuyệt vời!',
        content: 'Tôi rất hài lòng với dịch vụ của công ty. Nhân viên nhiệt tình và chuyên nghiệp.',
        status: 'pending',
        createdAt: '2024-12-10T10:30:00Z',
        source: 'website'
    },
    {
        id: '2',
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@email.com',
        rating: 4,
        title: 'Khá tốt',
        content: 'Sản phẩm chất lượng, giao hàng nhanh. Sẽ quay lại lần sau.',
        status: 'replied',
        reply: 'Cảm ơn bạn đã tin tưởng! Chúng tôi luôn cố gắng phục vụ tốt nhất.',
        repliedAt: '2024-12-09T14:00:00Z',
        createdAt: '2024-12-08T09:15:00Z',
        source: 'email'
    },
    {
        id: '3',
        customerName: 'Lê Văn C',
        customerEmail: 'levanc@email.com',
        rating: 3,
        title: 'Cần cải thiện',
        content: 'Dịch vụ ổn nhưng thời gian chờ đợi hơi lâu.',
        status: 'pending',
        createdAt: '2024-12-07T16:45:00Z',
        source: 'invitation'
    }
];

const mockStats: ReviewStats = {
    totalReviews: 156,
    averageRating: 4.2,
    pendingCount: 12,
    repliedCount: 144,
    ratingDistribution: { 1: 5, 2: 8, 3: 20, 4: 48, 5: 75 }
};

export const useReviewStore = create<ReviewStore>((set, get) => ({
    reviews: [],
    stats: null,
    filters: {},
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,

    fetchReviews: async (filters?: ReviewFilters) => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ ...get().filters, ...filters }),
            //     credentials: 'include',
            // });
            // const data = await response.json();

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 500));

            set({
                reviews: mockReviews,
                totalPages: 1,
                isLoading: false,
                filters: { ...get().filters, ...filters }
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch reviews',
                isLoading: false,
            });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/stats`, {
            //     credentials: 'include',
            // });
            // const data = await response.json();

            await new Promise(resolve => setTimeout(resolve, 300));

            set({ stats: mockStats, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch stats',
                isLoading: false,
            });
        }
    },

    replyToReview: async (reviewId: string, reply: string) => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}/reply`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ reply }),
            //     credentials: 'include',
            // });

            await new Promise(resolve => setTimeout(resolve, 500));

            // Update local state
            const reviews = get().reviews.map(r =>
                r.id === reviewId
                    ? { ...r, status: 'replied' as const, reply, repliedAt: new Date().toISOString() }
                    : r
            );

            set({ reviews, isLoading: false });
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to reply',
                isLoading: false,
            });
            return false;
        }
    },

    flagReview: async (reviewId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const reviews = get().reviews.map(r =>
                r.id === reviewId ? { ...r, status: 'flagged' as const } : r
            );

            set({ reviews, isLoading: false });
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
        get().fetchReviews(filters);
    },

    setPage: (page: number) => {
        set({ currentPage: page });
        get().fetchReviews();
    },

    clearError: () => set({ error: null }),
}));
