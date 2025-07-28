-- Create specific users with proper roles
-- Run this after FIX_MISSING_USERS.sql to assign proper roles to key users

-- First, check available mosques again
SELECT 
    'Available Mosques' as step,
    id,
    name,
    handle,
    city
FROM mosques
ORDER BY id;

-- Update specific users with Imam or Admin roles
-- Replace these with the actual emails and mosque assignments you need

-- Example: Update key users with proper roles
UPDATE users 
SET role = 'Imam', mosque_id = 1 
WHERE email = 'kingfaisal840@gmail.com';

UPDATE users 
SET role = 'Admin', mosque_id = 1 
WHERE email = 'ahmad@el-ali.de';

UPDATE users 
SET role = 'Imam', mosque_id = 1 
WHERE email = 'info@tayabk.de';

-- Add more users as needed:
-- UPDATE users SET role = 'Imam', mosque_id = 2 WHERE email = 'another-imam@example.com';

-- Verify the updates
SELECT 
    'Updated Users with Admin/Imam Roles' as info,
    u.email,
    u.role,
    u.mosque_id,
    m.name as mosque_name,
    m.handle
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
WHERE u.role IN ('Imam', 'Admin')
ORDER BY u.role, u.email;

-- Show all users grouped by role
SELECT 
    'User Count by Role' as info,
    role,
    COUNT(*) as count
FROM users
GROUP BY role
ORDER BY 
    CASE role 
        WHEN 'Admin' THEN 1 
        WHEN 'Imam' THEN 2 
        WHEN 'User' THEN 3 
        ELSE 4 
    END;
