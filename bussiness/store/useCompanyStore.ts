import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface Company {
    id: string;
    name: string;
    email: string;
    logo?: string;
    plan: 'Free' | 'Pro' | 'Premium';
    verified: boolean;
    website?: string;
    industry?: string;
    address?: string;
    phone?: string;
}

interface CompanyStore {
    company: Company | null;
    isLoading: boolean;
    error: string | null;
    magicLinkSent: boolean; // Track if magic link was sent

    // Actions
    setCompany: (company: Company) => void;
    updateCompany: (updates: Partial<Company>) => void;
    clearCompany: () => void;
    fetchCompanyProfile: () => Promise<void>;

    // Authentication actions
    sendMagicLink: (email: string) => Promise<boolean>;
    verifyMagicLink: (code: string) => Promise<boolean>;
    checkAuthStatus: () => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
    resetMagicLinkState: () => void;
}

export const useCompanyStore = create<CompanyStore>()(
    persist(
        (set, get) => ({
            company: null,
            isLoading: false,
            error: null,
            magicLinkSent: false,

            setCompany: (company: Company) => set({ company, error: null }),

            updateCompany: (updates: Partial<Company>) =>
                set((state) => ({
                    company: state.company ? { ...state.company, ...updates } : null,
                })),

            clearCompany: () => set({ company: null, error: null }),

            clearError: () => set({ error: null }),

            resetMagicLinkState: () => set({ magicLinkSent: false, error: null }),

            fetchCompanyProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/my-companies`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch company profile');
                    }

                    const data = await response.json();
                    set({ company: data, isLoading: false });
                } catch (error) {
                    console.error('Fetch profile error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'An error occurred',
                        isLoading: false,
                    });
                }
            },

            // Send magic link to email
            // API: POST /api/auth/magic-link?email=xxx
            sendMagicLink: async (email: string) => {
                set({ isLoading: true, error: null, magicLinkSent: false });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/auth/magic-link?email=${encodeURIComponent(email)}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Failed to send magic link');
                    }

                    const result = await response.text();
                    console.log('Magic link response:', result);

                    set({ isLoading: false, magicLinkSent: true });
                    return true;
                } catch (error) {
                    console.error('Send magic link error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to send magic link',
                        isLoading: false,
                        magicLinkSent: false,
                    });
                    return false;
                }
            },

            // Verify magic link code and get JWT
            // API: GET /api/auth/magic-link/{code}
            verifyMagicLink: async (code: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/auth/magic-link/${code}`, {
                        method: 'GET',
                        credentials: 'include', // Important: to receive HttpOnly cookie
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    const data = await response.json();

                    if (!response.ok || data.error === 'Invalid or expired state code') {
                        throw new Error(data.error || 'Invalid or expired magic link');
                    }

                    console.log('Magic link verified:', data);

                    // JWT is set via HttpOnly cookie by the server
                    // Set local auth cookie for middleware
                    document.cookie = 'auth-token=authenticated; path=/; max-age=3600';

                    set({ isLoading: false, magicLinkSent: false });

                    // Fetch company profile after successful auth
                    await get().fetchCompanyProfile();

                    return true;
                } catch (error) {
                    console.error('Verify magic link error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Invalid or expired magic link',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Check if user is authenticated (by checking if JWT cookie is valid)
            checkAuthStatus: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/my-companies`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({ company: data });
                        return true;
                    }
                    return false;
                } catch {
                    return false;
                }
            },

            // Logout
            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await fetch(`${API_BASE_URL}/api/auth/logout`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({ company: null, isLoading: false, error: null, magicLinkSent: false });
                    // Clear local auth cookie
                    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
            },
        }),
        {
            name: 'company-storage',
        }
    )
);

