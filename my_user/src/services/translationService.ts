// LibreTranslate API - Free, open-source translation
// Public instance: https://libretranslate.com (rate limited)
// Can self-host for unlimited usage

export interface TranslationResult {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
}

// Using public LibreTranslate instance
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

export async function translateText(
    text: string,
    targetLang: string,
    sourceLang: string = 'auto'
): Promise<TranslationResult> {
    try {
        // Convert locale codes to language codes
        const langMap: Record<string, string> = {
            'vi': 'vi',
            'en': 'en',
            'ru': 'ru',
            'ja': 'ja',
            'zh': 'zh',
            'pt': 'pt',
            'auto': 'auto'
        };

        const source = langMap[sourceLang] || 'auto';
        const target = langMap[targetLang] || targetLang;

        const response = await fetch(LIBRETRANSLATE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: source,
                target: target,
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();

        if (!data.translatedText) {
            throw new Error('No translation returned');
        }

        return {
            translatedText: data.translatedText,
            sourceLanguage: source,
            targetLanguage: target,
        };
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

// Detect language of text (basic detection based on characters)
export function detectLanguage(text: string): string {
    // Vietnamese detection
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) {
        return 'vi';
    }

    // Japanese detection
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
        return 'ja';
    }

    // Chinese detection
    if (/[\u4E00-\u9FFF]/.test(text)) {
        return 'zh';
    }

    // Russian detection
    if (/[а-яА-ЯёЁ]/.test(text)) {
        return 'ru';
    }

    // Portuguese detection (basic - checks for common Portuguese characters)
    if (/[àáâãçéêíóôõú]/i.test(text)) {
        return 'pt';
    }

    // Default to English
    return 'en';
}
