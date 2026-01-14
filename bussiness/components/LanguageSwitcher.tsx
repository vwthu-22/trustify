'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Locale = 'en' | 'vi' | 'ru' | 'ja' | 'zh' | 'pt';

const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function LanguageSwitcher() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState<Locale>('vi');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current locale from cookie on mount
    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const locale = getCookie('locale') as Locale;
        const validLocales: Locale[] = ['en', 'vi', 'ru', 'ja', 'zh', 'pt'];
        if (locale && validLocales.includes(locale)) {
            setCurrentLocale(locale);
        }
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

    const changeLocale = (locale: Locale) => {
        startTransition(() => {
            // Set cookie with SameSite attribute
            document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
            setCurrentLocale(locale);
            setIsOpen(false);

            // Use router.refresh() instead of full page reload
            router.refresh();
        });
    };

    const currentLanguage = languages.find(l => l.code === currentLocale);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
                <span className="sm:hidden">{currentLanguage?.flag}</span>
                {isPending && (
                    <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => changeLocale(language.code)}
                            disabled={isPending}
                            className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2">
                                <span>{language.flag}</span>
                                <span>{language.name}</span>
                            </span>
                            {currentLocale === language.code && (
                                <Check className="w-4 h-4 text-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
