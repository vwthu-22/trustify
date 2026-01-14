import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface Company {
    id: string;
    name: string;
    email: string;
    logo?: string;
    plan: 'Free' | 'Pro' | 'Premium';
    verified: boolean; // isVerified - email verification
    verifyStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'; // Document verification status
    fileVerificationUrl?: string;
    website?: string;
    industry?: string;
    address?: string;
    phone?: string;
    country?: string;
    size?: string;
    detail?: string;
    position?: string;
    createdAt?: string;
}

interface CompanyStore {
    company: Company | null;
    isLoading: boolean;
    error: string | null;
    magicLinkSent: boolean; // Track if magic link was sent
    verificationStatus: 'not-started' | 'pending' | 'verified' | 'rejected';
    isUploadingVerification: boolean;

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
    uploadLogo: (file: File) => Promise<string | null>;

    // Verification actions
    uploadVerificationDocument: (files: File | File[]) => Promise<boolean>;
    setVerificationStatus: (status: 'not-started' | 'pending' | 'verified' | 'rejected') => void;
}

export const useCompanyStore = create<CompanyStore>()(
    persist(
        (set, get) => ({
            company: null,
            isLoading: false,
            error: null,
            magicLinkSent: false,
            verificationStatus: 'not-started' as const,
            isUploadingVerification: false,

            setCompany: (company: Company) => set({ company, error: null }),

            updateCompany: (updates: Partial<Company>) =>
                set((state) => ({
                    company: state.company ? { ...state.company, ...updates } : null,
                })),

            clearCompany: () => set({ company: null, error: null }),

            clearError: () => set({ error: null }),

            resetMagicLinkState: () => set({ magicLinkSent: false, error: null }),

            fetchCompanyProfile: async () => {
                // Prevent redundant calls if already loading
                if (get().isLoading) return;

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
                            name: companyData.name || '',
                            // API uses contactEmail, not email
                            email: companyData.contactEmail || companyData.email || '',
                            // API uses logoUrl, not logo
                            logo: companyData.logoUrl || companyData.logo || '',
                            plan: companyData.plan?.name || companyData.planName || 'Free',
                            // API uses isVerified, not verified
                            verified: companyData.isVerified ?? companyData.verified ?? false,
                            // Document verification status
                            verifyStatus: companyData.verifyStatus || null,
                            fileVerificationUrl: companyData.fileVerificationUrl || '',
                            // API uses websiteUrl, not website
                            website: companyData.websiteUrl || companyData.website || '',
                            industry: companyData.industry || '',
                            // API uses address or city+country
                            address: companyData.address || (companyData.city ? `${companyData.city}, ${companyData.country}` : ''),
                            // API uses contactPhone, not phone
                            phone: companyData.contactPhone || companyData.phone || '',
                            country: companyData.country || '',
                            // API uses companySize, not size
                            size: companyData.companySize || companyData.size || '',
                            detail: companyData.description || companyData.detail || '',
                            position: companyData.position || '',
                            createdAt: companyData.createdAt || '',
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

            // Upload company logo
            // API: POST /api/images/upload
            uploadLogo: async (file: File) => {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Upload failed:', response.status, errorText);
                        throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
                    }

                    const responseData = await response.json();
                    console.log('Image upload response:', responseData);

                    // Handle nested response: { data: { fileName, url }, success, message }
                    const data = responseData.data || responseData;
                    const fileName = data.fileName || data.filename || data.name || data.url || data;

                    if (typeof fileName === 'string' && fileName) {
                        // Construct full image URL
                        const imageUrl = fileName.startsWith('http')
                            ? fileName
                            : `${API_BASE_URL}/api/images/${fileName}`;

                        // Update company logo in store
                        const currentCompany = get().company;
                        if (currentCompany) {
                            set({
                                company: { ...currentCompany, logo: imageUrl }
                            });
                        }
                        return imageUrl;
                    }

                    return null;
                } catch (error) {
                    console.error('Upload logo error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to upload image',
                    });
                    return null;
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
                        let errorMessage = 'Không thể gửi magic link';
                        try {
                            const errorData = await response.json();
                            console.error('Magic link error (JSON):', errorData);
                            // Extract user-friendly message from various formats
                            if (errorData.message && !errorData.message.includes('Internal Server Error')) {
                                errorMessage = errorData.message;
                            } else if (response.status === 500) {
                                errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                            } else if (response.status === 404) {
                                errorMessage = 'Email không tồn tại trong hệ thống.';
                            } else if (response.status === 400) {
                                errorMessage = 'Email không hợp lệ.';
                            } else if (response.status === 429) {
                                errorMessage = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.';
                            }
                        } catch {
                            const errorText = await response.text();
                            console.error('Magic link error (Text):', errorText);
                            // Don't show raw JSON to user
                            if (errorText.startsWith('{') || errorText.includes('Internal Server Error')) {
                                errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                            } else if (errorText && errorText.length < 100) {
                                errorMessage = errorText;
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    const result = await response.text();
                    console.log('Magic link response:', result);

                    set({ isLoading: false, magicLinkSent: true });
                    return true;
                } catch (error) {
                    console.error('Send magic link error:', error);
                    let userMessage = 'Không thể gửi magic link. Vui lòng thử lại.';

                    if (error instanceof Error) {
                        // Check if it's already a user-friendly message
                        if (!error.message.includes('{') && !error.message.includes('fetch')) {
                            userMessage = error.message;
                        } else if (error.message.includes('fetch')) {
                            userMessage = 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.';
                        }
                    }

                    set({
                        error: userMessage,
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

                    set({ isLoading: false, magicLinkSent: false, verificationStatus: 'not-started' });

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
                                name: companyData.name || '',
                                email: companyData.contactEmail || companyData.email || '',
                                logo: companyData.logoUrl || companyData.logo || '',
                                plan: companyData.plan?.name || companyData.planName || 'Free',
                                verified: companyData.isVerified ?? companyData.verified ?? false,
                                website: companyData.websiteUrl || companyData.website || '',
                                industry: companyData.industry || '',
                                address: companyData.address || (companyData.city ? `${companyData.city}, ${companyData.country}` : ''),
                                phone: companyData.contactPhone || companyData.phone || '',
                                country: companyData.country || '',
                                size: companyData.companySize || companyData.size || '',
                                detail: companyData.description || companyData.taxId || companyData.detail || '',
                                position: companyData.position || '',
                                createdAt: companyData.createdAt || '',
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

            // Set verification status
            setVerificationStatus: (status) => set({ verificationStatus: status }),

            // Upload verification document (single file only)
            // API: POST /api/companies/{id}/upload-verification
            // Backend expects: @RequestParam("file") MultipartFile file
            uploadVerificationDocument: async (files: File | File[]) => {
                const company = get().company;
                if (!company?.id) {
                    set({ error: 'Company ID not found. Please login again.' });
                    return false;
                }

                // Get the first file only
                const file = Array.isArray(files) ? files[0] : files;

                if (!file) {
                    set({ error: 'No file to upload.' });
                    return false;
                }

                set({ isUploadingVerification: true, error: null });

                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch(`${API_BASE_URL}/api/companies/${company.id}/upload-verification`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(errorData || `Upload failed with status ${response.status}`);
                    }

                    const result = await response.json();
                    console.log(`✅ Uploaded verification document:`, result);

                    // Update company state immediately with verifyStatus from response
                    if (result.success && result.verifyStatus) {
                        set((state) => ({
                            company: state.company ? {
                                ...state.company,
                                verifyStatus: result.verifyStatus,
                                fileVerificationUrl: result.fileUrl || state.company.fileVerificationUrl
                            } : state.company,
                            isUploadingVerification: false,
                            verificationStatus: result.verifyStatus === 'PENDING' ? 'pending' :
                                result.verifyStatus === 'APPROVED' ? 'verified' :
                                    result.verifyStatus === 'REJECTED' ? 'rejected' : 'not-started'
                        }));
                    } else {
                        set({ isUploadingVerification: false, verificationStatus: 'pending' });
                    }

                    // Refresh company profile to get updated data (async, non-blocking)
                    get().fetchCompanyProfile();

                    return true;
                } catch (error) {
                    console.error('Error uploading verification document:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to upload document. Please try again.',
                        isUploadingVerification: false
                    });
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
                    set({ company: null, isLoading: false, error: null, magicLinkSent: false, verificationStatus: 'not-started' });
                    // Clear access_token cookie
                    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    // Clear persisted store data
                    localStorage.removeItem('company-storage');

                    // Clear subscription store (import at top if needed)
                    // Note: We can't directly import useSubscriptionStore here due to circular dependency
                    // Instead, we'll rely on the subscription store being cleared when company changes to null
                }
            },
        }),
        {
            name: 'company-storage',
        }
    )
);

