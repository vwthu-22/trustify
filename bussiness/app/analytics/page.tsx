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
    ChevronUp
} from 'lucide-react';
import { useTranslations } from 'next-intl';

// Mock data - This will be replaced with actual API calls
const mockAnalysisResult = {
    summary: "Dựa trên phân tích 156 đánh giá gần đây, công ty của bạn đang hoạt động tốt với điểm đánh giá trung bình 4.2/5. Khách hàng đặc biệt hài lòng với chất lượng sản phẩm và dịch vụ khách hàng. Tuy nhiên, có một số điểm cần cải thiện liên quan đến thời gian giao hàng và quy trình đổi trả.",
    overallSentiment: {
        positive: 65,
        neutral: 22,
        negative: 13,
        totalReviews: 156,
        averageRating: 4.2
    },
    improvements: [
        {
            id: 1,
            priority: 'high',
            category: 'Giao hàng',
            issue: 'Thời gian giao hàng chậm',
            description: '23% khách hàng phàn nàn về việc giao hàng chậm so với thời gian cam kết, đặc biệt vào các dịp lễ.',
            suggestion: 'Cân nhắc mở rộng đội ngũ vận chuyển hoặc hợp tác với nhiều đơn vị giao hàng hơn. Cập nhật thời gian giao hàng dự kiến chính xác hơn cho khách hàng.',
            impactScore: 85,
            mentionCount: 36
        },
        {
            id: 2,
            priority: 'medium',
            category: 'Chính sách đổi trả',
            issue: 'Quy trình đổi trả phức tạp',
            description: '15% khách hàng gặp khó khăn khi đổi trả sản phẩm, cảm thấy quy trình rườm rà.',
            suggestion: 'Đơn giản hóa quy trình đổi trả, cho phép khách hàng tạo yêu cầu đổi trả online và in nhãn giao hàng tự động.',
            impactScore: 70,
            mentionCount: 23
        },
        {
            id: 3,
            priority: 'low',
            category: 'Giao tiếp',
            issue: 'Thiếu thông báo cập nhật đơn hàng',
            description: '8% khách hàng mong muốn nhận nhiều thông báo hơn về tình trạng đơn hàng.',
            suggestion: 'Tích hợp hệ thống thông báo tự động qua SMS/Zalo/Email cho các mốc quan trọng của đơn hàng.',
            impactScore: 45,
            mentionCount: 12
        }
    ],
    strengths: [
        {
            category: 'Chất lượng sản phẩm',
            description: 'Khách hàng đánh giá rất cao chất lượng sản phẩm, đặc biệt là độ bền và thiết kế.',
            mentionCount: 89,
            sentimentScore: 92
        },
        {
            category: 'Dịch vụ khách hàng',
            description: 'Đội ngũ hỗ trợ được khen ngợi về thái độ nhiệt tình và giải quyết vấn đề nhanh chóng.',
            mentionCount: 67,
            sentimentScore: 88
        },
        {
            category: 'Đóng gói',
            description: 'Sản phẩm được đóng gói cẩn thận, đảm bảo an toàn trong quá trình vận chuyển.',
            mentionCount: 45,
            sentimentScore: 85
        }
    ],
    keywords: {
        positive: ['chất lượng tốt', 'đẹp', 'nhanh nhẹn', 'nhiệt tình', 'đáng tiền', 'uy tín'],
        negative: ['chậm', 'đổi trả khó', 'đợi lâu', 'không liên lạc được'],
        trending: ['giao hàng', 'sản phẩm', 'dịch vụ', 'hỗ trợ', 'giá cả']
    },
    analyzedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days cache
};

export default function AIReviewAnalysisPage() {
    const t = useTranslations('analytics');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<typeof mockAnalysisResult | null>(null);
    const [expandedImprovement, setExpandedImprovement] = useState<number | null>(null);
    const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string | null>(null);

    // Simulate fetching cached analysis on mount
    useEffect(() => {
        // Check for cached analysis
        const cachedData = localStorage.getItem('ai_analysis_cache');
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                setAnalysisResult(parsed);
                setLastAnalyzedTime(parsed.analyzedAt);
            } catch {
                // Invalid cache
            }
        }
    }, []);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        // TODO: Replace with actual API call
        // API: POST /api/ai/analyze-reviews
        // Request body: { companyId: "...", timeRange: "30" }
        // Response: AIAnalysisResult

        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call

        setAnalysisResult(mockAnalysisResult);
        setLastAnalyzedTime(new Date().toISOString());
        localStorage.setItem('ai_analysis_cache', JSON.stringify(mockAnalysisResult));
        setIsAnalyzing(false);
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
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'Ưu tiên cao';
            case 'medium': return 'Ưu tiên trung bình';
            case 'low': return 'Ưu tiên thấp';
            default: return priority;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-7 h-7 text-purple-600" />
                        AI Review Analysis
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Phân tích đánh giá thông minh và đề xuất cải thiện từ AI
                    </p>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Đang phân tích...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Phân tích với AI
                        </>
                    )}
                </button>
            </div>

            {/* Analysis Status */}
            {lastAnalyzedTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-fit">
                    <Clock className="w-4 h-4" />
                    <span>Phân tích lần cuối: {formatDate(lastAnalyzedTime)}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                            <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">AI đang phân tích đánh giá...</p>
                            <p className="text-gray-500 mt-1">Quá trình này có thể mất vài giây</p>
                        </div>
                    </div>
                </div>
            )}

            {/* No Analysis Yet */}
            {!isAnalyzing && !analysisResult && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-12">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Bắt đầu phân tích AI</h3>
                            <p className="text-gray-600 mt-2 max-w-md">
                                Nhấn nút "Phân tích với AI" để AI đọc và phân tích tất cả đánh giá của khách hàng,
                                sau đó đưa ra những đề xuất cải thiện cụ thể cho doanh nghiệp của bạn.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Results */}
            {!isAnalyzing && analysisResult && (
                <div className="space-y-6">
                    {/* AI Summary */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Tóm tắt từ AI</h3>
                                <p className="text-white/90 leading-relaxed">{analysisResult.summary}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Overall Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Tổng quan
                            </h3>
                            <div className="space-y-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-4xl font-bold text-gray-900">
                                        {analysisResult.overallSentiment.averageRating}
                                        <span className="text-lg text-gray-500">/5</span>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Điểm đánh giá trung bình</p>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{analysisResult.overallSentiment.totalReviews} đánh giá được phân tích</span>
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Distribution */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bố cảm xúc</h3>
                            <div className="space-y-4">
                                {/* Positive */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="w-4 h-4 text-green-600" />
                                            <span className="font-medium text-gray-700">Tích cực</span>
                                        </div>
                                        <span className="font-bold text-green-600">{analysisResult.overallSentiment.positive}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-green-500 h-4 rounded-full transition-all"
                                            style={{ width: `${analysisResult.overallSentiment.positive}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Neutral */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Minus className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium text-gray-700">Trung lập</span>
                                        </div>
                                        <span className="font-bold text-gray-600">{analysisResult.overallSentiment.neutral}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-gray-400 h-4 rounded-full transition-all"
                                            style={{ width: `${analysisResult.overallSentiment.neutral}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Negative */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <ThumbsDown className="w-4 h-4 text-red-500" />
                                            <span className="font-medium text-gray-700">Tiêu cực</span>
                                        </div>
                                        <span className="font-bold text-red-600">{analysisResult.overallSentiment.negative}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-red-500 h-4 rounded-full transition-all"
                                            style={{ width: `${analysisResult.overallSentiment.negative}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Improvement Suggestions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            Đề xuất cải thiện từ AI
                        </h3>
                        <div className="space-y-4">
                            {analysisResult.improvements.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => setExpandedImprovement(
                                            expandedImprovement === item.id ? null : item.id
                                        )}
                                        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                                                {getPriorityLabel(item.priority)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{item.issue}</h4>
                                                <p className="text-sm text-gray-500">{item.category} • {item.mentionCount} lượt đề cập</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm text-gray-500">Impact Score</p>
                                                <p className="font-bold text-gray-900">{item.impactScore}%</p>
                                            </div>
                                            {expandedImprovement === item.id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    {expandedImprovement === item.id && (
                                        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <p className="text-sm text-green-800 flex items-start gap-2">
                                                    <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span>
                                                        <strong className="text-green-900">Đề xuất: </strong>
                                                        {item.suggestion}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strengths */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Điểm mạnh của doanh nghiệp
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {analysisResult.strengths.map((strength, index) => (
                                <div key={index} className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-green-900">{strength.category}</h4>
                                        <span className="text-lg font-bold text-green-600">{strength.sentimentScore}%</span>
                                    </div>
                                    <p className="text-sm text-green-800 mb-3">{strength.description}</p>
                                    <p className="text-xs text-green-600">{strength.mentionCount} lượt đề cập</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Keywords */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Positive Keywords */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4 text-green-600" />
                                Từ khóa tích cực
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.keywords.positive.map((keyword, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Negative Keywords */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ThumbsDown className="w-4 h-4 text-red-500" />
                                Từ khóa tiêu cực
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.keywords.negative.map((keyword, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Trending Keywords */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Từ khóa phổ biến
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.keywords.trending.map((keyword, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}