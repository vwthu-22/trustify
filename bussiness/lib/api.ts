const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// ==================== Auth API ====================

export const authApi = {
    // Send magic link to email
    sendMagicLink: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/send-magic-link`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to send magic link' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    // Send verification email
    sendVerificationEmail: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to send verification email' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    // Verify email with magic link code
    verifyEmail: async (code: string) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/magic-link/${code}`, {
            method: 'GET',  // Must be GET - called from email link
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Verification failed' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    // Login with email and password
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    // Logout
    logout: async () => {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return response.json();
    },

    // Get current user session
    getSession: async () => {
        const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    },
};

// ==================== Company API ====================

export const companyApi = {
    // Register company (send verification code)
    register: async (data: {
        name: string;
        workEmail: string;
        industry: string;
        website?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Registration failed' }));
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    // Verify company with code
    verify: async (email: string, code: string) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Verification failed' }));
            throw new Error(error.error || 'Verification failed');
        }

        return response.json();
    },

    // Resend verification code
    resendCode: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/resend-code?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to resend code' }));
            throw new Error(error.error || 'Failed to resend code');
        }

        return response.json();
    },

    // Get my company profile (authenticated)
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/api/companies/my-companies`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to fetch company profile' }));
            throw new Error(error.error || 'Failed to fetch company profile');
        }

        return response.json();
    },

    // Update company profile
    // API: PUT /api/companies/update/{id}
    updateProfile: async (companyId: string | number, data: {
        name?: string;
        websiteUrl?: string;
        avatarUrl?: string; // Note: Backend expects avatarUrl for update, returns logoUrl in response
        jobTitle?: string;
        contactPhone?: string;
        industry?: string;
        workEmail?: string;
        companySize?: string;
        foundedYear?: number;
        country?: string;
        annualRevenue?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/update/${companyId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to update company profile' }));
            throw new Error(error.error || error.message || 'Failed to update company profile');
        }

        return response.json();
    },

    // Update company info (name, address, website, industry, size, description)
    // API: PATCH /api/companies/update-info/{id}
    updateInfo: async (companyId: string | number, data: {
        name?: string;
        address?: string;
        websiteUrl?: string;
        industry?: string;
        companySize?: string;
        description?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/update-info/${companyId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to update company info' }));
            throw new Error(error.error || error.message || 'Failed to update company info');
        }

        return response.json();
    },

    // Get all companies (pagination)
    getAll: async (page = 0, size = 10) => {
        const response = await fetch(`${API_BASE_URL}/api/companies?page=${page}&size=${size}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch companies');
        }

        return response.json();
    },

    // Get companies by industry
    getByIndustry: async (industry: string, page = 0, size = 4) => {
        const response = await fetch(`${API_BASE_URL}/api/review/industry/${encodeURIComponent(industry)}?page=${page}&size=${size}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch companies by industry');
        }

        return response.json();
    },
};

// ==================== Plan API ====================

export const planApi = {
    // Get all active plans
    getPlans: async () => {
        const response = await fetch(`${API_BASE_URL}/api/plan`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch plans');
        }

        return response.json();
    },

    // Get plan by ID
    getPlanById: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/api/plan/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch plan');
        }

        return response.json();
    },
};

// ==================== Review API ====================

export const reviewApi = {
    // Get reviews for a company with pagination
    getCompanyReviews: async (companyId: number, page = 0, size = 10) => {
        const response = await fetch(`${API_BASE_URL}/api/review/company/${companyId}?page=${page}&size=${size}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to fetch reviews' }));
            throw new Error(error.message || 'Failed to fetch reviews');
        }

        return response.json();
    },

    // Reply to a review
    // API: PUT /api/review/{id}
    replyToReview: async (reviewId: number, data: any) => {
        const response = await fetch(`${API_BASE_URL}/api/review/${reviewId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to reply to review' }));
            throw new Error(error.message || error.error || 'Failed to reply to review');
        }

        return response.json();
    },
};

// ==================== Integration API ====================

export const integrationApi = {
    // Send invite email to customer with product
    sendInvite: async (companyId: number, data: {
        to: string;
        name: string;
        productLink: string;
        productCode?: string;
        subject?: string;
        body?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/invite/product/${companyId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to send invitation');
        }

        return response.json();
    },

    // Get company rating
    getCompanyRating: async (companyId: number) => {
        const response = await fetch(`${API_BASE_URL}/integration/companies/${companyId}/rating`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to fetch rating' }));
            throw new Error(error.message || 'Failed to fetch rating');
        }

        return response.json();
    },

    // Get integration manifest
    getManifest: async (companyId: number) => {
        const response = await fetch(`${API_BASE_URL}/integration/companies/${companyId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch integration manifest');
        }

        return response.json();
    },

    // Get company reviews (paginated)
    getCompanyReviews: async (companyId: number, page = 0, size = 20) => {
        const response = await fetch(`${API_BASE_URL}/integration/companies/${companyId}/reviews?page=${page}&size=${size}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        return response.json();
    },
};

export default {
    auth: authApi,
    company: companyApi,
    plan: planApi,
    review: reviewApi,
    integration: integrationApi,
};
