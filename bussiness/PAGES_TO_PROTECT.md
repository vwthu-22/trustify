# 🔒 Pages Need Protection

Add `useProtectedRoute` to these pages:

## 1. `/analytics/sentiment/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function SentimentPage() {
    const { isAllowed, loading } = useProtectedRoute('Advanced Analytics');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 2. `/analytics/branches/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function BranchesPage() {
    const { isAllowed, loading } = useProtectedRoute('Advanced Analytics');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 3. `/integrations/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function IntegrationsPage() {
    const { isAllowed, loading } = useProtectedRoute('Integrations');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 4. `/invitations/send/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function SendInvitationsPage() {
    const { isAllowed, loading } = useProtectedRoute('Team Invitations');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 5. `/invitations/campaigns/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function CampaignsPage() {
    const { isAllowed, loading } = useProtectedRoute('Team Invitations');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 6. `/invitations/templates/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function TemplatesPage() {
    const { isAllowed, loading } = useProtectedRoute('Team Invitations');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 7. `/manage/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function ManageReviewsPage() {
    const { isAllowed, loading } = useProtectedRoute('Review Management');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}
```

## 8. `/settings/page.tsx`
```tsx
import { useProtectedRoute } from '@/hooks/useFeatureAccess';

export default function SettingsPage() {
    const { isAllowed, loading } = useProtectedRoute('Advanced Settings');
    
    if (loading) return <LoadingSpinner />;
    if (!isAllowed) return null;
    
    // ... rest of component
}

```

---

## Loading Spinner Component

```tsx
function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
}
```

---

## Summary

| Page | Feature Required |
|------|------------------|
| `/analytics/*` | Advanced Analytics |
| `/integrations` | Integrations |
| `/invitations/*` | Team Invitations |
| `/manage` | Review Management |
| `/settings` | Advanced Settings |

**Total**: 9 pages need protection ✅
