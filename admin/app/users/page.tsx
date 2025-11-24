'use client'

import { Search, Filter, MoreVertical, Trash2, Edit, Shield } from 'lucide-react'

export default function UsersPage() {
    const users = [
        { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@gmail.com', role: 'User', status: 'Active', joined: '2023-10-15' },
        { id: 2, name: 'Tran Thi B', email: 'tranthib@company.com', role: 'Business Owner', status: 'Active', joined: '2023-11-02' },
        { id: 3, name: 'Le Van C', email: 'levanc@admin.com', role: 'Admin', status: 'Active', joined: '2023-09-20' },
        { id: 4, name: 'Pham Thi D', email: 'phamthid@gmail.com', role: 'User', status: 'Inactive', joined: '2023-12-05' },
        { id: 5, name: 'Hoang Van E', email: 'hoangvane@tech.com', role: 'Business Owner', status: 'Suspended', joined: '2023-10-30' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <span>Add New User</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
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
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined Date</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'Business Owner' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                        {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1 to 5 of 128 users</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
