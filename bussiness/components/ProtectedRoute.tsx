'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import { hasFeatureAccess } from '@/lib/featureAccess';
import { Loader2, Lock } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredFeature: 'verification' | 'aiAnalytics' | 'integrations';
    redirectTo?: string;
}

/**
 * Protected route wrapper that checks if user has access to a feature
 * Redirects to subscription page if access is denied
 */
export default function ProtectedRoute({
    children,
    requiredFeature,
    redirectTo = '/subscription'
}: ProtectedRouteProps) {
    const router = useRouter();
    const { company, isLoading } = useCompanyStore();

    const userPlan = company?.plan || 'Free';
    const hasAccess = hasFeatureAccess(userPlan, requiredFeature);

    useEffect(() => {
        // Wait for company data to load
        if (isLoading) return;

        // If no access, redirect to subscription page
        if (!hasAccess) {
            console.log(`Access denied to ${requiredFeature}. Redirecting to ${redirectTo}...`);
            router.push(redirectTo);
        }
    }, [hasAccess, isLoading, router, redirectTo, requiredFeature]);

    // Show loading while checking
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Checking access...</p>
                </div>
            </div>
        );
    }

    // Show access denied if no permission
    if (!hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Locked</h2>
                    <p className="text-gray-600 mb-6">
                        This feature requires a {requiredFeature === 'integrations' ? 'Premium' : 'Pro'} plan or higher.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to subscription page...</p>
                </div>
            </div>
        );
    }

    // Render children if access is granted
    return <>{children}</>;
}
