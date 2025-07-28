-- Quick fix for a specific user
-- Use this if you know the exact email that's having login issues

-- Step 1: Check which mosques are available
SELECT 'Step 1: Available Mosques' as step, id, name, handle FROM mosques ORDER BY name;

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
-- IMPORTANT: Replace the mosque_id UUID below with the correct one from Step 1
-- The mosque_id must be a valid UUID from the mosques table
INSERT INTO users (email, full_name, role, mosque_id, auth_user_id, created_at, updated_at)
VALUES (
    'kingfaisal840@gmail.com',           -- Your email
    'King Faisal',                       -- Your full name (required field)
    'Imam',                              -- Your role: 'Imam', 'Admin', or 'User'
    (SELECT id FROM mosques LIMIT 1),    -- This gets the first mosque UUID automatically
    '3aae3e17-2c8c-48b1-a305-32bbafbf548a',  -- Auth user ID from step 2
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    mosque_id = EXCLUDED.mosque_id,
    auth_user_id = EXCLUDED.auth_user_id,
    updated_at = NOW();

-- Step 4: Verify the user was created/updated
SELECT 
    'Step 4: Verification' as step,
    u.email,
    u.full_name,
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
    u.role, 
    u.mosque_id, 
    m.name as mosque_name,
    m.handle as mosque_handle
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
WHERE u.auth_user_id = '3aae3e17-2c8c-48b1-a305-32bbafbf548a';  -- Replace with auth_user_id from step 2
