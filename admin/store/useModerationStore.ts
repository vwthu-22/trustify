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
    user?: {
        name?: string;
        fullName?: string;
        email?: string;
        avatarUrl?: string;
        avatar?: string; // Added for fallback
    };
    fullName?: string;
    name?: string;
    nameUser?: string;
    userAvatar?: string;
    avatarUrl?: string;
    avatar?: string; // Added for fallback
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
    reviewerAvatar?: string;
    companyName: string;
    reason: string;
    status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
    createdAt: string;
    originalReview: ReviewReport;
}

// Pending review for approval
export interface PendingReview {
    id: number;
    title: string;
    description: string;
    rating: number;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    companyName: string;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface ModerationState {
    reports: Report[];
    pendingReviews: PendingReview[];
    isLoading: boolean;
    isPendingLoading: boolean;
    error: string | null;

    // Actions for reports
    fetchReports: () => Promise<void>;
    dismissReport: (report: Report) => Promise<void>;
    bulkDismissReports: (reports: Report[]) => Promise<void>;
    deleteReview: (report: Report) => Promise<void>;

    // Actions for pending reviews
    fetchPendingReviews: () => Promise<void>;
    approveReview: (reviewId: number) => Promise<void>;
    rejectReview: (reviewId: number) => Promise<void>;
    bulkApproveReviews: (reviewIds: number[]) => Promise<void>;
    bulkRejectReviews: (reviewIds: number[]) => Promise<void>;
}

export const useModerationStore = create<ModerationState>((set, get) => ({
    reports: [],
    pendingReviews: [],
    isLoading: false,
    isPendingLoading: false,
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
                } else if (data.reviews && Array.isArray(data.reviews)) {
                    reviewList = data.reviews;
                } else if (data.reports && Array.isArray(data.reports)) {
                    reviewList = data.reports;
                } else {
                    // Try to treat as Map or unknown object
                    reviewList = Object.values(data).filter(item => typeof item === 'object' && item !== null) as ReviewReport[];
                }
                console.log('Admin Moderation - Parsed List:', reviewList);

                // Transform to Report format
                const reports: Report[] = reviewList
                    .filter(r => {
                        const hasReport = !!r.contendReport;
                        if (!hasReport) console.log('Skipping review without report:', r.id);
                        return hasReport;
                    }) // Only show reviews with reports
                    .map(r => ({
                        id: r.id,
                        reviewId: r.id,
                        reviewTitle: r.title,
                        reviewContent: r.description,
                        reviewRating: r.rating,
                        reviewerName: r.userName || r.user?.name || r.user?.fullName || r.fullName || r.name || r.nameUser || (r.userEmail || r.email || '').split('@')[0] || 'User',
                        reviewerEmail: r.userEmail || r.email || '',
                        reviewerAvatar: r.userAvatar || r.avatarUrl || r.user?.avatarUrl || r.user?.avatar || r.avatar || '',
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
                    id: (report.originalReview as any).id,
                    title: (report.originalReview as any).title,
                    description: (report.originalReview as any).description,
                    rating: (report.originalReview as any).rating,
                    reply: (report.originalReview as any).reply || null,
                    email: (report.originalReview as any).email || (report.originalReview as any).user?.email || '',
                    companyName: (report.originalReview as any).companyName || (report.originalReview as any).company?.name || '',
                    expDate: Array.isArray((report.originalReview as any).expDate)
                        ? new Date().toISOString()
                        : (report.originalReview as any).expDate || new Date().toISOString(),
                    contendReport: '',
                    status: 'approved'
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

    // Bulk dismiss reports
    bulkDismissReports: async (reports: Report[]) => {
        try {
            const promises = reports.map(report =>
                fetch(`${API_BASE_URL}/api/review/${report.reviewId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({
                        id: (report.originalReview as any).id,
                        title: (report.originalReview as any).title,
                        description: (report.originalReview as any).description,
                        rating: (report.originalReview as any).rating,
                        reply: (report.originalReview as any).reply || null,
                        email: (report.originalReview as any).email || (report.originalReview as any).user?.email || '',
                        companyName: (report.originalReview as any).companyName || (report.originalReview as any).company?.name || '',
                        expDate: Array.isArray((report.originalReview as any).expDate)
                            ? new Date().toISOString()
                            : (report.originalReview as any).expDate || new Date().toISOString(),
                        contendReport: '',
                        status: 'approved'
                    })
                })
            );

            const results = await Promise.allSettled(promises);
            const successfulIds = reports.filter((_, index) =>
                results[index].status === 'fulfilled' && (results[index] as PromiseFulfilledResult<Response>).value.ok
            ).map(r => r.id);

            if (successfulIds.length > 0) {
                set(state => ({
                    reports: state.reports.map(r =>
                        successfulIds.includes(r.id) ? { ...r, status: 'DISMISSED' as const } : r
                    )
                }));
            }
        } catch (err) {
            console.error('Error bulk dismissing reports:', err);
        }
    },

    // Delete review -> Mark as REJECTED
    deleteReview: async (report: Report) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/${report.reviewId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    id: (report.originalReview as any).id,
                    title: (report.originalReview as any).title,
                    description: (report.originalReview as any).description,
                    rating: (report.originalReview as any).rating,
                    reply: (report.originalReview as any).reply || null,
                    email: (report.originalReview as any).email || (report.originalReview as any).user?.email || '',
                    companyName: (report.originalReview as any).companyName || (report.originalReview as any).company?.name || '',
                    expDate: Array.isArray((report.originalReview as any).expDate)
                        ? new Date().toISOString()
                        : (report.originalReview as any).expDate || new Date().toISOString(),
                    contendReport: '',
                    status: 'rejected'
                })
            });

            if (response.ok) {
                set(state => ({
                    reports: state.reports.map(r =>
                        r.id === report.id ? { ...r, status: 'RESOLVED' as const } : r
                    )
                }));
            } else {
                set({ error: 'Failed to delete review' });
            }
        } catch (err) {
            console.error('Error deleting review:', err);
            set({ error: 'Error deleting review' });
        }
    },

    // Fetch pending reviews (status = 'pending')
    fetchPendingReviews: async () => {
        set({ isPendingLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/admin/review/pending?page=0&size=100`, {
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Admin Moderation - Pending Reviews Data:', data);

                // The backend returns { reviews: [], totalElements: X, ... }
                const reviewList: any[] = data.reviews || [];

                // Debug: Log first review to see available fields
                if (reviewList.length > 0) {
                    console.log('Admin Moderation - Sample pending review:', reviewList[0]);
                    console.log('Admin Moderation - Avatar fields:', {
                        userAvatar: reviewList[0].userAvatar,
                        avatarUrl: reviewList[0].avatarUrl,
                        'user?.avatarUrl': reviewList[0].user?.avatarUrl,
                        'user?.avatar': reviewList[0].user?.avatar,
                        avatar: reviewList[0].avatar
                    });
                }

                const pendingReviews: PendingReview[] = reviewList.map(r => ({
                    id: r.id,
                    title: r.title,
                    description: r.description,
                    rating: r.rating,
                    userName: r.userName || r.user?.name || r.user?.fullName || r.fullName || r.name || r.nameUser || (r.userEmail || r.email || '').split('@')[0] || 'User',
                    userEmail: r.userEmail || r.user?.email || r.email || '',
                    userAvatar: r.userAvatar || r.avatarUrl || r.user?.avatarUrl || r.user?.avatar || r.avatar || '',
                    companyName: r.companyName || r.company?.name || '',
                    createdAt: r.createdAt || r.expDate || new Date().toISOString(),
                    status: 'pending' as const
                }));

                set({ pendingReviews, isPendingLoading: false });
            } else {
                set({ error: 'Failed to fetch pending reviews', isPendingLoading: false });
            }
        } catch (err) {
            console.error('Error fetching pending reviews:', err);
            set({ error: 'Error loading pending reviews', isPendingLoading: false });
        }
    },

    // Approve review
    approveReview: async (reviewId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/review/${reviewId}/status?status=APPROVED`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                set(state => ({
                    pendingReviews: state.pendingReviews.filter(r => r.id !== reviewId)
                }));
            } else {
                set({ error: 'Failed to approve review' });
            }
        } catch (err) {
            console.error('Error approving review:', err);
            set({ error: 'Error approving review' });
        }
    },

    // Reject review
    rejectReview: async (reviewId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/review/${reviewId}/status?status=REJECTED`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                set(state => ({
                    pendingReviews: state.pendingReviews.filter(r => r.id !== reviewId)
                }));
            } else {
                set({ error: 'Failed to reject review' });
            }
        } catch (err) {
            console.error('Error rejecting review:', err);
            set({ error: 'Error rejecting review' });
        }
    },

    // Bulk approve reviews
    bulkApproveReviews: async (reviewIds: number[]) => {
        try {
            // Process all approvals in parallel using the new endpoint
            const promises = reviewIds.map(reviewId =>
                fetch(`${API_BASE_URL}/admin/review/${reviewId}/status?status=APPROVED`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                })
            );

            const results = await Promise.allSettled(promises);
            const successfulIds = reviewIds.filter((_, index) =>
                results[index].status === 'fulfilled' && (results[index] as PromiseFulfilledResult<Response>).value.ok
            );

            if (successfulIds.length > 0) {
                set(state => ({
                    pendingReviews: state.pendingReviews.filter(r => !successfulIds.includes(r.id))
                }));
            }

            if (successfulIds.length < reviewIds.length) {
                set({ error: `Đã duyệt ${successfulIds.length}/${reviewIds.length} bình luận` });
            }
        } catch (err) {
            console.error('Error bulk approving reviews:', err);
            set({ error: 'Error bulk approving reviews' });
        }
    },

    // Bulk reject reviews
    bulkRejectReviews: async (reviewIds: number[]) => {
        try {
            // Process all rejections in parallel using the new endpoint
            const promises = reviewIds.map(reviewId =>
                fetch(`${API_BASE_URL}/admin/review/${reviewId}/status?status=REJECTED`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                })
            );

            const results = await Promise.allSettled(promises);
            const successfulIds = reviewIds.filter((_, index) =>
                results[index].status === 'fulfilled' && (results[index] as PromiseFulfilledResult<Response>).value.ok
            );

            if (successfulIds.length > 0) {
                set(state => ({
                    pendingReviews: state.pendingReviews.filter(r => !successfulIds.includes(r.id))
                }));
            }

            if (successfulIds.length < reviewIds.length) {
                set({ error: `Đã từ chối ${successfulIds.length}/${reviewIds.length} bình luận` });
            }
        } catch (err) {
            console.error('Error bulk rejecting reviews:', err);
            set({ error: 'Error bulk rejecting reviews' });
        }
    }
}));

