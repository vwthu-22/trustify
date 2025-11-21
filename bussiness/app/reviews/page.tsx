'use client'
import { useState } from 'react';
import { Star, MessageSquare, Clock, TrendingUp, AlertCircle, CheckCircle, Filter } from 'lucide-react';

export default function BusinessReviewDashboard() {
    const [currentPage, setCurrentPage] = useState('all-reviews');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Sample review data
    const reviews = [
        {
            id: 1,
            customer: 'Nguyễn Văn An',
            rating: 5,
            date: '2025-11-15',
            content: 'Sản phẩm rất tốt, giao hàng nhanh, nhân viên nhiệt tình. Tôi rất hài lòng với dịch vụ của công ty.',
            status: 'replied',
            reply: 'Cảm ơn anh đã tin tưởng và sử dụng dịch vụ của chúng tôi!',
            replyDate: '2025-11-16',
            sentiment: 'positive',
            topics: ['Chất lượng sản phẩm', 'Giao hàng', 'Dịch vụ khách hàng']
        },
        {
            id: 2,
            customer: 'Trần Thị Bình',
            rating: 2,
            date: '2025-11-14',
            content: 'Giao hàng quá chậm, đợi tận 2 tuần mới nhận được. Sản phẩm thì ổn nhưng dịch vụ giao hàng cần cải thiện.',
            status: 'pending',
            sentiment: 'negative',
            topics: ['Thời gian giao hàng', 'Chất lượng sản phẩm']
        },
        {
            id: 3,
            customer: 'Lê Minh Cường',
            rating: 4,
            date: '2025-11-13',
            content: 'Sản phẩm tốt, đúng mô tả. Giá cả hợp lý. Chỉ có điều đóng gói hơi sơ sài.',
            status: 'replied',
            reply: 'Cảm ơn anh đã phản hồi. Chúng tôi sẽ cải thiện khâu đóng gói trong thời gian tới.',
            replyDate: '2025-11-14',
            sentiment: 'positive',
            topics: ['Chất lượng sản phẩm', 'Giá cả', 'Đóng gói']
        },
        {
            id: 4,
            customer: 'Phạm Thu Hà',
            rating: 1,
            date: '2025-11-12',
            content: 'Sản phẩm không đúng như mô tả. Dịch vụ khách hàng không hỗ trợ. Rất thất vọng.',
            status: 'pending',
            sentiment: 'negative',
            topics: ['Chất lượng sản phẩm', 'Dịch vụ khách hàng']
        },
        {
            id: 5,
            customer: 'Hoàng Đức Tài',
            rating: 5,
            date: '2025-11-11',
            content: 'Tuyệt vời! Đây là lần thứ 3 tôi mua hàng và lần nào cũng hài lòng. Sẽ tiếp tục ủng hộ.',
            status: 'replied',
            reply: 'Cảm ơn anh rất nhiều! Chúng tôi rất vui khi được phục vụ anh.',
            replyDate: '2025-11-12',
            sentiment: 'positive',
            topics: ['Chất lượng sản phẩm', 'Dịch vụ khách hàng']
        }
    ];

    const filteredReviews = reviews.filter(review => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'pending') return review.status === 'pending';
        if (selectedFilter === 'replied') return review.status === 'replied';
        if (selectedFilter === 'positive') return review.sentiment === 'positive';
        if (selectedFilter === 'negative') return review.sentiment === 'negative';
        return true;
    });

    const stats = {
        totalReviews: reviews.length,
        avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        pendingReviews: reviews.filter(r => r.status === 'pending').length,
        repliedReviews: reviews.filter(r => r.status === 'replied').length
    };

    const sentimentData = {
        positive: reviews.filter(r => r.sentiment === 'positive').length,
        negative: reviews.filter(r => r.sentiment === 'negative').length
    };

    // Phân tích chủ đề
    const topicAnalysis: Record<string, { count: number; positive: number; negative: number }> = {};
    reviews.forEach(review => {
        review.topics.forEach(topic => {
            if (!topicAnalysis[topic]) {
                topicAnalysis[topic] = { count: 0, positive: 0, negative: 0 };
            }
            topicAnalysis[topic].count++;
            if (review.sentiment === 'positive') topicAnalysis[topic].positive++;
            if (review.sentiment === 'negative') topicAnalysis[topic].negative++;
        });
    });

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    const renderAllReviewsPage = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                            <div className="flex mt-1">{renderStars(Math.round(parseFloat(stats.avgRating)))}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Replied</p>
                            <p className="text-2xl font-bold text-green-600">{stats.repliedReviews}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Filter size={20} className="text-gray-600" />
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSelectedFilter('pending')}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setSelectedFilter('replied')}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === 'replied' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Replied
                    </button>
                    <button
                        onClick={() => setSelectedFilter('positive')}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === 'positive' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Positive
                    </button>
                    <button
                        onClick={() => setSelectedFilter('negative')}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === 'negative' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Negative
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredReviews.map(review => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{review.customer}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {review.status === 'pending' ? (
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                                        <Clock size={14} />
                                        Pending
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                                        <CheckCircle size={14} />
                                        Replied
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.content}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {review.topics.map((topic, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                    {topic}
                                </span>
                            ))}
                        </div>

                        {review.reply ? (
                            <div className="bg-gray-50 rounded-lg p-4 mt-4 border-l-4 border-blue-500">
                                <div className="flex items-start gap-3">
                                    <MessageSquare size={16} className="text-blue-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 mb-1">Phản hồi của bạn</p>
                                        <p className="text-sm text-gray-700">{review.reply}</p>
                                        <p className="text-xs text-gray-500 mt-2">{review.replyDate}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                Reply to review
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPendingPage = () => (
        <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-orange-600 mt-1 shrink-0" size={20} />
                <div>
                    <h3 className="font-semibold text-orange-900 mb-1">You have {stats.pendingReviews} reviews pending reply</h3>
                    <p className="text-sm text-orange-700">Replying quickly helps increase credibility and improve customer experience.</p>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.filter(r => r.status === 'pending').map(review => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{review.customer}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.content}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {review.topics.map((topic, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                    {topic}
                                </span>
                            ))}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Your reply</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Enter your reply..."
                            />
                            <div className="flex gap-2 mt-3">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                    Send reply
                                </button>
                                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAnalyticsPage = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    Sentiment Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Positive reviews</span>
                            <span className="font-bold text-green-600">{sentimentData.positive} ({((sentimentData.positive / reviews.length) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all"
                                style={{ width: `${(sentimentData.positive / reviews.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Negative reviews</span>
                            <span className="font-bold text-red-600">{sentimentData.negative} ({((sentimentData.negative / reviews.length) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-red-500 h-4 rounded-full transition-all"
                                style={{ width: `${(sentimentData.negative / reviews.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Topic Analysis</h2>
                <div className="space-y-4">
                    {Object.entries(topicAnalysis).map(([topic, data]: [string, { count: number; positive: number; negative: number }]) => (
                        <div key={topic} className="border-b border-gray-200 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">{topic}</h3>
                                <span className="text-sm text-gray-600">{data.count} mentions</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Positive</span>
                                        <span className="text-sm font-semibold text-green-600">{data.positive}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${(data.positive / data.count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Negative</span>
                                        <span className="text-sm font-semibold text-red-600">{data.negative}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${(data.negative / data.count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 rounded-md" >
            <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-6 rounded-md">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Review Management</h1>
                    <p className="text-blue-100">Customer review management and analysis system</p>
                </div>
            </div>

            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex gap-1 p-2">
                        <button
                            onClick={() => setCurrentPage('all-reviews')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${currentPage === 'all-reviews'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Star size={18} />
                            All Reviews
                        </button>
                        <button
                            onClick={() => setCurrentPage('pending')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${currentPage === 'pending'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Clock size={18} />
                            Pending
                            {stats.pendingReviews > 0 && (
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                    {stats.pendingReviews}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setCurrentPage('analytics')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${currentPage === 'analytics'
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <TrendingUp size={18} />
                            Analytics
                        </button>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {currentPage === 'all-reviews' && renderAllReviewsPage()}
                {currentPage === 'pending' && renderPendingPage()}
                {currentPage === 'analytics' && renderAnalyticsPage()}
            </div>
        </div>
    );
}