import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// ==================== Interfaces ====================

export interface Company {
    id: number;
    name: string;
    websiteUrl: string;
    contactEmail: string;
    industry: string;
    country: string;
    plan: string;
    logoUrl: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface UpdateCompanyStatusData {
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

// ==================== Store Interface ====================

interface CompanyManagementStore {
    // State
    companies: Company[];
    totalCompanies: number;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;

    // Actions
    fetchCompanies: (page?: number, size?: number) => Promise<void>;
    updateCompanyStatus: (companyId: number, status: UpdateCompanyStatusData['status']) => Promise<boolean>;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
    clearError: () => void;
}

// ==================== Store Implementation ====================

const useCompanyManagementStore = create<CompanyManagementStore>()(
    devtools(
        (set, get) => ({
            // Initial State
            companies: [],
            totalCompanies: 0,
            currentPage: 0,
            totalPages: 0,
            isLoading: false,
            error: null,
            searchQuery: '',

            // Fetch companies with pagination
            fetchCompanies: async (page = 0, size = 5) => {
                set({ isLoading: true, error: null });
                try {
                    const searchQuery = get().searchQuery;
                    let url = `${API_BASE_URL}/admin/company/all?page=${page}&size=${size}`;
                    if (searchQuery) {
                        url += `&search=${encodeURIComponent(searchQuery)}`;
                    }

                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('Unauthorized. Please login again.');
                        }
                        if (response.status === 404) {
                            throw new Error('Companies API not found');
                        }
                        throw new Error('Failed to fetch companies');
                    }

                    const data = await response.json();
                    console.log('Companies API response:', data);

                    // Parse new API response structure
                    let companiesData = [];
                    if (data.success && Array.isArray(data.companies)) {
                        companiesData = data.companies;
                    } else if (Array.isArray(data)) {
                        companiesData = data;
                    } else if (data.content && Array.isArray(data.content)) {
                        companiesData = data.content;
                    } else if (data.data && Array.isArray(data.data)) {
                        companiesData = data.data;
                    }

                    // Handle response (API doesn't seem to have pagination yet)
                    set({
                        companies: companiesData,
                        totalCompanies: data.totalElements || data.total || companiesData.length || 0,
                        currentPage: data.number || data.page || page,
                        totalPages: data.totalPages || Math.ceil((data.totalElements || data.total || companiesData.length) / size),
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('Fetch companies error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch companies',
                        isLoading: false,
                    });
                }
            },

            // Update company status
            updateCompanyStatus: async (companyId: number, status: UpdateCompanyStatusData['status']) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/admin/company/${companyId}/status`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify({ status }),
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('Unauthorized. Please login again.');
                        } else if (response.status === 403) {
                            throw new Error('You do not have permission to update companies');
                        } else if (response.status === 404) {
                            throw new Error('Company not found');
                        }
                        throw new Error('Failed to update company status');
                    }

                    // Update local state
                    set((state) => ({
                        companies: state.companies.map((company) =>
                            company.id === companyId ? { ...company, status } : company
                        ),
                        isLoading: false,
                    }));

                    return true;
                } catch (error) {
                    console.error('Update company status error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update company status',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Set search query
            setSearchQuery: (query: string) => set({ searchQuery: query }),

            // Set current page
            setCurrentPage: (page: number) => set({ currentPage: page }),

            // Clear error
            clearError: () => set({ error: null }),
        }),
        { name: 'company-management-store' }
    )
);

export default useCompanyManagementStore;
