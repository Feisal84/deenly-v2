-- Check existing lectures table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'lectures' 
ORDER BY ordinal_position;

-- Check existing mosques and users
SELECT 
  'Mosques:' as type, 
  id::text, 
  name, 
  handle 
FROM mosques 
WHERE handle = 'bilal-moschee-bielefeld'
UNION ALL
SELECT 
  'Users:' as type, 
  u.id::text, 
  u.full_name, 
  u.role::text 
FROM users u 
JOIN mosques m ON u.mosque_id = m.id 
WHERE m.handle = 'bilal-moschee-bielefeld';
