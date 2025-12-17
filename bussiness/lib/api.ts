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
    updateProfile: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/api/companies/my-companies`, {
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
            throw new Error(error.error || 'Failed to update company profile');
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
        const response = await fetch(`${API_BASE_URL}/api/companies/industry/${encodeURIComponent(industry)}?page=${page}&size=${size}`, {
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

export default {
    auth: authApi,
    company: companyApi,
    plan: planApi,
};
