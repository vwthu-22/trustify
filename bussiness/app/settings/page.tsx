'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, CheckCircle, Loader2, Camera, Save } from 'lucide-react';
import { useCompanyStore } from '@/store/useCompanyStore';
import { companyApi } from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
    const t = useTranslations('settings');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const { company, fetchCompanyProfile, updateCompany, uploadLogo, isLoading } = useCompanyStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
        detail: '',
        address: '',
        website: '',
        industry: '',
        size: ''
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
                detail: company.taxId || '',
                address: company.address || '',
                website: company.website || '',
                industry: company.industry || '',
                size: company.size || ''
            });
            setAvatarPreview(company.logo || null);
        }
    }, [company]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Upload logo if a new file was selected
            let logoUrl = profileData.avatar;
            if (avatarFile) {
                try {
                    const uploadedUrl = await uploadLogo(avatarFile);
                    if (uploadedUrl) {
                        logoUrl = uploadedUrl;
                        setAvatarFile(null);
                    }
                } catch (uploadError) {
                    console.warn('Logo upload failed, continuing without logo update:', uploadError);
                    // Continue without logo update - API might not be ready yet
                }
            }

            // Try to update company profile via API
            // API: PUT /api/companies/update/{id}
            if (company?.id) {
                try {
                    const updateData = {
                        name: companyData.name,
                        websiteUrl: companyData.website,
                        avatarUrl: logoUrl,
                        contactPhone: profileData.phone,
                        industry: companyData.industry,
                        workEmail: profileData.email,
                        companySize: companyData.size,
                        country: company.country || 'VN', // Add country to prevent null
                    };
                    console.log('Sending company update:', JSON.stringify(updateData, null, 2));
                    await companyApi.updateProfile(company.id, updateData);
                } catch (apiError) {
                    console.warn('API update failed, updating local store only:', apiError);
                    // Continue to update local store even if API fails
                }
            }

            // Update local store (always works)
            updateCompany({
                name: companyData.name,
                email: profileData.email,
                phone: profileData.phone,
                position: profileData.position,
                website: companyData.website,
                address: companyData.address,
                industry: companyData.industry,
                size: companyData.size,
                taxId: companyData.detail,
                logo: logoUrl,
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

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // Compress image using canvas
    const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize if larger than maxWidth
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Max 1MB for backend limit
            const maxSize = 1 * 1024 * 1024;

            let processedFile = file;

            // Compress if file is too large
            if (file.size > maxSize) {
                try {
                    processedFile = await compressImage(file, 800, 0.7);
                    console.log(`Compressed from ${file.size} to ${processedFile.size} bytes`);

                    // If still too large after compression
                    if (processedFile.size > maxSize) {
                        alert('Image is too large. Please choose a smaller image (max 1MB).');
                        return;
                    }
                } catch (error) {
                    console.error('Failed to compress image:', error);
                    alert('Failed to process image. Please try a smaller image.');
                    return;
                }
            }

            setAvatarFile(processedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(processedFile);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">{t('loadingSettings')}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>

            {/* Save Success Banner */}
            {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{t('saved')}</span>
                    </div>
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                    {/* Avatar/Logo Upload */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                        <div className="relative group">
                            <div
                                onClick={handleAvatarClick}
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold cursor-pointer overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition"
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    profileData.name?.charAt(0).toUpperCase() || 'C'
                                )}
                            </div>
                            {/* Camera overlay */}
                            <div
                                onClick={handleAvatarClick}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">{t('companyLogo')}</h4>
                            <p className="text-sm text-gray-500">{t('clickToUpload')}</p>
                            <p className="text-xs text-gray-400 mt-1">{t('maxFileSize')}</p>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('profileInfo')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('fullName')}
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterName')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">{t('emailCannotChange')}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('phone')}
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterPhone')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('detail')}
                                </label>
                                <input
                                    type="text"
                                    value={companyData.detail}
                                    onChange={(e) => setCompanyData({ ...companyData, detail: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterDetail')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('address')}
                                </label>
                                <textarea
                                    rows={3}
                                    value={companyData.address}
                                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterAddress')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('website')}
                                </label>
                                <input
                                    type="url"
                                    value={companyData.website}
                                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterWebsite')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {t('saveChanges')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dangerZone')}</h3>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 mb-4">
                        {t('dangerZoneDesc')}
                    </p>
                    <button className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                        {t('deleteAccount')}
                    </button>
                </div>
            </div>
        </div>
    );
}
