'use client';

import React, { useState } from 'react';
import { Languages, Loader2, RotateCcw } from 'lucide-react';
import { translateText, detectLanguage } from '@/services/translationService';
import { useLocale } from 'next-intl';

interface TranslateButtonProps {
    texts: {
        title?: string;
        description?: string;
        reply?: string;
    };
    onTranslatedTextsChange: (translatedTexts: {
        title?: string;
        description?: string;
        reply?: string;
    } | null) => void;
    className?: string;
}

export default function TranslateButton({
    texts,
    onTranslatedTextsChange,
    className = ''
}: TranslateButtonProps) {
    const [isTranslating, setIsTranslating] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);
    const locale = useLocale();

    const handleTranslate = async () => {
        if (isTranslated) {
            // Show original
            onTranslatedTextsChange(null);
            setIsTranslated(false);
            return;
        }

        setIsTranslating(true);
        try {
            // Translate all texts
            const translatedTitle = texts.title ? await translateTextSafely(texts.title) : undefined;
            const translatedDescription = texts.description ? await translateTextSafely(texts.description) : undefined;
            const translatedReply = texts.reply ? await translateTextSafely(texts.reply) : undefined;

            onTranslatedTextsChange({
                title: translatedTitle,
                description: translatedDescription,
                reply: translatedReply
            });
            setIsTranslated(true);
        } catch (error) {
            console.error('Translation failed:', error);
            alert('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    const translateTextSafely = async (text: string): Promise<string> => {
        const sourceLang = detectLanguage(text);

        // If already in target language, just return original
        if (sourceLang === locale) {
            return text;
        }

        // Translate
        const result = await translateText(text, locale, sourceLang);
        return result.translatedText;
    };

    return (
        <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`flex items-center gap-1 text-gray-500 hover:text-blue-600 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
