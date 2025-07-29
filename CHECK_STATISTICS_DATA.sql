-- Check Statistics Data for "Deenly in Zahlen" Section
-- Run this in Supabase SQL Editor to verify automatic statistics

-- ==============================================
-- 1. CHECK MOSQUE COUNT
-- ==============================================
SELECT 
  'MOSQUE COUNT' as metric,
  COUNT(*) as value,
  'Total number of mosques in database' as description
FROM mosques;

-- ==============================================
-- 2. CHECK LECTURE COUNT (PUBLIC ONLY)
-- ==============================================
SELECT 
  'PUBLIC LECTURE COUNT' as metric,
  COUNT(*) as value,
  'Number of public lectures/khutbas' as description
FROM lectures 
WHERE status = 'Public';

-- ==============================================
-- 3. CHECK TOTAL VIEWS
-- ==============================================
SELECT 
  'TOTAL VIEWS' as metric,
  COALESCE(SUM(num_views), 0) as value,
  'Sum of all views across public lectures' as description
FROM lectures 
WHERE status = 'Public';

-- ==============================================
-- 4. DETAILED BREAKDOWN BY MOSQUE
-- ==============================================
SELECT 
  m.name as mosque_name,
  COUNT(l.id) as lecture_count,
  COALESCE(SUM(l.num_views), 0) as total_views,
  COALESCE(AVG(l.num_views), 0)::integer as avg_views_per_lecture
FROM mosques m
LEFT JOIN lectures l ON m.id = l.mosque_id AND l.status = 'Public'
GROUP BY m.id, m.name
ORDER BY lecture_count DESC;

-- ==============================================
-- 5. CHECK IF num_views FIELD IS BEING UPDATED
-- ==============================================
SELECT 
  title,
  status,
  num_views,
  created_at::date as created_date,
  (SELECT name FROM mosques WHERE id = lectures.mosque_id) as mosque_name
FROM lectures 
WHERE status = 'Public'
ORDER BY num_views DESC, created_at DESC
LIMIT 10;

-- ==============================================
-- 6. CHECK FOR POTENTIAL ISSUES
-- ==============================================
-- Check for lectures with NULL num_views
SELECT 
  'NULL VIEWS COUNT' as issue,
  COUNT(*) as count,
  'Lectures with NULL num_views (should be 0)' as description
FROM lectures 
WHERE num_views IS NULL;

-- Check for draft lectures (not counted in statistics)
SELECT 
  'DRAFT LECTURES' as issue,
  COUNT(*) as count,
  'Draft lectures not included in public statistics' as description
FROM lectures 
WHERE status != 'Public';

-- ==============================================
-- SUMMARY FOR FRONTEND
-- ==============================================
SELECT 
  'FRONTEND STATISTICS' as summary,
  json_build_object(
    'mosqueCount', (SELECT COUNT(*) FROM mosques),
    'lectureCount', (SELECT COUNT(*) FROM lectures WHERE status = 'Public'),
    'totalViews', (SELECT COALESCE(SUM(num_views), 0) FROM lectures WHERE status = 'Public')
  ) as data_for_frontend;
