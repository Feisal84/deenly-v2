-- Check what tables exist and what's missing
-- Run this first to see your current database state

-- Check if tables exist
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mosques') 
    THEN '✅ mosques table exists' 
    ELSE '❌ mosques table missing' 
  END as mosques_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') 
    THEN '✅ users table exists' 
    ELSE '❌ users table missing' 
  END as users_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lectures') 
    THEN '✅ lectures table exists' 
    ELSE '❌ lectures table missing' 
  END as lectures_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') 
    THEN '✅ events table exists' 
    ELSE '❌ events table missing' 
  END as events_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'prayer_times') 
    THEN '✅ prayer_times table exists' 
    ELSE '❌ prayer_times table missing' 
  END as prayer_times_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'announcements') 
    THEN '✅ announcements table exists' 
    ELSE '❌ announcements table missing' 
  END as announcements_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') 
    THEN '✅ comments table exists' 
    ELSE '❌ comments table missing' 
  END as comments_status;

-- Check if you have any data in existing tables
SELECT 
  (SELECT COUNT(*) FROM mosques) as mosque_count,
  (SELECT COUNT(*) FROM users) as user_count;
