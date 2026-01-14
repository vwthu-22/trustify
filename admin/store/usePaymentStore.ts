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
    // Added for display purposes
    companyName?: string;
}

interface PaymentState {
    // State
    transactions: PaymentTransaction[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAllTransactions: () => Promise<void>;
    fetchTransactionsByCompany: (companyId: number) => Promise<PaymentTransaction[]>;
    clearError: () => void;
}

const usePaymentStore = create<PaymentState>()(
    devtools(
        (set, get) => ({
            transactions: [],
            isLoading: false,
            error: null,

            // Fetch all transactions by getting all companies first, then fetching transactions for each
            fetchAllTransactions: async () => {
                console.log('=== Fetch All Transactions ===');
                set({ isLoading: true, error: null });

                try {
                    // Step 1: Fetch all companies
                    const companiesResponse = await fetch(`${API_BASE_URL}/admin/company/all?page=0&size=100`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!companiesResponse.ok) {
                        if (companiesResponse.status === 401) {
                            throw new Error('Unauthorized. Please login again.');
                        }
                        throw new Error('Failed to fetch companies');
                    }

                    const companiesData = await companiesResponse.json();
                    console.log('Companies for transactions:', companiesData);

                    // Parse companies data
                    let companies: { id: number; name: string }[] = [];
                    if (companiesData.success && Array.isArray(companiesData.companies)) {
                        companies = companiesData.companies;
                    } else if (Array.isArray(companiesData)) {
                        companies = companiesData;
                    } else if (companiesData.content && Array.isArray(companiesData.content)) {
                        companies = companiesData.content;
                    } else if (companiesData.data && Array.isArray(companiesData.data)) {
                        companies = companiesData.data;
                    }

                    if (companies.length === 0) {
                        console.log('No companies found');
                        set({ transactions: [], isLoading: false });
                        return;
                    }

                    // Step 2: Fetch transactions for each company in parallel
                    const transactionPromises = companies.map(async (company) => {
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/payment/history/${company.id}`, {
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'ngrok-skip-browser-warning': 'true',
                                },
                            });

                            if (!response.ok) {
                                console.log(`No transactions for company ${company.id}`);
                                return [];
                            }

                            const data = await response.json();
                            // Add company name to each transaction
                            const transactions = Array.isArray(data) ? data : [];
                            return transactions.map((t: PaymentTransaction) => ({
                                ...t,
                                companyName: company.name,
                            }));
                        } catch (error) {
                            console.log(`Error fetching transactions for company ${company.id}:`, error);
                            return [];
                        }
                    });

                    const results = await Promise.all(transactionPromises);
                    const allTransactions = results.flat();

                    // Sort by createdAt descending (newest first)
                    allTransactions.sort((a, b) => {
                        const dateA = new Date(a.createdAt).getTime();
                        const dateB = new Date(b.createdAt).getTime();
                        return dateB - dateA;
                    });

                    console.log('All Transactions:', allTransactions);
                    set({ transactions: allTransactions, isLoading: false });
                } catch (error) {
                    console.error('=== Fetch All Transactions Error ===', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
                    set({ error: errorMessage, isLoading: false, transactions: [] });
                }
            },

            // Fetch transactions for a specific company
            fetchTransactionsByCompany: async (companyId: number) => {
                console.log('=== Fetch Transactions for Company ===', companyId);

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
                            return [];
                        }
                        throw new Error('Failed to fetch transactions');
                    }

                    const data = await response.json();
                    console.log('Company Transactions:', data);

                    return Array.isArray(data) ? data : [];
                } catch (error) {
                    console.error('=== Fetch Company Transactions Error ===', error);
                    return [];
                }
            },

            clearError: () => set({ error: null }),
        }),
        { name: 'admin-payment-store' }
    )
);

export default usePaymentStore;
