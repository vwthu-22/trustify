'use client'

import { Search, Filter, Download, MoreHorizontal, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function CompaniesPage() {
    const companies = [
        { id: 1, name: 'Tech Solutions Ltd.', industry: 'Technology', status: 'Verified', plan: 'Pro', joined: '2023-08-12' },
        { id: 2, name: 'Green Earth Organics', industry: 'Retail', status: 'Unverified', plan: 'Free', joined: '2023-11-20' },
        { id: 3, name: 'Global Logistics Inc.', industry: 'Logistics', status: 'Verified', plan: 'Enterprise', joined: '2023-05-15' },
        { id: 4, name: 'Sunrise Cafe', industry: 'Food & Beverage', status: 'Pending', plan: 'Free', joined: '2023-12-01' },
        { id: 5, name: 'Elite Fitness', industry: 'Health & Wellness', status: 'Verified', plan: 'Pro', joined: '2023-09-10' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add Company
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Company Name</th>
                            <th className="px-6 py-3">Industry</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Joined Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{company.name}</td>
                                <td className="px-6 py-4 text-gray-600">{company.industry}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${company.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                            company.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                        {company.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                                        {company.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                                        {company.status === 'Unverified' && <XCircle className="w-3 h-3" />}
                                        {company.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${company.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                                            company.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                        {company.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{company.joined}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1 to 5 of 45 companies</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
