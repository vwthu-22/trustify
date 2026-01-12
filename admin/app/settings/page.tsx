'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
    Bell,
    Shield,
    Moon,
    Sun,
    Globe,
    Mail,
    Save,
    Loader2,
    CheckCircle,
    Monitor,
    Smartphone,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react'
import useLanguageStore, { Locale } from '@/store/useLanguageStore'

export default function SettingsPage() {
    const t = useTranslations('settings')
    const tCommon = useTranslations('common')
    const { locale, setLocale } = useLanguageStore()

    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Settings state
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        pushNotifications: false,
        weeklyReport: true,
        newUserAlert: true,

        // Security
        twoFactorAuth: false,
        sessionTimeout: '30',
        loginAlerts: true,
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
    }

    const handleLanguageChange = (newLocale: Locale) => {
        setLocale(newLocale)
    }

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`p-1 rounded-full transition ${enabled ? 'text-blue-600' : 'text-gray-400'}`}
        >
            {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
        </button>
    )

    if (!mounted) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Appearance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('appearance.language')}</h3>
                    </div>
                </div>
                <div className="p-6 space-y-6">

                    {/* Language */}
                    <div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleLanguageChange('vi')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 transition flex items-center justify-center gap-2 ${locale === 'vi'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                <span className="text-xl">🇻🇳</span>
                                Tiếng Việt
                            </button>
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 transition flex items-center justify-center gap-2 ${locale === 'en'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                <span className="text-xl">🇺🇸</span>
                                English
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Danger Zone */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                <div className="p-6 border-b border-red-100 bg-red-50">
                    <h3 className="text-lg font-bold text-red-700">{t('dangerZone.title')}</h3>
                    <p className="text-sm text-red-600">{t('dangerZone.subtitle')}</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{t('dangerZone.deleteAccount')}</p>
                            <p className="text-sm text-gray-500">{t('dangerZone.deleteAccountDesc')}</p>
                        </div>
                        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            {t('dangerZone.deleteAccount')}
                        </button>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
