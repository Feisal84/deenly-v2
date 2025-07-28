-- Alternative fix - use specific mosque UUID
-- First run this to see available mosques:

SELECT 'Available Mosques' as info, id, name, handle FROM mosques ORDER BY name;

-- Then use this to create your user with a specific mosque UUID:
-- Replace the mosque_id UUID below with the correct one from the query above

INSERT INTO users (email, role, mosque_id, auth_user_id, created_at, updated_at)
VALUES (
    'kingfaisal840@gmail.com',
    'Imam',
    'your-mosque-uuid-here',  -- Replace with actual UUID from mosques table
    '3aae3e17-2c8c-48b1-a305-32bbafbf548a',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    mosque_id = EXCLUDED.mosque_id,
    auth_user_id = EXCLUDED.auth_user_id,
    updated_at = NOW();

-- Verify
SELECT 
    u.email,
    u.role, 
    u.mosque_id,
    m.name as mosque_name
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id
WHERE u.email = 'kingfaisal840@gmail.com';
