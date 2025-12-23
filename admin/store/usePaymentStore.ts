import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// Types matching API response
export interface PaymentTransaction {
    id: number;
    txnRef: string;
    vnpTransactionNo: string;
    amount: number;
    orderInfo: string;
    bankCode: string;
    payDate: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    responseCode: string;
    ipAddress: string;
    companyId: number;
    planId: number;
    createdAt: string;
    updatedAt: string;
}

interface PaymentState {
    // State
    transactions: PaymentTransaction[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAllTransactions: () => Promise<void>;
    fetchTransactionsByCompany: (companyId: number) => Promise<void>;
    clearError: () => void;
}

const usePaymentStore = create<PaymentState>()(
    devtools(
        (set) => ({
            transactions: [],
            isLoading: false,
            error: null,

            // Fetch all transactions (for admin overview)
            // Note: This fetches transactions from all companies
            // You may need to implement a backend endpoint for this
            fetchAllTransactions: async () => {
                console.log('=== Fetch All Transactions ===');
                set({ isLoading: true, error: null });

                try {
                    // Try to fetch from admin endpoint first
                    const response = await fetch(`${API_BASE_URL}/api/payment/history/all`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        // If /all endpoint doesn't exist, fallback to empty or mock
                        if (response.status === 404) {
                            console.log('All transactions endpoint not found, using fallback');
                            set({ transactions: [], isLoading: false });
                            return;
                        }
                        throw new Error('Failed to fetch transactions');
                    }

                    const data = await response.json();
                    console.log('All Transactions:', data);

                    set({ transactions: Array.isArray(data) ? data : [], isLoading: false });
                } catch (error) {
                    console.error('=== Fetch All Transactions Error ===', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
                    set({ error: errorMessage, isLoading: false, transactions: [] });
                }
            },

            // Fetch transactions for a specific company
            fetchTransactionsByCompany: async (companyId: number) => {
                console.log('=== Fetch Transactions for Company ===', companyId);
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/payment/history/${companyId}`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 404) {
                            set({ transactions: [], isLoading: false });
                            return;
                        }
                        throw new Error('Failed to fetch transactions');
                    }

                    const data = await response.json();
                    console.log('Company Transactions:', data);

                    set({ transactions: Array.isArray(data) ? data : [], isLoading: false });
                } catch (error) {
                    console.error('=== Fetch Company Transactions Error ===', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
                    set({ error: errorMessage, isLoading: false, transactions: [] });
                }
            },

            clearError: () => set({ error: null }),
        }),
        { name: 'admin-payment-store' }
    )
);

export default usePaymentStore;
