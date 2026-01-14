import { NextRequest, NextResponse } from 'next/server';

// MyMemory Translation API - Free, no setup required
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export async function POST(request: NextRequest) {
    try {
        const { text, targetLang, sourceLang } = await request.json();

        // Build API URL
        const url = new URL(MYMEMORY_API);
        url.searchParams.append('q', text);
        url.searchParams.append('langpair', `${sourceLang || 'auto'}|${targetLang}`);

        const response = await fetch(url.toString());

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Translation failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            return NextResponse.json(
                { error: data.responseDetails || 'Translation error' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            translatedText: data.responseData.translatedText
        });
    } catch (error: any) {
        console.error('Translation API error:', error);
        return NextResponse.json(
            { error: 'Translation service error', message: error.message },
            { status: 500 }
        );
    }
}
