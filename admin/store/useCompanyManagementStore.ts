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
    verifyStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
}

export interface VerificationRequest {
    id: number;
    company: {
        id: number;
        name: string;
        logoUrl?: string;
        contactEmail?: string;
    };
    documentUrl?: string;
    documents?: string[];
    submittedAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
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

    // Verification State
    pendingVerifications: VerificationRequest[];
    isLoadingVerifications: boolean;
    processingVerificationId: number | null;

    // Actions
    fetchCompanies: (page?: number, size?: number) => Promise<void>;
    updateCompanyStatus: (companyId: number, status: UpdateCompanyStatusData['status']) => Promise<boolean>;
    updateCompanyPlan: (companyId: number, plan: string) => Promise<boolean>;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
    clearError: () => void;

    // Verification Actions
    fetchPendingVerifications: (page?: number, size?: number) => Promise<void>;
    approveCompany: (companyId: number) => Promise<boolean>;
    rejectCompany: (companyId: number, reason: string) => Promise<boolean>;
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

            // Verification State
            pendingVerifications: [],
            isLoadingVerifications: false,
            processingVerificationId: null,

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

                    // Map backend fields to frontend Company interface
                    const mappedCompanies = companiesData.map((company: any) => ({
                        ...company,
                        // Map plan field - backend might return plan.name, planName, or plan
                        plan: company.plan?.name || company.planName || company.plan || 'Free',
                    }));

                    console.log('Mapped companies with plan:', mappedCompanies);

                    // Handle response (API doesn't seem to have pagination yet)
                    set({
                        companies: mappedCompanies,
                        totalCompanies: data.totalElements || data.total || mappedCompanies.length || 0,
                        currentPage: data.number || data.page || page,
                        totalPages: data.totalPages || Math.ceil((data.totalElements || data.total || mappedCompanies.length) / size),
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

            // Update company plan
            // TODO: Backend API needed - PUT /admin/company/{id}/plan
            updateCompanyPlan: async (companyId: number, plan: string) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Uncomment when backend API is ready
                    // const response = await fetch(`${API_BASE_URL}/admin/company/${companyId}/plan`, {
                    //     method: 'PUT',
                    //     credentials: 'include',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'ngrok-skip-browser-warning': 'true',
                    //     },
                    //     body: JSON.stringify({ plan }),
                    // });
                    //
                    // if (!response.ok) {
                    //     throw new Error('Failed to update company plan');
                    // }

                    // For now, just update local state
                    set((state) => ({
                        companies: state.companies.map((company) =>
                            company.id === companyId ? { ...company, plan } : company
                        ),
                        isLoading: false,
                    }));

                    console.log(`✅ Updated company ${companyId} plan to: ${plan}`);
                    return true;
                } catch (error) {
                    console.error('Update company plan error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update company plan',
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

            // ==================== Verification Actions ====================

            // Fetch pending verifications
            // Backend should have: GET /admin/company/pending-verification OR similar
            fetchPendingVerifications: async (page = 0, size = 20) => {
                set({ isLoadingVerifications: true, error: null });
                try {
                    // Try the admin endpoint for pending verifications
                    const response = await fetch(
                        `${API_BASE_URL}/admin/company/pending-verification?page=${page}&size=${size}`,
                        {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true',
                            },
                        }
                    );

                    console.log('📡 Pending verifications response status:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ API Error:', errorText);
                        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    // Handle different response formats
                    // Backend returns Page<Company> or List<Company> - each item IS a Company
                    let verifications: VerificationRequest[] = [];

                    // Helper to map Company to VerificationRequest format
                    const mapCompanyToVerification = (company: any): VerificationRequest => ({
                        id: company.id,
                        company: {
                            id: company.id,
                            name: company.name || `Company #${company.id}`,
                            logoUrl: company.logoUrl || company.logo,
                            contactEmail: company.contactEmail || company.email,
                        },
                        documentUrl: company.fileVerificationUrl || company.documentUrl,
                        documents: company.fileVerificationUrl ? [company.fileVerificationUrl] : [],
                        submittedAt: company.updatedAt || company.createdAt || new Date().toISOString(),
                        status: company.verifyStatus || 'PENDING',
                    });

                    if (Array.isArray(data)) {
                        // Direct array of Company objects
                        verifications = data.map(mapCompanyToVerification);
                    } else if (data.content && Array.isArray(data.content)) {
                        // Spring Page<Company> response
                        verifications = data.content.map(mapCompanyToVerification);
                    } else if (data.companies && Array.isArray(data.companies)) {
                        // Wrapped response with companies key
                        verifications = data.companies.map(mapCompanyToVerification);
                    } else if (data.data && Array.isArray(data.data)) {
                        // Wrapped response with data key
                        verifications = data.data.map(mapCompanyToVerification);
                    } else if (typeof data === 'object' && data !== null && data.id) {
                        // Single Company object
                        console.log('⚠️ Received single Company object');
                        verifications = [mapCompanyToVerification(data)];
                    }

                    console.log('✅ Parsed verifications:', verifications.length, 'items', verifications);
                    set({ pendingVerifications: verifications, isLoadingVerifications: false });
                } catch (error) {
                    console.error('❌ Error fetching verifications:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load verification requests',
                        isLoadingVerifications: false,
                    });
                }
            },

            // Approve company verification
            approveCompany: async (companyId: number) => {
                set({ processingVerificationId: companyId, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/admin/company/${companyId}/approve`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Approve failed: ${response.status}`);
                    }

                    // Remove from pending list
                    set((state) => ({
                        pendingVerifications: state.pendingVerifications.filter(
                            (v) => v.company?.id !== companyId && v.id !== companyId
                        ),
                        processingVerificationId: null,
                    }));

                    return true;
                } catch (error) {
                    console.error('Error approving company:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to approve company',
                        processingVerificationId: null,
                    });
                    return false;
                }
            },

            // Reject company verification
            rejectCompany: async (companyId: number, reason: string) => {
                set({ processingVerificationId: companyId, error: null });
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/admin/company/${companyId}/reject?reason=${encodeURIComponent(reason)}`,
                        {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true',
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Reject failed: ${response.status}`);
                    }

                    // Remove from pending list
                    set((state) => ({
                        pendingVerifications: state.pendingVerifications.filter(
                            (v) => v.company?.id !== companyId && v.id !== companyId
                        ),
                        processingVerificationId: null,
                    }));

                    return true;
                } catch (error) {
                    console.error('Error rejecting company:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to reject company',
                        processingVerificationId: null,
                    });
                    return false;
                }
            },
        }),
        { name: 'company-management-store' }
    )
);

export default useCompanyManagementStore;
