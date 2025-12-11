import { create } from 'zustand';

// Types
export interface AnalyticsData {
    period: string;
    reviews: number;
    averageRating: number;
    responseRate: number;
    responseTime: number; // in hours
}

export interface SentimentData {
    positive: number;
    neutral: number;
    negative: number;
}

export interface TopicData {
    topic: string;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
}

export interface BranchData {
    branchId: string;
    branchName: string;
    totalReviews: number;
    averageRating: number;
    responseRate: number;
}

export interface DashboardStats {
    totalReviews: number;
    reviewsThisMonth: number;
    reviewsChange: number; // percentage change
    averageRating: number;
    ratingChange: number;
    responseRate: number;
    responseRateChange: number;
    trustScore: number;
    trustScoreChange: number;
}

interface AnalyticsStore {
    // State
    dashboardStats: DashboardStats | null;
    analyticsData: AnalyticsData[];
    sentimentData: SentimentData | null;
    topicsData: TopicData[];
    branchesData: BranchData[];
    dateRange: { from: string; to: string };
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchDashboardStats: () => Promise<void>;
    fetchAnalyticsData: (period: 'week' | 'month' | 'year') => Promise<void>;
    fetchSentimentData: () => Promise<void>;
    fetchTopicsData: () => Promise<void>;
    fetchBranchesData: () => Promise<void>;
    setDateRange: (from: string, to: string) => void;
    clearError: () => void;
}

// Mock data
const mockDashboardStats: DashboardStats = {
    totalReviews: 1250,
    reviewsThisMonth: 87,
    reviewsChange: 12.5,
    averageRating: 4.3,
    ratingChange: 0.2,
    responseRate: 92,
    responseRateChange: 5,
    trustScore: 85,
    trustScoreChange: 3
};

const mockAnalyticsData: AnalyticsData[] = [
    { period: 'Jan', reviews: 45, averageRating: 4.2, responseRate: 88, responseTime: 4.5 },
    { period: 'Feb', reviews: 52, averageRating: 4.3, responseRate: 90, responseTime: 4.2 },
    { period: 'Mar', reviews: 48, averageRating: 4.1, responseRate: 85, responseTime: 5.0 },
    { period: 'Apr', reviews: 61, averageRating: 4.4, responseRate: 92, responseTime: 3.8 },
    { period: 'May', reviews: 55, averageRating: 4.3, responseRate: 91, responseTime: 4.0 },
    { period: 'Jun', reviews: 67, averageRating: 4.5, responseRate: 94, responseTime: 3.5 },
];

const mockSentimentData: SentimentData = {
    positive: 72,
    neutral: 18,
    negative: 10
};

const mockTopicsData: TopicData[] = [
    { topic: 'Chất lượng sản phẩm', count: 145, sentiment: 'positive' },
    { topic: 'Dịch vụ khách hàng', count: 98, sentiment: 'positive' },
    { topic: 'Giao hàng', count: 76, sentiment: 'neutral' },
    { topic: 'Giá cả', count: 54, sentiment: 'negative' },
    { topic: 'Đóng gói', count: 43, sentiment: 'positive' },
];

const mockBranchesData: BranchData[] = [
    { branchId: '1', branchName: 'Chi nhánh Hà Nội', totalReviews: 450, averageRating: 4.5, responseRate: 95 },
    { branchId: '2', branchName: 'Chi nhánh TP.HCM', totalReviews: 380, averageRating: 4.3, responseRate: 90 },
    { branchId: '3', branchName: 'Chi nhánh Đà Nẵng', totalReviews: 220, averageRating: 4.4, responseRate: 88 },
    { branchId: '4', branchName: 'Chi nhánh Cần Thơ', totalReviews: 150, averageRating: 4.2, responseRate: 85 },
];

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
    dashboardStats: null,
    analyticsData: [],
    sentimentData: null,
    topicsData: [],
    branchesData: [],
    dateRange: { from: '', to: '' },
    isLoading: false,
    error: null,

    fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/dashboard`);
            // const data = await response.json();

            await new Promise(resolve => setTimeout(resolve, 500));

            set({ dashboardStats: mockDashboardStats, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
                isLoading: false,
            });
        }
    },

    fetchAnalyticsData: async (period: 'week' | 'month' | 'year') => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            set({ analyticsData: mockAnalyticsData, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch analytics',
                isLoading: false,
            });
        }
    },

    fetchSentimentData: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            set({ sentimentData: mockSentimentData, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch sentiment data',
                isLoading: false,
            });
        }
    },

    fetchTopicsData: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            set({ topicsData: mockTopicsData, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch topics data',
                isLoading: false,
            });
        }
    },

    fetchBranchesData: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            set({ branchesData: mockBranchesData, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch branches data',
                isLoading: false,
            });
        }
    },

    setDateRange: (from: string, to: string) => {
        set({ dateRange: { from, to } });
    },

    clearError: () => set({ error: null }),
}));
