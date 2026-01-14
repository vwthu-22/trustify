import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// API Request types
interface AnalyzeRequest {
    companyId: number;
    maxReviews: number;
    dateRange: string;
    includeReplies: boolean;
    forceRefresh: boolean;
}

// API Response types
interface SentimentSummary {
    positivePercent: number;
    neutralPercent: number;
    negativePercent: number;
    overallSentiment: string;
}

interface StrengthWeakness {
    category: string;
    description: string;
    score: number;
    mentionCount: number;
    sampleReviews: string[];
}

interface Suggestion {
    category: string;
    title: string;
    description: string;
    priority: string;
    expectedImpact: string;
}

interface Trend {
    period: string;
    averageRating: number;
    reviewCount: number;
    sentiment: string;
}

interface Keyword {
    keyword: string;
    count: number;
    sentiment: string;
}

interface AIAnalysisResult {
    status: string;
    message: string;
    companyId: number;
    companyName: string;
    overallScore: number;
    reviewsAnalyzed: number;
    sentimentSummary: SentimentSummary;
    strengths: StrengthWeakness[];
    weaknesses: StrengthWeakness[];
    suggestions: Suggestion[];
    trends: Trend[];
    topKeywords: Keyword[];
    aiSummary: string;
    analyzedAt: string;
    cached: boolean;
}

interface AIAnalysisState {
    isLoading: boolean;
    error: string | null;
    analysisResult: AIAnalysisResult | null;
    lastAnalyzedAt: string | null;

    // Actions
    analyzeReviews: (request: AnalyzeRequest) => Promise<boolean>;
    clearError: () => void;
    clearAnalysis: () => void;
}

export const useAIAnalysisStore = create<AIAnalysisState>()(
    persist(
        (set, get) => ({
            isLoading: false,
            error: null,
            analysisResult: null,
            lastAnalyzedAt: null,

            analyzeReviews: async (request: AnalyzeRequest) => {
                console.log('=== AI Analysis Start ===');
                console.log('Request:', request);

                set({ isLoading: true, error: null });

                try {
                    const url = `${API_BASE_URL}/api/v1/ai/companies/${request.companyId}/analyze`;
                    console.log('Calling API:', url);

                    const response = await fetch(url, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify(request),
                    });

                    console.log('Response Status:', response.status);

                    if (!response.ok) {
                        let errorMessage = 'Không thể phân tích đánh giá';
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

                    const data: AIAnalysisResult = await response.json();
                    console.log('Analysis Result:', data);
                    console.log('=== AI Analysis Success ===');

                    set({
                        isLoading: false,
                        analysisResult: data,
                        lastAnalyzedAt: data.analyzedAt || new Date().toISOString(),
                    });

                    return true;
                } catch (error) {
                    console.error('=== AI Analysis Error ===');
                    console.error('Error:', error);

                    let errorMessage = 'Không thể phân tích đánh giá';

                    if (error instanceof TypeError && error.message.includes('fetch')) {
                        errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối và thử lại.';
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

            clearAnalysis: () => set({
                analysisResult: null,
                lastAnalyzedAt: null,
                error: null
            }),
        }),
        {
            name: 'ai-analysis-store',
            partialize: (state) => ({
                analysisResult: state.analysisResult,
                lastAnalyzedAt: state.lastAnalyzedAt,
            }),
            onRehydrateStorage: () => (state) => {
                console.log('💾 AI Analysis Store Rehydrated from localStorage');
                console.log('Loaded data:', {
                    hasAnalysisResult: !!state?.analysisResult,
                    companyId: state?.analysisResult?.companyId,
                    lastAnalyzedAt: state?.lastAnalyzedAt
                });
            }
        }
    )
);

export type { AIAnalysisResult, AnalyzeRequest, SentimentSummary, StrengthWeakness, Suggestion, Trend, Keyword };
