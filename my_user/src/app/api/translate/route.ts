import { NextRequest, NextResponse } from 'next/server';
import translate from 'translate';

// Translation engine configuration
const TRANSLATION_ENGINE = process.env.TRANSLATION_ENGINE || 'libre'; // 'libre', 'google', 'deepl', 'yandex'
const LIBRE_TRANSLATE_URL = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.com';
const LIBRE_TRANSLATE_KEY = process.env.LIBRE_TRANSLATE_KEY; // Optional for public instance

// Configure translate package
if (TRANSLATION_ENGINE === 'libre') {
    translate.engine = 'libre';
    (translate as any).url = LIBRE_TRANSLATE_URL; // Type assertion needed as 'url' is not in type definitions
    if (LIBRE_TRANSLATE_KEY) {
        translate.key = LIBRE_TRANSLATE_KEY;
    }
} else if (TRANSLATION_ENGINE === 'google') {
    translate.engine = 'google';
    translate.key = process.env.GOOGLE_TRANSLATE_API_KEY;
} else if (TRANSLATION_ENGINE === 'deepl') {
    translate.engine = 'deepl';
    translate.key = process.env.DEEPL_KEY;
} else if (TRANSLATION_ENGINE === 'yandex') {
    translate.engine = 'yandex';
    translate.key = process.env.YANDEX_KEY;
}

translate.cache = 10000; // Cache results for 10 seconds

/**
 * Translate text using LibreTranslate with Google Translate fallback
 */
export async function POST(request: NextRequest) {
    try {
        const { text, targetLang, sourceLang } = await request.json();

        // Validate input
        if (!text || !targetLang) {
            return NextResponse.json(
                { error: 'Missing required parameters: text and targetLang' },
                { status: 400 }
            );
        }

        let translatedText: string;
        let usedEngine = TRANSLATION_ENGINE;

        try {
            // Try primary translation engine
            translatedText = await translate(text, {
                from: sourceLang || 'auto',
                to: targetLang
            });
        } catch (primaryError: any) {
            console.warn(`${TRANSLATION_ENGINE} translation failed:`, primaryError.message);

            // Fallback to Google Translate if primary engine fails
            if (TRANSLATION_ENGINE !== 'google') {
                console.log('Falling back to Google Translate...');
                try {
                    const googleTranslate = translate;
                    googleTranslate.engine = 'google';
                    // Google Translate doesn't require API key for basic usage

                    translatedText = await googleTranslate(text, {
                        from: sourceLang || 'auto',
                        to: targetLang
                    });
                    usedEngine = 'google (fallback)';
                } catch (fallbackError: any) {
                    console.error('Fallback translation also failed:', fallbackError);
                    throw new Error(`Both ${TRANSLATION_ENGINE} and Google Translate failed`);
                }
            } else {
                throw primaryError;
            }
        }

        return NextResponse.json({
            translatedText,
            engine: usedEngine,
            sourceLanguage: sourceLang || 'auto',
            targetLanguage: targetLang
        });
    } catch (error: any) {
        console.error('Translation error:', error);
        return NextResponse.json(
            {
                error: 'Translation failed',
                message: error.message,
                engine: TRANSLATION_ENGINE
            },
            { status: 500 }
        );
    }
}
