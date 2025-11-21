'use client'

import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { day: 'Sat', sales: 45, revenue: 55 },
  { day: 'Sun', sales: 70, revenue: 80 },
  { day: 'Mon', sales: 60, revenue: 65 },
  { day: 'Tue', sales: 75, revenue: 85 },
  { day: 'Wed', sales: 35, revenue: 40 },
  { day: 'Thu', sales: 65, revenue: 75 },
  { day: 'Fri', sales: 80, revenue: 90 },
]

export default function ProfitChart() {
  const [period, setPeriod] = useState('This Week')

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profit this week</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
          <span className="text-sm text-gray-600">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={0}>
          <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="revenue" fill="#06B6D4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}