import { create } from 'zustand';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// ==================== Interfaces ====================

export interface Feature {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    features: Feature[];
    active: boolean;
}

interface PlanStore {
    plans: Plan[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchPlans: () => Promise<void>;
    clearError: () => void;
}

// ==================== Store ====================

const usePlanStore = create<PlanStore>((set) => ({
    plans: [],
    isLoading: false,
    error: null,

    // Fetch all active plans
    fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/api/plan`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch plans');
            }

            const data = await response.json();

            // Filter only active plans for business users
            const activePlans = data.filter((plan: Plan) => plan.active);

            console.log('Fetched active plans:', activePlans);
            set({ plans: activePlans, isLoading: false });
        } catch (error) {
            console.error('Fetch plans error:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch plans',
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));

export default usePlanStore;
