'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, Edit, X, ShieldCheck, ShieldX, ShieldQuestion } from 'lucide-react'
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
        updateCompanyPlan,
        setSearchQuery,
        clearError,
    } = useCompanyManagementStore()

    const pageSize = 5 // Show 5 companies per page

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    const [editPlan, setEditPlan] = useState<string>('Free')

    // Available plans
    const availablePlans = ['Free', 'Basic', 'Pro', 'Enterprise']

    // Verification filter (instead of status)
    const [verifyFilter, setVerifyFilter] = useState<string>('all')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)

    // Fetch companies on mount and when page changes
    useEffect(() => {
        fetchCompanies(currentPage, pageSize)
    }, [fetchCompanies, currentPage])

    // Filter companies by verification and search query
    const filteredCompanies = companies.filter(company => {
        // Verification filter
        const matchesVerify = verifyFilter === 'all' || company.verifyStatus === verifyFilter

        // Search filter (search in name and email)
        const matchesSearch = !searchQuery ||
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesVerify && matchesSearch
    })

    // Handle save edit
    const handleSaveEdit = async () => {
        if (!selectedCompany) return

        if (editPlan !== selectedCompany.plan) {
            await updateCompanyPlan(selectedCompany.id, editPlan)
        }

        setShowEditModal(false)
        setSelectedCompany(null)
        fetchCompanies(currentPage, pageSize)
    }

    // Get verification status badge
    const getVerifyStatusBadge = (verifyStatus?: string | null) => {
        switch (verifyStatus) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <ShieldCheck className="w-3 h-3" />
                        {t('verifyStatus.approved')}
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <ShieldX className="w-3 h-3" />
                        {t('verifyStatus.rejected')}
                    </span>
                )
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <ShieldQuestion className="w-3 h-3" />
                        {t('verifyStatus.pending')}
                    </span>
                )
            default:
                return (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        {t('verifyStatus.none')}
                    </span>
                )
        }
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
                            <span>{t('verificationLabel')}: {verifyFilter === 'all' ? tCommon('all') :
                                verifyFilter === 'APPROVED' ? t('verifyStatus.approved') :
                                    verifyFilter === 'PENDING' ? t('verifyStatus.pending') :
                                        verifyFilter === 'REJECTED' ? t('verifyStatus.rejected') : t('verifyStatus.none')}</span>
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                {['all', 'APPROVED', 'PENDING', 'REJECTED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setVerifyFilter(status)
                                            setShowFilterDropdown(false)
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${verifyFilter === status ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        {status === 'all' ? tCommon('all') :
                                            status === 'APPROVED' ? t('verifyStatus.approved') :
                                                status === 'PENDING' ? t('verifyStatus.pending') : t('verifyStatus.rejected')}
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
                                <th className="px-6 py-3">{t('verification') || 'Verification'}</th>
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
                                                    company.plan === 'Basic' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {company.plan || 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getVerifyStatusBadge(company.verifyStatus)}
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

          
        </div>
    )
}
