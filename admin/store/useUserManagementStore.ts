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
    role: 'ADMIN'; // Only admin can be created via this API
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
                    let url = `${API_BASE_URL}/admin/users?page=${page}&size=${size}`;
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
                        throw new Error('Failed to fetch users');
                    }

                    const data = await response.json();

                    // Handle paginated response
                    set({
                        users: data.content || data,
                        totalUsers: data.totalElements || data.length || 0,
                        currentPage: data.number || page,
                        totalPages: data.totalPages || Math.ceil((data.totalElements || data.length) / size),
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
                    const response = await fetch(`${API_BASE_URL}/admin/user/create`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify({
                            ...data,
                            role: 'ADMIN', // Force ADMIN role
                        }),
                    });

                    // Handle response
                    let responseData;
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        responseData = await response.json();
                    } else {
                        const text = await response.text();
                        responseData = { error: text };
                    }

                    if (!response.ok) {
                        if (response.status === 400) {
                            throw new Error(responseData.error || 'Email already exists or invalid data');
                        } else if (response.status === 401) {
                            throw new Error('Unauthorized. Please login again.');
                        } else if (response.status === 403) {
                            throw new Error('You do not have permission to create users');
                        }
                        throw new Error(responseData.error || 'Failed to create admin');
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
