-- DATABASE ADMIN CHECKLIST
-- Run these scripts in order through Supabase SQL Editor

-- ==============================================
-- STEP 1: VERIFY DATABASE SCHEMA
-- ==============================================
-- Run: database-schema-complete.sql
-- Purpose: Ensure all tables, indexes, and RLS policies exist
-- Status: ✅ Ready

-- ==============================================
-- STEP 2: CHECK CURRENT DATA STATE  
-- ==============================================
-- Run these diagnostic scripts first:

-- Check if mosques exist
SELECT COUNT(*) as mosque_count, 
       string_agg(name, ', ') as mosque_names 
FROM mosques;

-- Check if users exist and their roles
SELECT COUNT(*) as user_count,
       role,
       COUNT(*) as count_per_role
FROM users 
GROUP BY role;

-- Check enum values (should only be Admin, Imam, Member, Visitor)
SELECT enumlabel as valid_roles 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');

-- ==============================================
-- STEP 3: POPULATE ESSENTIAL DATA
-- ==============================================

-- Option A: Create sample mosques and data
-- Run: sample-data.sql 
-- OR
-- Option B: Create specific 4 mosques only
-- Run: update-4-mosques-safe.sql

-- ==============================================
-- STEP 4: CREATE ADMIN USERS
-- ==============================================

-- Run: ASSIGN_USER_ROLES.sql
-- Purpose: Give admin/imam access to specific users
-- Important: Only use 'Admin' or 'Imam' roles (not 'User')

-- ==============================================
-- STEP 5: ADD SAMPLE CONTENT
-- ==============================================

-- Run: INSERT_SAMPLE_KHUTBAH_CLEAN.sql
-- Purpose: Create sample khutbahs for testing
-- Status: ✅ Fixed for enum compatibility

-- ==============================================
-- STEP 6: FIX ANY ISSUES
-- ==============================================

-- If users are missing: FIX_MISSING_USERS.sql
-- If images broken: ADD_MOSQUE_IMAGES.sql or FIX_MOSQUE_IMAGES_404.sql
-- If single user needs fixing: FIX_SINGLE_USER.sql

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Final check - run these to verify everything works:

-- 1. Check all mosques have basic data
SELECT id, name, city, hero_path, handle FROM mosques;

-- 2. Check users have proper roles
SELECT email, role, 
       (SELECT name FROM mosques WHERE id = users.mosque_id) as mosque_name
FROM users 
WHERE role IN ('Admin', 'Imam');

-- 3. Check sample lectures exist
SELECT title, 
       (SELECT name FROM mosques WHERE id = lectures.mosque_id) as mosque_name,
       status,
       created_at
FROM lectures 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Verify no enum errors
SELECT role, COUNT(*) FROM users GROUP BY role;
