-- Check the valid enum values for user_role
SELECT 
    'Valid user_role enum values:' as info,
    unnest(enum_range(NULL::user_role)) as valid_roles;

-- Also check what roles currently exist in the users table
SELECT 
    'Current roles in users table:' as info,
    role,
    COUNT(*) as count
FROM users
GROUP BY role
ORDER BY count DESC;
