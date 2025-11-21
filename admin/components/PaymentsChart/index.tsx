'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { month: 'Jan', sales: 20, revenue: 30 },
  { month: 'Feb', sales: 25, revenue: 35 },
  { month: 'Mar', sales: 35, revenue: 40 },
  { month: 'Apr', sales: 45, revenue: 50 },
  { month: 'May', sales: 40, revenue: 55 },
  { month: 'Jun', sales: 55, revenue: 65 },
  { month: 'Jul', sales: 60, revenue: 70 },
  { month: 'Aug', sales: 70, revenue: 80 },
  { month: 'Sep', sales: 75, revenue: 85 },
  { month: 'Oct', sales: 80, revenue: 90 },
  { month: 'Nov', sales: 85, revenue: 88 },
  { month: 'Dec', sales: 90, revenue: 95 },
]

export default function PaymentsChart() {
  const [period, setPeriod] = useState('Monthly')

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payments Overview</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#6366F1"
            fillOpacity={1}
            fill="url(#colorSales)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#06B6D4"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-around mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Received Amount</p>
          <p className="text-2xl font-bold text-gray-900">$580.00</p>
        </div>
        <div className="h-12 w-px bg-gray-200"></div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Due Amount</p>
          <p className="text-2xl font-bold text-gray-900">$628.00</p>
        </div>
      </div>
    </div>
  )
}