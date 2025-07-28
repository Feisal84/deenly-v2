-- Step-by-Step Admin User Creation Guide
-- Follow these steps EXACTLY to create your admin user

-- STEP 1: First, run the ADD_MISSING_TABLES.sql script (which you already did)

-- STEP 2: Create a user in Supabase Auth Dashboard
-- Go to: Authentication → Users → Add User
-- Email: your-email@example.com
-- Password: your-secure-password
-- Click "Create User"
-- COPY THE USER ID from the users list (it looks like: 12345678-1234-1234-1234-123456789abc)

-- STEP 3: Get your mosque ID (run this first to see available mosques):
SELECT id, name, handle FROM mosques ORDER BY name;

-- STEP 4: Create your admin user record (REPLACE THE VALUES BELOW):
-- Replace 'PASTE-AUTH-USER-ID-HERE' with the User ID from Step 2
-- Replace 'your-email@example.com' with your actual email

/*
INSERT INTO users (auth_user_id, email, full_name, role, mosque_id, created_at)
VALUES (
  'PASTE-AUTH-USER-ID-HERE',
  'your-email@example.com', 
  'Admin User',
  'Admin',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld' LIMIT 1),
  NOW()
);
*/

-- EXAMPLE (DO NOT USE THESE VALUES - THEY ARE FAKE):
-- INSERT INTO users (auth_user_id, email, full_name, role, mosque_id, created_at)
-- VALUES (
--   '12345678-1234-1234-1234-123456789abc',
--   'admin@bilal-moschee.de', 
--   'Admin User',
--   'Admin',
--   (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld' LIMIT 1),
--   NOW()
-- );

-- STEP 5: Verify your user was created:
SELECT 
  u.full_name,
  u.email,
  u.role,
  m.name as mosque_name,
  u.auth_user_id
FROM users u
LEFT JOIN mosques m ON u.mosque_id = m.id;

-- If you see your user in the results, you're ready to test login!
