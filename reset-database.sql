-- =====================================================
-- SUPABASE DATABASE RESET SCRIPT
-- =====================================================
-- This script will remove all tables and data that were created
-- during the debugging session, returning your database to its
-- original empty state.
--
-- IMPORTANT: This will permanently delete all data!
-- Only run this if you want to completely reset your database.
-- =====================================================

-- Drop all tables that may have been created during debugging
-- (Run each DROP statement individually in the Supabase SQL Editor)

-- 1. Drop the lectures table (if exists)
DROP TABLE IF EXISTS public.lectures CASCADE;

-- 2. Drop the mosques table (if exists)  
DROP TABLE IF EXISTS public.mosques CASCADE;

-- 3. Drop any other tables that might have been created
DROP TABLE IF EXISTS public.khutbas CASCADE;
DROP TABLE IF EXISTS public.imams CASCADE;
DROP TABLE IF EXISTS public.prayer_times CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- 4. Drop any custom types that might have been created
DROP TYPE IF EXISTS public.lecture_status CASCADE;
DROP TYPE IF EXISTS public.mosque_service CASCADE;

-- 5. Drop any custom functions that might have been created
DROP FUNCTION IF EXISTS public.incr_lecture_viewer(uuid) CASCADE;

-- 6. Reset any sequences (if they exist)
DROP SEQUENCE IF EXISTS public.lectures_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.mosques_id_seq CASCADE;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- After running the above commands, verify the database is clean:

-- Check for remaining tables (should return empty or only system tables)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check for remaining functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check for remaining types
SELECT typname 
FROM pg_type 
WHERE typnamespace = (
    SELECT oid FROM pg_namespace WHERE nspname = 'public'
) 
AND typtype = 'e';

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Your Supabase project will remain active
-- 2. Your API keys and project URL will remain the same
-- 3. Only the database schema and data will be reset
-- 4. You can start fresh with a clean database
-- 5. The auth schema and other Supabase system tables are preserved
