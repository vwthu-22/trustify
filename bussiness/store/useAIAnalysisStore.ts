import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translateText } from '@/services/translationService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

// API Request types
interface AnalyzeRequest {
    companyId: number;
    maxReviews: number;
    dateRange: string;
    includeReplies: boolean;
    forceRefresh: boolean;
    language?: string; // Add language hint for AI
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
    analyzeReviews: (request: AnalyzeRequest, targetLang?: string) => Promise<boolean>;
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

            analyzeReviews: async (request: AnalyzeRequest, targetLang: string = 'en') => {
                console.log('=== AI Analysis Start ===');
                console.log('Request Company ID:', request.companyId);
                console.log('Target Language:', targetLang);

                if (!request.companyId || request.companyId <= 0) {
                    set({ error: 'ID công ty không hợp lệ', isLoading: false });
                    return false;
                }

                try {
                    // Include language in request body for backend hint
                    // Try removing /v1/ to match other API structures in the project
                    const url = `${API_BASE_URL}/api/ai/companies/${request.companyId}/analyze`;
                    console.log('Calling API (Revised URL):', url);

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
                        const errorText = await response.text();
                        console.error('Response Error:', errorText);

                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData.message || errorData.error || errorMessage;
                        } catch {
                            errorMessage = errorText || errorMessage;
                        }
                        throw new Error(errorMessage);
                    }

                    const data: AIAnalysisResult = await response.json();

                    // Automatic Translation Logic
                    // If target language is not English, translate the results
                    if (targetLang && targetLang !== 'en') {
                        console.log(`🌐 Translating AI results to: \${targetLang}...`);

                        try {
                            // 1. Translate AI Summary
                            if (data.aiSummary) {
                                const result = await translateText(data.aiSummary, targetLang);
                                data.aiSummary = result.translatedText;
                            }

                            // 2. Translate Strengths
                            if (data.strengths && data.strengths.length > 0) {
                                for (const s of data.strengths) {
                                    if (s.description) {
                                        try {
                                            const res = await translateText(s.description, targetLang);
                                            s.description = res.translatedText;
                                            // Small delay to prevent rate limiting
                                            await new Promise(resolve => setTimeout(resolve, 100));
                                        } catch (e) {
                                            console.warn('Failed to translate strength description:', e);
                                        }
                                    }
                                }
                            }

                            // 3. Translate Weaknesses
                            if (data.weaknesses && data.weaknesses.length > 0) {
                                for (const w of data.weaknesses) {
                                    if (w.description) {
                                        try {
                                            const res = await translateText(w.description, targetLang);
                                            w.description = res.translatedText;
                                            await new Promise(resolve => setTimeout(resolve, 100));
                                        } catch (e) {
                                            console.warn('Failed to translate weakness description:', e);
                                        }
                                    }
                                }
                            }

                            // 4. Translate Suggestions
                            if (data.suggestions && data.suggestions.length > 0) {
                                for (const s of data.suggestions) {
                                    try {
                                        if (s.title) {
                                            const resT = await translateText(s.title, targetLang);
                                            s.title = resT.translatedText;
                                            await new Promise(resolve => setTimeout(resolve, 50));
                                        }
                                        if (s.description) {
                                            const resD = await translateText(s.description, targetLang);
                                            s.description = resD.translatedText;
                                            await new Promise(resolve => setTimeout(resolve, 50));
                                        }
                                        if (s.expectedImpact) {
                                            const resI = await translateText(s.expectedImpact, targetLang);
                                            s.expectedImpact = resI.translatedText;
                                            await new Promise(resolve => setTimeout(resolve, 50));
                                        }
                                    } catch (e) {
                                        console.warn('Failed to translate suggestion fields:', e);
                                    }
                                }
                            }

                            console.log('✅ Translation complete');
                        } catch (transError) {
                            console.warn('⚠️ Auto-translation failed, showing original English results:', transError);
                        }
                    }

                    console.log('Analysis Result (final):', data);
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
