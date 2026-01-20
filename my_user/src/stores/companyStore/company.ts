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
    phone?: string;
    email?: string;
    verified: boolean;
    claimed: boolean;
}

interface CompanyState {
    companies: Company[];
    searchResults: Company[];
    bankCompanies: Company[];
    travelCompanies: Company[];
    currentCompany: Company | null;
    isLoading: boolean;
    isSearching: boolean;
    error: string | null;

    // Cache timestamps (5 minutes cache)
    lastFetchTime: number | null;
    lastBankFetchTime: number | null;
    lastTravelFetchTime: number | null;

    // Actions
    fetchCompanies: (params?: { category?: string; sort?: string; page?: number; limit?: number; forceRefresh?: boolean }) => Promise<void>;
    fetchCompaniesByIndustry: (industry: string, page?: number, size?: number) => Promise<void>;
    fetchBankCompanies: (page?: number, size?: number, forceRefresh?: boolean) => Promise<void>;
    fetchTravelCompanies: (page?: number, size?: number, forceRefresh?: boolean) => Promise<void>;
    fetchCompanyById: (id: string) => Promise<void>;
    searchCompanies: (query: string) => Promise<void>;
    clearSearchResults: () => void;
    fetchTopRatedCompanies: (limit?: number) => Promise<void>;
    clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useCompanyStore = create<CompanyState>()(
    devtools(
        (set, get) => ({
            companies: [],
            searchResults: [],
            bankCompanies: [],
            travelCompanies: [],
            currentCompany: null,
            isLoading: false,
            isSearching: false,
            error: null,
            lastFetchTime: null,
            lastBankFetchTime: null,
            lastTravelFetchTime: null,

            // Fetch companies with filters
            fetchCompanies: async (params = {}) => {
                // Check cache unless forceRefresh is true
                const { lastFetchTime, companies } = get();
                const now = Date.now();

                if (!params.forceRefresh && lastFetchTime && companies.length > 0) {
                    const timeSinceLastFetch = now - lastFetchTime;
                    if (timeSinceLastFetch < CACHE_DURATION) {
                        console.log('⚡ Using cached companies data (age:', Math.round(timeSinceLastFetch / 1000), 'seconds)');
                        return;
                    }
                }

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

                    // Map logoUrl to logo for display
                    const companiesList = (data.companies || data.content || data).map((c: any) => ({
                        ...c,
                        id: String(c.id),
                        logo: c.logoUrl || c.logo || '',
                    }));

                    set({
                        companies: companiesList,
                        isLoading: false,
                        lastFetchTime: Date.now()
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
            fetchBankCompanies: async (page = 0, size = 3, forceRefresh = false) => {
                // Check cache unless forceRefresh is true
                const { lastBankFetchTime, bankCompanies } = get();
                const now = Date.now();

                if (!forceRefresh && lastBankFetchTime && bankCompanies.length > 0) {
                    const timeSinceLastFetch = now - lastBankFetchTime;
                    if (timeSinceLastFetch < CACHE_DURATION) {
                        console.log('⚡ Using cached bank companies (age:', Math.round(timeSinceLastFetch / 1000), 'seconds)');
                        return;
                    }
                }

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

                    // Map logoUrl to logo for display
                    const companies = (data.content || data.companies || data).map((c: any) => ({
                        ...c,
                        id: String(c.id),
                        logo: c.logoUrl || c.logo || '',
                    }));

                    set({
                        bankCompanies: companies,
                        isLoading: false,
                        lastBankFetchTime: Date.now()
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
            fetchTravelCompanies: async (page = 0, size = 3, forceRefresh = false) => {
                // Check cache unless forceRefresh is true
                const { lastTravelFetchTime, travelCompanies } = get();
                const now = Date.now();

                if (!forceRefresh && lastTravelFetchTime && travelCompanies.length > 0) {
                    const timeSinceLastFetch = now - lastTravelFetchTime;
                    if (timeSinceLastFetch < CACHE_DURATION) {
                        console.log('⚡ Using cached travel companies (age:', Math.round(timeSinceLastFetch / 1000), 'seconds)');
                        return;
                    }
                }

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

                    // Map logoUrl to logo for display
                    const companies = (data.content || data.companies || data).map((c: any) => ({
                        ...c,
                        id: String(c.id),
                        logo: c.logoUrl || c.logo || '',
                    }));

                    set({
                        travelCompanies: companies,
                        isLoading: false,
                        lastTravelFetchTime: Date.now()
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
                    // Fetch from companies list and filter by ID
                    const url = `${API_BASE_URL}/api/companies?page=0&size=100`;
                    console.log('Fetching companies list from:', url);

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
                    console.log('Raw API Response:', data);

                    // Get companies array from response
                    const companies = data.content || data.companies || data;

                    // Find company by ID
                    const companyData = companies.find((c: any) =>
                        c.id?.toString() === id ||
                        c.slug === id
                    );

                    if (!companyData) {
                        throw new Error('Company not found');
                    }

                    console.log('Found Company Data:', companyData);
                    console.log('=== Fetch Company By ID Success ===');

                    // Map API fields to our Company interface
                    const mappedCompany: Company = {
                        id: companyData.id?.toString() || '',
                        name: companyData.name || '',
                        slug: companyData.slug || '',
                        logo: companyData.logoUrl || companyData.logo || '',
                        website: companyData.websiteUrl || companyData.website || '',
                        description: companyData.description || '',
                        rating: companyData.averageRating || companyData.rating?.averageRating || 0,
                        reviewCount: companyData.totalReviews || companyData.rating?.totalReviews || 0,
                        address: companyData.address || '',
                        city: companyData.city || '',
                        country: companyData.country || '',
                        industry: companyData.industry || '',
                        phone: companyData.contactPhone || companyData.phone || '',
                        email: companyData.contactEmail || companyData.email || '',
                        verified: companyData.isVerified ?? companyData.verified ?? false,
                        claimed: companyData.isClaimed ?? companyData.claimed ?? false,
                    };

                    set({
                        currentCompany: mappedCompany,
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

            // Search companies
            searchCompanies: async (query: string) => {
                console.log('=== Search Companies Start ===');
                console.log('Query:', query);

                set({ isSearching: true, error: null });

                try {
                    // Use the new search endpoint with keyword parameter
                    const url = `${API_BASE_URL}/api/companies/search?keyword=${encodeURIComponent(query)}&page=0&size=50`;
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
                        throw new Error(errorData.message || errorData.error || 'Failed to search companies');
                    }

                    const data = await response.json();
                    console.log('Search Response Data:', data);

                    // Handle paginated response (Page<Company>)
                    const results = data.content || data.companies || data;

                    // Map logoUrl to logo for display
                    const mappedResults = (Array.isArray(results) ? results : []).map((c: any) => ({
                        ...c,
                        id: String(c.id),
                        logo: c.logoUrl || c.logo || '',
                    }));

                    console.log('Search Results Count:', mappedResults.length);
                    console.log('=== Search Companies Success ===');

                    set({
                        searchResults: mappedResults,
                        isSearching: false
                    });
                } catch (error) {
                    console.error('=== Search Companies Error ===');
                    console.error('Error:', error);
                    set({
                        searchResults: [],
                        error: error instanceof Error ? error.message : 'Search failed',
                        isSearching: false,
                    });
                }
            },

            // Clear search results
            clearSearchResults: () => set({ searchResults: [] }),

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
