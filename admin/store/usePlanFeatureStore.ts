import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
    active: boolean;
    features?: Feature[];
}

export interface CreatePlanData {
    name: string;
    description: string;
    price: number;
    durationDays: number;
    active: boolean;
}

export interface CreateFeatureData {
    name: string;
    description?: string;
}

// ==================== Store Interface ====================

interface PlanFeatureStore {
    // State
    plans: Plan[];
    features: Feature[];
    currentPlan: Plan | null;
    currentFeature: Feature | null;
    planFeatures: Feature[];
    isLoading: boolean;
    error: string | null;

    // Plan Actions
    fetchPlans: () => Promise<void>;
    fetchPlanById: (id: number) => Promise<void>;
    createPlan: (data: CreatePlanData) => Promise<boolean>;
    updatePlan: (id: number, data: CreatePlanData) => Promise<boolean>;
    deletePlan: (id: number) => Promise<boolean>;

    // Feature Actions
    fetchFeatures: () => Promise<void>;
    fetchFeatureById: (id: number) => Promise<void>;
    fetchFeaturesByPlanId: (planId: number) => Promise<void>;
    createFeature: (data: CreateFeatureData) => Promise<boolean>;
    updateFeature: (id: number, data: CreateFeatureData) => Promise<boolean>;
    deleteFeature: (id: number) => Promise<boolean>;

    // Utility
    clearError: () => void;
    clearCurrentPlan: () => void;
    clearCurrentFeature: () => void;
}

// ==================== Store Implementation ====================

const usePlanFeatureStore = create<PlanFeatureStore>()(
    devtools(
        (set, get) => ({
            // Initial State
            plans: [],
            features: [],
            currentPlan: null,
            currentFeature: null,
            planFeatures: [],
            isLoading: false,
            error: null,

            // ==================== Plan Actions ====================

            // Get all plans
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
                    set({ plans: data, isLoading: false });
                } catch (error) {
                    console.error('Fetch plans error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch plans',
                        isLoading: false,
                    });
                }
            },

            // Get plan by ID
            fetchPlanById: async (id: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/plan/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch plan');
                    }

                    const data = await response.json();
                    set({ currentPlan: data, isLoading: false });
                } catch (error) {
                    console.error('Fetch plan by ID error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch plan',
                        isLoading: false,
                    });
                }
            },

            // Create new plan
            createPlan: async (data: CreatePlanData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/plan`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Failed to create plan');
                    }

                    const newPlan = await response.json();
                    set((state) => ({
                        plans: [...state.plans, newPlan],
                        isLoading: false,
                    }));
                    return true;
                } catch (error) {
                    console.error('Create plan error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to create plan',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Update plan
            updatePlan: async (id: number, data: CreatePlanData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/plan/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Failed to update plan');
                    }

                    const updatedPlan = await response.json();
                    set((state) => ({
                        plans: state.plans.map((p) => (p.id === id ? updatedPlan : p)),
                        currentPlan: state.currentPlan?.id === id ? updatedPlan : state.currentPlan,
                        isLoading: false,
                    }));
                    return true;
                } catch (error) {
                    console.error('Update plan error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update plan',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Delete plan
            deletePlan: async (id: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/plan/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete plan');
                    }

                    set((state) => ({
                        plans: state.plans.filter((p) => p.id !== id),
                        isLoading: false,
                    }));
                    return true;
                } catch (error) {
                    console.error('Delete plan error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to delete plan',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // ==================== Feature Actions ====================

            // Get all features
            fetchFeatures: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/feature`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch features');
                    }

                    const data = await response.json();
                    set({ features: data, isLoading: false });
                } catch (error) {
                    console.error('Fetch features error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch features',
                        isLoading: false,
                    });
                }
            },

            // Get feature by ID
            fetchFeatureById: async (id: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/feature/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch feature');
                    }

                    const data = await response.json();
                    set({ currentFeature: data, isLoading: false });
                } catch (error) {
                    console.error('Fetch feature by ID error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch feature',
                        isLoading: false,
                    });
                }
            },

            // Get features by plan ID
            fetchFeaturesByPlanId: async (planId: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/feature/plan/${planId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch plan features');
                    }

                    const data = await response.json();
                    set({ planFeatures: data, isLoading: false });
                } catch (error) {
                    console.error('Fetch features by plan ID error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch plan features',
                        isLoading: false,
                    });
                }
            },

            // Create new feature
            createFeature: async (data: CreateFeatureData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/feature`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Failed to create feature');
                    }

                    const newFeature = await response.json();
                    set((state) => ({
                        features: [...state.features, newFeature],
                        isLoading: false,
                    }));
                    return true;
                } catch (error) {
                    console.error('Create feature error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to create feature',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Update feature
            updateFeature: async (id: number, data: CreateFeatureData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/feature/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Failed to update feature');
                    }

                    const updatedFeature = await response.json();
                    set((state) => ({
                        features: state.features.map((f) => (f.id === id ? updatedFeature : f)),
                        currentFeature: state.currentFeature?.id === id ? updatedFeature : state.currentFeature,
                        isLoading: false,
                    }));
                    return true;
                } catch (error) {
                    console.error('Update feature error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update feature',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Delete feature
            deleteFeature: async (id: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/feature/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete feature');
                    }

                    set((state) => ({
                        features: state.features.filter((f) => f.id !== id),
                        isLoading: false,
                    }));
                    return true;
                } catch (error) {
                    console.error('Delete feature error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to delete feature',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // ==================== Utility ====================

            clearError: () => set({ error: null }),
            clearCurrentPlan: () => set({ currentPlan: null }),
            clearCurrentFeature: () => set({ currentFeature: null }),
        }),
        { name: 'plan-feature-store' }
    )
);

export default usePlanFeatureStore;
