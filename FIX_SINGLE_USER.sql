-- Quick fix for a specific user
-- Use this if you know the exact email that's having login issues

-- Step 1: Check which mosques are available
SELECT 'Step 1: Available Mosques' as step, id, name, handle FROM mosques ORDER BY id;

-- Step 2: Get the auth_user_id for your email
-- REPLACE 'your-email@example.com' with your actual email
SELECT 
    'Step 2: Your Auth User ID' as step,
    id as auth_user_id,
    email,
    email_confirmed_at
FROM auth.users 
WHERE email = 'kingfaisal840@gmail.com';  -- Replace with your email

-- Step 3: Create the user record in public.users
-- REPLACE the values below with your actual information
INSERT INTO users (email, role, mosque_id, auth_user_id, created_at, updated_at)
VALUES (
    'kingfaisal840@gmail.com',           -- Your email
    'Imam',                              -- Your role: 'Imam', 'Admin', or 'User'
    1,                                   -- Mosque ID (see step 1)
    '3aae3e17-2c8c-48b1-a305-32bbafbf548a',  -- Auth user ID from step 2
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    mosque_id = EXCLUDED.mosque_id,
    auth_user_id = EXCLUDED.auth_user_id,
    updated_at = NOW();

-- Step 4: Verify the user was created/updated
SELECT 
    'Step 4: Verification' as step,
    u.email,
    u.role,
    u.mosque_id,
    u.auth_user_id,
    m.name as mosque_name
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
WHERE u.email = 'kingfaisal840@gmail.com';  -- Replace with your email

-- Test query: This should now return a result
SELECT 
    'Final Test: User Role Query' as step,
    role, 
    mosque_id, 
    mosques.name as mosque_name,
    mosques.handle as mosque_handle
FROM users
LEFT JOIN mosques ON users.mosque_id = mosques.id
WHERE auth_user_id = '3aae3e17-2c8c-48b1-a305-32bbafbf548a';  -- Replace with auth_user_id from step 2
