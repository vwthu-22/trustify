import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RatingState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;

    // Actions
    submitRating: (companyId: string, rating: number) => Promise<boolean>;
    clearError: () => void;
    clearSuccess: () => void;
}

const useRatingStore = create<RatingState>()(
    devtools(
        (set) => ({
            isLoading: false,
            error: null,
            successMessage: null,

            // Submit rating for a company
            submitRating: async (companyId: string, rating: number) => {
                console.log('=== Submit Rating Start ===');
                console.log('Company ID:', companyId);
                console.log('Rating:', rating);

                set({ isLoading: true, error: null, successMessage: null });

                try {
                    const url = `${API_BASE_URL}/api/company-rating/${companyId}/${rating}`;
                    console.log('Submitting to:', url);

                    const response = await fetch(url, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'bypass-tunnel-reminder': 'true',
                        },
                    });


                    console.log('Response Status:', response.status);
                    console.log('Response Content-Type:', response.headers.get('content-type'));

                    if (!response.ok) {
                        // Try to parse error as JSON, fallback to text
                        let errorMessage = 'Failed to submit rating';
                        try {
                            const errorData = await response.json();
                            console.error('Response Error (JSON):', errorData);
                            errorMessage = errorData.message || errorData.error || errorMessage;
                        } catch {
                            const errorText = await response.text();
                            console.error('Response Error (Text):', errorText);
                            errorMessage = errorText || errorMessage;
                        }
                        throw new Error(errorMessage);
                    }

                    // Handle both JSON and plain text responses
                    const contentType = response.headers.get('content-type');
                    let data;

                    if (contentType && contentType.includes('application/json')) {
                        data = await response.json();
                        console.log('Response Data (JSON):', data);
                    } else {
                        data = await response.text();
                        console.log('Response Data (Text):', data);
                    }

                    console.log('=== Submit Rating Success ===');

                    set({
                        isLoading: false,
                        successMessage: 'Rating submitted successfully!'
                    });
                    return true;
                } catch (error) {
                    console.error('=== Submit Rating Error ===');
                    console.error('Error:', error);

                    let errorMessage = 'Failed to submit rating';

                    if (error instanceof TypeError && error.message.includes('fetch')) {
                        errorMessage = 'Network error. Please check your connection and try again.';
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

            clearError: () => set({ error: null }),
            clearSuccess: () => set({ successMessage: null }),
        }),
        { name: 'rating-store' }
    )
);

export default useRatingStore;
