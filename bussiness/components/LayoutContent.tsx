'use client';

import { useState, useEffect } from 'react';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [pathname, isMobile]);

    // Public routes: just show content (no sidebar/header)
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Protected routes: wrap with AuthGuard and show sidebar/header
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                {/* Mobile overlay */}
                {sidebarOpen && isMobile && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    isMobile={isMobile}
                />

                {/* Main content */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${!isMobile ? 'lg:ml-56' : ''}`}>
                    <Header
                        onMenuClick={() => setSidebarOpen(true)}
                        isMobile={isMobile}
                    />
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
