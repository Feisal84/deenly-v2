-- SAFER VERSION: Update Database with 4 Specific Mosques
-- This version preserves existing data by updating instead of truncating

-- First, let's see what mosques currently exist
SELECT name, handle, city FROM mosques ORDER BY name;

-- Delete mosques that are NOT in our required list
-- (This preserves any existing data for our 4 mosques if they already exist)
DELETE FROM mosques 
WHERE handle NOT IN (
  'bilal-moschee-bielefeld',
  'ditib-moschee-lage', 
  'sokut-icmg-baesweiler',
  'spenge-moschee'
) AND name NOT IN (
  'Bilal Moschee',
  'DITIB Moschee Lage',
  'SoKuT Icmg Baesweiler', 
  'Spenge Moschee'
);

-- Insert or update the 4 required mosques using UPSERT (INSERT ... ON CONFLICT)
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
  jumua_time,
  handle,
  services,
  created_at,
  updated_at
) VALUES 
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
  'Egyptian General Authority of Survey',
  '13:45',
  'bilal-moschee-bielefeld',
  ARRAY['Religious Education', 'Community Events', 'Prayer Services', 'Youth Programs'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
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
  'Egyptian General Authority of Survey',
  '13:30',
  'ditib-moschee-lage',
  ARRAY['Prayer Services', 'Religious Education', 'Community Services'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
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
  'Egyptian General Authority of Survey',
  '13:30',
  'sokut-icmg-baesweiler',
  ARRAY['Prayer Services', 'Cultural Programs', 'Community Events'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
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
  'Egyptian General Authority of Survey',
  '13:30',
  'spenge-moschee',
  ARRAY['Prayer Services', 'Community Support', 'Religious Education'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (handle) DO UPDATE SET
  name = EXCLUDED.name,
  legal_name = EXCLUDED.legal_name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  postal_code = EXCLUDED.postal_code,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  about = EXCLUDED.about,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  prayer_time_calculation = EXCLUDED.prayer_time_calculation,
  jumua_time = EXCLUDED.jumua_time,
  services = EXCLUDED.services,
  updated_at = CURRENT_TIMESTAMP;

-- Verify the final state
SELECT 
  name,
  city,
  address,
  phone,
  email,
  website,
  handle,
  latitude,
  longitude
FROM mosques 
ORDER BY name;

-- Display summary
SELECT 
  COUNT(*) as total_mosques,
  STRING_AGG(name, ', ' ORDER BY name) as mosque_names
FROM mosques;
