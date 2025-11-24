'use client'

import { CreditCard, Download, Check, Plus } from 'lucide-react'

export default function BillingPage() {
    const transactions = [
        { id: 'TRX-001', company: 'Tech Solutions Ltd.', plan: 'Pro Plan', amount: '$49.00', date: 'Oct 25, 2023', status: 'Paid' },
        { id: 'TRX-002', company: 'Global Logistics', plan: 'Enterprise', amount: '$199.00', date: 'Oct 24, 2023', status: 'Paid' },
        { id: 'TRX-003', company: 'Elite Fitness', plan: 'Pro Plan', amount: '$49.00', date: 'Oct 23, 2023', status: 'Failed' },
        { id: 'TRX-004', company: 'Sunrise Cafe', plan: 'Pro Plan', amount: '$49.00', date: 'Oct 22, 2023', status: 'Paid' },
    ]

    const plans = [
        { name: 'Free', price: '$0', users: '1 User', features: ['Basic Analytics', '100 Reviews/mo', 'Email Support'] },
        { name: 'Pro', price: '$49', users: '5 Users', features: ['Advanced Analytics', 'Unlimited Reviews', 'Priority Support', 'Custom Widgets'], active: true },
        { name: 'Enterprise', price: '$199', users: 'Unlimited', features: ['Dedicated Manager', 'API Access', 'SSO', 'Custom Contracts'] },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transactions Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                        <button className="text-sm text-blue-600 hover:underline">View All</button>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Invoice ID</th>
                                <th className="px-6 py-3">Company</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{trx.id}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div>{trx.company}</div>
                                        <div className="text-xs text-gray-400">{trx.plan}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{trx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${trx.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500">{trx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Plans Overview */}
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`bg-white rounded-xl shadow-sm border p-6 ${plan.active ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">{plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span></div>
                                </div>
                                {plan.active && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Popular</span>}
                            </div>

                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Edit Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
