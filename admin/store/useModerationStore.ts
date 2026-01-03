import { create } from 'zustand';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface Report {
    id: number;
    reviewId: number;
    reviewTitle: string;
    reviewContent: string;
    reviewRating: number;
    reviewerName: string;
    reviewerEmail: string;
    companyName: string;
    reason: string;
    description?: string;
    reporterName?: string;
    reporterEmail?: string;
    status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
    createdAt: string;
}

interface ModerationState {
    reports: Report[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchReports: () => Promise<void>;
    dismissReport: (reportId: number) => Promise<void>;
    deleteReview: (report: Report) => Promise<void>;
}

export const useModerationStore = create<ModerationState>((set, get) => ({
    reports: [],
    isLoading: false,
    error: null,

    fetchReports: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/allReports`, {
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Handle different response formats
                const reportList = Array.isArray(data) ? data : data.content || data.reports || [];
                set({ reports: reportList, isLoading: false });
            } else {
                set({ error: 'Failed to fetch reports', isLoading: false });
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            set({ error: 'Error loading reports', isLoading: false });
        }
    },

    dismissReport: async (reportId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/report/${reportId}/dismiss`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                set(state => ({
                    reports: state.reports.map(r =>
                        r.id === reportId ? { ...r, status: 'DISMISSED' as const } : r
                    )
                }));
            }
        } catch (err) {
            console.error('Error dismissing report:', err);
        }
    },

    deleteReview: async (report: Report) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/${report.reviewId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                set(state => ({
                    reports: state.reports.map(r =>
                        r.id === report.id ? { ...r, status: 'RESOLVED' as const } : r
                    )
                }));
            }
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    }
}));
