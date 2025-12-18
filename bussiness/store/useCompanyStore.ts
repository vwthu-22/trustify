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
                    console.log('Company profile response:', data);

                    // Handle different API response formats
                    let companyData = null;

                    // Format: { success: true, company: {...} }
                    if (data.success && data.company) {
                        companyData = data.company;
                    }
                    // Format: array of companies
                    else if (Array.isArray(data)) {
                        companyData = data[0] || null;
                    }
                    // Format: { companies: [...] }
                    else if (data.companies && Array.isArray(data.companies)) {
                        companyData = data.companies[0] || null;
                    }
                    // Format: paginated { content: [...] }
                    else if (data.content && Array.isArray(data.content)) {
                        companyData = data.content[0] || null;
                    }
                    // Format: direct object (no wrapper)
                    else if (data.id || data.name) {
                        companyData = data;
                    }

                    // Map API response to our Company interface
                    if (companyData) {
                        const company: Company = {
                            id: companyData.id?.toString() || '',
                            name: companyData.name || companyData.companyName || '',
                            email: companyData.email || companyData.workEmail || '',
                            logo: companyData.logo || companyData.logoUrl || '',
                            plan: companyData.plan?.name || companyData.planName || 'Free',
                            verified: companyData.verified ?? companyData.isVerified ?? false,
                            website: companyData.website || '',
                            industry: companyData.industry || '',
                            address: companyData.address || '',
                            phone: companyData.phone || companyData.phoneNumber || '',
                        };
                        set({ company, isLoading: false });
                    } else {
                        console.error('No company data found in response');
                        set({ company: null, isLoading: false });
                    }
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

                    // JWT is set via HttpOnly cookie (access_token) by the server

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

                        // Handle different API response formats
                        let companyData = null;

                        if (data.success && data.company) {
                            companyData = data.company;
                        } else if (Array.isArray(data)) {
                            companyData = data[0] || null;
                        } else if (data.companies && Array.isArray(data.companies)) {
                            companyData = data.companies[0] || null;
                        } else if (data.content && Array.isArray(data.content)) {
                            companyData = data.content[0] || null;
                        } else if (data.id || data.name) {
                            companyData = data;
                        }

                        if (companyData) {
                            const company: Company = {
                                id: companyData.id?.toString() || '',
                                name: companyData.name || companyData.companyName || '',
                                email: companyData.email || companyData.workEmail || '',
                                logo: companyData.logo || companyData.logoUrl || '',
                                plan: companyData.plan?.name || companyData.planName || 'Free',
                                verified: companyData.verified ?? companyData.isVerified ?? false,
                                website: companyData.website || '',
                                industry: companyData.industry || '',
                                address: companyData.address || '',
                                phone: companyData.phone || companyData.phoneNumber || '',
                            };
                            set({ company });
                            return true;
                        }
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
                    // Clear access_token cookie
                    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
            },
        }),
        {
            name: 'company-storage',
        }
    )
);

