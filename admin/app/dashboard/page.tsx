'use client'

import StatCard from '@/components/Startcard'
import PaymentsChart from '@/components/PaymentsChart'
import ProfitChart from '@/components/ProfitChart'
import { Eye, DollarSign, Package, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

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
          value="3.5K"
          label={t('totalViews')}
          change={0.43}
          isPositive={true}
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          iconBgColor="bg-orange-500"
          value="$4.2K"
          label={t('totalRevenue')}
          change={4.35}
          isPositive={true}
        />
        <StatCard
          icon={<Package className="w-6 h-6" />}
          iconBgColor="bg-purple-600"
          value="3.5K"
          label={t('totalCompanies')}
          change={2.59}
          isPositive={true}
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-cyan-500"
          value="3.5K"
          label={t('totalUsers')}
          change={-0.95}
          isPositive={false}
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