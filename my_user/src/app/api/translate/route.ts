import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text, targetLang, sourceLang } = await request.json();

        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang || 'auto',
                target: targetLang,
                format: 'text'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('LibreTranslate error:', errorData);
            return NextResponse.json(
                { error: 'Translation failed', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Translation API error:', error);
        return NextResponse.json(
            { error: 'Translation service error', message: error.message },
            { status: 500 }
        );
    }
}
