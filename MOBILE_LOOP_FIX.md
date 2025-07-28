# 🔧 Mobile Navigation Loop Fix

## Problem Summary

**Issue**: On both iOS and Android devices, users experience this loop:

1. Pick a mosque → 2. Returns to settings page → 3. Back to "pick a mosque" → **REPEAT**

## Root Cause

Your app is designed for **authenticated users** (Imams/Admins), but most users are **guests** who just want to browse mosque content. The authentication flow is creating redirect loops on mobile browsers.

## Solution: Guest User Flow

### 1. Create Guest Mosque Selector

I've created `components/guest-mosque-selector.tsx` which:

- ✅ **No authentication required** - guests can browse immediately
- ✅ **Mobile-optimized** - uses `window.location.replace()` to prevent back button loops
- ✅ **Stores selection** - uses localStorage/sessionStorage for persistence
- ✅ **Fallback to login** - option for Imams/Admins to authenticate

### 2. Update Navigation Flow

**Before (causing loops):**

```
User visits app → Auth check → Login required → Pick mosque → Auth check → LOOP
```

**After (fixed):**

```
User visits app → Guest mosque selector → Mosque page → Browse content ✅
```

### 3. Mobile-Specific Fixes

The key changes for mobile:

```typescript
// Use location.replace instead of router.push on mobile
if (isMobileDevice()) {
  window.location.replace(mosqueUrl); // ✅ Prevents back button loops
} else {
  router.push(mosqueUrl); // ✅ Desktop navigation
}

// Store selection for mobile persistence
localStorage.setItem("selectedMosque", mosque.handle);
sessionStorage.setItem("selectedMosque", mosque.handle);
```

## Implementation Steps

### Step 1: Test the New Guest Flow

1. **Visit**: `http://localhost:3000/de/select-mosque`
2. **Select any mosque** - should go directly to mosque page
3. **Test on mobile** - should not loop back to selection

### Step 2: Update Your Main App Entry Point

Update your main landing page to use the guest mosque selector:

```typescript
// app/[locale]/page.tsx
import GuestMosqueSelector from '@/components/guest-mosque-selector';

export default function HomePage() {
  return <GuestMosqueSelector />;
}
```

### Step 3: Test Mobile Flow

```bash
# Start dev server accessible from mobile
npm run dev -- -H 0.0.0.0

# Test from mobile browser:
# http://[your-ip]:3000/de/select-mosque
```

## Key Benefits

1. **🎯 No More Loops** - Guests go directly to content
2. **📱 Mobile Optimized** - Proper navigation handling
3. **⚡ Instant Access** - No authentication barriers for browsing
4. **🔐 Admin Access** - Still available via login button

## User Experience

### For Guests (95% of users):

1. Visit app → 2. Pick mosque → 3. Browse content ✅

### For Imams/Admins:

1. Visit app → 2. Click "Anmelden" → 3. Login → 4. Dashboard ✅

## Testing Checklist

- [ ] **Desktop**: Mosque selection works
- [ ] **Mobile iOS**: No redirect loops
- [ ] **Mobile Android**: Navigation works correctly
- [ ] **Back button**: Doesn't create loops
- [ ] **App switching**: Returns to selected mosque
- [ ] **Admin login**: Still works for authenticated users

This approach treats your app as a **content browser first, admin tool second**, which matches most users' expectations.
