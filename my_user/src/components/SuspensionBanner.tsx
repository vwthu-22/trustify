'use client';

import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SuspensionBannerProps {
    suspendedAt?: string | null;
    onClear?: () => void;
    message?: string;
}

const SuspensionBanner = ({ suspendedAt, onClear, message }: SuspensionBannerProps) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const t = useTranslations('suspension');

    useEffect(() => {
        // Calculate end date (7 days from suspendedAt, or 7 days from now if missing)
        const startDate = suspendedAt ? new Date(suspendedAt) : new Date();
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('Expired');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [suspendedAt]);

    return (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 relative animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                    <h4 className="text-red-900 font-bold text-sm mb-1 uppercase tracking-tight">{t('title')}</h4>
                    <p className="text-red-700 text-[13px] leading-relaxed mb-3">
                        {(message || t('message')).split('**').map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{t('timeLeft')}</span>
                        <div className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-mono font-bold shadow-sm">
                            {timeLeft || '-- : -- : -- : --'}
                        </div>
                    </div>
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
