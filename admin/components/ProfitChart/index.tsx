'use client'

import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import usePaymentStore from '@/store/usePaymentStore'
import { useTranslations } from 'next-intl'

export default function ProfitChart() {
  const t = useTranslations('dashboard')
  const { transactions } = usePaymentStore()

  // Process transactions into daily data for the last 7 days
  const chartData = useMemo(() => {
    // Get translated day names
    const days = [
      t('profitChart.days.sun'),
      t('profitChart.days.mon'),
      t('profitChart.days.tue'),
      t('profitChart.days.wed'),
      t('profitChart.days.thu'),
      t('profitChart.days.fri'),
      t('profitChart.days.sat'),
    ]
    const dailyData: { [key: number]: { success: number; failed: number } } = {}

    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dailyData[i] = { success: 0, failed: 0 }
    }

    // Get transactions from last 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    transactions.forEach(tx => {
      if (!tx.createdAt) return
      const date = new Date(tx.createdAt)

      // Only include transactions from last 7 days
      if (date >= sevenDaysAgo) {
        const dayOfWeek = date.getDay() // 0 = Sunday

        if (tx.status === 'SUCCESS') {
          dailyData[dayOfWeek].success += tx.amount
        } else if (tx.status === 'FAILED') {
          dailyData[dayOfWeek].failed += tx.amount
        }
      }
    })

    // Convert to array format for chart (starting from Monday)
    const orderedDays = [1, 2, 3, 4, 5, 6, 0] // Mon to Sun
    return orderedDays.map(dayIndex => ({
      day: days[dayIndex],
      success: Math.round(dailyData[dayIndex].success / 1000),
      failed: Math.round(dailyData[dayIndex].failed / 1000),
    }))
  }, [transactions, t])

  // Calculate week totals
  const weekSuccess = transactions
    .filter(t => {
      if (!t.createdAt || t.status !== 'SUCCESS') return false
      const date = new Date(t.createdAt)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return date >= sevenDaysAgo
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('profitChart.title')}</h2>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(weekSuccess)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
          <span className="text-sm text-gray-600">{t('profitChart.success')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span className="text-sm text-gray-600">{t('profitChart.failed')}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} barGap={2}>
          <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(value) => `${value}K`} />
          <Tooltip
            formatter={(value: number) => [`${value}K ₫`, '']}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Bar dataKey="success" name={t('profitChart.success')} fill="#6366F1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="failed" name={t('profitChart.failed')} fill="#F87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}