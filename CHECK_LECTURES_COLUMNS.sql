-- Check the actual columns in the lectures table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'lectures' 
ORDER BY ordinal_position;
