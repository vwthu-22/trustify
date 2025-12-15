'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Trash2, Edit, Shield, Plus, X, Loader2, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useUserManagementStore, { User, CreateAdminData } from '@/store/useUserManagementStore'

export default function UsersPage() {
    const t = useTranslations('users')
    const tCommon = useTranslations('common')

    const {
        users,
        totalUsers,
        currentPage,
        totalPages,
        pageSize,
        isLoading,
        error,
        searchQuery,
        fetchUsers,
        createAdmin,
        updateUserStatus,
        deleteUser,
        setSearchQuery,
        clearError,
    } = useUserManagementStore()

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // Create admin form
    const [createForm, setCreateForm] = useState<CreateAdminData>({
        email: '',
        password: '',
        fullName: '',
    })

    // Status filter
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)

    // Fetch users on mount and when page changes
    useEffect(() => {
        fetchUsers(currentPage, pageSize)
    }, [fetchUsers, currentPage, pageSize])

    // Search handler with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(0, pageSize)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, fetchUsers, pageSize])

    // Filter users by status
    const filteredUsers = statusFilter === 'all'
        ? users
        : users.filter(user => user.status === statusFilter)

    // Handle create admin
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await createAdmin(createForm)
        if (success) {
            setShowCreateModal(false)
            setCreateForm({ email: '', password: '', fullName: '' })
        }
    }

    // Handle edit status
    const handleEditStatus = async (newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
        if (!selectedUser) return
        const success = await updateUserStatus(selectedUser.id, newStatus)
        if (success) {
            setShowEditModal(false)
            setSelectedUser(null)
        }
    }

    // Handle delete
    const handleDelete = async () => {
        if (!selectedUser) return
        const success = await deleteUser(selectedUser.id)
        if (success) {
            setShowDeleteModal(false)
            setSelectedUser(null)
        }
    }

    // Pagination
    const handlePrevPage = () => {
        if (currentPage > 0) {
            fetchUsers(currentPage - 1, pageSize)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchUsers(currentPage + 1, pageSize)
        }
    }

    const startItem = currentPage * pageSize + 1
    const endItem = Math.min((currentPage + 1) * pageSize, totalUsers)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>{t('addNewAdmin')}</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search & Filter */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-600"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{tCommon('filter')}: {statusFilter === 'all' ? tCommon('all') : statusFilter}</span>
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                {['all', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status)
                                            setShowFilterDropdown(false)
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === status ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        {status === 'all' ? tCommon('all') :
                                            status === 'ACTIVE' ? tCommon('active') :
                                                status === 'INACTIVE' ? tCommon('inactive') : tCommon('suspended')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">{t('avatar')}</th>
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('email')}</th>
                                <th className="px-6 py-3">{t('country')}</th>
                                <th className="px-6 py-3">{t('role')}</th>
                                <th className="px-6 py-3">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading && users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                                        <span className="text-gray-500">{tCommon('loading')}</span>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {t('noUsers')}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={user.avatarUrl || '/default-avatar.png'}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.country}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'BUSINESS' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    user.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {user.status === 'ACTIVE' ? tCommon('active') :
                                                    user.status === 'INACTIVE' ? tCommon('inactive') : tCommon('suspended')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>
                        {t('showing')} {startItem} {t('to')} {endItem} {t('of')} {totalUsers}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0 || isLoading}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {tCommon('previous')}
                        </button>
                        <span className="px-3 py-1 text-gray-700">
                            {currentPage + 1} / {totalPages || 1}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1 || isLoading}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            {tCommon('next')}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Admin Modal */}
            {
                showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('createAdmin.title')}</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAdmin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('createAdmin.fullName')} *
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.fullName}
                                        onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                                        placeholder={t('createAdmin.fullNamePlaceholder')}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('createAdmin.email')} *
                                    </label>
                                    <input
                                        type="email"
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                        placeholder={t('createAdmin.emailPlaceholder')}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('createAdmin.password')} *
                                    </label>
                                    <input
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        {tCommon('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                {t('createAdmin.submit')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Edit Status Modal */}
            {
                showEditModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('editStatus.title')}</h2>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false)
                                        setSelectedUser(null)
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">{selectedUser.name}</span>
                                </p>
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                            </div>

                            <div className="space-y-2 mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">{t('editStatus.selectStatus')}</p>
                                {(['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleEditStatus(status)}
                                        disabled={isLoading || selectedUser.status === status}
                                        className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2
                                        ${selectedUser.status === status
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : status === 'ACTIVE'
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                                    : status === 'INACTIVE'
                                                        ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            status === 'ACTIVE' ? tCommon('active') :
                                                status === 'INACTIVE' ? tCommon('inactive') : tCommon('suspended')
                                        )}
                                        {selectedUser.status === status && <span className="text-xs">{t('editStatus.current')}</span>}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setSelectedUser(null)
                                }}
                                className="w-full py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                {tCommon('cancel')}
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                showDeleteModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{t('deleteConfirm.title')}</h3>
                            <p className="text-gray-500 text-center mb-2">
                                {t('deleteConfirm.message')}
                            </p>
                            <p className="text-center font-medium text-gray-900 mb-6">
                                {selectedUser.name} ({selectedUser.email})
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false)
                                        setSelectedUser(null)
                                    }}
                                    className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    {tCommon('cancel')}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        tCommon('delete')
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
