'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import useLanguageStore, { Locale } from '@/stores/languageStore/language';

const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { locale, setLocale, isHydrated } = useLanguageStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Don't render until mounted (prevents hydration mismatch)
    if (!mounted) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-300">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">🌐</span>
                <ChevronDown className="w-3.5 h-3.5" />
            </div>
        );
    }

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    const handleLanguageChange = (langCode: Locale) => {
        if (langCode !== locale) {
            setLocale(langCode);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Select language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.flag}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
                                ${locale === lang.code
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="flex-1 font-medium">{lang.name}</span>
                            {locale === lang.code && (
                                <Check className="w-4 h-4 text-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
