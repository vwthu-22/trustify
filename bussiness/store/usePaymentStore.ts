import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// Types
export interface PaymentDetail {
    id?: number;
    txnRef: string;
    amount: number;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    companyId?: number;
    planId?: number;
    createdAt?: string;
}

export interface PaymentHistory {
    id: number;
    txnRef: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface CreatePaymentResponse {
    status: string;
    message: string;
    paymentUrl?: string;
    txnRef?: string;
}

interface PaymentState {
    // State
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
    currentPayment: PaymentDetail | null;
    paymentHistory: PaymentHistory[];

    // Actions
    createPayment: (companyId: number, planId: number, bankCode?: string) => Promise<CreatePaymentResponse | null>;
    getPaymentDetail: (txnRef: string) => Promise<PaymentDetail | null>;
    getPaymentHistory: (companyId: number) => Promise<void>;
    clearError: () => void;
    clearCurrentPayment: () => void;
}

const usePaymentStore = create<PaymentState>()(
    devtools(
        (set, get) => ({
            isLoading: false,
            isCreating: false,
            error: null,
            currentPayment: null,
            paymentHistory: [],

            // Create VNPay payment URL
            createPayment: async (companyId: number, planId: number, bankCode?: string) => {
                console.log('=== Create Payment Start ===');
                console.log('CompanyId:', companyId, 'PlanId:', planId, 'BankCode:', bankCode);

                set({ isCreating: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify({
                            companyId,
                            planId,
                            ...(bankCode && { bankCode }),
                        }),
                    });

                    const data = await response.json();
                    console.log('Create Payment Response:', data);

                    if ((data.status === 'SUCCESS' || data.status === 'OK') && data.paymentUrl) {
                        // Store txnRef for later verification
                        if (typeof window !== 'undefined' && data.txnRef) {
                            localStorage.setItem('vnpay_txnRef', data.txnRef);
                            localStorage.setItem('vnpay_planId', planId.toString());
                        }

                        set({ isCreating: false });
                        return data as CreatePaymentResponse;
                    } else {
                        throw new Error(data.message || 'Failed to create payment');
                    }
                } catch (error) {
                    console.error('=== Create Payment Error ===', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
                    set({ error: errorMessage, isCreating: false });
                    return null;
                }
            },

            // Get payment detail by txnRef
            getPaymentDetail: async (txnRef: string) => {
                console.log('=== Get Payment Detail ===', txnRef);

                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/payment/detail/${txnRef}`, {
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        if (response.status === 404) {
                            console.log('Payment not found, may still be processing...');
                            set({ isLoading: false });
                            return null;
                        }
                        throw new Error('Failed to fetch payment detail');
                    }

                    const data = await response.json();
                    console.log('Payment Detail:', data);

                    set({ currentPayment: data, isLoading: false });
                    return data as PaymentDetail;
                } catch (error) {
                    console.error('=== Get Payment Detail Error ===', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to get payment detail';
                    set({ error: errorMessage, isLoading: false });
                    return null;
                }
            },

            // Get payment history for company
            getPaymentHistory: async (companyId: number) => {
                console.log('=== Get Payment History ===', companyId);

                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/payment/history/${companyId}`, {
                        credentials: 'include',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch payment history');
                    }

                    const data = await response.json();
                    console.log('Payment History:', data);

                    set({ paymentHistory: data || [], isLoading: false });
                } catch (error) {
                    console.error('=== Get Payment History Error ===', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to get payment history';
                    set({ error: errorMessage, isLoading: false, paymentHistory: [] });
                }
            },

            clearError: () => set({ error: null }),

            clearCurrentPayment: () => {
                set({ currentPayment: null });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('vnpay_txnRef');
                    localStorage.removeItem('vnpay_planId');
                }
            },
        }),
        { name: 'payment-store' }
    )
);

export default usePaymentStore;
