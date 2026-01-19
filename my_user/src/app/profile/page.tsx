'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MapPin, Save, ArrowLeft, Check, Camera } from 'lucide-react';
import Link from 'next/link';
import useAuthStore from '@/stores/userAuthStore/user';
import { useTranslations } from 'next-intl';

const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
    'Bangladesh', 'Belgium', 'Brazil', 'Cambodia', 'Canada', 'Chile', 'China',
    'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
    'Hong Kong', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Japan', 'Jordan', 'Kenya', 'South Korea', 'Kuwait', 'Laos',
    'Malaysia', 'Mexico', 'Mongolia', 'Morocco', 'Myanmar', 'Nepal',
    'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines',
    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia',
    'Singapore', 'South Africa', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
    'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
    'United Kingdom', 'United States', 'Vietnam'
];

export default function ProfilePage() {
    const router = useRouter();
    const t = useTranslations('profile');
    const tCommon = useTranslations('common');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        successMessage,
        updateProfile,
        uploadAvatar,
        clearError,
        clearSuccess
    } = useAuthStore();

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setCountry(user.country || '');
            setAvatarPreview(user.avatar || null);
        }
    }, [user]);

    // Clear messages on unmount
    useEffect(() => {
        return () => {
            clearError();
            clearSuccess();
        };
    }, [clearError, clearSuccess]);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => clearSuccess(), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, clearSuccess]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Clear previous errors
            clearError();

            // Validate file type more strictly
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert(`Invalid file type: ${file.type}\nPlease select a JPEG, PNG, GIF, or WebP image.`);
                e.target.value = ''; // Reset input
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                alert(`File size (${sizeMB}MB) exceeds the maximum allowed size of 5MB.\nPlease choose a smaller image.`);
                e.target.value = ''; // Reset input
                return;
            }

            // Check if file is actually an image by trying to load it
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                // File is valid, proceed with preview
                setAvatarFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                alert('The selected file appears to be corrupted or is not a valid image.\nPlease try a different file.');
                e.target.value = ''; // Reset input
            };

            img.src = objectUrl;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Upload avatar if a new file was selected
        let avatarUrl = user?.avatar; // Default to existing avatar

        if (avatarFile) {
            const uploadedUrl = await uploadAvatar(avatarFile);
            if (uploadedUrl) {
                avatarUrl = uploadedUrl;
                setAvatarFile(null); // Clear file after successful upload
            }
        }

        // Pass avatarUrl (new or existing) to updateProfile
        await updateProfile(name, country, avatarUrl);
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
            <div className="max-w-lg mx-auto px-4 sm:px-6">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-4 transition text-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('backToHome')}</span>
                </Link>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-5 sm:py-6">
                        <div className="flex items-center gap-3">
                            {/* Avatar with upload */}
                            <div className="relative group">
                                <div
                                    onClick={handleAvatarClick}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold cursor-pointer overflow-hidden bg-white/20 hover:bg-white/30 transition"
                                >
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                                {/* Camera overlay */}
                                <div
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                >
                                    <Camera className="w-5 h-5 text-white" />
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
                            <div className="text-white">
                                <h1 className="text-base sm:text-lg font-bold">{user.name}</h1>
                                <p className="text-blue-100 text-xs sm:text-sm">{user.email}</p>
                            </div>
                        </div>
                        <p className="text-blue-200 text-xs mt-2">{t('clickAvatarToChange')}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                                <Check className="w-4 h-4" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    {t('email')}
                                </div>
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">{t('emailCannotChange')}</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    {t('fullName')}
                                </div>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('enterFullName')}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition text-sm"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {t('country')}
                                </div>
                            </label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition bg-white text-sm"
                            >
                                <option value="">{t('selectCountry')}</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {t('saving')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {t('saveChanges')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>{t('needHelp')} <Link href="/support" className="text-blue-600 hover:underline">{t('contactSupport')}</Link></p>
                </div>
            </div>
        </div>
    );
}
