-- Final SQL to Update Database with 4 Mosques Only
-- Run this directly in Supabase SQL Editor
-- This bypasses RLS policies since it runs as admin

-- Step 1: Remove all existing mosques
DELETE FROM mosques;

-- Step 2: Insert the 4 required mosques
INSERT INTO mosques (
  name,
  legal_name,
  address,
  city,
  state,
  country,
  postal_code,
  phone,
  email,
  website,
  about,
  latitude,
  longitude,
  prayer_time_calculation,
  jumua,
  handle,
  services,
  num_anon_members
) VALUES 
-- 1. Bilal Moschee
(
  'Bilal Moschee',
  'Bilal Moschee e.V.',
  'Schildescher Str. 69',
  'Bielefeld',
  'Nordrhein-Westfalen',
  'Germany',
  '33611',
  '+4952198629199',
  'info@alx.de',
  'https://www.aikv.de',
  'In unserer Moschee bieten wir eine Vielzahl von Dienstleistungen an. Von religiöser Bildung bis hin zu Gemeindeveranstaltungen haben wir alles, was Sie brauchen, um mit Ihrem Glauben und Ihrer Gemeinde in Kontakt zu treten.',
  52.0302,
  8.5325,
  'standard',
  '13:45',
  'bilal-moschee-bielefeld',
  ARRAY['Religious Education', 'Community Events', 'Prayer Services', 'Youth Programs'],
  0
),
-- 2. DITIB Moschee Lage
(
  'DITIB Moschee Lage',
  'DITIB Moschee Lage e.V.',
  'Detmolder Str. 48',
  'Lage',
  'Nordrhein-Westfalen',
  'Germany',
  '32791',
  NULL,
  NULL,
  NULL,
  'DITIB Moschee in Lage bietet religiöse Dienstleistungen und Gemeinschaftsaktivitäten für die lokale muslimische Gemeinde.',
  51.9892,
  8.7879,
  'standard',
  '13:30',
  'ditib-moschee-lage',
  ARRAY['Prayer Services', 'Religious Education', 'Community Services'],
  0
),
-- 3. SoKuT Icmg Baesweiler
(
  'SoKuT Icmg Baesweiler',
  'SoKuT Icmg Baesweiler e.V.',
  'Breite Str. 64',
  'Baesweiler',
  'Nordrhein-Westfalen',
  'Germany',
  '52499',
  NULL,
  NULL,
  NULL,
  'SoKuT Icmg Moschee in Baesweiler dient der lokalen muslimischen Gemeinde mit religiösen Dienstleistungen und kulturellen Aktivitäten.',
  50.9095,
  6.1886,
  'standard',
  '13:30',
  'sokut-icmg-baesweiler',
  ARRAY['Prayer Services', 'Cultural Programs', 'Community Events'],
  0
),
-- 4. Spenge Moschee
(
  'Spenge Moschee',
  'Spenge Moschee e.V.',
  'Ravensberger Str. 35',
  'Spenge',
  'Nordrhein-Westfalen',
  'Germany',
  '32139',
  NULL,
  NULL,
  NULL,
  'Die Spenge Moschee bietet religiöse Dienstleistungen und Gemeinschaftsunterstützung für die muslimische Gemeinde in Spenge.',
  52.1344,
  8.4891,
  'standard',
  '13:30',
  'spenge-moschee',
  ARRAY['Prayer Services', 'Community Support', 'Religious Education'],
  0
);

-- Step 3: Verify the results
SELECT 
  name,
  city,
  address,
  handle,
  phone,
  email,
  website,
  jumua as friday_prayer_time
FROM mosques 
ORDER BY name;

-- Step 4: Show summary
SELECT 
  COUNT(*) as total_mosques,
  STRING_AGG(name, ', ' ORDER BY name) as mosque_names
FROM mosques;
