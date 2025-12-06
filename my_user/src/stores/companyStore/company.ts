import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface Company {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    website: string;
    description?: string;
    rating: number;
    reviewCount: number;
    address: string;
    city?: string;
    country?: string;
    industry?: string;
    verified: boolean;
    claimed: boolean;
}

interface CompanyState {
    companies: Company[];
    bankCompanies: Company[];
    travelCompanies: Company[];
    currentCompany: Company | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCompanies: (params?: { category?: string; sort?: string; page?: number; limit?: number }) => Promise<void>;
    fetchCompaniesByIndustry: (industry: string, page?: number, size?: number) => Promise<void>;
    fetchBankCompanies: (page?: number, size?: number) => Promise<void>;
    fetchTravelCompanies: (page?: number, size?: number) => Promise<void>;
    fetchCompanyById: (id: string) => Promise<void>;
    fetchCompanyBySlug: (slug: string) => Promise<void>;
    searchCompanies: (query: string) => Promise<void>;
    fetchTopRatedCompanies: (limit?: number) => Promise<void>;
    clearError: () => void;
}

const useCompanyStore = create<CompanyState>()(
    devtools(
        (set) => ({
            companies: [],
            bankCompanies: [],
            travelCompanies: [],
            currentCompany: null,
            isLoading: false,
            error: null,

            // Fetch companies with filters
            fetchCompanies: async (params = {}) => {
                console.log('=== Fetch Companies Start ===');
                console.log('Params:', params);

                set({ isLoading: true, error: null });

                try {
                    const queryParams = new URLSearchParams();
                    if (params.category) queryParams.append('category', params.category);
                    if (params.sort) queryParams.append('sort', params.sort);
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.limit) queryParams.append('limit', params.limit.toString());

                    const url = `${API_BASE_URL}/api/companies?${queryParams.toString()}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Failed to fetch companies');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Fetch Companies Success ===');

                    set({
                        companies: data.companies || data.content || data,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('=== Fetch Companies Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch companies',
                        isLoading: false,
                    });
                }
            },

            // Fetch companies by industry
            fetchCompaniesByIndustry: async (industry: string, page = 0, size = 4) => {
                console.log('=== Fetch Companies By Industry Start ===');
                console.log('Industry:', industry);
                console.log('Page:', page, 'Size:', size);

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/companies/industry/${encodeURIComponent(industry)}?page=${page}&size=${size}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Failed to fetch companies by industry');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Fetch Companies By Industry Success ===');

                    set({
                        companies: data.content || data.companies || data,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('=== Fetch Companies By Industry Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch companies by industry',
                        isLoading: false,
                    });
                }
            },

            // Fetch bank companies (max 3)
            fetchBankCompanies: async (page = 0, size = 3) => {
                console.log('=== Fetch Bank Companies Start ===');

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/companies/industry/Bank?page=${page}&size=${size}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch bank companies');
                    }

                    const data = await response.json();
                    console.log('Bank Companies:', data);

                    set({
                        bankCompanies: data.content || data.companies || data,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Fetch Bank Companies Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch bank companies',
                        isLoading: false,
                    });
                }
            },

            // Fetch travel companies (max 3)
            fetchTravelCompanies: async (page = 0, size = 3) => {
                console.log('=== Fetch Travel Companies Start ===');

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/companies/industry/Travel?page=${page}&size=${size}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch travel companies');
                    }

                    const data = await response.json();
                    console.log('Travel Companies:', data);

                    set({
                        travelCompanies: data.content || data.companies || data,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Fetch Travel Companies Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch travel companies',
                        isLoading: false,
                    });
                }
            },

            // Fetch single company by ID
            fetchCompanyById: async (id: string) => {
                console.log('=== Fetch Company By ID Start ===');
                console.log('ID:', id);

                set({ isLoading: true, error: null, currentCompany: null });

                try {
                    const url = `${API_BASE_URL}/api/companies/${id}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Company not found');
                    }

                    const data = await response.json();
                    console.log('Raw API Response:', data);
                    console.log('Response keys:', Object.keys(data));

                    // Handle different response structures
                    let companyData = data;

                    // If response has a 'company' field, use that
                    if (data.company) {
                        console.log('Using nested company object');
                        companyData = data.company;
                    }
                    // If response has a 'data' field, use that
                    else if (data.data) {
                        console.log('Using nested data object');
                        companyData = data.data;
                    }

                    console.log('Final Company Data:', companyData);
                    console.log('Company Name:', companyData.name || companyData.companyName || 'NOT FOUND');
                    console.log('=== Fetch Company By ID Success ===');

                    set({
                        currentCompany: companyData,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('=== Fetch Company By ID Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch company',
                        isLoading: false,
                    });
                }
            },

            // Fetch single company by slug
            fetchCompanyBySlug: async (slug: string) => {
                console.log('=== Fetch Company By Slug Start ===');
                console.log('Slug:', slug);

                set({ isLoading: true, error: null, currentCompany: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/${slug}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Company not found');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Fetch Company Success ===');

                    set({
                        currentCompany: data.company || data,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('=== Fetch Company Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch company',
                        isLoading: false,
                    });
                }
            },

            // Search companies
            searchCompanies: async (query: string) => {
                console.log('=== Search Companies Start ===');
                console.log('Query:', query);

                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/search?q=${encodeURIComponent(query)}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Search failed');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Search Companies Success ===');

                    set({
                        companies: data.companies || data.results || data,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('=== Search Companies Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Search failed',
                        isLoading: false,
                    });
                }
            },

            // Fetch top rated companies
            fetchTopRatedCompanies: async (limit = 10) => {
                console.log('=== Fetch Top Rated Companies Start ===');
                console.log('Limit:', limit);

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/companies/top-rated?limit=${limit}`;
                    console.log('Fetching from:', url);

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Failed to fetch top rated companies');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Fetch Top Rated Companies Success ===');

                    // Shuffle and take random 3 companies
                    const allCompanies = data.content || data.companies || data;
                    const shuffled = [...allCompanies].sort(() => Math.random() - 0.5);
                    const randomThree = shuffled.slice(0, 3);

                    set({
                        companies: randomThree,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('=== Fetch Top Rated Companies Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch top rated companies',
                        isLoading: false,
                    });
                }
            },

            clearError: () => set({ error: null }),
        }),
        { name: 'company-store' }
    )
);

export default useCompanyStore;
