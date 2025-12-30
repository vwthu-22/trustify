// stores/userAuthStore/user.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
const API_BASE_URL = 'https://trustify.io.vn';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  country?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  setUser: (user: User) => void;
  exchangeToken: (state: string) => Promise<boolean>;
  fetchUserInfo: () => Promise<void>;
  updateProfile: (name: string, country: string, avatarUrl?: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

const useAuthStore = create<AuthState>()(
  devtools(persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      successMessage: null,

      setUser: (user) => set({
        user,
        isAuthenticated: true,
        error: null
      }),

      // Exchange state
      exchangeToken: async (state: string) => {
        console.log('=== Exchange Token Start ===');
        console.log('State:', state);

        set({ isLoading: true, error: null });

        try {
          const requestBody = { state: state };
          console.log('Request Body:', JSON.stringify(requestBody));

          const response = await fetch(`${API_BASE_URL}/api/auth/exchange-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(requestBody),
          });

          console.log('Response Status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Response Error:', errorData);
            throw new Error(errorData.error || `Exchange token failed: ${response.status}`);
          }

          const data = await response.json();
          console.log('Response Data:', data);
          console.log('=== Exchange Token Success ===');

          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('=== Exchange Token Error ===');
          console.error('Error:', error);
          set({
            error: error instanceof Error ? error.message : 'Exchange token failed',
            isLoading: false,
          });
          return false;
        }
      },

      // Fetch user info
      fetchUserInfo: async () => {
        console.log('=== Fetch User Info Start ===');
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/user/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          });

          console.log('User Info Response Status:', response.status);
          console.log('User Info Response Headers:', Object.fromEntries(response.headers.entries()));

          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              console.log('User not authenticated');
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              });
              return;
            }
            throw new Error('Failed to fetch user info');
          }

          const responseText = await response.text();
          console.log('User Info Response Body (raw):', responseText);

          const userData = JSON.parse(responseText);
          console.log('User Data:', userData);

          const user: User = {
            id: userData.id || userData.userId,
            name: userData.name || userData.displayName || userData.username,
            email: userData.email,
            avatar: userData.avatarUrl || userData.avatar || '',
            country: userData.country || '',
          };

          console.log('Processed User:', user);
          console.log('=== Fetch User Info Success ===');

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error: any) {
          console.error('=== Fetch User Info Error ===');
          if (error instanceof TypeError && error.message.includes('fetch')) {
          }

          set({
            error: error instanceof Error ? error.message : 'Failed to fetch user info',
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
        }
      },

      // Logout
      logout: async () => {
        console.log('=== Logout Start ===');
        set({ isLoading: true });

        try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          });
          console.log('=== Logout Success ===');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false
          });
        }
      },

      clearError: () => set({ error: null }),
      clearSuccess: () => set({ successMessage: null }),

      // Upload user avatar
      // API: POST /api/images/upload
      uploadAvatar: async (file: File) => {
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

            // Update user avatar in store
            const currentUser = get().user;
            if (currentUser) {
              set({
                user: { ...currentUser, avatar: imageUrl }
              });
            }
            return imageUrl;
          }

          return null;
        } catch (error) {
          console.error('Upload avatar error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to upload image',
          });
          return null;
        }
      },

      // Update user profile
      updateProfile: async (name: string, country: string, avatarUrl?: string) => {
        const { user } = get();
        if (!user) return false;

        set({ isLoading: true, error: null, successMessage: null });

        try {
          const updateData: any = {
            email: user.email,
            name,
            country,
          };

          // Include avatarUrl if provided
          if (avatarUrl) {
            updateData.avatarUrl = avatarUrl;
          }

          const response = await fetch(`${API_BASE_URL}/api/user/me`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: {
                ...user,
                name: data.name || name,
                country: data.country || country,
                avatar: data.avatarUrl || avatarUrl || user.avatar,
              },
              isLoading: false,
              successMessage: 'Profile updated successfully!',
            });
            return true;
          } else {
            const errorData = await response.json();
            set({
              error: errorData.message || 'Failed to update profile',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error('Update profile error:', error);
          set({
            error: 'An error occurred while updating your profile',
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Chỉ lưu isAuthenticated như một "hint" cho UI
      // User data KHÔNG được lưu vì lý do bảo mật
      // Session thực sự được xác thực qua httpOnly cookie từ backend
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated
      }),
    }
  ), { name: 'user-auth-store' })
);

export default useAuthStore;