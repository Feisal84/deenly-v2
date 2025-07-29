-- FIXED VERSION: Update Database with 4 Specific Mosques
-- This version handles missing columns gracefully

-- First, let's see what mosques currently exist
SELECT name, handle, city FROM mosques ORDER BY name;

-- Delete mosques that are NOT in our required list
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

-- Insert the 4 required mosques with basic columns only
-- (using only essential columns that must exist)
INSERT INTO mosques (
  name,
  address,
  city,
  postal_code,
  phone,
  email,
  website,
  about,
  handle
) VALUES 
(
  'Bilal Moschee',
  'Schildescher Str. 69',
  'Bielefeld',
  '33611',
  '+4952198629199',
  'info@alx.de',
  'https://www.aikv.de',
  'In unserer Moschee bieten wir eine Vielzahl von Dienstleistungen an. Von religiöser Bildung bis hin zu Gemeindeveranstaltungen haben wir alles, was Sie brauchen, um mit Ihrem Glauben und Ihrer Gemeinde in Kontakt zu treten.',
  'bilal-moschee-bielefeld'
),
(
  'DITIB Moschee Lage',
  'Detmolder Str. 48',
  'Lage',
  '32791',
  NULL,
  NULL,
  NULL,
  'DITIB Moschee in Lage bietet religiöse Dienstleistungen und Gemeinschaftsaktivitäten für die lokale muslimische Gemeinde.',
  'ditib-moschee-lage'
),
(
  'SoKuT Icmg Baesweiler',
  'Breite Str. 64',
  'Baesweiler',
  '52499',
  NULL,
  NULL,
  NULL,
  'SoKuT Icmg Moschee in Baesweiler dient der lokalen muslimischen Gemeinde mit religiösen Dienstleistungen und kulturellen Aktivitäten.',
  'sokut-icmg-baesweiler'
),
(
  'Spenge Moschee',
  'Ravensberger Str. 35',
  'Spenge',
  '32139',
  NULL,
  NULL,
  NULL,
  'Die Spenge Moschee bietet religiöse Dienstleistungen und Gemeinschaftsunterstützung für die muslimische Gemeinde in Spenge.',
  'spenge-moschee'
)
ON CONFLICT (handle) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  postal_code = EXCLUDED.postal_code,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  about = EXCLUDED.about;

-- Now add optional columns if they exist (safe updates)
-- Update state/country if columns exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='state') THEN
    UPDATE mosques SET state = 'Nordrhein-Westfalen' WHERE handle IN ('bilal-moschee-bielefeld', 'ditib-moschee-lage', 'sokut-icmg-baesweiler', 'spenge-moschee');
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='country') THEN
    UPDATE mosques SET country = 'Germany' WHERE handle IN ('bilal-moschee-bielefeld', 'ditib-moschee-lage', 'sokut-icmg-baesweiler', 'spenge-moschee');
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='created_at') THEN
    UPDATE mosques SET created_at = CURRENT_TIMESTAMP WHERE handle IN ('bilal-moschee-bielefeld', 'ditib-moschee-lage', 'sokut-icmg-baesweiler', 'spenge-moschee') AND created_at IS NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='updated_at') THEN
    UPDATE mosques SET updated_at = CURRENT_TIMESTAMP WHERE handle IN ('bilal-moschee-bielefeld', 'ditib-moschee-lage', 'sokut-icmg-baesweiler', 'spenge-moschee');
  END IF;
END $$;

-- Update latitude/longitude if columns exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='latitude') THEN
    UPDATE mosques SET latitude = 52.0302, longitude = 8.5325 WHERE handle = 'bilal-moschee-bielefeld';
    UPDATE mosques SET latitude = 51.9892, longitude = 8.7879 WHERE handle = 'ditib-moschee-lage';
    UPDATE mosques SET latitude = 50.9095, longitude = 6.1886 WHERE handle = 'sokut-icmg-baesweiler';
    UPDATE mosques SET latitude = 52.1344, longitude = 8.4891 WHERE handle = 'spenge-moschee';
  END IF;
END $$;

-- Update services array if column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='services') THEN
    UPDATE mosques SET services = ARRAY['Religious Education', 'Community Events', 'Prayer Services', 'Youth Programs'] WHERE handle = 'bilal-moschee-bielefeld';
    UPDATE mosques SET services = ARRAY['Prayer Services', 'Religious Education', 'Community Services'] WHERE handle = 'ditib-moschee-lage';
    UPDATE mosques SET services = ARRAY['Prayer Services', 'Cultural Programs', 'Community Events'] WHERE handle = 'sokut-icmg-baesweiler';
    UPDATE mosques SET services = ARRAY['Prayer Services', 'Community Support', 'Religious Education'] WHERE handle = 'spenge-moschee';
  END IF;
END $$;

-- Update jumua_time if column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mosques' AND column_name='jumua_time') THEN
    UPDATE mosques SET jumua_time = '13:45' WHERE handle = 'bilal-moschee-bielefeld';
    UPDATE mosques SET jumua_time = '13:30' WHERE handle IN ('ditib-moschee-lage', 'sokut-icmg-baesweiler', 'spenge-moschee');
  END IF;
END $$;

-- Verify the final state
SELECT 
  name,
  city,
  address,
  phone,
  email,
  website,
  handle
FROM mosques 
ORDER BY name;

-- Display summary
SELECT 
  COUNT(*) as total_mosques,
  STRING_AGG(name, ', ' ORDER BY name) as mosque_names
FROM mosques;
