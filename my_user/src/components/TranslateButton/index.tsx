'use client';

import React, { useState } from 'react';
import { Languages, Loader2, RotateCcw } from 'lucide-react';
import { translateText, detectLanguage } from '@/services/translationService';
import useLanguageStore from '@/stores/languageStore/language';

interface TranslateButtonProps {
    originalText: string;
    onTranslatedTextChange: (translatedText: string | null) => void;
    className?: string;
}

export default function TranslateButton({
    originalText,
    onTranslatedTextChange,
    className = ''
}: TranslateButtonProps) {
    const [isTranslating, setIsTranslating] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);
    const { locale } = useLanguageStore();

    const handleTranslate = async () => {
        if (isTranslated) {
            // Show original
            onTranslatedTextChange(null);
            setIsTranslated(false);
            return;
        }

        setIsTranslating(true);
        try {
            // Detect source language
            const sourceLang = detectLanguage(originalText);

            // Don't translate if already in target language
            if (sourceLang === locale) {
                alert('This text is already in your language');
                setIsTranslating(false);
                return;
            }

            // Translate
            const result = await translateText(originalText, locale, sourceLang);
            onTranslatedTextChange(result.translatedText);
            setIsTranslated(true);
        } catch (error) {
            console.error('Translation failed:', error);
            alert('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`flex items-center gap-1 text-gray-600 hover:text-blue-700 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            title={isTranslated ? 'Show original' : 'Translate to your language'}
        >
            {isTranslating ? (
                <>
                    <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                    <span>Translating...</span>
                </>
            ) : isTranslated ? (
                <>
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Original</span>
                </>
            ) : (
                <>
                    <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Translate</span>
                </>
            )}
        </button>
    );
}
