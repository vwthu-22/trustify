'use client';

import { useState } from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';

export default function CustomWidgetsPage() {
    const [isPro] = useState(false); // Simulating FREE plan

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Custom Widgets</h2>
                <p className="text-gray-500 mt-1">Advanced widget customization for PRO users</p>
            </div>

            {/* Upgrade Notice */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-8 text-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Crown className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">Upgrade to PRO for Custom Widgets</h3>
                        <p className="text-white/90 mb-6">
                            Unlock advanced customization options to match your brand perfectly
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Full CSS customization</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Custom fonts & colors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Advanced layouts</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Remove Trustify branding</span>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                            Upgrade to PRO
                        </button>
                    </div>
                </div>
            </div>

            {/* Locked Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        title: 'Custom CSS Editor',
                        description: 'Write custom CSS to style your widgets exactly how you want',
                        icon: '🎨'
                    },
                    {
                        title: 'Brand Colors',
                        description: 'Match widgets to your brand colors automatically',
                        icon: '🌈'
                    },
                    {
                        title: 'Advanced Layouts',
                        description: 'Access premium layout templates and designs',
                        icon: '📐'
                    },
                    {
                        title: 'Custom Animations',
                        description: 'Add smooth animations and transitions',
                        icon: '✨'
                    },
                    {
                        title: 'White Label',
                        description: 'Remove all Trustify branding from widgets',
                        icon: '🏷️'
                    },
                    {
                        title: 'API Access',
                        description: 'Build completely custom widgets with our API',
                        icon: '⚙️'
                    }
                ].map((feature, index) => (
                    <div key={index} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-60">
                        <div className="absolute top-4 right-4">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-4xl mb-3">{feature.icon}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                        <div className="mt-4 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full inline-block">
                            PRO Feature
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Compare Plans</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-900">FREE</th>
                                <th className="text-center py-3 px-4 font-semibold text-purple-600">PRO</th>
                                <th className="text-center py-3 px-4 font-semibold text-blue-600">PREMIUM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { feature: 'Basic Widgets', free: true, pro: true, premium: true },
                                { feature: 'Custom CSS', free: false, pro: true, premium: true },
                                { feature: 'Brand Colors', free: false, pro: true, premium: true },
                                { feature: 'Advanced Layouts', free: false, pro: true, premium: true },
                                { feature: 'White Label', free: false, pro: false, premium: true },
                                { feature: 'API Access', free: false, pro: true, premium: true },
                                { feature: 'Priority Support', free: false, pro: false, premium: true }
                            ].map((row, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                                    <td className="py-3 px-4 text-center">
                                        {row.free ? '✅' : '❌'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {row.pro ? '✅' : '❌'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {row.premium ? '✅' : '❌'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
