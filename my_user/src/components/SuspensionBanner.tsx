'use client';

import React from 'react';
import { Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SuspensionBannerProps {
    onClear?: () => void;
    message?: string;
}

const SuspensionBanner = ({ onClear, message }: SuspensionBannerProps) => {
    const t = useTranslations('suspension');

    return (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 relative animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                    <h4 className="text-red-900 font-bold text-sm mb-1 uppercase tracking-tight">{t('title')}</h4>
                    <p className="text-red-700 text-[13px] leading-relaxed">
                        {(message || t('message')).split('**').map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                    </p>
                </div>
                {onClear && (
                    <button
                        onClick={onClear}
                        className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full transition"
                    >
                        <X size={14} className="text-red-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SuspensionBanner;
