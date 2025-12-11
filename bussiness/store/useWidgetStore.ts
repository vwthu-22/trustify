import { create } from 'zustand';

// Types
export interface Widget {
    id: string;
    name: string;
    type: 'trustbox' | 'carousel' | 'grid' | 'badge' | 'floating';
    settings: WidgetSettings;
    embedCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface WidgetSettings {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    showRating: boolean;
    showReviewCount: boolean;
    showCompanyName: boolean;
    reviewsToShow: number;
    autoRotate: boolean;
    rotateInterval: number; // seconds
    width: string;
    height: string;
}

export interface Integration {
    id: string;
    name: string;
    type: 'api' | 'webhook' | 'zapier' | 'shopify' | 'wordpress' | 'wix';
    status: 'active' | 'inactive' | 'error';
    config: Record<string, unknown>;
    createdAt: string;
    lastSync?: string;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    permissions: ('read' | 'write' | 'delete')[];
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
}

interface WidgetStore {
    // State
    widgets: Widget[];
    integrations: Integration[];
    apiKeys: ApiKey[];
    isLoading: boolean;
    error: string | null;

    // Widget Actions
    fetchWidgets: () => Promise<void>;
    createWidget: (widget: Partial<Widget>) => Promise<Widget | null>;
    updateWidget: (id: string, updates: Partial<Widget>) => Promise<boolean>;
    deleteWidget: (id: string) => Promise<boolean>;
    generateEmbedCode: (widgetId: string) => string;

    // Integration Actions
    fetchIntegrations: () => Promise<void>;
    createIntegration: (integration: Partial<Integration>) => Promise<boolean>;
    updateIntegration: (id: string, updates: Partial<Integration>) => Promise<boolean>;
    deleteIntegration: (id: string) => Promise<boolean>;
    testIntegration: (id: string) => Promise<boolean>;

    // API Key Actions
    fetchApiKeys: () => Promise<void>;
    createApiKey: (name: string, permissions: ('read' | 'write' | 'delete')[]) => Promise<ApiKey | null>;
    revokeApiKey: (id: string) => Promise<boolean>;

    clearError: () => void;
}

// Mock data
const mockWidgets: Widget[] = [
    {
        id: '1',
        name: 'TrustBox chính',
        type: 'trustbox',
        settings: {
            theme: 'light',
            primaryColor: '#0095b6',
            showRating: true,
            showReviewCount: true,
            showCompanyName: true,
            reviewsToShow: 5,
            autoRotate: true,
            rotateInterval: 5,
            width: '100%',
            height: 'auto'
        },
        embedCode: '<div class="trustify-widget" data-widget-id="1"></div>',
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Carousel Reviews',
        type: 'carousel',
        settings: {
            theme: 'dark',
            primaryColor: '#0095b6',
            showRating: true,
            showReviewCount: false,
            showCompanyName: true,
            reviewsToShow: 10,
            autoRotate: true,
            rotateInterval: 3,
            width: '100%',
            height: '300px'
        },
        embedCode: '<div class="trustify-widget" data-widget-id="2"></div>',
        createdAt: '2024-08-01T00:00:00Z',
        updatedAt: '2024-11-01T00:00:00Z'
    }
];

const mockIntegrations: Integration[] = [
    { id: '1', name: 'Website API', type: 'api', status: 'active', config: {}, createdAt: '2024-01-01T00:00:00Z', lastSync: '2024-12-10T12:00:00Z' },
    { id: '2', name: 'Webhook Notifications', type: 'webhook', status: 'active', config: { url: 'https://example.com/webhook' }, createdAt: '2024-06-01T00:00:00Z' },
];

const mockApiKeys: ApiKey[] = [
    { id: '1', name: 'Production Key', key: 'tk_live_xxxx...xxxx', permissions: ['read', 'write'], createdAt: '2024-01-01T00:00:00Z', lastUsed: '2024-12-10T12:00:00Z' },
    { id: '2', name: 'Development Key', key: 'tk_test_xxxx...xxxx', permissions: ['read'], createdAt: '2024-06-01T00:00:00Z' },
];

export const useWidgetStore = create<WidgetStore>((set, get) => ({
    widgets: [],
    integrations: [],
    apiKeys: [],
    isLoading: false,
    error: null,

    // Widget Actions
    fetchWidgets: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ widgets: mockWidgets, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch widgets', isLoading: false });
        }
    },

    createWidget: async (widget: Partial<Widget>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newWidget: Widget = {
                id: `widget-${Date.now()}`,
                name: widget.name || 'New Widget',
                type: widget.type || 'trustbox',
                settings: widget.settings || {
                    theme: 'light',
                    primaryColor: '#0095b6',
                    showRating: true,
                    showReviewCount: true,
                    showCompanyName: true,
                    reviewsToShow: 5,
                    autoRotate: false,
                    rotateInterval: 5,
                    width: '100%',
                    height: 'auto'
                },
                embedCode: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            newWidget.embedCode = `<div class="trustify-widget" data-widget-id="${newWidget.id}"></div>`;

            set({ widgets: [...get().widgets, newWidget], isLoading: false });
            return newWidget;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create widget', isLoading: false });
            return null;
        }
    },

    updateWidget: async (id: string, updates: Partial<Widget>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const widgets = get().widgets.map(w =>
                w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
            );

            set({ widgets, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update widget', isLoading: false });
            return false;
        }
    },

    deleteWidget: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ widgets: get().widgets.filter(w => w.id !== id), isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete widget', isLoading: false });
            return false;
        }
    },

    generateEmbedCode: (widgetId: string) => {
        return `<script src="https://trustify.com/widget.js"></script>\n<div class="trustify-widget" data-widget-id="${widgetId}"></div>`;
    },

    // Integration Actions
    fetchIntegrations: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ integrations: mockIntegrations, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch integrations', isLoading: false });
        }
    },

    createIntegration: async (integration: Partial<Integration>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newIntegration: Integration = {
                id: `int-${Date.now()}`,
                name: integration.name || 'New Integration',
                type: integration.type || 'api',
                status: 'inactive',
                config: integration.config || {},
                createdAt: new Date().toISOString()
            };

            set({ integrations: [...get().integrations, newIntegration], isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create integration', isLoading: false });
            return false;
        }
    },

    updateIntegration: async (id: string, updates: Partial<Integration>) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const integrations = get().integrations.map(i =>
                i.id === id ? { ...i, ...updates } : i
            );

            set({ integrations, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update integration', isLoading: false });
            return false;
        }
    },

    deleteIntegration: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ integrations: get().integrations.filter(i => i.id !== id), isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete integration', isLoading: false });
            return false;
        }
    },

    testIntegration: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock test - always succeeds
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Integration test failed', isLoading: false });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    // API Key Actions
    fetchApiKeys: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ apiKeys: mockApiKeys, isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch API keys', isLoading: false });
        }
    },

    createApiKey: async (name: string, permissions: ('read' | 'write' | 'delete')[]) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newKey: ApiKey = {
                id: `key-${Date.now()}`,
                name,
                key: `tk_live_${Math.random().toString(36).substring(2, 15)}`,
                permissions,
                createdAt: new Date().toISOString()
            };

            set({ apiKeys: [...get().apiKeys, newKey], isLoading: false });
            return newKey;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create API key', isLoading: false });
            return null;
        }
    },

    revokeApiKey: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ apiKeys: get().apiKeys.filter(k => k.id !== id), isLoading: false });
            return true;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to revoke API key', isLoading: false });
            return false;
        }
    },

    clearError: () => set({ error: null }),
}));
