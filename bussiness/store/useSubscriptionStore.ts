import { create } from 'zustand';

// Types
export interface SubscriptionPlan {
    id: string;
    name: 'Free' | 'Pro' | 'Premium';
    price: number;
    priceYearly: number;
    features: string[];
    limits: {
        reviewsPerMonth: number;
        invitationsPerMonth: number;
        teamMembers: number;
        branches: number;
        apiCalls: number;
    };
}

export interface CompanySubscription {
    planId: string;
    planName: 'Free' | 'Pro' | 'Premium';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    billingCycle: 'monthly' | 'yearly';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export interface Invoice {
    id: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    createdAt: string;
    paidAt?: string;
    invoiceUrl?: string;
}

interface SubscriptionStore {
    // State
    plans: SubscriptionPlan[];
    currentSubscription: CompanySubscription | null;
    invoices: Invoice[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchPlans: () => Promise<void>;
    fetchCurrentSubscription: () => Promise<void>;
    fetchInvoices: () => Promise<void>;
    upgradePlan: (planId: string, billingCycle: 'monthly' | 'yearly') => Promise<boolean>;
    cancelSubscription: () => Promise<boolean>;
    resumeSubscription: () => Promise<boolean>;
    clearError: () => void;
    clearSubscription: () => void;
}

// Mock data
const mockPlans: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        priceYearly: 0,
        features: [
            'Up to 50 reviews/month',
            'Basic analytics',
            'Email support (48h)',
        ],
        limits: {
            reviewsPerMonth: 50,
            invitationsPerMonth: 100,
            teamMembers: 1,
            branches: 1,
            apiCalls: 1000
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 49,
        priceYearly: 470,
        features: [
            'Up to 500 reviews/month',
            'Advanced analytics',
            'Email support (24h)',
            'API access',
            'Multiple team members'
        ],
        limits: {
            reviewsPerMonth: 500,
            invitationsPerMonth: 1000,
            teamMembers: 5,
            branches: 3,
            apiCalls: 10000
        }
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 149,
        priceYearly: 1430,
        features: [
            'Unlimited reviews',
            'Full analytics suite',
            'Priority support (4h)',
            'White-label widgets',
            'Full API access',
            'Unlimited team members',
            'Unlimited branches',
            'Dedicated account manager'
        ],
        limits: {
            reviewsPerMonth: -1, // unlimited
            invitationsPerMonth: -1,
            teamMembers: -1,
            branches: -1,
            apiCalls: -1
        }
    }
];

const mockSubscription: CompanySubscription = {
    planId: 'free',
    planName: 'Free',
    status: 'active',
    billingCycle: 'monthly',
    currentPeriodStart: '2024-12-01T00:00:00Z',
    currentPeriodEnd: '2025-01-01T00:00:00Z',
    cancelAtPeriodEnd: false
};

const mockInvoices: Invoice[] = [
    { id: '1', amount: 0, status: 'paid', createdAt: '2024-12-01T00:00:00Z', paidAt: '2024-12-01T00:00:00Z' },
];

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
    plans: [],
    currentSubscription: null,
    invoices: [],
    isLoading: false,
    error: null,

    fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ plans: mockPlans, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch plans', isLoading: false });
        }
    },

    fetchCurrentSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

            // Try to fetch company's latest successful transaction to get current plan
            const response = await fetch(`${API_BASE_URL}/api/payment/my-transactions`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            // If endpoint doesn't exist (404), we'll fallback to company.plan later
            if (response.status === 404) {
                console.warn('⚠️ Transactions endpoint not found (404). Will use company.plan as fallback.');
                set({ isLoading: false });
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch subscription');
            }

            const transactions = await response.json();

            // Find the latest successful transaction
            const successfulTransactions = Array.isArray(transactions)
                ? transactions.filter((t: any) => t.status === 'SUCCESS')
                : [];

            if (successfulTransactions.length > 0) {
                // Sort by createdAt descending to get the latest
                const latestTransaction = successfulTransactions.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )[0];

                // Fetch plan details to get plan name
                const planResponse = await fetch(`${API_BASE_URL}/api/plans/${latestTransaction.planId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                let planName: 'Free' | 'Pro' | 'Premium' = 'Free';
                if (planResponse.ok) {
                    const planData = await planResponse.json();
                    planName = planData.name || 'Free';
                }

                const subscription: CompanySubscription = {
                    planId: latestTransaction.planId.toString(),
                    planName: planName,
                    status: 'active',
                    billingCycle: 'monthly', // Default, can be enhanced later
                    currentPeriodStart: latestTransaction.createdAt,
                    currentPeriodEnd: new Date(new Date(latestTransaction.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    cancelAtPeriodEnd: false
                };

                set({ currentSubscription: subscription, isLoading: false });
            } else {
                // No successful transactions = Free plan
                set({
                    currentSubscription: {
                        planId: 'free',
                        planName: 'Free',
                        status: 'active',
                        billingCycle: 'monthly',
                        currentPeriodStart: new Date().toISOString(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        cancelAtPeriodEnd: false
                    },
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('Fetch subscription error:', error);
            // Don't set error state, just log it and let header use company.plan as fallback
            set({ isLoading: false });
        }
    },

    fetchInvoices: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ invoices: mockInvoices, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch invoices', isLoading: false });
        }
    },

    upgradePlan: async (planId: string, billingCycle: 'monthly' | 'yearly') => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call - should redirect to payment gateway
            await new Promise(resolve => setTimeout(resolve, 1000));

            const plan = get().plans.find(p => p.id === planId);
            if (plan) {
                set({
                    currentSubscription: {
                        planId,
                        planName: plan.name,
                        status: 'active',
                        billingCycle,
                        currentPeriodStart: new Date().toISOString(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        cancelAtPeriodEnd: false
                    },
                    isLoading: false
                });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to upgrade plan', isLoading: false });
            return false;
        }
    },

    cancelSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const current = get().currentSubscription;
            if (current) {
                set({
                    currentSubscription: { ...current, cancelAtPeriodEnd: true },
                    isLoading: false
                });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to cancel subscription', isLoading: false });
            return false;
        }
    },

    resumeSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const current = get().currentSubscription;
            if (current) {
                set({
                    currentSubscription: { ...current, cancelAtPeriodEnd: false },
                    isLoading: false
                });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to resume subscription', isLoading: false });
            return false;
        }
    },

    clearError: () => set({ error: null }),

    clearSubscription: () => set({
        currentSubscription: null,
        plans: [],
        invoices: [],
        error: null
    }),
}));
