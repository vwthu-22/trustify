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
        clearError
    } = useAIAnalysisStore();

    const [expandedImprovement, setExpandedImprovement] = useState<number | null>(null);
    const [expandedStrength, setExpandedStrength] = useState<number | null>(null);
    const [expandedWeakness, setExpandedWeakness] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState('30');
    const [maxReviews, setMaxReviews] = useState(50);

    // Pagination states
    const [strengthsPage, setStrengthsPage] = useState(1);
    const [weaknessesPage, setWeaknessesPage] = useState(1);

    // Reset pagination when analysis result changes
    useEffect(() => {
        setStrengthsPage(1);
        setWeaknessesPage(1);
    }, [analysisResult]);

    const handleAnalyze = async (forceRefresh: boolean = false) => {
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-7 h-7 text-purple-600" />
                        {t('aiTitle')}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {t('aiSubtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Range Selector */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="10">{t('reviewsCount', { count: 10 })}</option>
                        <option value="25">{t('reviewsCount', { count: 25 })}</option>
                        <option value="50">{t('reviewsCount', { count: 50 })}</option>
                        <option value="100">{t('reviewsCount', { count: 100 })}</option>
                    </select>

                    <button
                        onClick={() => handleAnalyze(false)}
                        disabled={isLoading || !company?.id}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                {t('analyzing')}
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                {t('analyzeWithAI')}
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
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">{t('aiSummary')}</h3>
                                <p className="text-white/90 leading-relaxed">{analysisResult.aiSummary}</p>
                            </div>
                        </div>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-4xl font-bold text-purple-600">{analysisResult.overallScore}</p>
                            <p className="text-sm text-gray-600 mt-1">{t('overallScore')}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-4xl font-bold text-blue-600">{analysisResult.reviewsAnalyzed}</p>
                            <p className="text-sm text-gray-600 mt-1">{t('reviewsAnalyzed')}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-4xl font-bold text-green-600">{analysisResult.strengths?.length || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">{t('strengths')}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <p className="text-4xl font-bold text-orange-600">{analysisResult.suggestions?.length || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">{t('suggestions')}</p>
                        </div>
                    </div>

                    {/* Sentiment Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('sentimentDistribution')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Positive */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="w-4 h-4 text-[#5aa5df]" />
                                            <span className="font-medium text-gray-700">{t('positive')}</span>
                                        </div>
                                        <span className="font-bold text-[#5aa5df]">
                                            {analysisResult.sentimentSummary?.positivePercent || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-[#5aa5df] h-4 rounded-full transition-all"
                                            style={{ width: `${analysisResult.sentimentSummary?.positivePercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Neutral */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Minus className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium text-gray-700">{t('neutral')}</span>
                                        </div>
                                        <span className="font-bold text-gray-600">
                                            {analysisResult.sentimentSummary?.neutralPercent || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-gray-400 h-4 rounded-full transition-all"
                                            style={{ width: `${analysisResult.sentimentSummary?.neutralPercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Negative */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <ThumbsDown className="w-4 h-4 text-red-500" />
                                            <span className="font-medium text-gray-700">{t('negative')}</span>
                                        </div>
                                        <span className="font-bold text-red-600">
                                            {analysisResult.sentimentSummary?.negativePercent || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-red-500 h-4 rounded-full transition-all"
                                            style={{ width: `${analysisResult.sentimentSummary?.negativePercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-center p-6 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-2">{t('overallSentiment')}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {analysisResult.sentimentSummary?.overallSentiment || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-orange-500" />
                                {t('suggestionsFromAI')} ({analysisResult.suggestions.length})
                            </h3>
                            <div className="space-y-4">
                                {analysisResult.suggestions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() => setExpandedImprovement(
                                                expandedImprovement === index ? null : index
                                            )}
                                            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                                                    {getPriorityLabel(item.priority)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                    <p className="text-sm text-gray-500">{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {item.expectedImpact && (
                                                    <span className="text-xs text-gray-500 hidden sm:block">
                                                        {t('impact')}: {item.expectedImpact}
                                                    </span>
                                                )}
                                                {expandedImprovement === index ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </button>

                                        {expandedImprovement === index && (
                                            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
                                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                    <p className="text-sm text-green-800 flex items-start gap-2">
                                                        <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Strengths */}
                        {analysisResult.strengths && analysisResult.strengths.length > 0 && (() => {
                            const totalStrengthPages = Math.ceil(analysisResult.strengths.length / ITEMS_PER_PAGE);
                            const paginatedStrengths = analysisResult.strengths.slice(
                                (strengthsPage - 1) * ITEMS_PER_PAGE,
                                strengthsPage * ITEMS_PER_PAGE
                            );

                            return (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-[#5aa5df]" />
                                            {t('strengths')} ({analysisResult.strengths.length})
                                        </h3>
                                        {totalStrengthPages > 1 && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setStrengthsPage(prev => Math.max(1, prev - 1))}
                                                    disabled={strengthsPage === 1}
                                                    className="p-1 rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-[#5aa5df]" />
                                                </button>
                                                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                                                    {strengthsPage} / {totalStrengthPages}
                                                </span>
                                                <button
                                                    onClick={() => setStrengthsPage(prev => Math.min(totalStrengthPages, prev + 1))}
                                                    disabled={strengthsPage === totalStrengthPages}
                                                    className="p-1 rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-[#5aa5df]" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {paginatedStrengths.map((strength, index) => (
                                            <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-blue-900">{strength.category}</h4>
                                                    <span className={`text-lg font-bold flex items-center gap-1 ${getStarFillColor(strength.score)}`}>
                                                        <Star className="w-4 h-4" />
                                                        {strength.score}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-800 mb-2">{strength.description}</p>
                                                <p className="text-xs text-[#5aa5df]">{strength.mentionCount} {t('mentions')}</p>
                                                {strength.sampleReviews && strength.sampleReviews.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                                        <p className="text-xs text-blue-700 mb-1 flex items-center gap-1">
                                                            <Quote className="w-3 h-3" /> {t('sampleReview')}:
                                                        </p>
                                                        <p className="text-xs text-blue-800 italic">
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
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                            {t('weaknesses')} ({analysisResult.weaknesses.length})
                                        </h3>
                                        {totalWeaknessPages > 1 && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setWeaknessesPage(prev => Math.max(1, prev - 1))}
                                                    disabled={weaknessesPage === 1}
                                                    className="p-1 rounded-lg hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-red-600" />
                                                </button>
                                                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                                                    {weaknessesPage} / {totalWeaknessPages}
                                                </span>
                                                <button
                                                    onClick={() => setWeaknessesPage(prev => Math.min(totalWeaknessPages, prev + 1))}
                                                    disabled={weaknessesPage === totalWeaknessPages}
                                                    className="p-1 rounded-lg hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {paginatedWeaknesses.map((weakness, index) => (
                                            <div key={index} className="p-4 bg-red-50 rounded-xl border border-red-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-red-900">{weakness.category}</h4>
                                                    <span className={`text-lg font-bold flex items-center gap-1 ${getStarFillColor(weakness.score)}`}>
                                                        <Star className="w-4 h-4" />
                                                        {weakness.score}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-red-800 mb-2">{weakness.description}</p>
                                                <p className="text-xs text-red-600">{weakness.mentionCount} {t('mentions')}</p>
                                                {weakness.sampleReviews && weakness.sampleReviews.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-red-200">
                                                        <p className="text-xs text-red-700 mb-1 flex items-center gap-1">
                                                            <Quote className="w-3 h-3" /> {t('sampleReview')}:
                                                        </p>
                                                        <p className="text-xs text-red-800 italic">
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('popularKeywords')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.topKeywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${getSentimentColor(keyword.sentiment)}`}
                                    >
                                        {keyword.keyword} ({keyword.count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trends */}
                    {analysisResult.trends && analysisResult.trends.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('timeTrends')}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('period')}</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700">{t('avgReview')}</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700">{t('quantity')}</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700">{t('sentiment')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analysisResult.trends.map((trend, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium text-gray-900">{trend.period}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`flex items-center justify-center gap-1 ${getStarFillColor(trend.averageRating)}`}>
                                                        <Star className="w-4 h-4" />
                                                        {trend.averageRating.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center text-gray-600">{trend.reviewCount}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(trend.sentiment)}`}>
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