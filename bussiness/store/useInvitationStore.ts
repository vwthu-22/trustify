import { create } from 'zustand';

// Types
export interface Invitation {
    id: string;
    customerEmail: string;
    customerName: string;
    status: 'pending' | 'sent' | 'opened' | 'completed' | 'failed';
    sentAt?: string;
    openedAt?: string;
    completedAt?: string;
    campaignId?: string;
    templateId?: string;
}

export interface Campaign {
    id: string;
    name: string;
    description?: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    templateId: string;
    totalSent: number;
    totalOpened: number;
    totalCompleted: number;
    createdAt: string;
    scheduledAt?: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InvitationStats {
    totalSent: number;
    totalOpened: number;
    totalCompleted: number;
    openRate: number;
    completionRate: number;
}

interface InvitationStore {
    // State
    invitations: Invitation[];
    campaigns: Campaign[];
    templates: EmailTemplate[];
    stats: InvitationStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchInvitations: () => Promise<void>;
    sendInvitation: (emails: string[], templateId: string) => Promise<boolean>;
    sendSingleInvite: (data: {
        to: string;
        productLink: string;
        productCode?: string;
        subject?: string;
        body?: string;
    }) => Promise<{ status: string; to: string; productLink: string }>;
    fetchCampaigns: () => Promise<void>;
    createCampaign: (campaign: Partial<Campaign>) => Promise<boolean>;
    updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<boolean>;
    deleteCampaign: (id: string) => Promise<boolean>;
    fetchTemplates: () => Promise<void>;
    createTemplate: (template: Partial<EmailTemplate>) => Promise<boolean>;
    updateTemplate: (id: string, updates: Partial<EmailTemplate>) => Promise<boolean>;
    deleteTemplate: (id: string) => Promise<boolean>;
    fetchStats: () => Promise<void>;
    clearError: () => void;
}

// Mock data
const mockInvitations: Invitation[] = [
    { id: '1', customerEmail: 'customer1@email.com', customerName: 'Khách hàng 1', status: 'completed', sentAt: '2024-12-10T10:00:00Z', completedAt: '2024-12-10T14:30:00Z' },
    { id: '2', customerEmail: 'customer2@email.com', customerName: 'Khách hàng 2', status: 'opened', sentAt: '2024-12-10T10:00:00Z', openedAt: '2024-12-10T12:00:00Z' },
    { id: '3', customerEmail: 'customer3@email.com', customerName: 'Khách hàng 3', status: 'sent', sentAt: '2024-12-10T10:00:00Z' },
    { id: '4', customerEmail: 'customer4@email.com', customerName: 'Khách hàng 4', status: 'pending' },
];

const mockCampaigns: Campaign[] = [
    { id: '1', name: 'Chiến dịch tháng 12', status: 'active', templateId: '1', totalSent: 150, totalOpened: 89, totalCompleted: 45, createdAt: '2024-12-01T00:00:00Z' },
    { id: '2', name: 'Khách hàng VIP', status: 'completed', templateId: '2', totalSent: 50, totalOpened: 42, totalCompleted: 28, createdAt: '2024-11-15T00:00:00Z' },
    { id: '3', name: 'Chiến dịch mới', status: 'draft', templateId: '1', totalSent: 0, totalOpened: 0, totalCompleted: 0, createdAt: '2024-12-10T00:00:00Z' },
];

const mockTemplates: EmailTemplate[] = [
    { id: '1', name: 'Template mặc định', subject: 'Chia sẻ trải nghiệm của bạn', content: 'Xin chào {{name}}, hãy chia sẻ đánh giá...', isDefault: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-12-01T00:00:00Z' },
    { id: '2', name: 'Template VIP', subject: 'Đánh giá dành riêng cho khách VIP', content: 'Kính gửi {{name}}, là khách hàng VIP...', isDefault: false, createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-11-01T00:00:00Z' },
];

const mockStats: InvitationStats = {
    totalSent: 1250,
    totalOpened: 875,
    totalCompleted: 425,
    openRate: 70,
    completionRate: 34
};

export const useInvitationStore = create<InvitationStore>((set, get) => ({
    invitations: [],
    campaigns: [],
    templates: [],
    stats: null,
    isLoading: false,
    error: null,

    fetchInvitations: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ invitations: mockInvitations, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch invitations', isLoading: false });
        }
    },

    sendInvitation: async (emails: string[], templateId: string) => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newInvitations = emails.map((email, index) => ({
                id: `new-${Date.now()}-${index}`,
                customerEmail: email,
                customerName: email.split('@')[0],
                status: 'sent' as const,
                sentAt: new Date().toISOString(),
                templateId
            }));

            set({
                invitations: [...newInvitations, ...get().invitations],
                isLoading: false
            });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to send invitations', isLoading: false });
            return false;
        }
    },

    // New: Send single invite using real API
    sendSingleInvite: async (data: {
        to: string;
        productLink: string;
        productCode?: string;
        subject?: string;
        body?: string;
    }) => {
        set({ isLoading: true, error: null });
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';
            const response = await fetch(`${API_BASE_URL}/integration/companies/invite`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to send invitation');
            }

            const result = await response.json();

            // Add to invitations list
            const newInvitation: Invitation = {
                id: `invite-${Date.now()}`,
                customerEmail: data.to,
                customerName: data.to.split('@')[0],
                status: 'sent',
                sentAt: new Date().toISOString(),
            };

            set({
                invitations: [newInvitation, ...get().invitations],
                isLoading: false
            });

            return result;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to send invitation', isLoading: false });
            throw error;
        }
    },

    fetchCampaigns: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ campaigns: mockCampaigns, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch campaigns', isLoading: false });
        }
    },

    createCampaign: async (campaign: Partial<Campaign>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newCampaign: Campaign = {
                id: `campaign-${Date.now()}`,
                name: campaign.name || 'New Campaign',
                status: 'draft',
                templateId: campaign.templateId || '1',
                totalSent: 0,
                totalOpened: 0,
                totalCompleted: 0,
                createdAt: new Date().toISOString(),
                ...campaign
            };

            set({ campaigns: [...get().campaigns, newCampaign], isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create campaign', isLoading: false });
            return false;
        }
    },

    updateCampaign: async (id: string, updates: Partial<Campaign>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const campaigns = get().campaigns.map(c =>
                c.id === id ? { ...c, ...updates } : c
            );

            set({ campaigns, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update campaign', isLoading: false });
            return false;
        }
    },

    deleteCampaign: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ campaigns: get().campaigns.filter(c => c.id !== id), isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete campaign', isLoading: false });
            return false;
        }
    },

    fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            set({ templates: mockTemplates, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch templates', isLoading: false });
        }
    },

    createTemplate: async (template: Partial<EmailTemplate>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTemplate: EmailTemplate = {
                id: `template-${Date.now()}`,
                name: template.name || 'New Template',
                subject: template.subject || '',
                content: template.content || '',
                isDefault: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            set({ templates: [...get().templates, newTemplate], isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create template', isLoading: false });
            return false;
        }
    },

    updateTemplate: async (id: string, updates: Partial<EmailTemplate>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const templates = get().templates.map(t =>
                t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
            );

            set({ templates, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update template', isLoading: false });
            return false;
        }
    },

    deleteTemplate: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ templates: get().templates.filter(t => t.id !== id), isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete template', isLoading: false });
            return false;
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            set({ stats: mockStats, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch stats', isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
