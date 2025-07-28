-- Add Images to Mosques
-- Run this in Supabase SQL Editor

-- First, let's check current mosque data
SELECT name, handle, hero_path FROM mosques ORDER BY name;

-- Update Bilal Moschee with its image (we know this exists)
UPDATE mosques 
SET hero_path = '/images/mosques/bilal-moschee.jpg'
WHERE handle = 'bilal-moschee-bielefeld';

-- For DITIB and other mosques, let's use the mosque-features image temporarily
-- You can replace these with specific mosque images later
UPDATE mosques 
SET hero_path = '/images/features/mosque-features.webp'
WHERE handle = 'ditib-moschee-lage';

UPDATE mosques 
SET hero_path = '/images/features/mosque-features.webp'
WHERE handle = 'sokut-icmg-baesweiler';

UPDATE mosques 
SET hero_path = '/images/features/mosque-features.webp'
WHERE handle = 'spenge-moschee';

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
