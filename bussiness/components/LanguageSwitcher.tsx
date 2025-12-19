'use client';

import { useTransition } from 'react';
import { Globe, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Locale = 'en' | 'vi';

const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState<Locale>('vi');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current locale from cookie on mount
    useEffect(() => {
        const locale = document.cookie
            .split('; ')
            .find(row => row.startsWith('locale='))
            ?.split('=')[1] as Locale;
        if (locale) {
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
            // Set cookie
            document.cookie = `locale=${locale};path=/;max-age=31536000`;
            setCurrentLocale(locale);
            setIsOpen(false);
            // Reload to apply new locale
            window.location.reload();
        });
    };

    const currentLanguage = languages.find(l => l.code === currentLocale);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
                <span className="sm:hidden">{currentLanguage?.flag}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => changeLocale(language.code)}
                            className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
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
