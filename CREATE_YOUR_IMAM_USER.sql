-- Simple Imam User Creation (Run AFTER database schema and mosques are set up)
-- Replace 'YOUR_REAL_UUID_FROM_SUPABASE_AUTH' with the actual UUID from Authentication > Users

-- First, verify the mosque exists
SELECT id, name, handle FROM mosques WHERE handle = 'bilal-moschee-bielefeld';

-- Create your imam user (replace the UUID!)
INSERT INTO users (
  name, 
  email, 
  role, 
  mosque_id, 
  auth_user_id,
  preferred_language
) VALUES (
  'Imam Feisal Ibrahim',
  'kingfaisal840@gmail.com',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  '3aae3e17-2c8c-48b1-a305-32bbafbf548a', -- ⚠️ REPLACE THIS!
  'de'
);

-- Verify it worked
SELECT 
  u.name,
  u.email,
  u.role,
  m.name as mosque_name,
  m.handle as mosque_handle
FROM users u
JOIN mosques m ON u.mosque_id = m.id
WHERE u.email = 'kingfaisal840@gmail.com';
