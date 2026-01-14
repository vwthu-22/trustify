'use client';

import { useState, useEffect } from 'react';
import {
    Sparkles,
    TrendingUp,
    TrendingDown,
    Lightbulb,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Minus,
    RefreshCw,
    Clock,
    CheckCircle2,
    Star,
    MessageSquare,
    Brain,
    Target,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Quote
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAIAnalysisStore } from '@/store/useAIAnalysisStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { getStarFillColor } from '@/utils/ratingColors';

const ITEMS_PER_PAGE = 3;

export default function AIReviewAnalysisPage() {
    const t = useTranslations('analytics');
    const { company } = useCompanyStore();
    const {
        isLoading,
        error,
        analysisResult,
        lastAnalyzedAt,
        analyzeReviews,
        clearError,
        clearAnalysis
    } = useAIAnalysisStore();

    const [expandedImprovement, setExpandedImprovement] = useState<number | null>(null);
    const [expandedStrength, setExpandedStrength] = useState<number | null>(null);
    const [expandedWeakness, setExpandedWeakness] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState('30');
    const [maxReviews, setMaxReviews] = useState(50);

    // Pagination states
    const [strengthsPage, setStrengthsPage] = useState(1);
    const [weaknessesPage, setWeaknessesPage] = useState(1);

    // Clear analysis when company changes (logout/login to different company)
    useEffect(() => {
        // Only clear if we have analysis data AND it's for a DIFFERENT company
        if (analysisResult && company?.id) {
            const currentCompanyId = Number(company.id);
            const analysisCompanyId = analysisResult.companyId;

            if (currentCompanyId !== analysisCompanyId) {
                console.log('🔄 Switched to different company, clearing old analysis data');
                console.log('Previous company:', analysisCompanyId, '→ Current company:', currentCompanyId);
                clearAnalysis();
            } else {
                console.log('✅ Same company, keeping analysis data');
            }
        }
        // Don't clear when company is null (just logged out) - keep data in localStorage
    }, [company?.id, analysisResult?.companyId, clearAnalysis]);

    // Reset pagination when analysis result changes
    useEffect(() => {
        setStrengthsPage(1);
        setWeaknessesPage(1);
    }, [analysisResult]);

    const handleAnalyze = async (forceRefresh: boolean = false) => {
        console.log('DEBUG: handleAnalyze using company:', company);
        if (!company?.id) {
            console.error('Company ID not found');
            return;
        }

        await analyzeReviews({
            companyId: Number(company.id),
            maxReviews: maxReviews,
            dateRange: getDateRangeString(dateRange),
            includeReplies: true,
            forceRefresh: forceRefresh,
        });
    };

    const getDateRangeString = (days: string): string => {
        switch (days) {
            case '7': return '7 days';
            case '30': return '30 days';
            case '90': return '90 days';
            case '180': return '6 months';
            case '365': return '1 year';
            default: return '30 days';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return t('priorityHigh');
            case 'medium': return t('priorityMedium');
            case 'low': return t('priorityLow');
            default: return priority;
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive': return 'text-[#5aa5df] bg-blue-100';
            case 'negative': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        {t('aiTitle')}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        {t('aiSubtitle')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Date Range Selector */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="7">{t('days7')}</option>
                        <option value="30">{t('days30')}</option>
                        <option value="90">{t('days90')}</option>
                        <option value="180">{t('months6')}</option>
                        <option value="365">{t('year1')}</option>
                    </select>

                    {/* Max Reviews */}
                    <select
                        value={maxReviews}
                        onChange={(e) => setMaxReviews(Number(e.target.value))}
                        className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="10">{t('reviewsCount', { count: 10 })}</option>
                        <option value="25">{t('reviewsCount', { count: 25 })}</option>
                        <option value="50">{t('reviewsCount', { count: 50 })}</option>
                        <option value="100">{t('reviewsCount', { count: 100 })}</option>
                    </select>

                    <button
                        onClick={() => handleAnalyze(false)}
                        disabled={isLoading || !company?.id}
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">{t('analyzing')}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span className="hidden sm:inline">{t('analyzeWithAI')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-800 font-medium">{t('analysisError')}</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                    <button onClick={clearError} className="text-red-500 hover:text-red-700">
                        ✕
                    </button>
                </div>
            )}

            {/* Analysis Status */}
            {lastAnalyzedAt && analysisResult && (
                <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{t('lastAnalyzed')}: {formatDate(lastAnalyzedAt)}</span>
                    </div>
                    {analysisResult.cached && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {t('cached')}
                        </span>
                    )}
                    <button
                        onClick={() => handleAnalyze(true)}
                        disabled={isLoading}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                    >
                        <RefreshCw className="w-3 h-3" />
                        {t('refresh')}
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                            <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">{t('aiAnalyzing')}</p>
                            <p className="text-gray-500 mt-1">{t('analysisNote')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* No Company */}
            {!company?.id && !isLoading && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-yellow-900">{t('noCompany')}</h3>
                    <p className="text-yellow-700 mt-2">{t('pleaseLogin')}</p>
                </div>
            )}

            {/* No Analysis Yet */}
            {!isLoading && !analysisResult && company?.id && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-12">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{t('startAnalysis')}</h3>
                            <p className="text-gray-600 mt-2 max-w-md">
                                {t('startAnalysisDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Results */}
            {!isLoading && analysisResult && (
                <div className="space-y-6">
                    {/* AI Summary */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold mb-1">{t('aiSummary')}</h3>
                                <p className="text-white/90 text-sm leading-relaxed">{analysisResult.aiSummary}</p>
                            </div>
                        </div>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 sm:p-3 text-center">
                            <p className="text-xl sm:text-2xl font-bold text-purple-600">{analysisResult.overallScore}</p>
                            <p className="text-xs text-gray-600">{t('overallScore')}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 sm:p-3 text-center">
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">{analysisResult.reviewsAnalyzed}</p>
                            <p className="text-xs text-gray-600">{t('reviewsAnalyzed')}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 sm:p-3 text-center">
                            <p className="text-xl sm:text-2xl font-bold text-[#5aa5df]">{analysisResult.strengths?.length || 0}</p>
                            <p className="text-xs text-gray-600">{t('strengths')}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 sm:p-3 text-center">
                            <p className="text-xl sm:text-2xl font-bold text-orange-600">{analysisResult.suggestions?.length || 0}</p>
                            <p className="text-xs text-gray-600">{t('suggestions')}</p>
                        </div>
                    </div>

                    {/* Sentiment Distribution */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">{t('sentimentDistribution')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                {/* Positive */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <ThumbsUp className="w-3.5 h-3.5 text-[#5aa5df]" />
                                            <span className="font-medium text-gray-700">{t('positive')}</span>
                                        </div>
                                        <span className="font-bold text-[#5aa5df]">
                                            {analysisResult.sentimentSummary?.positivePercent || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-[#5aa5df] h-2.5 rounded-full transition-all"
                                            style={{ width: `${analysisResult.sentimentSummary?.positivePercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Neutral */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <Minus className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="font-medium text-gray-700">{t('neutral')}</span>
                                        </div>
                                        <span className="font-bold text-gray-600">
                                            {analysisResult.sentimentSummary?.neutralPercent || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-gray-400 h-2.5 rounded-full transition-all"
                                            style={{ width: `${analysisResult.sentimentSummary?.neutralPercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Negative */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
                                            <span className="font-medium text-gray-700">{t('negative')}</span>
                                        </div>
                                        <span className="font-bold text-red-600">
                                            {analysisResult.sentimentSummary?.negativePercent || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-red-500 h-2.5 rounded-full transition-all"
                                            style={{ width: `${analysisResult.sentimentSummary?.negativePercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">{t('overallSentiment')}</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {analysisResult.sentimentSummary?.overallSentiment || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                <Target className="w-4 h-4 text-orange-500" />
                                {t('suggestionsFromAI')} ({analysisResult.suggestions.length})
                            </h3>
                            <div className="space-y-2">
                                {analysisResult.suggestions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                                    >
                                        <button
                                            onClick={() => setExpandedImprovement(
                                                expandedImprovement === index ? null : index
                                            )}
                                            className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                                                    {getPriorityLabel(item.priority)}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                                                    <p className="text-xs text-gray-500">{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.expectedImpact && (
                                                    <span className="text-xs text-gray-500 hidden sm:block">
                                                        {t('impact')}: {item.expectedImpact}
                                                    </span>
                                                )}
                                                {expandedImprovement === index ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                        </button>

                                        {expandedImprovement === index && (
                                            <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-3">
                                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                                    <p className="text-xs text-green-800 flex items-start gap-1.5">
                                                        <Lightbulb className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span>{item.description}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Strengths */}
                        {analysisResult.strengths && analysisResult.strengths.length > 0 && (() => {
                            const totalStrengthPages = Math.ceil(analysisResult.strengths.length / ITEMS_PER_PAGE);
                            const paginatedStrengths = analysisResult.strengths.slice(
                                (strengthsPage - 1) * ITEMS_PER_PAGE,
                                strengthsPage * ITEMS_PER_PAGE
                            );

                            return (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                            <TrendingUp className="w-4 h-4 text-[#5aa5df]" />
                                            {t('strengths')} ({analysisResult.strengths.length})
                                        </h3>
                                        {totalStrengthPages > 1 && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setStrengthsPage(prev => Math.max(1, prev - 1))}
                                                    disabled={strengthsPage === 1}
                                                    className="p-0.5 rounded hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronLeft className="w-4 h-4 text-[#5aa5df]" />
                                                </button>
                                                <span className="text-xs text-gray-600 min-w-[40px] text-center">
                                                    {strengthsPage}/{totalStrengthPages}
                                                </span>
                                                <button
                                                    onClick={() => setStrengthsPage(prev => Math.min(totalStrengthPages, prev + 1))}
                                                    disabled={strengthsPage === totalStrengthPages}
                                                    className="p-0.5 rounded hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-[#5aa5df]" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {paginatedStrengths.map((strength, index) => (
                                            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium text-blue-900 text-sm">{strength.category}</h4>
                                                    <span className={`text-sm font-bold flex items-center gap-0.5 ${getStarFillColor(strength.score)}`}>
                                                        <Star className="w-3.5 h-3.5" />
                                                        {strength.score}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-blue-800 mb-1">{strength.description}</p>
                                                <p className="text-xs text-[#5aa5df]">{strength.mentionCount} {t('mentions')}</p>
                                                {strength.sampleReviews && strength.sampleReviews.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-blue-200">
                                                        <p className="text-xs text-blue-700 mb-0.5 flex items-center gap-1">
                                                            <Quote className="w-2.5 h-2.5" /> {t('sampleReview')}:
                                                        </p>
                                                        <p className="text-xs text-blue-800 italic line-clamp-2">
                                                            "{strength.sampleReviews[0]}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Weaknesses */}
                        {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (() => {
                            const totalWeaknessPages = Math.ceil(analysisResult.weaknesses.length / ITEMS_PER_PAGE);
                            const paginatedWeaknesses = analysisResult.weaknesses.slice(
                                (weaknessesPage - 1) * ITEMS_PER_PAGE,
                                weaknessesPage * ITEMS_PER_PAGE
                            );

                            return (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                            {t('weaknesses')} ({analysisResult.weaknesses.length})
                                        </h3>
                                        {totalWeaknessPages > 1 && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setWeaknessesPage(prev => Math.max(1, prev - 1))}
                                                    disabled={weaknessesPage === 1}
                                                    className="p-0.5 rounded hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronLeft className="w-4 h-4 text-red-600" />
                                                </button>
                                                <span className="text-xs text-gray-600 min-w-[40px] text-center">
                                                    {weaknessesPage}/{totalWeaknessPages}
                                                </span>
                                                <button
                                                    onClick={() => setWeaknessesPage(prev => Math.min(totalWeaknessPages, prev + 1))}
                                                    disabled={weaknessesPage === totalWeaknessPages}
                                                    className="p-0.5 rounded hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {paginatedWeaknesses.map((weakness, index) => (
                                            <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium text-red-900 text-sm">{weakness.category}</h4>
                                                    <span className={`text-sm font-bold flex items-center gap-0.5 ${getStarFillColor(weakness.score)}`}>
                                                        <Star className="w-3.5 h-3.5" />
                                                        {weakness.score}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-red-800 mb-1">{weakness.description}</p>
                                                <p className="text-xs text-red-600">{weakness.mentionCount} {t('mentions')}</p>
                                                {weakness.sampleReviews && weakness.sampleReviews.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-red-200">
                                                        <p className="text-xs text-red-700 mb-0.5 flex items-center gap-1">
                                                            <Quote className="w-2.5 h-2.5" /> {t('sampleReview')}:
                                                        </p>
                                                        <p className="text-xs text-red-800 italic line-clamp-2">
                                                            "{weakness.sampleReviews[0]}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Top Keywords */}
                    {analysisResult.topKeywords && analysisResult.topKeywords.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">{t('popularKeywords')}</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {analysisResult.topKeywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(keyword.sentiment)}`}
                                    >
                                        {keyword.keyword} ({keyword.count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trends */}
                    {analysisResult.trends && analysisResult.trends.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">{t('timeTrends')}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t('period')}</th>
                                            <th className="text-center py-2 px-3 font-semibold text-gray-700">{t('avgReview')}</th>
                                            <th className="text-center py-2 px-3 font-semibold text-gray-700">{t('quantity')}</th>
                                            <th className="text-center py-2 px-3 font-semibold text-gray-700">{t('sentiment')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analysisResult.trends.map((trend, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-2 px-3 font-medium text-gray-900">{trend.period}</td>
                                                <td className="py-2 px-3 text-center">
                                                    <span className={`flex items-center justify-center gap-0.5 ${getStarFillColor(trend.averageRating)}`}>
                                                        <Star className="w-3 h-3" />
                                                        {trend.averageRating.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-center text-gray-600">{trend.reviewCount}</td>
                                                <td className="py-2 px-3 text-center">
                                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${getSentimentColor(trend.sentiment)}`}>
                                                        {trend.sentiment}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}