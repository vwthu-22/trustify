import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // NOTE: Backend sets access_token cookie on trustify.io.vn domain
    // This middleware runs on vercel.app - different domain
    // So we can't check the cookie here. Backend handles auth with 401 errors.

    // Just pass through all requests
    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

