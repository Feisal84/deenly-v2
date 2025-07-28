-- Database Update Verification Script
-- Run this first to check your current database state

-- Step 1: Check if you have the 4 mosques
SELECT 
  COUNT(*) as total_mosques,
  STRING_AGG(name, ', ' ORDER BY name) as mosque_names
FROM mosques;

-- Step 2: List all mosques with their handles
SELECT 
  name,
  handle,
  city,
  address
FROM mosques 
ORDER BY name;

-- Step 3: Check if users table exists and has any imams
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'Imam' THEN 1 END) as imam_count,
  COUNT(CASE WHEN role = 'Admin' THEN 1 END) as admin_count
FROM users;

-- Step 4: List existing users (if any)
SELECT 
  name,
  email,
  role,
  mosque_id
FROM users
ORDER BY role, name;
