'use client'

import { useEffect } from 'react'
import StatCard from '@/components/Startcard'
import PaymentsChart from '@/components/PaymentsChart'
import ProfitChart from '@/components/ProfitChart'
import { DollarSign, Building2, Users } from 'lucide-react'
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
    <>

      {/* Stats Grid - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          iconBgColor="bg-green-500"
          value={formatCurrency(totalRevenue)}
          label={t('totalRevenue')}
          subtitle={`${successCount} ${t('successfulTransactions')}`}
        />
        <StatCard
          icon={<Building2 className="w-6 h-6" />}
          iconBgColor="bg-purple-600"
          value={(totalCompanies || companies.length).toString()}
          label={t('totalCompanies')}
          subtitle={t('registered')}
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-cyan-500"
          value={(totalUsers || users.length).toString()}
          label={t('totalUsers')}
          subtitle={t('activeUsers')}
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