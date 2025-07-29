-- Diagnose Mosque Table Schema Issues
-- Run this to see what columns actually exist in your database

-- Check if mosques table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'mosques'
) as mosques_table_exists;

-- Show all columns in mosques table (if it exists)
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'mosques' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check for prayer time related columns specifically
SELECT 
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'mosques' 
AND table_schema = 'public'
AND column_name LIKE '%time%' OR column_name LIKE '%prayer%' OR column_name LIKE '%jumua%'
ORDER BY column_name;
