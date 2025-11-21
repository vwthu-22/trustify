'use client';

import { useState } from 'react';
import { Search, Star, MapPin, Package, MessageSquare, Eye, X, Sparkles } from 'lucide-react';

interface Review {
    id: string;
    author: string;
    rating: number;
    time: string;
    branch: string;
    service: string;
    text: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    topics: Array<{ name: string; sentiment: 'positive' | 'negative' }>;
    hasResponse: boolean;
}

const mockReviews: Review[] = [
    {
        id: '1',
        author: 'Nguyễn Văn A',
        rating: 5,
        time: '2 hours ago',
        branch: 'Hà Nội',
        service: 'Product X',
        text: 'Sản phẩm tuyệt vời! Chất lượng vượt mong đợi. Giao hàng nhanh chóng và đóng gói cẩn thận. Tôi rất hài lòng với dịch vụ.',
        sentiment: 'positive',
        topics: [
            { name: 'Product Quality', sentiment: 'positive' },
            { name: 'Delivery', sentiment: 'positive' }
        ],
        hasResponse: false
    },
    {
        id: '2',
        author: 'Trần Thị B',
        rating: 3,
        time: '5 hours ago',
        branch: 'TP.HCM',
        service: 'Service Y',
        text: 'Sản phẩm ổn nhưng giao hàng hơi chậm. Nhân viên hỗ trợ nhiệt tình.',
        sentiment: 'neutral',
        topics: [
            { name: 'Delivery', sentiment: 'negative' },
            { name: 'Customer Service', sentiment: 'positive' }
        ],
        hasResponse: false
    },
    {
        id: '3',
        author: 'Lê Văn C',
        rating: 5,
        time: '1 day ago',
        branch: 'Đà Nẵng',
        service: 'Product Z',
        text: 'Dịch vụ khách hàng xuất sắc! Giải quyết vấn đề rất nhanh.',
        sentiment: 'positive',
        topics: [
            { name: 'Customer Service', sentiment: 'positive' }
        ],
        hasResponse: true
    }
];

export default function ReviewsPage() {
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [filterBranch, setFilterBranch] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const generateAISuggestion = (review: Review) => {
        if (review.sentiment === 'positive') {
            return `Xin chào ${review.author},\n\nCảm ơn bạn đã dành thời gian chia sẻ trải nghiệm tích cực! Chúng tôi rất vui khi biết bạn hài lòng với ${review.service}. Đội ngũ của chúng tôi luôn nỗ lực để mang đến trải nghiệm tốt nhất.\n\nRất mong được phục vụ bạn trong tương lai!\n\nTrân trọng,\nĐội ngũ ${review.branch}`;
        } else {
            return `Xin chào ${review.author},\n\nCảm ơn bạn đã chia sẻ phản hồi. Chúng tôi xin lỗi vì những bất tiện bạn gặp phải. Chúng tôi đã ghi nhận và sẽ cải thiện dịch vụ.\n\nVui lòng liên hệ trực tiếp với chúng tôi để được hỗ trợ tốt hơn.\n\nTrân trọng,\nĐội ngũ ${review.branch}`;
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Rating Filter */}
                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All ratings</option>
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                    </select>

                    {/* Branch Filter */}
                    <select
                        value={filterBranch}
                        onChange={(e) => setFilterBranch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All branches</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP.HCM</option>
                        <option value="danang">Đà Nẵng</option>
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 bg-white px-6 pt-4 rounded-t-xl">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'all'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    All Reviews
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'pending'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Pending Response
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                        12
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('replied')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'replied'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Replied
                </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {mockReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${
                                                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-semibold text-gray-900">{review.author}</span>
                                        <span className="text-sm text-gray-500">• {review.time}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>Branch: {review.branch}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Package className="h-4 w-4" />
                                            <span>Service: {review.service}</span>
                                        </div>
                                    </div>
                                </div>
                                {review.hasResponse && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                        Replied
                                    </span>
                                )}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-700">{review.text}</p>

                            {/* Topics & Sentiment */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-gray-600">🏷️ Topics:</span>
                                {review.topics.map((topic, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            topic.sentiment === 'positive'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {topic.name} ({topic.sentiment === 'positive' ? '+' : '-'})
                                    </span>
                                ))}
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        review.sentiment === 'positive'
                                            ? 'bg-green-100 text-green-700'
                                            : review.sentiment === 'neutral'
                                            ? 'bg-gray-100 text-gray-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    {review.sentiment === 'positive' ? '😊' : review.sentiment === 'neutral' ? '😐' : '😞'}{' '}
                                    {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setSelectedReview(review)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    {review.hasResponse ? 'View Response' : 'Reply'}
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                    <Eye className="h-4 w-4" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">💬 Reply to Review</h2>
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Original Review */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Original Review:</p>
                                <p className="text-gray-900">{selectedReview.text}</p>
                            </div>

                            {/* AI Suggestion */}
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-5 w-5 text-green-600" />
                                    <p className="text-sm font-medium text-green-700">💡 AI Suggested Reply:</p>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                                    {generateAISuggestion(selectedReview)}
                                </p>
                                <button
                                    onClick={() => setReplyText(generateAISuggestion(selectedReview))}
                                    className="px-3 py-1.5 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    📋 Use this suggestion
                                </button>
                            </div>

                            {/* Reply Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    ✍️ Your Response:
                                </label>
                                <textarea
                                    placeholder="Write your response here..."
                                    rows={6}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    ✅ Send Response
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}