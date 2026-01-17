import { create } from 'zustand';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export interface Product {
    id: number;
    productCode: number;
    name: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    createdAt?: string;
}

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProducts: (companyId: string | number) => Promise<void>;
    clearError: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async (companyId: string | number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/products`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            // Handle different response formats
            let productsData: Product[] = [];

            if (Array.isArray(data)) {
                productsData = data;
            } else if (data.content && Array.isArray(data.content)) {
                productsData = data.content;
            } else if (data.products && Array.isArray(data.products)) {
                productsData = data.products;
            }

            set({ products: productsData, isLoading: false });
        } catch (error) {
            console.error('Fetch products error:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch products',
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));
