# 🎯 Plan & Feature Implementation Guide

## 📋 Recommended Plans & Features

### Plan 1: FREE (0₫/month)
**Duration**: 30 days
**Target**: Trial users

**Features to create in Admin**:
1. Basic Review Collection
2. Email Notifications  
3. Basic Widgets (3 types)
4. Community Support
5. Trustify Branding

**Limits**:
- Max 50 reviews/month
- 3 widget types only
- Watermark on widgets

---

### Plan 2: PROFESSIONAL (299,000₫/month)
**Duration**: 30 days
**Target**: Growing businesses

**Features to create in Admin** (includes FREE +):
1. Unlimited Reviews
2. Advanced Analytics
3. Custom Widgets
4. Remove Branding
5. Integrations
6. Team Invitations
7. Review Management
8. Priority Email Support

**Unlocks**:
- `/analytics` page
- `/widgets` page
- `/integrations` page
- `/invitations` page
- `/manage` page

---

### Plan 3: ENTERPRISE (599,000₫/month)
**Duration**: 30 days
**Target**: Large enterprises

**Features to create in Admin** (includes PRO +):
1. White Label
2. Advanced Settings
3. API Access
4. Custom Domain
5. Dedicated Account Manager
6. 24/7 Priority Support
7. SLA Guarantee
8. Custom Integrations

**Unlocks**:
- `/settings` page
- API access
- Custom domain
- Premium support

---

## 🔧 How to Use Feature Gates

### 1. Protect entire pages

```tsx
'use client';

import { useProtectedRoute, FEATURES } from '@/hooks/useFeatureAccess';

export default function AnalyticsPage() {
    const { isAllowed, loading } = useProtectedRoute(FEATURES.ADVANCED_ANALYTICS);

    if (loading) return <div>Loading...</div>;
    if (!isAllowed) return null; // Will redirect to /subscription

    return (
        <div>
            {/* Your analytics content */}
        </div>
    );
}
```

### 2. Lock sections of a page

```tsx
import { FeatureGate, FEATURES } from '@/components/FeatureGate';

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
            
            {/* Always visible */}
            <BasicStats />
            
            {/* Only for Pro+ users */}
            <FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
                <AdvancedCharts />
            </FeatureGate>
        </div>
    );
}
```

### 3. Show upgrade prompt

```tsx
<FeatureGate 
    feature={FEATURES.CUSTOM_WIDGETS}
    showUpgrade={true}
>
    <WidgetBuilder />
</FeatureGate>
```

### 4. Disable buttons

```tsx
import { FeatureButton, FEATURES } from '@/components/FeatureGate';

<FeatureButton
    feature={FEATURES.TEAM_INVITATIONS}
    onClick={handleInvite}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
    Invite Team Member
</FeatureButton>
```

### 5. Show feature badges

```tsx
import { FeatureBadge, FEATURES } from '@/components/FeatureGate';

<button>
    Advanced Analytics
    <FeatureBadge feature={FEATURES.ADVANCED_ANALYTICS} />
</button>
```

---

## 📝 Steps to Implement

### Step 1: Create Plans in Admin
1. Go to Admin → Billing → Plans
2. Create 3 plans: FREE, PROFESSIONAL, ENTERPRISE
3. Set prices and durations

### Step 2: Create Features in Admin
1. Go to Admin → Billing → Features
2. Create all features listed above
3. Assign features to plans

### Step 3: Protect Routes
Add to each protected page:

```tsx
import { useProtectedRoute, FEATURES } from '@/hooks/useFeatureAccess';

const { isAllowed, loading } = useProtectedRoute(FEATURES.YOUR_FEATURE);
```

### Step 4: Test
1. Create a company with FREE plan
2. Try to access `/analytics` → Should redirect to /subscription
3. Upgrade to PRO
4. Try again → Should work

---

## 🎨 UI Examples

### Locked Page
```tsx
<FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
    <AnalyticsContent />
</FeatureGate>
```

Shows:
- Lock icon
- "Advanced Analytics is locked"
- Current plan badge
- "Upgrade Now" button

### Locked Button
```tsx
<FeatureButton feature={FEATURES.INTEGRATIONS}>
    Connect Integration
</FeatureButton>
```

Shows:
- Disabled button with lock overlay
- Clicks redirect to /subscription

---

## 🔐 Backend Requirements

Backend needs to:
1. Return company profile with plan and features
2. Endpoint: `GET /api/company/profile`
3. Response format:
```json
{
    "id": 1,
    "name": "Company Name",
    "plan": {
        "id": 2,
        "name": "Professional",
        "features": [
            { "id": 1, "name": "Advanced Analytics" },
            { "id": 2, "name": "Custom Widgets" }
        ]
    }
}
```

---

## 📊 Feature Matrix

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Basic Reviews | ✅ | ✅ | ✅ |
| Email Notifications | ✅ | ✅ | ✅ |
| Basic Widgets | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| Integrations | ❌ | ✅ | ✅ |
| Team Invitations | ❌ | ✅ | ✅ |
| Review Management | ❌ | ✅ | ✅ |
| White Label | ❌ | ❌ | ✅ |
| Advanced Settings | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Custom Domain | ❌ | ❌ | ✅ |

---

## 🚀 Quick Start

1. **Create plans and features in Admin**
2. **Import hooks in your pages**:
   ```tsx
   import { useProtectedRoute, FEATURES } from '@/hooks/useFeatureAccess';
   import { FeatureGate } from '@/components/FeatureGate';
   ```
3. **Protect your routes**
4. **Test with different plans**

Done! 🎉
