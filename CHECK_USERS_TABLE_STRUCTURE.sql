-- Check the users table structure to see all required fields
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check if there are any existing users to see the structure
SELECT 
    'Existing Users Sample' as info,
    email,
    full_name,
    role,
    mosque_id,
    auth_user_id
FROM users 
LIMIT 3;
