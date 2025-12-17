'use client'

import { useEffect, useState } from 'react'
import { Check, Plus, X, Edit2, Trash2, Loader2, DollarSign, Calendar, ToggleLeft, ToggleRight, Download, CreditCard, LayoutGrid, List } from 'lucide-react'
import usePlanFeatureStore, { Plan, Feature, CreatePlanData, CreateFeatureData } from '@/store/usePlanFeatureStore'

// Mock transactions data - replace with API when available
const mockTransactions = [
    { id: 'TRX-001', company: 'Tech Solutions Ltd.', plan: 'Pro Plan', amount: 49.00, date: '2024-01-25', status: 'Paid' },
    { id: 'TRX-002', company: 'Global Logistics', plan: 'Enterprise', amount: 199.00, date: '2024-01-24', status: 'Paid' },
    { id: 'TRX-003', company: 'Elite Fitness', plan: 'Pro Plan', amount: 49.00, date: '2024-01-23', status: 'Failed' },
    { id: 'TRX-004', company: 'Sunrise Cafe', plan: 'Pro Plan', amount: 49.00, date: '2024-01-22', status: 'Paid' },
    { id: 'TRX-005', company: 'Digital Agency', plan: 'Enterprise', amount: 199.00, date: '2024-01-21', status: 'Pending' },
]

export default function BillingPage() {
    const {
        plans,
        features,
        isLoading,
        error,
        fetchPlans,
        fetchFeatures,
        createPlan,
        updatePlan,
        deletePlan,
        createFeature,
        updateFeature,
        deleteFeature,
        clearError,
    } = usePlanFeatureStore()

    const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'features'>('overview')
    const [showPlanModal, setShowPlanModal] = useState(false)
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

    // Form state for Plan
    const [formData, setFormData] = useState<CreatePlanData>({
        name: '',
        description: '',
        price: 0,
        durationDays: 30,
        active: true,
    })

    // Feature modal states
    const [showFeatureModal, setShowFeatureModal] = useState(false)
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
    const [deleteFeatureConfirmId, setDeleteFeatureConfirmId] = useState<number | null>(null)

    // Form state for Feature
    const [featureFormData, setFeatureFormData] = useState<CreateFeatureData>({
        name: '',
        description: '',
    })
    const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([])

    // Fetch data on mount
    useEffect(() => {
        fetchPlans()
        fetchFeatures()
    }, [fetchPlans, fetchFeatures])

    // Reset plan form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            durationDays: 30,
            active: true,
        })
        setEditingPlan(null)
    }

    // Reset feature form
    const resetFeatureForm = () => {
        setFeatureFormData({
            name: '',
            description: '',
        })
        setSelectedPlanIds([])
        setEditingFeature(null)
    }

    // Open create modal
    const handleCreateClick = () => {
        resetForm()
        setShowPlanModal(true)
    }

    // Open edit modal
    const handleEditClick = (plan: Plan) => {
        setEditingPlan(plan)
        setFormData({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            durationDays: plan.durationDays,
            active: plan.active,
        })
        setShowPlanModal(true)
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let success: boolean
        if (editingPlan) {
            success = await updatePlan(editingPlan.id, formData)
        } else {
            success = await createPlan(formData)
        }

        if (success) {
            setShowPlanModal(false)
            resetForm()
        }
    }

    // Handle delete plan
    const handleDelete = async (id: number) => {
        const success = await deletePlan(id)
        if (success) {
            setDeleteConfirmId(null)
        }
    }

    // ==================== Feature Handlers ====================

    // Open create feature modal
    const handleCreateFeatureClick = () => {
        resetFeatureForm()
        setShowFeatureModal(true)
    }

    // Open edit feature modal
    const handleEditFeatureClick = (feature: Feature) => {
        setEditingFeature(feature)
        setFeatureFormData({
            name: feature.name,
            description: feature.description || '',
        })
        setShowFeatureModal(true)
    }

    // Handle feature form submit
    const handleFeatureSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Add selected plans to form data - send as array of IDs
        const dataToSubmit: CreateFeatureData = {
            name: featureFormData.name,
            description: featureFormData.description,
            plans: selectedPlanIds.length > 0 ? selectedPlanIds : undefined
        }

        let success: boolean
        if (editingFeature) {
            success = await updateFeature(editingFeature.id, dataToSubmit)
        } else {
            success = await createFeature(dataToSubmit)
        }

        if (success) {
            setShowFeatureModal(false)
            resetFeatureForm()
            // Refresh plans to show updated features
            fetchPlans()
        }
    }

    // Handle delete feature
    const handleDeleteFeature = async (id: number) => {
        const success = await deleteFeature(id)
        if (success) {
            setDeleteFeatureConfirmId(null)
        }
    }

    // Format price
    const formatPrice = (price: number) => {
        return price === 0 ? 'Free' : `$${price.toFixed(2)}`
    }

    // Calculate stats
    const totalRevenue = mockTransactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0)
    const activePlans = plans.filter(p => p.active).length
    const paidTransactions = mockTransactions.filter(t => t.status === 'Paid').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
                    <p className="text-gray-500 mt-1">Manage subscription plans, features and transactions</p>
                </div>
                {/* <button
                    onClick={handleCreateClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create New Plan
                </button> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Plans</p>
                            <p className="text-xl font-bold text-gray-900">{activePlans}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Paid Transactions</p>
                            <p className="text-xl font-bold text-gray-900">{paidTransactions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <List className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Features</p>
                            <p className="text-xl font-bold text-gray-900">{features.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex gap-6 px-6">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'plans', label: 'Plans' },
                            { id: 'features', label: 'Features' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={clearError} className="text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tab Content */}
                <div className="p-6">
                    {/* Overview Tab - Transactions + Plans Summary */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Transactions Table */}
                            <div className="lg:col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-600 font-medium">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Invoice ID</th>
                                                <th className="px-4 py-3">Company</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 rounded-r-lg text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {mockTransactions.map((trx) => (
                                                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{trx.id}</td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        <div>{trx.company}</div>
                                                        <div className="text-xs text-gray-400">{trx.plan}</div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-gray-900">${trx.amount.toFixed(2)}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                                                            ${trx.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                                trx.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'}`}>
                                                            {trx.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-500">{trx.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Plans Summary */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-900">Plans</h2>
                                {isLoading && plans.length === 0 ? (
                                    <div className="animate-pulse space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                                        ))}
                                    </div>
                                ) : plans.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No plans yet</p>
                                        <button
                                            onClick={handleCreateClick}
                                            className="mt-2 text-sm text-blue-600 hover:underline"
                                        >
                                            Create first plan
                                        </button>
                                    </div>
                                ) : (
                                    plans.slice(0, 3).map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`border rounded-lg p-4 ${plan.active ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                                                    {plan.description && (
                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{plan.description}</p>
                                                    )}
                                                    <p className="text-lg font-bold text-gray-900 mt-2">
                                                        {formatPrice(plan.price)}
                                                        {plan.price > 0 && <span className="text-sm font-normal text-gray-500">/{plan.durationDays}d</span>}
                                                    </p>
                                                </div>
                                                {!plan.active && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>

                                            {/* Features */}
                                            {plan.features && plan.features.length > 0 && (
                                                <div className="mt-3 mb-3 space-y-1">
                                                    {plan.features.slice(0, 3).map((feature) => (
                                                        <div key={feature.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                                                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                                                            <span className="line-clamp-1">{feature.name}</span>
                                                        </div>
                                                    ))}
                                                    {plan.features.length > 3 && (
                                                        <p className="text-xs text-blue-600 pl-4">
                                                            +{plan.features.length - 3} more
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleEditClick(plan)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Edit Plan
                                            </button>
                                        </div>
                                    ))
                                )}
                                {plans.length > 3 && (
                                    <button
                                        onClick={() => setActiveTab('plans')}
                                        className="w-full py-2 text-sm text-blue-600 hover:underline"
                                    >
                                        View all {plans.length} plans →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Plans Tab - Full Grid */}
                    {activeTab === 'plans' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading && plans.length === 0 ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))
                            ) : plans.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No plans yet</h3>
                                    <p className="text-gray-500 mb-4">Create your first subscription plan</p>
                                    <button
                                        onClick={handleCreateClick}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Plan
                                    </button>
                                </div>
                            ) : (
                                plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`border rounded-xl p-6 relative ${plan.active ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
                                            }`}
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            {!plan.active && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>

                                        {/* Plan Info */}
                                        <div className="mb-4">
                                            <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatPrice(plan.price)}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-sm text-gray-500 font-normal">
                                                    /{plan.durationDays} days
                                                </span>
                                            )}
                                        </div>

                                        {/* Features */}
                                        {plan.features && plan.features.length > 0 && (
                                            <ul className="space-y-2 mb-6">
                                                {plan.features.slice(0, 4).map((feature) => (
                                                    <li key={feature.id} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        {feature.name}
                                                    </li>
                                                ))}
                                                {plan.features.length > 4 && (
                                                    <li className="text-sm text-blue-600">
                                                        +{plan.features.length - 4} more
                                                    </li>
                                                )}
                                            </ul>
                                        )}

                                        {/* Duration */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                            <Calendar className="w-4 h-4" />
                                            {plan.durationDays} days duration
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(plan)}
                                                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(plan.id)}
                                                className="px-3 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">All Features ({features.length})</h2>
                                <button
                                    onClick={handleCreateFeatureClick}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Feature
                                </button>
                            </div>
                            {features.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <List className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No features yet</h3>
                                    <p className="text-gray-500 mb-4">Create your first feature</p>
                                    <button
                                        onClick={handleCreateFeatureClick}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Feature
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {features.map((feature) => (
                                        <div
                                            key={feature.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900">{feature.name}</h3>
                                                    {feature.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{feature.description}</p>
                                                    )}
                                                    {feature.createdAt && (
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            Created: {new Date(feature.createdAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 ml-2">
                                                    <button
                                                        onClick={() => handleEditFeatureClick(feature)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteFeatureConfirmId(feature.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Plan Modal */}
            {showPlanModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowPlanModal(false)
                                    resetForm()
                                }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Plan Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Pro Plan"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the plan benefits..."
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                                />
                            </div>

                            {/* Price & Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price ($)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={formData.price}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                // Allow only numbers and decimal point
                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                    setFormData({ ...formData, price: value === '' ? 0 : parseFloat(value) || 0 })
                                                }
                                            }}
                                            placeholder="0.00"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (days)
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.durationDays}
                                            onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 30 })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Active Plan</p>
                                    <p className="text-sm text-gray-500">Show this plan to customers</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className={`p-1 rounded-full transition ${formData.active ? 'text-blue-600' : 'text-gray-400'}`}
                                >
                                    {formData.active ? (
                                        <ToggleRight className="w-8 h-8" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8" />
                                    )}
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPlanModal(false)
                                        resetForm()
                                    }}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {editingPlan ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editingPlan ? 'Update Plan' : 'Create Plan'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Plan Confirmation Modal */}
            {deleteConfirmId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Plan?</h3>
                        <p className="text-gray-500 text-center mb-6">
                            This action cannot be undone. All data associated with this plan will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
                                disabled={isLoading}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Feature Modal */}
            {showFeatureModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingFeature ? 'Edit Feature' : 'Create New Feature'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowFeatureModal(false)
                                    resetFeatureForm()
                                }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleFeatureSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feature Name *
                                </label>
                                <input
                                    type="text"
                                    value={featureFormData.name}
                                    onChange={(e) => setFeatureFormData({ ...featureFormData, name: e.target.value })}
                                    placeholder="e.g., Reply to Reviews"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">Feature name must be unique</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={featureFormData.description || ''}
                                    onChange={(e) => setFeatureFormData({ ...featureFormData, description: e.target.value })}
                                    placeholder="Describe what this feature does..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                                />
                            </div>

                            {/* Assign to Plans */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assign to Plans (Optional)
                                </label>
                                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                    {plans.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-2">No plans available</p>
                                    ) : (
                                        plans.map((plan) => (
                                            <label
                                                key={plan.id}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlanIds.includes(plan.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedPlanIds([...selectedPlanIds, plan.id])
                                                        } else {
                                                            setSelectedPlanIds(selectedPlanIds.filter(id => id !== plan.id))
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                                                    <p className="text-xs text-gray-500">{formatPrice(plan.price)}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Select which plans should include this feature
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFeatureModal(false)
                                        resetFeatureForm()
                                    }}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {editingFeature ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editingFeature ? 'Update Feature' : 'Create Feature'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Feature Confirmation Modal */}
            {deleteFeatureConfirmId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Feature?</h3>
                        <p className="text-gray-500 text-center mb-6">
                            This action cannot be undone. This feature will be removed from all plans.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteFeatureConfirmId(null)}
                                className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteFeatureConfirmId !== null && handleDeleteFeature(deleteFeatureConfirmId)}
                                disabled={isLoading}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

