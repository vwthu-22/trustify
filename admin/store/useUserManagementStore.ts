import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// ==================== Interfaces ====================

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    createdAt: string;
}

export interface CreateAdminData {
    email: string;
    password: string;
    fullName: string;
}

export interface UpdateUserStatusData {
    status: 'Active' | 'Inactive' | 'Suspended';
}

// ==================== Store Interface ====================

interface UserManagementStore {
    // State
    users: User[];
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;

    // Actions
    fetchUsers: (page?: number, size?: number) => Promise<void>;
    createAdmin: (data: CreateAdminData) => Promise<boolean>;
    updateUserStatus: (userId: number, status: UpdateUserStatusData['status']) => Promise<boolean>;
    deleteUser: (userId: number) => Promise<boolean>;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
    clearError: () => void;
}

// ==================== Store Implementation ====================

// ==================== Store Implementation ====================

const useUserManagementStore = create<UserManagementStore>()(
    devtools(
        (set, get) => ({
            // Initial State
            users: [],
            totalUsers: 0,
            currentPage: 0,
            totalPages: 0,
            pageSize: 20,
            isLoading: false,
            error: null,
            searchQuery: '',

            // Fetch users with pagination
            fetchUsers: async (page = 0, size = 20) => {
                set({ isLoading: true, error: null });
                try {
                    const searchQuery = get().searchQuery;
                    let url = `${API_BASE_URL}/admin/user/all?page=${page}&size=${size}`;
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
                            throw new Error('Users API not found');
                        }
                        throw new Error('Failed to fetch users');
                    }

                    const data = await response.json();
                    console.log('Users API response:', data);

                    // Ensure users is always an array
                    let usersData = [];
                    if (Array.isArray(data)) {
                        usersData = data;
                    } else if (data.content && Array.isArray(data.content)) {
                        usersData = data.content;
                    } else if (data.data && Array.isArray(data.data)) {
                        usersData = data.data;
                    }

                    // Handle paginated response
                    set({
                        users: usersData,
                        totalUsers: data.totalElements || data.total || usersData.length || 0,
                        currentPage: data.number || data.page || page,
                        totalPages: data.totalPages || Math.ceil((data.totalElements || data.total || usersData.length) / size),
                        pageSize: size,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('Fetch users error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch users',
                        isLoading: false,
                    });
                }
            },

            // Create new admin user
            // POST /admin/user/create
            createAdmin: async (data: CreateAdminData) => {
                set({ isLoading: true, error: null });
                try {
                    // Only send required fields according to API documentation
                    const requestBody = {
                        email: data.email,
                        password: data.password,
                        fullName: data.fullName,
                    };

                    console.log('Creating admin with:', { ...requestBody, password: '***' });
                    console.log('API URL:', `${API_BASE_URL}/admin/user/create`);

                    const response = await fetch(`${API_BASE_URL}/admin/user/create`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    // Handle response - try to parse JSON first
                    let responseData: Record<string, unknown> = {};
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        responseData = await response.json();
                        console.log('API response:', responseData);
                    } else {
                        const text = await response.text();
                        console.log('API response (text):', text);
                        responseData = { error: text || `Error ${response.status}` };
                    }

                    if (!response.ok) {
                        // Log full response for debugging
                        console.error('API Error Response:', {
                            status: response.status,
                            statusText: response.statusText,
                            data: responseData,
                        });

                        // Extract error message from various possible response formats
                        let errorMessage: string;

                        // Handle different error response formats
                        if (typeof responseData.error === 'string') {
                            errorMessage = responseData.error;
                        } else if (typeof responseData.message === 'string') {
                            errorMessage = responseData.message;
                        } else if (typeof responseData.errors === 'string') {
                            errorMessage = responseData.errors;
                        } else if (Array.isArray(responseData.errors)) {
                            // Handle validation errors array
                            errorMessage = responseData.errors.map((e: { field?: string; message?: string; defaultMessage?: string }) =>
                                e.field ? `${e.field}: ${e.message || e.defaultMessage}` : (e.message || e.defaultMessage || String(e))
                            ).join(', ');
                        } else if (typeof responseData.errors === 'object' && responseData.errors !== null) {
                            // Handle object with field errors
                            errorMessage = Object.entries(responseData.errors)
                                .map(([field, msg]) => `${field}: ${msg}`)
                                .join(', ');
                        } else if (responseData.detail) {
                            errorMessage = String(responseData.detail);
                        } else {
                            // Default error messages based on status code
                            errorMessage = response.status === 400
                                ? `Bad Request: ${JSON.stringify(responseData)}`
                                : response.status === 401
                                    ? 'Unauthorized. Please login again.'
                                    : response.status === 403
                                        ? 'You do not have permission to create users'
                                        : `Server error (${response.status})`;
                        }

                        throw new Error(errorMessage);
                    }

                    // Refresh users list
                    await get().fetchUsers(get().currentPage, get().pageSize);

                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    console.error('Create admin error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to create admin',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Update user status (Active, Inactive, Suspended)
            updateUserStatus: async (userId: number, status: UpdateUserStatusData['status']) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/status`, {
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
                            throw new Error('You do not have permission to update users');
                        } else if (response.status === 404) {
                            throw new Error('User not found');
                        }
                        throw new Error('Failed to update user status');
                    }

                    // Update local state
                    set((state) => ({
                        users: state.users.map((user) =>
                            user.id === userId ? { ...user, status } : user
                        ),
                        isLoading: false,
                    }));

                    return true;
                } catch (error) {
                    console.error('Update user status error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update user status',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Delete user
            deleteUser: async (userId: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('Unauthorized. Please login again.');
                        } else if (response.status === 403) {
                            throw new Error('You do not have permission to delete users');
                        }
                        throw new Error('Failed to delete user');
                    }

                    // Remove from local state
                    set((state) => ({
                        users: state.users.filter((user) => user.id !== userId),
                        totalUsers: state.totalUsers - 1,
                        isLoading: false,
                    }));

                    return true;
                } catch (error) {
                    console.error('Delete user error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to delete user',
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
        { name: 'user-management-store' }
    )
);

export default useUserManagementStore;
