'use client'

import { useEffect } from 'react'
import StatCard from '@/components/Startcard'
import PaymentsChart from '@/components/PaymentsChart'
import ProfitChart from '@/components/ProfitChart'
import { Eye, DollarSign, Package, Users } from 'lucide-react'
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
    fetchCompanies(0, 100) // Fetch up to 100 companies
    fetchUsers(0, 100)     // Fetch up to 100 users
    fetchAllTransactions() // Fetch all transactions
  }, [fetchCompanies, fetchUsers, fetchAllTransactions])

  // Calculate total revenue from successful transactions
  const totalRevenue = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)

  // Format number to K/M format
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // Format currency (VND)
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫'
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K ₫'
    }
    return amount.toLocaleString('vi-VN') + ' ₫'
  }

  // Calculate total reviews (placeholder - you may need a reviews API)
  const totalReviews = companies.reduce((sum, c: any) => sum + (c.reviewCount || 0), 0)

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Eye className="w-6 h-6" />}
          iconBgColor="bg-green-500"
          value={formatNumber(totalReviews || 0)}
          label={t('totalReviews')}
          change={0}
          isPositive={true}
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          iconBgColor="bg-orange-500"
          value={formatCurrency(totalRevenue)}
          label={t('totalRevenue')}
          change={0}
          isPositive={true}
        />
        <StatCard
          icon={<Package className="w-6 h-6" />}
          iconBgColor="bg-purple-600"
          value={formatNumber(totalCompanies || companies.length)}
          label={t('totalCompanies')}
          change={0}
          isPositive={true}
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-cyan-500"
          value={formatNumber(totalUsers || users.length)}
          label={t('totalUsers')}
          change={0}
          isPositive={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentsChart />
        </div>
        <div className="lg:col-span-1">
          <ProfitChart />
        </div>
      </div>
    </>
  )
}