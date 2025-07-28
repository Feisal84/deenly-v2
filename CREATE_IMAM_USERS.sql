-- Create Test Imam Users for the 4 Mosques
-- Run these commands in your Supabase SQL Editor

-- First, you need to create actual auth users in Supabase Auth
-- Go to Authentication > Users in your Supabase dashboard and manually create users:
-- 1. Email: imam.bilal@deenly.de, Password: TestPassword123!
-- 2. Email: imam.lage@deenly.de, Password: TestPassword123!
-- 3. Email: imam.baesweiler@deenly.de, Password: TestPassword123!
-- 4. Email: imam.spenge@deenly.de, Password: TestPassword123!

-- Then run this SQL to create the user records in your users table:

-- Get the mosque IDs first
SELECT id, name, handle FROM mosques ORDER BY name;

-- Insert imam users (replace the auth_user_id with actual UUIDs from Supabase Auth)
-- You'll need to get these UUIDs from the Authentication > Users section after creating the auth users

-- IMPORTANT: After creating the auth user for kingfaisal840@gmail.com in Supabase Auth,
-- replace 'YOUR_ACTUAL_AUTH_UUID_HERE' with the real UUID from Authentication > Users

INSERT INTO users (
  name, 
  email, 
  role, 
  mosque_id, 
  auth_user_id,
  preferred_language
) VALUES 
-- Bilal Moschee Imam (YOUR ACCOUNT)
(
  'Imam Feisal Ibrahim',
  'kingfaisal840@gmail.com',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  'YOUR_ACTUAL_AUTH_UUID_HERE', -- ⚠️ REPLACE THIS WITH YOUR REAL UUID FROM SUPABASE AUTH
  'de'
),
-- DITIB Moschee Lage Imam
(
  'Imam Muhammad Ali',
  'imam.lage@deenly.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'ditib-moschee-lage'),
  'YOUR_AUTH_USER_ID_HERE_2', -- Replace with actual UUID from Supabase Auth
  'de'
),
-- SoKuT Icmg Baesweiler Imam  
(
  'Imam Yusuf Omar',
  'imam.baesweiler@deenly.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'sokut-icmg-baesweiler'),
  'YOUR_AUTH_USER_ID_HERE_3', -- Replace with actual UUID from Supabase Auth
  'de'
),
-- Spenge Moschee Imam
(
  'Imam Ibrahim Khalil',
  'imam.spenge@deenly.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'spenge-moschee'),
  'YOUR_AUTH_USER_ID_HERE_4', -- Replace with actual UUID from Supabase Auth
  'de'
);

-- Verify the users were created correctly
SELECT 
  u.name,
  u.email,
  u.role,
  m.name as mosque_name,
  m.handle as mosque_handle
FROM users u
JOIN mosques m ON u.mosque_id = m.id
WHERE u.role = 'Imam'
ORDER BY u.name;
