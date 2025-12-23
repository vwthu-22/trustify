'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Shield, Calendar, Key, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useAdminAuthStore from '@/store/useAdminAuthStore'

export default function ProfilePage() {
  const t = useTranslations('profile')
  const { adminUser, checkAuthStatus } = useAdminAuthStore()

  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  })

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  useEffect(() => {
    if (adminUser) {
      setFormData({
        fullName: adminUser.email.split('@')[0] || 'Admin',
        email: adminUser.email,
      })
    }
  }, [adminUser])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {t('updated')}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {formData.email.charAt(0).toUpperCase()}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{formData.fullName}</h2>
              <div className="flex items-center gap-2 mt-1 text-white/80">
                <Shield className="w-4 h-4" />
                <span>{adminUser?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-6">
          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('emailAddress')}</label>
              <p className="text-gray-900 font-medium">{formData.email}</p>
              <p className="text-xs text-gray-400 mt-1">{t('emailNote')}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('role')}</label>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Shield className="w-3.5 h-3.5" />
                {adminUser?.role || 'Administrator'}
              </span>
            </div>
          </div>

          {/* Login Time */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('lastLogin')}</label>
              <p className="text-gray-900">
                {adminUser?.loginTime
                  ? new Date(adminUser.loginTime).toLocaleString('vi-VN')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t('security')}</h3>
          <p className="text-sm text-gray-500">{t('securitySubtitle')}</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t('password')}</p>
                <p className="text-sm text-gray-500">{t('lastChanged')} Never</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {t('changePassword')}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{t('recentActivity')}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { action: t('activities.loggedIn'), time: 'Just now', icon: '🔐' },
            { action: t('activities.updatedUser'), time: '2 hours ago', icon: '👤' },
            { action: t('activities.createdAdmin'), time: 'Yesterday', icon: '➕' },
            { action: t('activities.reviewedReports'), time: '2 days ago', icon: '📊' },
          ].map((activity, index) => (
            <div key={index} className="px-6 py-4 flex items-center gap-4">
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}