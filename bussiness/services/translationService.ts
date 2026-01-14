// LibreTranslate via Next.js API route (to bypass CORS)

export interface TranslationResult {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
}

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

        // Call our Next.js API route instead of LibreTranslate directly
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                targetLang: target,
                sourceLang: source
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Translation API error:', errorData);
            throw new Error(errorData.error || 'Translation failed');
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
