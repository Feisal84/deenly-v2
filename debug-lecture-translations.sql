-- Debug query to check existing lectures and their translation data
-- Run this in Supabase SQL Editor to see what translation data exists

SELECT 
  id,
  title,
  status,
  created_at,
  title_translations,
  translation_map,
  CASE 
    WHEN translation_map IS NULL THEN 'No translation_map'
    WHEN translation_map = '{}' THEN 'Empty translation_map'
    WHEN jsonb_typeof(translation_map) = 'object' THEN 'Has translation_map: ' || (SELECT COUNT(*) FROM jsonb_object_keys(translation_map))::text || ' languages'
    ELSE 'Unknown translation_map format'
  END as translation_status
FROM lectures 
ORDER BY created_at DESC 
LIMIT 10;

-- Also check if any lectures have AI translations
SELECT 
  COUNT(*) as total_lectures,
  COUNT(CASE WHEN translation_map IS NOT NULL AND translation_map != '{}' THEN 1 END) as lectures_with_translations,
  COUNT(CASE WHEN title_translations IS NOT NULL AND title_translations != '{"orig": "' || title || '"}' THEN 1 END) as lectures_with_title_translations
FROM lectures;
