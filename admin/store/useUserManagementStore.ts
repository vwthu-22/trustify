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

// ==================== Mock Data (for development) ====================

const MOCK_USERS: User[] = [
    { id: 1, fullName: 'Nguyen Van A', email: 'nguyenvana@gmail.com', role: 'USER', status: 'Active', createdAt: '2023-10-15T10:30:00' },
    { id: 2, fullName: 'Tran Thi B', email: 'tranthib@company.com', role: 'BUSINESS', status: 'Active', createdAt: '2023-11-02T14:20:00' },
    { id: 3, fullName: 'Le Van C', email: 'levanc@admin.com', role: 'ADMIN', status: 'Active', createdAt: '2023-09-20T08:00:00' },
    { id: 4, fullName: 'Pham Thi D', email: 'phamthid@gmail.com', role: 'USER', status: 'Inactive', createdAt: '2023-12-05T16:45:00' },
    { id: 5, fullName: 'Hoang Van E', email: 'hoangvane@tech.com', role: 'BUSINESS', status: 'Suspended', createdAt: '2023-10-30T11:15:00' },
    { id: 6, fullName: 'Do Thi F', email: 'dothif@email.com', role: 'USER', status: 'Active', createdAt: '2023-11-15T09:30:00' },
    { id: 7, fullName: 'Vu Van G', email: 'vuvang@business.com', role: 'BUSINESS', status: 'Active', createdAt: '2023-12-01T13:00:00' },
    { id: 8, fullName: 'Bui Thi H', email: 'buithih@admin.com', role: 'ADMIN', status: 'Active', createdAt: '2023-08-10T07:30:00' },
    { id: 9, fullName: 'Ngo Van I', email: 'ngovani@gmail.com', role: 'USER', status: 'Active', createdAt: '2023-11-20T15:00:00' },
    { id: 10, fullName: 'Dang Thi K', email: 'dangthik@company.com', role: 'BUSINESS', status: 'Inactive', createdAt: '2023-10-05T10:00:00' },
    { id: 11, fullName: 'Trinh Van L', email: 'trinhvanl@gmail.com', role: 'USER', status: 'Active', createdAt: '2023-12-10T11:30:00' },
    { id: 12, fullName: 'Mai Thi M', email: 'maithim@tech.com', role: 'BUSINESS', status: 'Active', createdAt: '2023-09-25T14:00:00' },
    { id: 13, fullName: 'Cao Van N', email: 'caovann@email.com', role: 'USER', status: 'Suspended', createdAt: '2023-11-08T08:45:00' },
    { id: 14, fullName: 'Duong Thi O', email: 'duongthio@business.com', role: 'BUSINESS', status: 'Active', createdAt: '2023-10-18T16:30:00' },
    { id: 15, fullName: 'Ly Van P', email: 'lyvanp@gmail.com', role: 'USER', status: 'Active', createdAt: '2023-12-15T12:00:00' },
    { id: 16, fullName: 'Ho Thi Q', email: 'hothiq@company.com', role: 'USER', status: 'Inactive', createdAt: '2023-11-28T09:15:00' },
    { id: 17, fullName: 'Ta Van R', email: 'tavanr@admin.com', role: 'ADMIN', status: 'Active', createdAt: '2023-07-15T10:00:00' },
    { id: 18, fullName: 'Dinh Thi S', email: 'dinhthis@email.com', role: 'USER', status: 'Active', createdAt: '2023-12-20T14:30:00' },
    { id: 19, fullName: 'Truong Van T', email: 'truongvant@tech.com', role: 'BUSINESS', status: 'Active', createdAt: '2023-10-22T11:45:00' },
    { id: 20, fullName: 'Lam Thi U', email: 'lamthiu@gmail.com', role: 'USER', status: 'Active', createdAt: '2023-11-30T08:30:00' },
    { id: 21, fullName: 'Quach Van V', email: 'quachvanv@company.com', role: 'BUSINESS', status: 'Suspended', createdAt: '2023-09-12T15:15:00' },
    { id: 22, fullName: 'Chau Thi W', email: 'chauthiw@email.com', role: 'USER', status: 'Active', createdAt: '2023-12-08T13:45:00' },
    { id: 23, fullName: 'Kieu Van X', email: 'kieuvanx@business.com', role: 'BUSINESS', status: 'Active', createdAt: '2023-10-28T10:30:00' },
    { id: 24, fullName: 'Son Thi Y', email: 'sonthiy@gmail.com', role: 'USER', status: 'Inactive', createdAt: '2023-11-05T16:00:00' },
    { id: 25, fullName: 'Tong Van Z', email: 'tongvanz@admin.com', role: 'ADMIN', status: 'Active', createdAt: '2023-06-20T09:00:00' },
];

// Helper function to get mock users with optional search filter
function getMockUsers(searchQuery: string): User[] {
    if (!searchQuery) return MOCK_USERS;
    const query = searchQuery.toLowerCase();
    return MOCK_USERS.filter(user =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
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
                        // API not available - use mock data for development
                        if (response.status === 404) {
                            console.warn('Users API not found, using mock data');
                            const mockUsers = getMockUsers(searchQuery);
                            const startIdx = page * size;
                            const endIdx = startIdx + size;
                            const paginatedUsers = mockUsers.slice(startIdx, endIdx);

                            set({
                                users: paginatedUsers,
                                totalUsers: mockUsers.length,
                                currentPage: page,
                                totalPages: Math.ceil(mockUsers.length / size),
                                pageSize: size,
                                isLoading: false,
                            });
                            return;
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
                    const requestBody = {
                        email: data.email,
                        password: data.password,
                        fullName: data.fullName,
                        role: 'ADMIN', // Force ADMIN role
                    };

                    console.log('Creating admin with:', { ...requestBody, password: '***' });

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
                        // Extract error message from various possible response formats
                        const errorMessage =
                            responseData.error ||
                            responseData.message ||
                            responseData.errors ||
                            (response.status === 400 ? 'Invalid data. Please check all fields.' : null) ||
                            (response.status === 401 ? 'Unauthorized. Please login again.' : null) ||
                            (response.status === 403 ? 'You do not have permission to create users' : null) ||
                            `Server error (${response.status})`;

                        throw new Error(String(errorMessage));
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
