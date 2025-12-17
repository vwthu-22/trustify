'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Crown } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

interface FeatureGateProps {
    feature: string;
    children: ReactNode;
    fallback?: ReactNode;
    showUpgrade?: boolean;
}

export function FeatureGate({ feature, children, fallback, showUpgrade = true }: FeatureGateProps) {
    const router = useRouter();
    const { hasFeature, loading, planName } = useFeatureAccess();

    if (loading) {
        return (
            <div className="animate-pulse bg-gray-100 rounded-lg p-8">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    const allowed = hasFeature(feature);

    if (allowed) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (showUpgrade) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature} is locked
                </h3>
                <p className="text-gray-600 mb-6">
                    Upgrade your plan to unlock this feature
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <span>Current plan:</span>
                    <span className="px-3 py-1 bg-gray-200 rounded-full font-semibold">
                        {planName}
                    </span>
                </div>
                <button
                    onClick={() => router.push('/subscription')}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                    <Crown className="w-5 h-5" />
                    Upgrade Now
                </button>
            </div>
        );
    }

    return null;
}

// Component for inline feature badges
export function FeatureBadge({ feature }: { feature: string }) {
    const { hasFeature } = useFeatureAccess();
    const allowed = hasFeature(feature);

    if (allowed) return null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            <Lock className="w-3 h-3" />
            Pro
        </span>
    );
}

// Component for disabled buttons
export function FeatureButton({
    feature,
    children,
    onClick,
    className = '',
    ...props
}: {
    feature: string;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    [key: string]: any;
}) {
    const router = useRouter();
    const { hasFeature } = useFeatureAccess();
    const allowed = hasFeature(feature);

    if (!allowed) {
        return (
            <button
                onClick={() => router.push('/subscription')}
                className={`relative ${className} opacity-75`}
                {...props}
            >
                <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-600" />
                </div>
                {children}
            </button>
        );
    }

    return (
        <button onClick={onClick} className={className} {...props}>
            {children}
        </button>
    );
}
