'use client';

import { TrendingUp, TrendingDown, Lightbulb, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const sentimentOverview = [
    { name: 'Positive', value: 55, color: '#00B67A' },
    { name: 'Neutral', value: 30, color: '#9CA3AF' },
    { name: 'Negative', value: 15, color: '#EF4444' }
];

const topicsData = [
    {
        topic: 'Product Quality',
        positive: 85,
        neutral: 12,
        negative: 3,
        totalMentions: 340,
        keywords: ['excellent', 'quality', 'great', 'perfect'],
        trend: 'up',
        recommendation: 'This is a key strength! Highlight in marketing materials.'
    },
    {
        topic: 'Delivery Time',
        positive: 45,
        neutral: 30,
        negative: 25,
        totalMentions: 400,
        keywords: ['slow', 'late', 'delayed', 'waiting'],
        trend: 'down',
        recommendation: 'Critical issue: Improve logistics and communicate delivery times clearly.'
    },
    {
        topic: 'Customer Service',
        positive: 78,
        neutral: 15,
        negative: 7,
        totalMentions: 280,
        keywords: ['helpful', 'responsive', 'friendly', 'professional'],
        trend: 'up',
        recommendation: 'Good performance. Consider sharing customer service success stories.'
    },
    {
        topic: 'Pricing',
        positive: 52,
        neutral: 28,
        negative: 20,
        totalMentions: 220,
        keywords: ['expensive', 'value', 'worth', 'price'],
        trend: 'neutral',
        recommendation: 'Mixed feedback. Consider value-added services or loyalty programs.'
    },
    {
        topic: 'Packaging',
        positive: 70,
        neutral: 22,
        negative: 8,
        totalMentions: 180,
        keywords: ['secure', 'neat', 'careful', 'protected'],
        trend: 'up',
        recommendation: 'Strong point. Maintain current standards.'
    }
];

export default function SentimentAnalysisPage() {
    const [timeRange, setTimeRange] = useState('30');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Sentiment Analysis</h2>
                    <p className="text-gray-500 mt-1">AI-powered sentiment and topic analysis</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                </select>
            </div>

            {/* Sentiment Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Overall Sentiment Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart Simulation */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64">
                            {sentimentOverview.map((item, index) => {
                                const previousTotal = sentimentOverview.slice(0, index).reduce((sum, i) => sum + i.value, 0);
                                const rotation = (previousTotal / 100) * 360;
                                const itemRotation = (item.value / 100) * 360;
                                
                                return (
                                    <div
                                        key={index}
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: `conic-gradient(from ${rotation}deg, ${item.color} 0deg, ${item.color} ${itemRotation}deg, transparent ${itemRotation}deg)`,
                                            clipPath: 'circle(50%)'
                                        }}
                                    />
                                );
                            })}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center border-4 border-gray-100">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-900">100%</p>
                                        <p className="text-sm text-gray-600">1,234 reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                        {sentimentOverview.map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="text-2xl font-bold" style={{ color: item.color }}>
                                        {item.value}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="h-3 rounded-full transition-all"
                                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {Math.round((item.value / 100) * 1234)} reviews out of 1,234 total
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Topics Analysis */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Analysis by Topic</h3>
                {topicsData.map((topic, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="space-y-4">
                            {/* Topic Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-xl font-bold text-gray-900">{topic.topic}</h4>
                                    {topic.trend === 'up' ? (
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    ) : topic.trend === 'down' ? (
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    ) : null}
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                    {topic.totalMentions} mentions
                                </span>
                            </div>

                            {/* Sentiment Bars */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600 w-20">Positive</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="bg-green-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                                            style={{ width: `${topic.positive}%` }}
                                        >
                                            <span className="text-sm font-bold text-white">{topic.positive}%</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-24 text-right">
                                        {Math.round((topic.positive / 100) * topic.totalMentions)} reviews
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600 w-20">Neutral</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="bg-gray-500 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                                            style={{ width: `${topic.neutral}%` }}
                                        >
                                            <span className="text-sm font-bold text-white">{topic.neutral}%</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-24 text-right">
                                        {Math.round((topic.neutral / 100) * topic.totalMentions)} reviews
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600 w-20">Negative</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="bg-red-500 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                                            style={{ width: `${topic.negative}%` }}
                                        >
                                            <span className="text-sm font-bold text-white">{topic.negative}%</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-24 text-right">
                                        {Math.round((topic.negative / 100) * topic.totalMentions)} reviews
                                    </span>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Top Keywords:</span>
                                <div className="flex flex-wrap gap-2">
                                    {topic.keywords.map((keyword, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                            &quot;{keyword}&quot;
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendations */}
                            {topic.negative > 20 ? (
                                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-yellow-900">Attention Required</p>
                                        <p className="text-sm text-yellow-800">{topic.recommendation}</p>
                                    </div>
                                </div>
                            ) : topic.positive > 75 ? (
                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <Lightbulb className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-green-900">Strength Identified</p>
                                        <p className="text-sm text-green-800">{topic.recommendation}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-blue-900">Recommendation</p>
                                        <p className="text-sm text-blue-800">{topic.recommendation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}