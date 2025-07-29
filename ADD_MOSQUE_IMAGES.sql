-- Add Images to Mosques
-- Run this in Supabase SQL Editor

-- First, let's check current mosque data
SELECT name, handle, hero_path FROM mosques ORDER BY name;

-- Update Bilal Moschee with its image (we know this exists)
UPDATE mosques 
SET hero_path = '/images/mosques/bilal-moschee.jpg'
WHERE handle = 'bilal-moschee-bielefeld';

-- Update DITIB mosque with its specific image
UPDATE mosques 
SET hero_path = '/images/mosques/ditib-moschee.webp'
WHERE handle = 'ditib-moschee-lage';

-- For other mosques, use available generic mosque images
UPDATE mosques 
SET hero_path = '/images/mosques/moschee2.webp'
WHERE handle = 'sokut-icmg-baesweiler';

UPDATE mosques 
SET hero_path = '/images/mosques/moschee3.webp'
WHERE handle = 'spenge-moschee';

-- Add a default image for any mosques without images
UPDATE mosques 
SET hero_path = '/images/mosques/moschee-default.webp'
WHERE hero_path IS NULL;

-- Verify the updates
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
