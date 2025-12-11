import { create } from 'zustand';

// Types
export interface CompanySettings {
    // Basic Info
    name: string;
    email: string;
    phone?: string;
    website?: string;
    logo?: string;
    industry?: string;
    description?: string;
    address?: string;
    city?: string;
    country?: string;

    // Notification Settings
    notifications: {
        newReview: boolean;
        reviewReply: boolean;
        weeklyReport: boolean;
        monthlyReport: boolean;
        promotionalEmails: boolean;
    };

    // Widget Settings
    widgetSettings: {
        primaryColor: string;
        showRating: boolean;
        showReviewCount: boolean;
        autoRefresh: boolean;
    };

    // Team Settings
    teamMembers: TeamMember[];
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    status: 'active' | 'pending' | 'inactive';
    invitedAt: string;
    joinedAt?: string;
}

interface SettingsStore {
    // State
    settings: CompanySettings | null;
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;

    // Actions
    fetchSettings: () => Promise<void>;
    updateSettings: (updates: Partial<CompanySettings>) => Promise<boolean>;
    updateNotifications: (notifications: CompanySettings['notifications']) => Promise<boolean>;
    updateWidgetSettings: (widgetSettings: CompanySettings['widgetSettings']) => Promise<boolean>;
    uploadLogo: (file: File) => Promise<string | null>;
    inviteTeamMember: (email: string, role: 'admin' | 'member') => Promise<boolean>;
    removeTeamMember: (memberId: string) => Promise<boolean>;
    updateTeamMemberRole: (memberId: string, role: 'admin' | 'member') => Promise<boolean>;
    clearError: () => void;
}

// Mock data
const mockSettings: CompanySettings = {
    name: 'Công ty ABC',
    email: 'contact@abc.com',
    phone: '0123 456 789',
    website: 'https://abc.com',
    industry: 'Technology',
    description: 'Công ty công nghệ hàng đầu Việt Nam',
    address: '123 Đường ABC, Quận 1',
    city: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    notifications: {
        newReview: true,
        reviewReply: true,
        weeklyReport: true,
        monthlyReport: false,
        promotionalEmails: false,
    },
    widgetSettings: {
        primaryColor: '#0095b6',
        showRating: true,
        showReviewCount: true,
        autoRefresh: true,
    },
    teamMembers: [
        { id: '1', name: 'Nguyễn Văn A', email: 'admin@abc.com', role: 'owner', status: 'active', invitedAt: '2024-01-01T00:00:00Z', joinedAt: '2024-01-01T00:00:00Z' },
        { id: '2', name: 'Trần Thị B', email: 'manager@abc.com', role: 'admin', status: 'active', invitedAt: '2024-06-01T00:00:00Z', joinedAt: '2024-06-02T00:00:00Z' },
        { id: '3', name: 'Pending User', email: 'pending@abc.com', role: 'member', status: 'pending', invitedAt: '2024-12-01T00:00:00Z' },
    ]
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: null,
    isLoading: false,
    error: null,
    isSaving: false,

    fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ settings: mockSettings, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch settings', isLoading: false });
        }
    },

    updateSettings: async (updates: Partial<CompanySettings>) => {
        set({ isSaving: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const currentSettings = get().settings;
            if (currentSettings) {
                set({ settings: { ...currentSettings, ...updates }, isSaving: false });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update settings', isSaving: false });
            return false;
        }
    },

    updateNotifications: async (notifications: CompanySettings['notifications']) => {
        set({ isSaving: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const currentSettings = get().settings;
            if (currentSettings) {
                set({ settings: { ...currentSettings, notifications }, isSaving: false });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update notifications', isSaving: false });
            return false;
        }
    },

    updateWidgetSettings: async (widgetSettings: CompanySettings['widgetSettings']) => {
        set({ isSaving: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const currentSettings = get().settings;
            if (currentSettings) {
                set({ settings: { ...currentSettings, widgetSettings }, isSaving: false });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update widget settings', isSaving: false });
            return false;
        }
    },

    uploadLogo: async (file: File) => {
        set({ isSaving: true, error: null });
        try {
            // TODO: Replace with actual file upload API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock URL - in real implementation, this would be the uploaded file URL
            const logoUrl = URL.createObjectURL(file);

            const currentSettings = get().settings;
            if (currentSettings) {
                set({ settings: { ...currentSettings, logo: logoUrl }, isSaving: false });
            }
            return logoUrl;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to upload logo', isSaving: false });
            return null;
        }
    },

    inviteTeamMember: async (email: string, role: 'admin' | 'member') => {
        set({ isSaving: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newMember: TeamMember = {
                id: `member-${Date.now()}`,
                name: email.split('@')[0],
                email,
                role,
                status: 'pending',
                invitedAt: new Date().toISOString(),
            };

            const currentSettings = get().settings;
            if (currentSettings) {
                set({
                    settings: {
                        ...currentSettings,
                        teamMembers: [...currentSettings.teamMembers, newMember]
                    },
                    isSaving: false
                });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to invite team member', isSaving: false });
            return false;
        }
    },

    removeTeamMember: async (memberId: string) => {
        set({ isSaving: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const currentSettings = get().settings;
            if (currentSettings) {
                set({
                    settings: {
                        ...currentSettings,
                        teamMembers: currentSettings.teamMembers.filter(m => m.id !== memberId)
                    },
                    isSaving: false
                });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to remove team member', isSaving: false });
            return false;
        }
    },

    updateTeamMemberRole: async (memberId: string, role: 'admin' | 'member') => {
        set({ isSaving: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const currentSettings = get().settings;
            if (currentSettings) {
                set({
                    settings: {
                        ...currentSettings,
                        teamMembers: currentSettings.teamMembers.map(m =>
                            m.id === memberId ? { ...m, role } : m
                        )
                    },
                    isSaving: false
                });
            }
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update role', isSaving: false });
            return false;
        }
    },

    clearError: () => set({ error: null }),
}));
