# Authentication Troubleshooting Guide

## Issue: "Email not recognized after entering OTP code"

### Possible Causes and Solutions:

### 1. **User doesn't exist in public.users table**
Even if the email exists in Supabase Auth, the user might not be properly created in the public.users table.

**Debug Steps:**
1. Run `DEBUG_AUTH_ISSUES.sql` in Supabase SQL Editor
2. Run `CHECK_SPECIFIC_USER.sql` with your email address
3. Look for "MISSING CONNECTIONS" in the results

**Solution:** If user is missing from public.users table, create the user:
```sql
-- Replace with actual values
INSERT INTO users (email, role, mosque_id, auth_user_id, created_at, updated_at)
VALUES (
    'your-email@example.com',
    'Imam',  -- or 'Admin'
    1,  -- Replace with correct mosque_id
    'auth-user-id-from-auth.users-table',
    NOW(),
    NOW()
);
```

### 2. **Wrong role assignment**
User exists but doesn't have 'Imam' or 'Admin' role.

**Debug:** Check the users table for role field
**Solution:** Update user role:
```sql
UPDATE users 
SET role = 'Imam'  -- or 'Admin'
WHERE email = 'your-email@example.com';
```

### 3. **OTP verification failing**
The OTP code itself is not being accepted by Supabase.

**Debug Steps:**
1. Open browser console (F12) during login
2. Look for console messages starting with "Starting OTP verification"
3. Check for any error messages

**Common Issues:**
- OTP code expired (10 minutes limit)
- Wrong email case sensitivity
- Copy-paste issues with the code

### 4. **Database connection issues**
The connection between auth.users and public.users is broken.

**Debug:** Look for mismatched auth_user_id values
**Solution:** Fix the auth_user_id connection:
```sql
UPDATE users 
SET auth_user_id = (
    SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
WHERE email = 'your-email@example.com';
```

### 5. **Email case sensitivity**
Supabase auth might store emails differently than the public.users table.

**Debug:** Compare email cases in both tables
**Solution:** Normalize email cases:
```sql
UPDATE users 
SET email = LOWER(email);
```

## Testing Process:

1. **Enable Debug Mode:**
   - Open browser console (F12)
   - Try to log in
   - Watch console messages for detailed error information

2. **Step-by-step verification:**
   - Enter email → Check console for "Starting authentication"
   - Enter OTP → Check console for "OTP verification response"
   - Look for "User role query result" message

3. **Database verification:**
   - Run the provided SQL scripts in Supabase SQL Editor
   - Verify user exists in both auth.users and public.users
   - Check role assignment

## Quick Fixes:

### For missing user in public.users:
```sql
-- Get the auth_user_id first
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then create the public user record
INSERT INTO users (email, role, mosque_id, auth_user_id, created_at, updated_at)
VALUES (
    'your-email@example.com',
    'Imam',
    1,  -- Replace with correct mosque_id
    'the-auth-user-id-from-above',
    NOW(),
    NOW()
);
```

### For role issues:
```sql
UPDATE users 
SET role = 'Imam'  -- Change to 'Admin' if needed
WHERE email = 'your-email@example.com';
```

## Prevention:

1. Always create users in both auth.users and public.users tables
2. Use the proper user creation flow through the application
3. Verify role assignments after user creation
4. Test authentication flow after any database changes

## Contact Developer:

If none of these solutions work, provide:
1. Screenshot of browser console during login attempt
2. Results from running `DEBUG_AUTH_ISSUES.sql`
3. Results from running `CHECK_SPECIFIC_USER.sql` with your email
4. The exact error message you see on screen
