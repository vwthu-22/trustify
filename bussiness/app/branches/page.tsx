'use client';

import { useState } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin, Star, Phone, Mail, Users } from 'lucide-react';

interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    manager: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
}

const initialBranches: Branch[] = [
    {
        id: '1',
        name: 'Hà Nội Branch',
        address: '123 Hoàng Quốc Việt, Cầu Giấy',
        city: 'Hà Nội',
        phone: '024-1234-5678',
        email: 'hanoi@company.com',
        manager: 'Nguyễn Văn A',
        rating: 4.8,
        reviewCount: 450,
        isActive: true
    },
    {
        id: '2',
        name: 'TP.HCM Branch',
        address: '456 Nguyễn Huệ, Quận 1',
        city: 'TP.HCM',
        phone: '028-9876-5432',
        email: 'hcm@company.com',
        manager: 'Trần Thị B',
        rating: 4.6,
        reviewCount: 680,
        isActive: true
    },
    {
        id: '3',
        name: 'Đà Nẵng Branch',
        address: '789 Trần Phú, Hải Châu',
        city: 'Đà Nẵng',
        phone: '0236-555-6789',
        email: 'danang@company.com',
        manager: 'Lê Văn C',
        rating: 4.5,
        reviewCount: 290,
        isActive: true
    },
    {
        id: '4',
        name: 'Cần Thơ Branch',
        address: '321 Mậu Thân, Ninh Kiều',
        city: 'Cần Thơ',
        phone: '0292-333-4444',
        email: 'cantho@company.com',
        manager: 'Phạm Thị D',
        rating: 4.3,
        reviewCount: 156,
        isActive: false
    }
];

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>(initialBranches);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this branch?')) {
            setBranches(branches.filter(b => b.id !== id));
        }
    };

    const toggleStatus = (id: string) => {
        setBranches(branches.map(b =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
        ));
    };

    const activeBranches = branches.filter(b => b.isActive);
    const totalReviews = branches.reduce((sum, b) => sum + b.reviewCount, 0);
    const avgRating = branches.reduce((sum, b) => sum + b.rating, 0) / branches.length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Branches</h2>
                    <p className="text-gray-500 mt-1">Manage your business locations and track performance</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Branch
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Branches</p>
                            <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Building2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Branches</p>
                            <p className="text-2xl font-bold text-gray-900">{activeBranches.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Star className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branches List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {branches.map((branch) => (
                    <div
                        key={branch.id}
                        className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${branch.isActive
                                ? 'border-gray-200 hover:shadow-lg'
                                : 'border-gray-200 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className={`p-3 rounded-lg ${branch.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Building2 className={`h-6 w-6 ${branch.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold text-gray-900">{branch.rating}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">({branch.reviewCount} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${branch.isActive
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {branch.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                <span>{branch.address}, {branch.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{branch.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{branch.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span>Manager: {branch.manager}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setSelectedBranch(branch)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => toggleStatus(branch.id)}
                                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${branch.isActive
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                            >
                                {branch.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleDelete(branch.id)}
                                className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Branch Performance Comparison</h3>
                <div className="space-y-4">
                    {branches
                        .sort((a, b) => b.rating - a.rating)
                        .map((branch, index) => (
                            <div key={branch.id} className="flex items-center gap-4">
                                <div className="text-2xl font-bold text-gray-400 w-8">
                                    #{index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">{branch.name}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold text-gray-900">{branch.rating}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">{branch.reviewCount} reviews</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${(branch.rating / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Add/Edit Modal would go here */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Branch</h3>
                        <p className="text-gray-600 mb-4">Form would go here...</p>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
