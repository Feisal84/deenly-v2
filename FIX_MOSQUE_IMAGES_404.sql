-- TROUBLESHOOTING: Image 404 Error Fix
-- Run this script to verify and fix mosque image paths

-- Step 1: First, check what mosques exist and their current hero_path
SELECT 
  id,
  name,
  handle,
  hero_path,
  CASE 
    WHEN hero_path IS NOT NULL THEN '✅ Has Path'
    ELSE '❌ No Path'
  END as path_status
FROM mosques 
ORDER BY name;

-- Step 2: Clear all existing hero_path values first (optional, for clean start)
-- UPDATE mosques SET hero_path = NULL;

-- Step 3: Set images with verified paths
-- These paths should work if your Next.js development server is running on localhost:3000

UPDATE mosques 
SET hero_path = '/images/mosques/bilal-moschee.jpg'
WHERE handle = 'bilal-moschee-bielefeld';

UPDATE mosques 
SET hero_path = '/images/mosques/ditib-moschee.webp'
WHERE handle = 'ditib-moschee-lage';

UPDATE mosques 
SET hero_path = '/images/mosques/moschee2.webp'
WHERE handle = 'sokut-icmg-baesweiler';

UPDATE mosques 
SET hero_path = '/images/mosques/moschee3.webp'
WHERE handle = 'spenge-moschee';

-- Step 4: Set a default image for any remaining mosques without images
UPDATE mosques 
SET hero_path = '/images/mosques/moschee-default.webp'
WHERE hero_path IS NULL OR hero_path = '';

-- Step 5: Verify all updates
SELECT 
  name,
  handle,
  hero_path,
  CASE 
    WHEN hero_path IS NOT NULL THEN '✅ Has Image'
    ELSE '❌ No Image'
  END as image_status
FROM mosques 
ORDER BY name;

-- TROUBLESHOOTING NOTES:
-- 1. Make sure your Next.js development server is running (npm run dev)
-- 2. Images should be accessible at: http://localhost:3000/images/mosques/[filename]
-- 3. If still getting 404, check that files exist in: public/images/mosques/
-- 4. Try a hard refresh in browser (Ctrl+Shift+R)
-- 5. Check browser Network tab to see the exact URL being requested
