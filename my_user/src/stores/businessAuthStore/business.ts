// stores/businessAuthStore/business.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://demographic-mileage-any-frames.trycloudflare.com';

interface BusinessFormData {
    website: string;
    companyName: string;
    name: string;
    jobTitle: string;
    workEmail: string;
    country: string;
    phoneNumber: string;
    industry: string;
    numberOfEmployees: string;
    annualRevenue: string;
}

interface BusinessAuthState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;

    // Actions
    registerBusiness: (formData: BusinessFormData) => Promise<boolean>;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
    resendOtp: (email: string) => Promise<boolean>;
    clearError: () => void;
    clearSuccess: () => void;
}

const useBusinessAuthStore = create<BusinessAuthState>()(
    devtools(
        (set) => ({
            isLoading: false,
            error: null,
            successMessage: null,

            // Register business account
            registerBusiness: async (formData: BusinessFormData) => {
                console.log('=== Register Business Start ===');
                console.log('Form Data:', formData);
                console.log('API URL:', `${API_BASE_URL}/api/companies/register`);

                set({ isLoading: true, error: null, successMessage: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/register`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                        body: JSON.stringify(formData),
                    });

                    console.log('Response Status:', response.status);
                    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);

                        // If verification is already in progress, treat it as success
                        if (response.status === 400 && errorData.error?.includes('Verification already in progress')) {
                            console.log('Verification already in progress - allowing OTP entry');
                            set({
                                isLoading: false,
                                successMessage: 'Please check your email for the verification code'
                            });
                            return true;
                        }

                        throw new Error(errorData.message || errorData.error || 'Registration failed');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Register Business Success ===');

                    set({
                        isLoading: false,
                        successMessage: 'OTP has been sent to your email'
                    });
                    return true;
                } catch (error) {
                    console.error('=== Register Business Error ===');
                    console.error('Error Type:', error instanceof TypeError ? 'Network/CORS Error' : 'Other Error');
                    console.error('Error:', error);

                    let errorMessage = 'Registration failed';

                    if (error instanceof TypeError && error.message.includes('fetch')) {
                        errorMessage = 'Network error: Unable to connect to server. Please check if the backend is running and CORS is configured.';
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Verify OTP
            verifyOtp: async (email: string, otp: string) => {
                console.log('=== Verify OTP Start ===');
                console.log('Email:', email);
                console.log('OTP:', otp);

                set({ isLoading: true, error: null, successMessage: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(otp)}`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'OTP verification failed');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Verify OTP Success ===');

                    set({
                        isLoading: false,
                        successMessage: 'Account verified successfully'
                    });
                    return true;
                } catch (error) {
                    console.error('=== Verify OTP Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'OTP verification failed',
                        isLoading: false,
                    });
                    return false;
                }
            },

            // Resend OTP
            resendOtp: async (email: string) => {
                console.log('=== Resend OTP Start ===');
                console.log('Email:', email);

                set({ isLoading: true, error: null, successMessage: null });

                try {
                    const response = await fetch(`${API_BASE_URL}/api/companies/resend-code?email=${encodeURIComponent(email)}`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Response Error:', errorData);
                        throw new Error(errorData.message || errorData.error || 'Failed to resend OTP');
                    }

                    const data = await response.json();
                    console.log('Response Data:', data);
                    console.log('=== Resend OTP Success ===');

                    set({
                        isLoading: false,
                        successMessage: 'OTP has been resent to your email'
                    });
                    return true;
                } catch (error) {
                    console.error('=== Resend OTP Error ===');
                    console.error('Error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to resend OTP',
                        isLoading: false,
                    });
                    return false;
                }
            },

            clearError: () => set({ error: null }),
            clearSuccess: () => set({ successMessage: null }),
        }),
        { name: 'business-auth-store' }
    )
);

export default useBusinessAuthStore;
