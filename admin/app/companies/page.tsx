'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, Edit, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useCompanyManagementStore, { Company } from '@/store/useCompanyManagementStore'
import Image from 'next/image'

export default function CompaniesPage() {
    const t = useTranslations('companies')
    const tCommon = useTranslations('common')

    const {
        companies,
        totalCompanies,
        currentPage,
        totalPages,
        isLoading,
        error,
        searchQuery,
        fetchCompanies,
        updateCompanyStatus,
        setSearchQuery,
        clearError,
    } = useCompanyManagementStore()

    const pageSize = 5 // Show 5 companies per page

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    const [editStatus, setEditStatus] = useState<'ACTIVE' | 'INACTIVE' | 'PENDING'>('ACTIVE')

    // Status filter
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)

    // Fetch companies on mount and when page changes
    useEffect(() => {
        fetchCompanies(currentPage, pageSize)
    }, [fetchCompanies, currentPage])

    // Filter companies by status and search query
    const filteredCompanies = companies.filter(company => {
        // Status filter
        const matchesStatus = statusFilter === 'all' || company.status === statusFilter

        // Search filter (search in name and email)
        const matchesSearch = !searchQuery ||
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesStatus && matchesSearch
    })

    // Handle save edit
    const handleSaveEdit = async () => {
        if (!selectedCompany) return

        if (editStatus !== selectedCompany.status) {
            await updateCompanyStatus(selectedCompany.id, editStatus)
        }

        setShowEditModal(false)
        setSelectedCompany(null)
        fetchCompanies(currentPage, pageSize)
    }

    // Pagination
    const handlePrevPage = () => {
        if (currentPage > 0) {
            fetchCompanies(currentPage - 1, pageSize)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchCompanies(currentPage + 1, pageSize)
        }
    }

    const startItem = currentPage * pageSize + 1
    const endItem = Math.min((currentPage + 1) * pageSize, totalCompanies)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
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
                                {['all', 'ACTIVE', 'INACTIVE', 'PENDING'].map((status) => (
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
                                                status === 'INACTIVE' ? tCommon('inactive') : 'Pending'}
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
                                <th className="px-6 py-3">{t('logo')}</th>
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('email')}</th>
                                <th className="px-6 py-3">{t('website')}</th>
                                <th className="px-6 py-3">{t('industry')}</th>
                                <th className="px-6 py-3">{t('country')}</th>
                                <th className="px-6 py-3">{t('plan')}</th>
                                <th className="px-6 py-3">{t('status')}</th>
                                <th className="px-6 py-3 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading && companies.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                                        <span className="text-gray-500">{tCommon('loading')}</span>
                                    </td>
                                </tr>
                            ) : filteredCompanies.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        {t('noCompanies')}
                                    </td>
                                </tr>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={company.logoUrl || '/default-company.png'}
                                                alt={company.name}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{company.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{company.contactEmail}</td>
                                        <td className="px-6 py-4">
                                            <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {company.websiteUrl}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{company.industry}</td>
                                        <td className="px-6 py-4 text-gray-600">{company.country}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${company.plan === 'Enterprise' || company.plan === 'Pro' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'}`}>
                                                {company.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${company.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    company.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {company.status === 'ACTIVE' ? tCommon('active') :
                                                    company.status === 'INACTIVE' ? tCommon('inactive') : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedCompany(company)
                                                    setEditStatus(company.status)
                                                    setShowEditModal(true)
                                                }}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title={tCommon('edit')}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
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
                        {t('showing')} {startItem} {t('to')} {endItem} {t('of')} {totalCompanies}
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

            {/* Edit Company Status Modal */}
            {showEditModal && selectedCompany && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{t('editStatus.title')}</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setSelectedCompany(null)
                                }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                <span className="font-medium">{selectedCompany.name}</span>
                            </p>
                            <p className="text-sm text-gray-500">{selectedCompany.contactEmail}</p>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Status Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('status')}
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as 'ACTIVE' | 'INACTIVE' | 'PENDING')}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="ACTIVE">{tCommon('active')}</option>
                                    <option value="INACTIVE">{tCommon('inactive')}</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setSelectedCompany(null)
                                }}
                                className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                {tCommon('cancel')}
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isLoading}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    tCommon('save')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
