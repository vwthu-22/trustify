'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/auth', '/magic-link', '/verify'];

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { company, checkAuthStatus } = useCompanyStore();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

    useEffect(() => {
        const checkAuth = async () => {
            // Public routes don't need auth check
            if (isPublicRoute) {
                setIsChecking(false);
                setIsAuthenticated(true); // Allow access
                return;
            }

            // If we already have a company in the store, we can skip the remote check
            // unless we want to force re-verify on every path change (usually not needed)
            if (company) {
                setIsAuthenticated(true);
                setIsChecking(false);
                return;
            }

            // Perform backend verification to ensure session is still valid
            const isValid = await checkAuthStatus();

            if (isValid) {
                setIsAuthenticated(true);
            } else {
                // Not authenticated, redirect to login
                router.replace('/login');
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [pathname, isPublicRoute, checkAuthStatus, router, company]);

    // Show loading while checking auth
    if (isChecking && !isPublicRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated and not public route - don't render anything (redirecting)
    if (!isAuthenticated && !isPublicRoute) {
        return null;
    }

    return <>{children}</>;
}
