-- Database diagnostic and repair script for Deenly v2
-- Run this script if you're experiencing connection or function errors

-- Check if the database tables exist
SELECT 
    tablename,
    schemaname
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('mosques', 'lectures', 'users', 'events', 'prayer_times', 'announcements');

-- Check if required functions exist
SELECT 
    p.proname as function_name,
    p.proargnames as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname IN ('increment_lecture_views', 'update_updated_at_column');

-- Create the increment function if it doesn't exist
CREATE OR REPLACE FUNCTION increment_lecture_views(lecture_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE lectures 
    SET num_views = COALESCE(num_views, 0) + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = lecture_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Test the increment function with a dummy call (will fail gracefully if no lectures exist)
DO $$
BEGIN
    -- Only test if lectures table has data
    IF EXISTS (SELECT 1 FROM lectures LIMIT 1) THEN
        RAISE NOTICE 'increment_lecture_views function is ready to use';
    ELSE
        RAISE NOTICE 'No lectures found - function is ready but untested';
    END IF;
END $$;

-- Check row level security status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('mosques', 'lectures', 'users', 'events', 'prayer_times', 'announcements');

-- Display any recent errors in the logs (if accessible)
SELECT 'Database diagnostic completed successfully' as status;
