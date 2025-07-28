-- Fix missing connections: Add all auth users to public.users table
-- This script will create public.users records for all users who exist in auth.users but not in public.users

-- First, let's see which mosques are available to assign users to
SELECT 
    'Available Mosques' as info,
    id,
    name,
    handle
FROM mosques
ORDER BY id;

-- Create users for all missing connections
-- We'll assign them all to mosque_id = 1 initially and role = 'User'
-- You can update specific users to 'Imam' or 'Admin' later

INSERT INTO users (email, role, mosque_id, auth_user_id, created_at, updated_at)
SELECT 
    au.email,
    'User' as role,  -- Default role, change to 'Imam' or 'Admin' as needed
    1 as mosque_id,  -- Default to first mosque, change as needed
    au.id as auth_user_id,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN users pu ON au.id = pu.auth_user_id
WHERE pu.auth_user_id IS NULL;

-- Verify the users were created
SELECT 
    'Verification: Newly Created Users' as info,
    u.email,
    u.role,
    u.mosque_id,
    m.name as mosque_name,
    u.auth_user_id
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
WHERE u.created_at >= NOW() - INTERVAL '1 minute'
ORDER BY u.created_at DESC;

-- Update specific users to Imam or Admin role if needed
-- Uncomment and modify these lines for specific users:

-- UPDATE users SET role = 'Imam', mosque_id = 1 WHERE email = 'kingfaisal840@gmail.com';
-- UPDATE users SET role = 'Admin', mosque_id = 1 WHERE email = 'ahmad@el-ali.de';
-- UPDATE users SET role = 'Imam', mosque_id = 2 WHERE email = 'info@tayabk.de';
-- Add more UPDATE statements as needed...

-- Final verification - check if there are any remaining missing connections
SELECT 
    'Final Check: Remaining Missing Connections' as info,
    COUNT(*) as remaining_missing_connections
FROM auth.users au
LEFT JOIN users pu ON au.id = pu.auth_user_id
WHERE pu.auth_user_id IS NULL;
