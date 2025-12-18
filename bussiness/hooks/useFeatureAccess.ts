import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { companyApi } from '@/lib/api';

interface CompanyProfile {
    id: number;
    name: string;
    email: string;
    plan?: {
        id: number;
        name: string;
        features: Array<{
            id: number;
            name: string;
            description?: string;
        }>;
    };
}

// Route to feature name mapping - only this needs to be configured
// Map your routes to the exact feature names from backend
export const ROUTE_FEATURES: Record<string, string> = {
    '/analytics': 'Advanced Analytics',
    '/widgets': 'Custom Widgets',
    '/integrations': 'Integrations',
    '/invitations': 'Team Invitations',
    '/manage': 'Review Management'
};

// Public routes - don't fetch profile
const PUBLIC_ROUTES = ['/login', '/auth', '/magic-link', '/verify'];

export function useFeatureAccess() {
    const pathname = usePathname();
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

    useEffect(() => {
        if (!isPublicRoute) {
            loadProfile();
        } else {
            setLoading(false);
        }
    }, [isPublicRoute]);

    const loadProfile = async () => {
        try {
            const data = await companyApi.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check if user has a specific feature by name
    const hasFeature = (featureName: string): boolean => {
        if (!profile?.plan?.features) return false;
        return profile.plan.features.some(f => f.name === featureName);
    };

    // Check if user can access a specific route
    const canAccessRoute = (route: string): boolean => {
        const requiredFeature = ROUTE_FEATURES[route];
        if (!requiredFeature) return true; // No restriction
        return hasFeature(requiredFeature);
    };

    // Get all available features for current plan
    const getAvailableFeatures = (): string[] => {
        if (!profile?.plan?.features) return [];
        return profile.plan.features.map(f => f.name);
    };

    // Check if user has any of the given features
    const hasAnyFeature = (featureNames: string[]): boolean => {
        return featureNames.some(name => hasFeature(name));
    };

    // Check if user has all of the given features
    const hasAllFeatures = (featureNames: string[]): boolean => {
        return featureNames.every(name => hasFeature(name));
    };

    return {
        profile,
        loading,
        hasFeature,
        canAccessRoute,
        getAvailableFeatures,
        hasAnyFeature,
        hasAllFeatures,
        planName: profile?.plan?.name || 'Free',
        planId: profile?.plan?.id,
    };
}

// Hook to protect routes
export function useProtectedRoute(requiredFeature?: string) {
    const router = useRouter();
    const { hasFeature, loading } = useFeatureAccess();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (requiredFeature) {
            const allowed = hasFeature(requiredFeature);
            setIsAllowed(allowed);

            if (!allowed) {
                router.push('/subscription?upgrade=true');
            }
        } else {
            setIsAllowed(true);
        }
    }, [loading, requiredFeature, hasFeature, router]);

    return { isAllowed, loading };
}
