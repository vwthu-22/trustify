// Feature access control based on subscription plans
export type PlanType = 'Free' | 'Pro' | 'Premium';

export interface FeatureAccess {
    verification: boolean;
    aiAnalytics: boolean;
    integrations: boolean;
}

/**
 * Get feature access based on plan
 * Free: No premium features
 * Pro: Verification + AI Analytics
 * Premium: Verification + AI Analytics + Integrations
 */
export function getFeatureAccess(plan: PlanType | string): FeatureAccess {
    // Normalize plan name to handle case variations from backend
    const normalizedPlan = plan?.toString().toLowerCase();

    switch (normalizedPlan) {
        case 'premium':
            return {
                verification: true,
                aiAnalytics: true,
                integrations: true,
            };
        case 'pro':
            return {
                verification: true,
                aiAnalytics: true,
                integrations: false,
            };
        case 'free':
        default:
            return {
                verification: false,
                aiAnalytics: false,
                integrations: false,
            };
    }
}

/**
 * Check if a specific feature is accessible
 */
export function hasFeatureAccess(plan: PlanType | string, feature: keyof FeatureAccess): boolean {
    const access = getFeatureAccess(plan);
    return access[feature];
}

/**
 * Get required plan for a feature
 */
export function getRequiredPlan(feature: keyof FeatureAccess): PlanType {
    switch (feature) {
        case 'integrations':
            return 'Premium';
        case 'verification':
        case 'aiAnalytics':
            return 'Pro';
        default:
            return 'Free';
    }
}
