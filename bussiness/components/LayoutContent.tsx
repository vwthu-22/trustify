'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import AuthGuard from '@/components/AuthGuard';

// Routes that don't show sidebar/header
const PUBLIC_ROUTES = ['/login', '/auth', '/magic-link', '/verify'];

interface LayoutContentProps {
    children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
    const pathname = usePathname();
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

    // Public routes: just show content (no sidebar/header)
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Protected routes: wrap with AuthGuard and show sidebar/header
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="p-8">{children}</div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
