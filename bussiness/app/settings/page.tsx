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
                detail: company.detail || '',
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

            if (company?.id) {
                // Update company info via PATCH /api/companies/update-info/{id}
                try {
                    const updateInfoData = {
                        name: companyData.name,
                        address: companyData.address,
                        websiteUrl: companyData.website,
                        industry: companyData.industry,
                        companySize: companyData.size,
                        description: companyData.detail,
                    };
                    console.log('Sending info update (PATCH):', JSON.stringify(updateInfoData, null, 2));
                    await companyApi.updateInfo(company.id, updateInfoData);
                } catch (apiError) {
                    console.warn('Info update API failed:', apiError);
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
                detail: companyData.detail,
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
        <div className="space-y-4">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
                <div className="space-y-4">
                    {/* Avatar/Logo Upload */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                        <div className="relative group">
                            <div
                                onClick={handleAvatarClick}
                                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition"
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
                            <h4 className="font-medium text-gray-900 text-sm">{t('companyLogo')}</h4>
                            <p className="text-xs text-gray-500">{t('clickToUpload')}</p>
                            <p className="text-xs text-gray-400">{t('maxFileSize')}</p>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">{t('profileInfo')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t('fullName')}
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterName')}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t('phone')}
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterPhone')}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t('website')}
                                </label>
                                <input
                                    type="url"
                                    value={companyData.website}
                                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterWebsite')}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t('detail')}
                                </label>
                                <input
                                    type="text"
                                    value={companyData.detail}
                                    onChange={(e) => setCompanyData({ ...companyData, detail: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterDetail')}
                                />
                            </div>

                            {/* <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t('address')}
                                </label>
                                <textarea
                                    rows={2}
                                    value={companyData.address}
                                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('enterAddress')}
                                />
                            </div> */}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
    );
}
