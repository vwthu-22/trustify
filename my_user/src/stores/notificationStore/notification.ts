import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface Notification {
    id: string;
    type: 'reply' | 'like' | 'mention' | 'system';
    message: string;
    reviewId?: string;
    companyId?: string;
    companyName?: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearNotifications: () => void;
}

const useNotificationStore = create<NotificationState>()(
    devtools(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isLoading: false,
            error: null,

            fetchNotifications: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/notification/my-notifications`,
                        {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'ngrok-skip-browser-warning': 'true',
                            },
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const notifications = data.notifications || data || [];
                        const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

                        set({
                            notifications,
                            unreadCount,
                            isLoading: false,
                        });
                    } else {
                        // If API doesn't exist yet, use empty array
                        set({
                            notifications: [],
                            unreadCount: 0,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                    set({
                        notifications: [],
                        unreadCount: 0,
                        isLoading: false,
                        error: 'Failed to fetch notifications',
                    });
                }
            },

            markAsRead: async (notificationId: string) => {
                try {
                    await fetch(
                        `${API_BASE_URL}/api/notification/${notificationId}/read`,
                        {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'ngrok-skip-browser-warning': 'true',
                            },
                        }
                    );

                    set((state) => {
                        const notifications = state.notifications.map((n) =>
                            n.id === notificationId ? { ...n, isRead: true } : n
                        );
                        return {
                            notifications,
                            unreadCount: notifications.filter((n) => !n.isRead).length,
                        };
                    });
                } catch (error) {
                    console.error('Failed to mark notification as read:', error);
                }
            },

            markAllAsRead: async () => {
                try {
                    await fetch(
                        `${API_BASE_URL}/api/notification/mark-all-read`,
                        {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'ngrok-skip-browser-warning': 'true',
                            },
                        }
                    );

                    set((state) => ({
                        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                        unreadCount: 0,
                    }));
                } catch (error) {
                    console.error('Failed to mark all as read:', error);
                }
            },

            clearNotifications: () => {
                set({ notifications: [], unreadCount: 0 });
            },
        }),
        { name: 'notification-store' }
    )
);

export default useNotificationStore;
