-- Create missing user in public.users table
-- Use this if your email exists in auth.users but not in public.users

-- Step 1: Check if user exists in auth.users
SELECT 
    'Step 1: Checking auth.users' as step,
    id as auth_user_id, 
    email, 
    email_confirmed_at
FROM auth.users 
WHERE email = 'your-email@example.com';  -- Replace with your email

-- Step 2: Check available mosques to get the correct mosque_id
SELECT 
    'Step 2: Available mosques' as step,
    id as mosque_id,
    name,
    handle
FROM mosques
ORDER BY name;

-- Step 3: Insert user into public.users table
-- IMPORTANT: Replace the values below with actual data from steps 1 and 2
INSERT INTO users (
    email, 
    role, 
    mosque_id, 
    auth_user_id, 
    created_at, 
    updated_at
) VALUES (
    'your-email@example.com',           -- Your email
    'Imam',                             -- Role: 'Imam' or 'Admin'
    1,                                  -- mosque_id from step 2
    'your-auth-user-id-from-step-1',    -- auth_user_id from step 1
    NOW(),
    NOW()
);

-- Step 4: Verify the user was created successfully
SELECT 
    'Step 4: Verification' as step,
    u.email,
    u.role,
    u.mosque_id,
    u.auth_user_id,
    m.name as mosque_name
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
WHERE u.email = 'your-email@example.com';  -- Replace with your email
