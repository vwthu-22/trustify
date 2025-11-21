'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Star, MessageSquare, Users } from 'lucide-react';

const branchesData = [
    {
        id: 1,
        name: 'Hà Nội',
        rating: 4.8,
        reviews: 450,
        responseRate: 98,
        avgResponseTime: '1.8h',
        growth: 12,
        trend: 'up',
        topIssues: ['Parking'],
        topStrengths: ['Product Quality', 'Service']
    },
    {
        id: 2,
        name: 'TP.HCM',
        rating: 4.6,
        reviews: 680,
        responseRate: 95,
        avgResponseTime: '2.1h',
        growth: 8,
        trend: 'up',
        topIssues: ['Wait Time'],
        topStrengths: ['Location', 'Staff']
    },
    {
        id: 3,
        name: 'Đà Nẵng',
        rating: 4.5,
        reviews: 290,
        responseRate: 92,
        avgResponseTime: '2.5h',
        growth: 0,
        trend: 'neutral',
        topIssues: ['Limited Stock'],
        topStrengths: ['Cleanliness']
    },
    {
        id: 4,
        name: 'Cần Thơ',
        rating: 4.2,
        reviews: 180,
        responseRate: 85,
        avgResponseTime: '4.5h',
        growth: -5,
        trend: 'down',
        topIssues: ['Customer Service', 'Delivery'],
        topStrengths: ['Price']
    }
];

const performanceMetrics = [
    { month: 'Jan', hanoi: 4.5, hcm: 4.4, danang: 4.3, cantho: 4.0 },
    { month: 'Feb', hanoi: 4.6, hcm: 4.5, danang: 4.4, cantho: 4.1 },
    { month: 'Mar', hanoi: 4.7, hcm: 4.5, danang: 4.4, cantho: 4.2 },
    { month: 'Apr', hanoi: 4.7, hcm: 4.6, danang: 4.5, cantho: 4.2 },
    { month: 'May', hanoi: 4.8, hcm: 4.6, danang: 4.5, cantho: 4.2 },
    { month: 'Jun', hanoi: 4.8, hcm: 4.6, danang: 4.5, cantho: 4.2 }
];

export default function BranchComparisonPage() {
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    const sortedBranches = [...branchesData].sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviews - a.reviews;
        if (sortBy === 'growth') return b.growth - a.growth;
        return 0;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Branch Performance Comparison</h2>
                    <p className="text-gray-500 mt-1">Compare performance across all branches</p>
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="rating">Sort by Rating</option>
                    <option value="reviews">Sort by Reviews</option>
                    <option value="growth">Sort by Growth</option>
                </select>
            </div>

            {/* Ranking Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Branch Rankings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Reviews</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Response Rate</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Response</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedBranches.map((branch, index) => (
                                <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-2xl">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <span className="font-semibold text-gray-900">{branch.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold text-gray-900">{branch.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-medium text-gray-900">{branch.reviews}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            branch.responseRate >= 95 ? 'bg-green-100 text-green-700' :
                                            branch.responseRate >= 90 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {branch.responseRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-medium text-gray-900">{branch.avgResponseTime}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {branch.trend === 'up' ? (
                                                <>
                                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                                    <span className="font-semibold text-green-600">+{branch.growth}%</span>
                                                </>
                                            ) : branch.trend === 'down' ? (
                                                <>
                                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                                    <span className="font-semibold text-red-600">{branch.growth}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Minus className="h-5 w-5 text-gray-600" />
                                                    <span className="font-semibold text-gray-600">0%</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">6-Month Performance Trend</h3>
                <div className="space-y-4">
                    <div className="h-64 flex items-end gap-4">
                        {performanceMetrics.map((data, index) => (
                            <div key={index} className="flex-1 space-y-2">
                                <div className="relative h-48 bg-gray-100 rounded-t">
                                    <div
                                        className="absolute bottom-0 w-full bg-blue-500 rounded-t opacity-80"
                                        style={{ height: `${(data.hanoi / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-center text-gray-600">{data.month}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Hà Nội</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">TP.HCM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Đà Nẵng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Cần Thơ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch for Detailed Analysis:</label>
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Branches</option>
                        {branchesData.map(branch => (
                            <option key={branch.id} value={branch.name}>{branch.name}</option>
                        ))}
                    </select>
                </div>

                {selectedBranch !== 'all' && (
                    <div className="space-y-6">
                        {branchesData.filter(b => b.name === selectedBranch).map(branch => (
                            <div key={branch.id}>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">{branch.name} Branch Analysis</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Issues */}
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <h5 className="font-semibold text-red-900 mb-3">Areas Need Attention</h5>
                                        <ul className="space-y-2">
                                            {branch.topIssues.map((issue, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-red-800">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    {issue}
                                                </li>
                                            ))}
                                            {branch.responseRate < 90 && (
                                                <li className="flex items-center gap-2 text-sm text-red-800">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    Low response rate ({branch.responseRate}%)
                                                </li>
                                            )}
                                            {parseFloat(branch.avgResponseTime) > 3 && (
                                                <li className="flex items-center gap-2 text-sm text-red-800">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    Slow response time ({branch.avgResponseTime})
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Strengths */}
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <h5 className="font-semibold text-green-900 mb-3">Key Strengths</h5>
                                        <ul className="space-y-2">
                                            {branch.topStrengths.map((strength, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-green-800">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    {strength}
                                                </li>
                                            ))}
                                            {branch.rating >= 4.5 && (
                                                <li className="flex items-center gap-2 text-sm text-green-800">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    High customer satisfaction ({branch.rating})
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h5 className="font-semibold text-blue-900 mb-3">Recommendations</h5>
                                    <ul className="space-y-2 text-sm text-blue-800">
                                        {branch.responseRate < 90 && (
                                            <li>• Increase staffing for customer support to improve response rate</li>
                                        )}
                                        {parseFloat(branch.avgResponseTime) > 3 && (
                                            <li>• Implement automated responses for common queries to reduce response time</li>
                                        )}
                                        {branch.growth < 0 && (
                                            <li>• Launch customer retention campaign to improve satisfaction scores</li>
                                        )}
                                        <li>• Share best practices from top-performing branches</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}