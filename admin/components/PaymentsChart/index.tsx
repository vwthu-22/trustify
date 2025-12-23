'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import usePaymentStore from '@/store/usePaymentStore'
import { useTranslations } from 'next-intl'

export default function PaymentsChart() {
  const t = useTranslations('dashboard')
  const { transactions } = usePaymentStore()

  // Process transactions into monthly data
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { success: number; total: number } } = {}

    // Initialize all months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(month => {
      monthlyData[month] = { success: 0, total: 0 }
    })

    // Aggregate transactions by month
    transactions.forEach(tx => {
      if (!tx.createdAt) return
      const date = new Date(tx.createdAt)
      const monthIndex = date.getMonth()
      const monthName = months[monthIndex]

      monthlyData[monthName].total += tx.amount
      if (tx.status === 'SUCCESS') {
        monthlyData[monthName].success += tx.amount
      }
    })

    // Convert to array format for chart
    return months.map(month => ({
      month,
      success: Math.round(monthlyData[month].success / 1000), // Convert to K
      total: Math.round(monthlyData[month].total / 1000),
    }))
  }, [transactions])

  // Calculate totals
  const totalSuccess = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPending = transactions
    .filter(t => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{t('paymentsChart.title')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-sm text-gray-600">{t('paymentsChart.success')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-sm text-gray-600">{t('paymentsChart.total')}</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(value) => `${value}K`} />
          <Tooltip
            formatter={(value: number) => [`${value}K ₫`, '']}
            labelStyle={{ color: '#374151' }}
          />
          <Area
            type="monotone"
            dataKey="success"
            name={t('paymentsChart.success')}
            stroke="#6366F1"
            fillOpacity={1}
            fill="url(#colorSuccess)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="total"
            name={t('paymentsChart.total')}
            stroke="#06B6D4"
            fillOpacity={1}
            fill="url(#colorTotal)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-around mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">{t('paymentsChart.paid')}</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSuccess)}</p>
        </div>
        <div className="h-12 w-px bg-gray-200"></div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">{t('paymentsChart.pending')}</p>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
        </div>
      </div>
    </div>
  )
}