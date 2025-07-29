-- Add Images to Mosques - FIXED VERSION
-- Run this in Supabase SQL Editor

-- First, let's check current mosque data and see if hero_path column exists
SELECT 
  name, 
  handle,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='hero_path') 
    THEN 'hero_path column exists'
    ELSE 'hero_path column missing'
  END as column_status
FROM mosques 
LIMIT 1;

-- Add hero_path column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='hero_path') THEN
    ALTER TABLE mosques ADD COLUMN hero_path VARCHAR(500);
  END IF;
END $$;

-- Update Bilal Moschee with its image (we know this exists)
UPDATE mosques 
SET hero_path = '/images/mosques/bilal-moschee.jpg'
WHERE handle = 'bilal-moschee-bielefeld';

-- Update DITIB mosque with its correctly named image
UPDATE mosques 
SET hero_path = '/images/mosques/ditib-lage.jpg'
WHERE handle = 'ditib-moschee-lage';

-- For other mosques, use the correctly named images we just created
UPDATE mosques 
SET hero_path = '/images/mosques/sokut-baesweiler.jpg'
WHERE handle = 'sokut-icmg-baesweiler';

UPDATE mosques 
SET hero_path = '/images/mosques/spenge-moschee.jpg'
WHERE handle = 'spenge-moschee';

-- Add a default image for any mosques without images
UPDATE mosques 
SET hero_path = '/images/mosques/moschee-default.webp'
WHERE hero_path IS NULL OR hero_path = '';

-- Verify the updates
SELECT 
  name,
  handle,
  hero_path,
  CASE 
    WHEN hero_path IS NOT NULL AND hero_path != '' THEN '✅ Has Image'
    ELSE '❌ No Image'
  END as image_status
FROM mosques 
ORDER BY name;

-- Test if the images actually exist by showing the paths
SELECT 
  'Image Files Check' as info,
  hero_path,
  COUNT(*) as mosques_using_this_image
FROM mosques 
WHERE hero_path IS NOT NULL 
GROUP BY hero_path;
