'use client';

import { useState, useEffect } from 'react';
import { User, Building2, Mail, Phone, Lock, Bell, Globe, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useCompanyStore } from '@/store/useCompanyStore';
import { companyApi } from '@/lib/api';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'notifications' | 'security'>('profile');

    const { company, fetchCompanyProfile, updateCompany, isLoading } = useCompanyStore();

    // Local state for form editing
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        avatar: ''
    });

    const [companyData, setCompanyData] = useState({
        name: '',
        taxId: '',
        address: '',
        website: '',
        industry: '',
        size: ''
    });

    const [notifications, setNotifications] = useState({
        emailNewReview: true,
        emailWeeklyReport: true,
        emailMonthlyReport: false,
        pushNewReview: true,
        pushLowRating: true,
        pushMilestone: true
    });

    // Fetch company profile on mount
    useEffect(() => {
        fetchCompanyProfile();
    }, [fetchCompanyProfile]);

    // Populate form when company data is loaded
    useEffect(() => {
        if (company) {
            console.log('Settings - company data loaded:', company);
            setProfileData({
                name: company.name || '',
                email: company.email || '',
                phone: company.phone || '',
                position: company.position || '',
                avatar: company.logo || ''
            });
            setCompanyData({
                name: company.name || '',
                taxId: company.taxId || '',
                address: company.address || '',
                website: company.website || '',
                industry: company.industry || '',
                size: company.size || ''
            });
        }
    }, [company]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update company profile via API
            await companyApi.updateProfile({
                name: companyData.name,
                email: profileData.email,
                phone: profileData.phone,
                position: profileData.position,
                website: companyData.website,
                address: companyData.address,
                industry: companyData.industry,
                size: companyData.size,
                taxId: companyData.taxId,
            });

            // Update local store
            updateCompany({
                name: companyData.name,
                email: profileData.email,
                phone: profileData.phone,
                position: profileData.position,
                website: companyData.website,
                address: companyData.address,
                industry: companyData.industry,
                size: companyData.size,
                taxId: companyData.taxId,
            });

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'company', name: 'Company Info', icon: Building2 },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Lock }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading settings...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
            </div>

            {/* Save Success Banner */}
            {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Settings saved successfully!</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Company Info Card */}
                    {company && (
                        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Building2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{company.email}</p>
                                <div className="mt-3">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${company.plan === 'Premium' ? 'bg-purple-100 text-purple-700' :
                                        company.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {company.plan || 'Free'} Plan
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Position
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.position}
                                                onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g. CEO, Manager"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Company Tab */}
                        {activeTab === 'company' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                value={companyData.name}
                                                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter company name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tax ID / Business Registration Number
                                            </label>
                                            <input
                                                type="text"
                                                value={companyData.taxId}
                                                onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter tax ID"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Address
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={companyData.address}
                                                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter business address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={companyData.website}
                                                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://yourcompany.com"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Industry
                                                </label>
                                                <select
                                                    value={companyData.industry}
                                                    onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select industry</option>
                                                    <option value="technology">Technology</option>
                                                    <option value="retail">Retail</option>
                                                    <option value="food">Food & Beverage</option>
                                                    <option value="healthcare">Healthcare</option>
                                                    <option value="education">Education</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company Size
                                                </label>
                                                <select
                                                    value={companyData.size}
                                                    onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select size</option>
                                                    <option value="1-10">1-10 employees</option>
                                                    <option value="11-50">11-50 employees</option>
                                                    <option value="50-100">50-100 employees</option>
                                                    <option value="100+">100+ employees</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <p className="font-medium text-gray-900">New Review Alerts</p>
                                                <p className="text-sm text-gray-600">Get notified when you receive a new review</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailNewReview}
                                                onChange={(e) => setNotifications({ ...notifications, emailNewReview: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <p className="font-medium text-gray-900">Weekly Summary</p>
                                                <p className="text-sm text-gray-600">Receive a weekly summary of your reviews</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailWeeklyReport}
                                                onChange={(e) => setNotifications({ ...notifications, emailWeeklyReport: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <p className="font-medium text-gray-900">Monthly Report</p>
                                                <p className="text-sm text-gray-600">Get a detailed monthly analytics report</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailMonthlyReport}
                                                onChange={(e) => setNotifications({ ...notifications, emailMonthlyReport: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Push Notifications</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <p className="font-medium text-gray-900">New Reviews</p>
                                                <p className="text-sm text-gray-600">Push notification for new reviews</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications.pushNewReview}
                                                onChange={(e) => setNotifications({ ...notifications, pushNewReview: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <p className="font-medium text-gray-900">Low Rating Alert</p>
                                                <p className="text-sm text-gray-600">Alert when receiving low ratings (1-2 stars)</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications.pushLowRating}
                                                onChange={(e) => setNotifications({ ...notifications, pushLowRating: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <div>
                                                <p className="font-medium text-gray-900">Milestones</p>
                                                <p className="text-sm text-gray-600">Celebrate when you reach review milestones</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notifications.pushMilestone}
                                                onChange={(e) => setNotifications({ ...notifications, pushMilestone: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">

                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-700 mb-4">
                                            Add an extra layer of security to your account by enabling two-factor authentication.
                                        </p>
                                        <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Danger Zone</h3>
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-sm text-red-700 mb-4">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <button className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
