import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trustify.io.vn';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    const backendUrl = `${API_BASE_URL}/api/review/recent-review?page=${page}&size=${size}`;
    console.log('Proxy fetching from:', backendUrl);

    try {
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        console.log('Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch reviews', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Proxy success, reviews count:', data.reviews?.length || 0);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
