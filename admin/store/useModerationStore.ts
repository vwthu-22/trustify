import { create } from 'zustand';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// API response format from /api/review/allReports
export interface ReviewReport {
    id: number;
    title: string;
    description: string;
    reply?: string;
    email?: string;
    status: string;
    contendReport: string;
    companyName: string;
    rating: number;
    expDate?: string;
    userName?: string;
    userEmail?: string;
}

// Transformed format for display
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
    status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
    createdAt: string;
    originalReview: ReviewReport;
}

interface ModerationState {
    reports: Report[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchReports: () => Promise<void>;
    dismissReport: (report: Report) => Promise<void>;
    deleteReview: (report: Report) => Promise<void>;
}

export const useModerationStore = create<ModerationState>((set, get) => ({
    reports: [],
    isLoading: false,
    error: null,

    fetchReports: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/allReports?page=0&size=100`, {
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Admin Moderation - Raw API Data:', data);

                // Handle different response formats (Array, Page, Map)
                let reviewList: ReviewReport[] = [];
                if (Array.isArray(data)) {
                    reviewList = data;
                } else if (data.content && Array.isArray(data.content)) {
                    reviewList = data.content;
                } else if (data.reports && Array.isArray(data.reports)) {
                    reviewList = data.reports;
                } else {
                    // Try to treat as Map or unknown object
                    reviewList = Object.values(data).filter(item => typeof item === 'object' && item !== null) as ReviewReport[];
                }
                console.log('Admin Moderation - Parsed List:', reviewList);

                // Transform to Report format
                const reports: Report[] = reviewList
                    // .filter(r => {
                    //     const hasReport = !!r.contendReport;
                    //     if (!hasReport) console.log('Skipping review without report:', r.id);
                    //     return hasReport;
                    // }) // Only show reviews with reports
                    .map(r => ({
                        id: r.id,
                        reviewId: r.id,
                        reviewTitle: r.title,
                        reviewContent: r.description,
                        reviewRating: r.rating,
                        reviewerName: r.userName || r.email?.split('@')[0] || 'User',
                        reviewerEmail: r.userEmail || r.email || '',
                        companyName: r.companyName || '',
                        reason: r.contendReport,
                        status: r.status === 'RESOLVED' ? 'RESOLVED' : r.status === 'DISMISSED' ? 'DISMISSED' : 'PENDING',
                        createdAt: r.expDate || new Date().toISOString(),
                        originalReview: r
                    }));

                set({ reports, isLoading: false });
            } else {
                set({ error: 'Failed to fetch reports', isLoading: false });
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            set({ error: 'Error loading reports', isLoading: false });
        }
    },

    // Dismiss report - clear contendReport via PUT
    dismissReport: async (report: Report) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/${report.reviewId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    ...report.originalReview,
                    contendReport: null, // Clear the report
                    status: 'DISMISSED'
                })
            });

            if (response.ok) {
                set(state => ({
                    reports: state.reports.map(r =>
                        r.id === report.id ? { ...r, status: 'DISMISSED' as const } : r
                    )
                }));
            }
        } catch (err) {
            console.error('Error dismissing report:', err);
        }
    },

    // Delete review
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
