'use client'

import { useEffect } from 'react'
import StatCard from '@/components/Startcard'
import PaymentsChart from '@/components/PaymentsChart'
import ProfitChart from '@/components/ProfitChart'
import { DollarSign, Building2, Users, TrendingUp, Activity } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useCompanyManagementStore from '@/store/useCompanyManagementStore'
import useUserManagementStore from '@/store/useUserManagementStore'
import usePaymentStore from '@/store/usePaymentStore'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  // Fetch data from stores
  const { companies, totalCompanies, fetchCompanies } = useCompanyManagementStore()
  const { users, totalUsers, fetchUsers } = useUserManagementStore()
  const { transactions, fetchAllTransactions } = usePaymentStore()

  // Fetch data on mount
  useEffect(() => {
    fetchCompanies(0, 100)
    fetchUsers(0, 100)
    fetchAllTransactions()
  }, [fetchCompanies, fetchUsers, fetchAllTransactions])

  // Calculate total revenue from successful transactions
  const totalRevenue = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)

  // Count transactions
  const successCount = transactions.filter(t => t.status === 'SUCCESS').length

  // Format currency (VND)
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + ' tỷ'
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫'
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K ₫'
    }
    return amount.toLocaleString('vi-VN') + ' ₫'
  }

  return (
    <div className="space-y-4">

      {/* Stats Grid - 3 modern gradient cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
          <div className="relative p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{formatCurrency(totalRevenue)}</div>
            <div className="text-emerald-100 text-xs font-medium">{t('totalRevenue')}</div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <span className="text-xs text-white/90">{successCount} {t('successfulTransactions')}</span>
            </div>
          </div>
        </div>

        {/* Companies Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
          <div className="relative p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{(totalCompanies || companies.length).toString()}</div>
            <div className="text-violet-100 text-xs font-medium">{t('totalCompanies')}</div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <span className="text-xs text-white/90">{t('registered')}</span>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
          <div className="relative p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{(totalUsers || users.length).toString()}</div>
            <div className="text-cyan-100 text-xs font-medium">{t('totalUsers')}</div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <span className="text-xs text-white/90">{t('activeUsers')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PaymentsChart />
        </div>
        <div className="lg:col-span-1">
          <ProfitChart />
        </div>
      </div>
    </div>
  )
}