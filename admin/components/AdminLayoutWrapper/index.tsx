'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Pages that don't need the admin layout (sidebar + header)
    const isAuthPage = pathname === '/login' || pathname === '/forgot-password';

    // For login page, render without sidebar/header
    if (isAuthPage) {
        return <>{children}</>;
    }

    // For all other pages, render with admin layout
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
