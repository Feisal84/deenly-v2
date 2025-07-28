# Mobile Authentication & Mosque Selection Fix

## Issue Description

On both iOS and Android devices, users experience a circular navigation issue:

1. User picks a mosque
2. App returns to settings page
3. App goes back to "pick a mosque" page
4. Loop continues indefinitely

## Root Causes

### 1. Mobile Browser Session Handling

Mobile browsers (especially iOS Safari and Android Chrome) handle authentication cookies and sessions differently than desktop browsers.

### 2. Redirect Chain Issues

The current authentication flow may be creating redirect loops on mobile due to:

- Supabase auth state not properly persisting
- Middleware redirect logic conflicting with mobile browser behavior
- Missing mobile-specific session persistence

### 3. Missing Mobile User Flow

The app may be missing a proper user onboarding flow for regular users (non-Imam/Admin) who just want to select a mosque and browse content.

## Solutions

### Immediate Fix 1: Update Authentication Flow for Mobile

```typescript
// components/flexible-login.tsx - Add mobile-specific handling
const checkUserRole = async (authUserId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, mosque_id, mosques(name, handle)")
      .eq("auth_user_id", authUserId)
      .single();

    if (userError || !userData) {
      // For mobile users without accounts, redirect to mosque selection
      if (isMobileDevice()) {
        const mosqueSelectionUrl = `/${locale}/moscheen`;
        window.location.href = mosqueSelectionUrl;
        return;
      }
      setError("Benutzer nicht gefunden. Kontaktieren Sie den Administrator.");
      return;
    }

    if (userData.role === "Imam" || userData.role === "Admin") {
      // Admin/Imam redirect to dashboard
      const dashboardUrl = `/${locale}/dashboard`;

      // Mobile-specific redirect with session persistence
      if (isMobileDevice()) {
        // Force session persistence on mobile
        await supabase.auth.getSession();
        // Use replace instead of push for mobile
        window.location.replace(dashboardUrl);
      } else {
        router.push(dashboardUrl);
      }
    } else {
      // Regular users go to mosque selection
      const mosqueSelectionUrl = `/${locale}/moscheen`;
      window.location.href = mosqueSelectionUrl;
    }
  } catch (err) {
    console.error("Role check error:", err);
    setError("Fehler beim Überprüfen der Benutzerrolle");
  }
};

// Add mobile detection helper
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
```

### Immediate Fix 2: Create Guest User Flow

Most users don't need accounts - they just want to browse mosque content. Create a guest flow:

```typescript
// components/mosque-selector.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function MosqueSelector() {
  const [selectedMosque, setSelectedMosque] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  // Store selected mosque in localStorage for mobile persistence
  const handleMosqueSelect = (mosqueHandle: string) => {
    // Store selection for mobile browsers
    localStorage.setItem('selectedMosque', mosqueHandle);
    sessionStorage.setItem('selectedMosque', mosqueHandle);

    // Redirect to mosque page
    const mosqueUrl = `/${locale}/moscheen/${mosqueHandle}`;

    // Use replace for mobile to prevent back button issues
    if (isMobileDevice()) {
      window.location.replace(mosqueUrl);
    } else {
      router.push(mosqueUrl);
    }
  };

  return (
    <div className="mosque-selector">
      {/* Mosque selection UI */}
    </div>
  );
}
```

### Immediate Fix 3: Update Middleware for Mobile

```typescript
// middleware.ts - Add mobile-specific handling
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Skip intl middleware for paths that don't need localization
  if (
    pathname.includes("/_next") ||
    pathname.includes("/api") ||
    pathname.includes("/images") ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return response;
  }

  // Check if user is on mobile and has selected a mosque
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

  if (isMobile && pathname === `/${getLocale(request)}/moscheen`) {
    // Check if user already selected a mosque (stored in session/localStorage)
    const selectedMosque = request.cookies.get("selectedMosque")?.value;
    if (selectedMosque) {
      // Redirect to selected mosque instead of selection page
      return NextResponse.redirect(
        new URL(
          `/${getLocale(request)}/moscheen/${selectedMosque}`,
          request.url
        )
      );
    }
  }

  return intlMiddleware(request);
}
```

## Testing Steps

1. **Clear browser data** on mobile device
2. **Navigate to app** on mobile
3. **Select a mosque** - should redirect to mosque page, not back to selection
4. **Test back button** - should not create loops
5. **Test app switching** - returning to app should remember mosque selection

## Additional Mobile Optimizations

1. **Add PWA capabilities** for better mobile experience
2. **Implement offline storage** for mosque selection
3. **Add mobile-specific UI adjustments**
4. **Test on both iOS Safari and Android Chrome**

## Quick Test Commands

```bash
# Test on mobile simulator
npm run dev -- -H 0.0.0.0

# Then visit from mobile browser:
# http://[your-ip]:3000
```

The key insight is that most users are **guests** who just want to browse mosque content, not admins who need authentication. The app should support this use case without requiring login.
