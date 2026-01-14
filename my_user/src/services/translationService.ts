// MyMemory Translation API - Free, no API key needed
// Limit: 10,000 words/day

export interface TranslationResult {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
}

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

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
        };

        const source = langMap[sourceLang] || sourceLang;
        const target = langMap[targetLang] || targetLang;

        // Build API URL
        const url = new URL(MYMEMORY_API);
        url.searchParams.append('q', text);
        url.searchParams.append('langpair', `${source}|${target}`);

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails || 'Translation error');
        }

        return {
            translatedText: data.responseData.translatedText,
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
