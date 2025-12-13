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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-500 mt-1">{t('subtitle')}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {tCommon('loading')}
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {tCommon('save')}
                        </>
                    )}
                </button>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {t('saved')}
                </div>
            )}

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('notifications.title')}</h3>
                        <p className="text-sm text-gray-500">{t('notifications.subtitle')}</p>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">{t('notifications.email')}</p>
                                <p className="text-sm text-gray-500">{t('notifications.emailDesc')}</p>
                            </div>
                        </div>
                        <Toggle
                            enabled={settings.emailNotifications}
                            onChange={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                        />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">{t('notifications.push')}</p>
                                <p className="text-sm text-gray-500">{t('notifications.pushDesc')}</p>
                            </div>
                        </div>
                        <Toggle
                            enabled={settings.pushNotifications}
                            onChange={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                        />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{t('notifications.weekly')}</p>
                            <p className="text-sm text-gray-500">{t('notifications.weeklyDesc')}</p>
                        </div>
                        <Toggle
                            enabled={settings.weeklyReport}
                            onChange={() => setSettings({ ...settings, weeklyReport: !settings.weeklyReport })}
                        />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{t('notifications.newUser')}</p>
                            <p className="text-sm text-gray-500">{t('notifications.newUserDesc')}</p>
                        </div>
                        <Toggle
                            enabled={settings.newUserAlert}
                            onChange={() => setSettings({ ...settings, newUserAlert: !settings.newUserAlert })}
                        />
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Sun className="w-5 h-5 text-purple-600" />
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

            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('security.title')}</h3>
                        <p className="text-sm text-gray-500">{t('security.subtitle')}</p>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{t('security.twoFactor')}</p>
                            <p className="text-sm text-gray-500">{t('security.twoFactorDesc')}</p>
                        </div>
                        <Toggle
                            enabled={settings.twoFactorAuth}
                            onChange={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                        />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">{t('security.loginAlerts')}</p>
                            <p className="text-sm text-gray-500">{t('security.loginAlertsDesc')}</p>
                        </div>
                        <Toggle
                            enabled={settings.loginAlerts}
                            onChange={() => setSettings({ ...settings, loginAlerts: !settings.loginAlerts })}
                        />
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{t('security.sessionTimeout')}</p>
                                <p className="text-sm text-gray-500">{t('security.sessionTimeoutDesc')}</p>
                            </div>
                            <select
                                value={settings.sessionTimeout}
                                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="15">15 {t('security.minutes')}</option>
                                <option value="30">30 {t('security.minutes')}</option>
                                <option value="60">1 {t('security.hour')}</option>
                                <option value="120">2 {t('security.hours')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
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
            </div>
        </div>
    )
}
