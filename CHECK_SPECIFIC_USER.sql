-- Quick check for specific user email
-- Replace 'your-email@example.com' with the actual email you're trying to log in with

-- 1. Check if email exists in Supabase auth
SELECT 
    'CHECKING AUTH TABLE' as status,
    email,
    id as auth_user_id,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email = 'your-email@example.com';  -- Replace with your email

-- 2. Check if user exists in public users table
SELECT 
    'CHECKING PUBLIC USERS TABLE' as status,
    email,
    role,
    mosque_id,
    auth_user_id
FROM users 
WHERE email = 'your-email@example.com';  -- Replace with your email

-- 3. Check connection between auth and public tables
SELECT 
    'CHECKING AUTH-PUBLIC CONNECTION' as status,
    au.email as auth_email,
    au.id as auth_id,
    pu.email as public_email,
    pu.role,
    pu.mosque_id
FROM auth.users au
LEFT JOIN users pu ON au.id = pu.auth_user_id
WHERE au.email = 'your-email@example.com';  -- Replace with your email
