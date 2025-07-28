# 🔐 Authentication Fix Guide

## 🚨 **Problem Identified**

Your app is experiencing an authentication method mismatch:

- **Login Form**: Expects email + password
- **Supabase Config**: Set to email OTP verification
- **Result**: OTP codes being sent instead of direct password login

## � **Can't Find the Settings? Try This:**

### **Dashboard Search Method:**

1. **Use the search bar** in Supabase dashboard
2. **Search for:** "email confirmation" or "auth settings"
3. **Or search:** "email" and look through results

### **Alternative: Check via SQL**

If you can't find the UI setting, you can check your current config:

1. **Go to SQL Editor** in Supabase
2. **Run this query:**

```sql
SELECT * FROM auth.config;
```

### **Quick Test Method:**

1. **Try creating a test user** with a simple email/password
2. **If it sends OTP** → Email confirmation is ENABLED (bad)
3. **If it logs in directly** → Email confirmation is DISABLED (good)

### **Contact Method:**

- **Take a screenshot** of your Authentication section tabs
- **Share what tabs/options you see** and I can guide you to the exact setting

## 🎯 **What We're Trying to Achieve:**

**Current Behavior:** Email → OTP → Login (WRONG)  
**Desired Behavior:** Email + Password → Direct Login (CORRECT)

### **Step 1: Navigate to Supabase Auth Settings**

**📍 Where to Find Auth Settings (Multiple Paths):**

**Option A - Sidebar Navigation:**

1. **Go to Supabase Dashboard** (https://supabase.com/dashboard)
2. **Select your project**
3. **Left Sidebar** → **Authentication**
4. **Look for tabs:** `Users`, `Policies`, `Settings`, `Providers`
5. **Click on "Settings" tab**

**Option B - If you see different layout:**

1. **Authentication** → **Configuration**
2. **Or Authentication** → **Auth Settings**
3. **Or Settings** → **Authentication**

**Option C - Alternative path:**

1. **Project Settings** (gear icon)
2. **Authentication** section

**🔍 What you're looking for:**

- A section with **"Enable email confirmations"** checkbox
- **Site URL** and **Redirect URLs** fields
- **Email Templates** or **Auth Providers** options

### **Step 2: Find the Email Confirmation Setting**

**🎯 Look for one of these sections:**

**A) "Email" or "Email Settings":**

```
☐ Confirm email (UNCHECK THIS)
☐ Enable email confirmations (UNCHECK THIS)
☐ Double confirm email changes
```

**B) "Auth" or "Authentication":**

```
☐ Enable email confirmations (UNCHECK THIS)
☐ Enable phone confirmations (can stay checked)
```

**C) "User Management":**

```
☐ Email confirmation required (UNCHECK THIS)
```

**🚨 Critical Setting:**
Whatever the exact wording, **DISABLE/UNCHECK** any setting that requires email confirmation for new users or login.

### **Step 3: Update URLs (if found)**

**Site URL:** `http://localhost:3000`
**Redirect URLs:**

- `http://localhost:3000/**`
- `http://localhost:3000/auth/callback`

### **Step 3: Recreate Your Test User (If Needed)**

If the above doesn't work, recreate your auth user:

1. **Delete existing auth user** (Authentication → Users)
2. **Create new user with password:**
   ```
   Email: kingfaisal840@gmail.com
   Password: YourSecurePassword123!
   ☑ Auto Confirm User (CHECK THIS BOX)
   ```

### **Step 4: Alternative - Update Login to Support OTP**

If you prefer to keep OTP authentication, update the login component:

```tsx
// Add to your login page
const [step, setStep] = useState<"email" | "otp">("email");
const [otpCode, setOtpCode] = useState("");

const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    setError(error.message);
  } else {
    setStep("otp");
    setError(null);
  }
  setLoading(false);
};

const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otpCode,
    type: "email",
  });

  if (error) {
    setError("Invalid OTP code");
  } else {
    // Proceed with role checking...
  }
  setLoading(false);
};
```

## 🎯 **Recommended Solution**

**I recommend Option 1 (disable email confirmation)** because:

- ✅ Faster login for imams
- ✅ No email dependency
- ✅ More reliable for admin users
- ✅ Your current login form works without changes

## 🔧 **Quick Test Steps**

After making the changes:

1. **Clear your browser cache**
2. **Try logging in with:**
   ```
   Email: kingfaisal840@gmail.com
   Password: YourSecurePassword123!
   ```
3. **Should go directly to dashboard** (no OTP needed)

## 🚨 **Still Getting OTP Prompts?**

### **Check Your Supabase Project Settings:**

1. **Authentication** → **Settings** → **Auth**
2. **Look for "Enable email confirmations"**
3. **UNCHECK this option**
4. **Save changes**
5. **Wait 2-3 minutes for settings to apply**

### **Alternative Check - RLS Policies:**

Your auth might be working, but RLS policies blocking user lookup:

```sql
-- Run this in Supabase SQL Editor to check:
SELECT
  auth.uid() as current_auth_user,
  u.name,
  u.email,
  u.role
FROM users u
WHERE u.auth_user_id = auth.uid();
```

## 📱 **Mobile Specific Issues**

On mobile devices, also check:

- **Clear browser cache/data**
- **Try incognito/private mode**
- **Check if cookies are enabled**
- **Try different browser app**

## 🔄 **If All Else Fails - Complete Reset**

1. **Delete the auth user** in Supabase
2. **Delete the user record** from your users table
3. **Recreate both** with "Auto Confirm User" checked
4. **Test on desktop first**, then mobile

---

**Most likely fix: Disable email confirmations in Supabase Auth Settings!** 🎯
