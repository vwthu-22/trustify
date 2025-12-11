import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

    // Actions
    setCompany: (company: Company) => void;
    updateCompany: (updates: Partial<Company>) => void;
    clearCompany: () => void;
    fetchCompanyProfile: () => Promise<void>;

    // Authentication actions
    sendVerificationCode: (email: string) => Promise<boolean>;
    verifyCode: (email: string, code: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>()(
    persist(
        (set, get) => ({
            company: null,
            isLoading: false,
            error: null,

            setCompany: (company: Company) => set({ company, error: null }),

            updateCompany: (updates: Partial<Company>) =>
                set((state) => ({
                    company: state.company ? { ...state.company, ...updates } : null,
                })),

            clearCompany: () => set({ company: null, error: null }),

            fetchCompanyProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/profile`, {
                    //     credentials: 'include',
                    //     headers: { 'Content-Type': 'application/json' },
                    // });
                    // const data = await response.json();

                    // Mock delay
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Mock data - remove when API is ready
                    const mockCompany: Company = {
                        id: '1',
                        name: 'Công ty ABC',
                        email: 'contact@abc.com',
                        plan: 'Free',
                        verified: false,
                        website: 'https://abc.com',
                        industry: 'Technology',
                    };

                    set({ company: mockCompany, isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'An error occurred',
                        isLoading: false,
                    });
                }
            },

            // Send verification code to email
            sendVerificationCode: async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification-code`, {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ email }),
                    // });

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to send verification code',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Verify code and login
            verifyCode: async (email: string, code: string) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`, {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ email, code }),
                    // });
                    // const data = await response.json();

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Set auth cookie
                    document.cookie = 'auth-token=logged-in; path=/; max-age=86400';

                    // Mock company data - replace with API response
                    const mockCompany: Company = {
                        id: '1',
                        name: email.split('@')[0],
                        email: email,
                        plan: 'Free',
                        verified: false,
                    };

                    set({
                        company: mockCompany,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Invalid verification code',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Logout
            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Replace with actual API call
                    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                    //     method: 'POST',
                    //     credentials: 'include',
                    // });

                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({ company: null, isLoading: false, error: null });
                    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
            },
        }),
        {
            name: 'company-storage',
        }
    )
);
