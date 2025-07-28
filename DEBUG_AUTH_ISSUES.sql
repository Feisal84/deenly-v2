-- Check user authentication issues
-- This script helps debug email recognition problems after OTP verification

-- 1. Check if users exist in auth.users table
SELECT 
    'AUTH USERS' as table_name,
    email,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check if users exist in public.users table
SELECT 
    'PUBLIC USERS' as table_name,
    u.id,
    u.email,
    u.role,
    u.mosque_id,
    u.auth_user_id,
    m.name as mosque_name,
    m.handle as mosque_handle
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
ORDER BY u.created_at DESC
LIMIT 10;

-- 3. Check for missing connections between auth.users and public.users
SELECT 
    'MISSING CONNECTIONS' as issue_type,
    au.email as auth_email,
    au.id as auth_user_id,
    pu.email as public_email,
    pu.auth_user_id as public_auth_user_id
FROM auth.users au
LEFT JOIN users pu ON au.id = pu.auth_user_id
WHERE pu.auth_user_id IS NULL
ORDER BY au.created_at DESC;

-- 4. Check for duplicate emails
SELECT 
    'DUPLICATE EMAILS' as issue_type,
    email,
    COUNT(*) as count
FROM auth.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 5. Check recent OTP verification attempts (if logs available)
-- This might not work depending on Supabase logging settings
-- SELECT * FROM auth.audit_log_entries 
-- WHERE payload->>'action' = 'token_verification' 
-- ORDER BY created_at DESC 
-- LIMIT 10;
