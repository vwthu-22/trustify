import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface AdminUser {
    email: string;
    role: string;
    loginTime: string;
}

interface AdminAuthStore {
    // State
    adminUser: AdminUser | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => void;
    clearError: () => void;
}

const useAdminAuthStore = create<AdminAuthStore>()(
    devtools(
        (set) => ({
            adminUser: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,

            // Login with email and password
            // API: POST /api/auth/admin/login
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
                        method: 'POST',
                        credentials: 'include', // Important: to receive and store HttpOnly cookie
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    // Handle non-JSON responses (like 500 errors)
                    let data;
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        data = await response.json();
                    } else {
                        const text = await response.text();
                        data = { error: text || `Server error (${response.status})` };
                    }

                    if (!response.ok) {
                        // Provide more specific error messages
                        if (response.status === 500) {
                            throw new Error('Server error. Please try again later or contact support.');
                        } else if (response.status === 401) {
                            throw new Error(data.error || 'Invalid email or password');
                        } else if (response.status === 404) {
                            throw new Error('Login service not available');
                        } else {
                            throw new Error(data.error || `Error: ${response.status}`);
                        }
                    }

                    // Login successful - JWT is set via HttpOnly cookie by the server
                    console.log('Admin login successful:', data.message);

                    const adminUser: AdminUser = {
                        email,
                        role: 'Administrator',
                        loginTime: new Date().toISOString(),
                    };

                    // Set local auth cookie for middleware (30 days to match backend JWT)
                    document.cookie = 'admin-auth=true; path=/; max-age=2592000'; // 30 days

                    // Store in localStorage for persistence
                    localStorage.setItem('admin-authenticated', 'true');
                    localStorage.setItem('admin-user', JSON.stringify(adminUser));

                    set({
                        adminUser,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error) {
                    console.error('Admin login error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Login failed. Please try again.',
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    return false;
                }
            },

            // Logout
            logout: () => {
                // Clear localStorage
                localStorage.removeItem('admin-authenticated');
                localStorage.removeItem('admin-user');

                // Clear all auth cookies
                document.cookie = 'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                set({
                    adminUser: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Check auth status from localStorage
            checkAuthStatus: () => {
                const isAuth = localStorage.getItem('admin-authenticated') === 'true';
                const storedUser = localStorage.getItem('admin-user');

                if (isAuth && storedUser) {
                    set({
                        adminUser: JSON.parse(storedUser),
                        isAuthenticated: true,
                    });
                } else {
                    set({
                        adminUser: null,
                        isAuthenticated: false,
                    });
                }
            },

            // Clear error
            clearError: () => set({ error: null }),
        }),
        { name: 'admin-auth-store' }
    )
);

export default useAdminAuthStore;
