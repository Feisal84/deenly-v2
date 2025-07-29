-- Quick Database Readiness Check for AI Translations
-- Run this first in Supabase SQL Editor to verify everything is ready

-- ==============================================
-- 1. CHECK IF BILAL MOSCHEE EXISTS
-- ==============================================
SELECT 
  'MOSQUE CHECK' as test,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Bilal Moschee found'
    ELSE '❌ Bilal Moschee not found - run mosque setup first'
  END as result,
  COUNT(*) as count
FROM mosques 
WHERE handle = 'bilal-moschee-bielefeld';

-- ==============================================
-- 2. CHECK IF USERS EXIST FOR BILAL MOSCHEE
-- ==============================================
SELECT 
  'USER CHECK' as test,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Users found for Bilal Moschee'
    ELSE '❌ No users found - may need to create admin user'
  END as result,
  COUNT(*) as count,
  string_agg(role::text, ', ') as roles
FROM users u
JOIN mosques m ON u.mosque_id = m.id
WHERE m.handle = 'bilal-moschee-bielefeld';

-- ==============================================
-- 3. CHECK TRANSLATION COLUMNS EXIST
-- ==============================================
SELECT 
  'SCHEMA CHECK' as test,
  CASE 
    WHEN COUNT(*) = 2 THEN '✅ Translation columns ready'
    ELSE '❌ Translation columns missing'
  END as result,
  string_agg(column_name, ', ') as translation_columns
FROM information_schema.columns 
WHERE table_name = 'lectures' 
AND column_name IN ('title_translations', 'translation_map');

-- ==============================================
-- 4. CHECK CURRENT LECTURES
-- ==============================================
SELECT 
  'LECTURE CHECK' as test,
  CASE 
    WHEN COUNT(*) > 0 THEN CONCAT('✅ ', COUNT(*), ' lectures exist')
    ELSE '⚠️ No lectures yet - ready to insert first one'
  END as result,
  COUNT(*) as count
FROM lectures l
JOIN mosques m ON l.mosque_id = m.id
WHERE m.handle = 'bilal-moschee-bielefeld';

-- ==============================================
-- SUMMARY AND NEXT STEPS
-- ==============================================
SELECT 
  'NEXT STEPS' as action,
  CASE 
    WHEN (SELECT COUNT(*) FROM mosques WHERE handle = 'bilal-moschee-bielefeld') = 0 
    THEN '1. Run mosque setup scripts first'
    WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'lectures' AND column_name IN ('title_translations', 'translation_map')) < 2
    THEN '2. Update database schema with translation columns'
    ELSE '3. ✅ Ready! Run INSERT_SAMPLE_KHUTBAH_WITH_AI_TRANSLATIONS.sql'
  END as instruction;
