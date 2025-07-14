-- Sample data for Deenly v2 Database
-- Insert the mosques from your screenshots and BilalMosque component

-- Insert mosques
INSERT INTO mosques (
  id,
  name,
  address,
  city,
  postal_code,
  phone,
  email,
  website,
  about,
  services,
  latitude,
  longitude,
  prayer_time_calculation,
  jumua_time,
  handle,
  hero_path
) VALUES 
(
  uuid_generate_v4(),
  'Bilal Moschee',
  'Schildescher Str. 69',
  'Bielefeld',
  '33611',
  '+4952198629199',
  'info@alx.de',
  'https://www.aikv.de',
  'In unserer Moschee bieten wir eine Vielzahl von Dienstleistungen an. Von religiöser Bildung bis hin zu Gemeindeveranstaltungen haben wir alles, was Sie brauchen, um mit Ihrem Glauben und Ihrer Gemeinde in Kontakt zu treten.',
  ARRAY['Gebetszeiten', 'Freitagsgebet', 'Religiöse Bildung', 'Gemeindeveranstaltungen', 'Islamunterricht'],
  52.0302,
  8.5325,
  'Egyptian General Authority of Survey',
  '13:45',
  'bilal-moschee',
  '/images/mosques/bilal-moschee.jpg'
),
(
  uuid_generate_v4(),
  'DITIB Moschee Lage',
  'Detmolder Str. 48',
  'Lage',
  '32791',
  '+495232123456',
  'info@ditib-lage.de',
  'https://www.ditib-lage.de',
  'Die DITIB Moschee Lage ist ein Zentrum für islamische Bildung und Gemeinschaftsaktivitäten in der Region.',
  ARRAY['Gebetszeiten', 'Freitagsgebet', 'Koranunterricht', 'Soziale Dienste', 'Jugendarbeit'],
  51.9909,
  8.7881,
  'Egyptian General Authority of Survey',
  '13:30',
  'ditib-lage',
  '/images/mosques/ditib-lage.jpg'
),
(
  uuid_generate_v4(),
  'SoKuT Icmg Baesweiler',
  'Breite Str. 64',
  'Baesweiler',
  '52499',
  '+492401987654',
  'info@sokut-baesweiler.de',
  'https://www.sokut-baesweiler.de',
  'Die SoKuT Icmg Moschee in Baesweiler dient der türkischen Gemeinde und bietet umfassende religiöse und kulturelle Dienste.',
  ARRAY['Gebetszeiten', 'Freitagsgebet', 'Türkischunterricht', 'Kulturelle Veranstaltungen', 'Seniorenbetreuung'],
  50.9092,
  6.1819,
  'Egyptian General Authority of Survey',
  '13:00',
  'sokut-baesweiler',
  '/images/mosques/sokut-baesweiler.jpg'
),
(
  uuid_generate_v4(),
  'Spenge Moschee',
  'Ravensberger Str. 35',
  'Spenge',
  '32139',
  '+495225876543',
  'info@spenge-moschee.de',
  'https://www.spenge-moschee.de',
  'Die Spenge Moschee ist ein wichtiger Anlaufpunkt für Muslime in Spenge und Umgebung.',
  ARRAY['Gebetszeiten', 'Freitagsgebet', 'Arabischunterricht', 'Familienprogramme', 'Wohltätigkeit'],
  52.1333,
  8.6833,
  'Egyptian General Authority of Survey',
  '13:15',
  'spenge-moschee',
  '/images/mosques/spenge-moschee.jpg'
);

-- Insert sample users (Imams and admins)
INSERT INTO users (
  id,
  name,
  email,
  role,
  mosque_id,
  bio,
  preferred_language
) VALUES 
(
  uuid_generate_v4(),
  'Imam Ahmed Hassan',
  'imam.ahmed@bilal-moschee.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee'),
  'Imam Ahmed Hassan ist seit 2015 Imam der Bilal Moschee und bietet wöchentliche Khutbas in Deutsch und Arabisch.',
  'de'
),
(
  uuid_generate_v4(),
  'Imam Mustafa Özkan',
  'imam.mustafa@ditib-lage.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'ditib-lage'),
  'Imam Mustafa Özkan leitet die DITIB Moschee Lage und ist spezialisiert auf Jugendarbeit und Familienberatung.',
  'de'
),
(
  uuid_generate_v4(),
  'Imam Mehmet Yılmaz',
  'imam.mehmet@sokut-baesweiler.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'),
  'Imam Mehmet Yılmaz führt die türkische Gemeinde in Baesweiler und bietet Dienste in Türkisch und Deutsch.',
  'tr'
),
(
  uuid_generate_v4(),
  'Imam Omar Al-Rashid',
  'imam.omar@spenge-moschee.de',
  'Imam',
  (SELECT id FROM mosques WHERE handle = 'spenge-moschee'),
  'Imam Omar Al-Rashid ist bekannt für seine inspirierenden Khutbas und Gemeinschaftsarbeit.',
  'ar'
);

-- Insert sample lectures/khutbas
INSERT INTO lectures (
  id,
  title,
  content,
  type,
  status,
  mosque_id,
  created_by,
  title_translations,
  delivery_date,
  num_views
) VALUES 
(
  uuid_generate_v4(),
  'Die Bedeutung des Freitagsgebets',
  'Das Freitagsgebet (Jumu''ah) ist eines der wichtigsten gemeinschaftlichen Gebete im Islam. Es bringt die Gläubigen zusammen und stärkt die Bindungen der Gemeinschaft...',
  'Khutba',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee'),
  (SELECT id FROM users WHERE email = 'imam.ahmed@bilal-moschee.de'),
  '{"en": "The Importance of Friday Prayer", "ar": "أهمية صلاة الجمعة", "tr": "Cuma Namazının Önemi"}',
  '2025-01-10',
  156
),
(
  uuid_generate_v4(),
  'Geduld in schwierigen Zeiten',
  'Allah prüft uns mit verschiedenen Herausforderungen. Wie wir mit Geduld und Vertrauen auf Allah reagieren, zeigt unseren wahren Glauben...',
  'Khutba',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'ditib-lage'),
  (SELECT id FROM users WHERE email = 'imam.mustafa@ditib-lage.de'),
  '{"en": "Patience in Difficult Times", "ar": "الصبر في الأوقات الصعبة", "tr": "Zor Zamanlarda Sabır"}',
  '2025-01-03',
  89
),
(
  uuid_generate_v4(),
  'Die Rechte der Nachbarn im Islam',
  'Der Islam legt großen Wert auf die Rechte der Nachbarn. Ein guter Muslim ist derjenige, der zu seinen Nachbarn freundlich und hilfsbereit ist...',
  'Khutba',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'),
  (SELECT id FROM users WHERE email = 'imam.mehmet@sokut-baesweiler.de'),
  '{"en": "Rights of Neighbors in Islam", "ar": "حقوق الجيران في الإسلام", "tr": "İslam''da Komşu Hakları"}',
  '2024-12-27',
  234
),
(
  uuid_generate_v4(),
  'Dankbarkeit - Ein Weg zur Zufriedenheit',
  'Dankbarkeit (Shukr) ist eine der schönsten Eigenschaften eines Muslims. Wenn wir dankbar sind für das, was Allah uns gegeben hat...',
  'Khutba',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'spenge-moschee'),
  (SELECT id FROM users WHERE email = 'imam.omar@spenge-moschee.de'),
  '{"en": "Gratitude - A Path to Contentment", "ar": "الشكر - طريق إلى الرضا", "tr": "Şükür - Memnuniyet Yolu"}',
  '2024-12-20',
  178
);

-- Insert sample events
INSERT INTO events (
  id,
  title,
  description,
  mosque_id,
  created_by,
  event_date,
  start_time,
  end_time,
  location,
  max_participants,
  title_translations
) VALUES 
(
  uuid_generate_v4(),
  'Islamische Kalligrafie Workshop',
  'Lernen Sie die Kunst der arabischen Kalligrafie in diesem praktischen Workshop. Für Anfänger und Fortgeschrittene geeignet.',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee'),
  (SELECT id FROM users WHERE email = 'imam.ahmed@bilal-moschee.de'),
  '2025-01-25',
  '14:00',
  '17:00',
  'Gemeinschaftsraum der Bilal Moschee',
  25,
  '{"en": "Islamic Calligraphy Workshop", "ar": "ورشة الخط العربي", "tr": "İslami Hat Sanatı Atölyesi"}'
),
(
  uuid_generate_v4(),
  'Familien-Iftar',
  'Gemeinsames Fastenbrechen für Familien mit Kindern. Bitte bringen Sie ein Gericht für das Buffet mit.',
  (SELECT id FROM mosques WHERE handle = 'ditib-lage'),
  (SELECT id FROM users WHERE email = 'imam.mustafa@ditib-lage.de'),
  '2025-02-15',
  '18:30',
  '21:00',
  'Hauptgebetsraum',
  100,
  '{"en": "Family Iftar", "ar": "إفطار عائلي", "tr": "Aile İftarı"}'
),
(
  uuid_generate_v4(),
  'Koran-Rezitation Wettbewerb',
  'Jährlicher Wettbewerb für Jugendliche im Alter von 12-18 Jahren. Anmeldung bis zum 15. März.',
  (SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'),
  (SELECT id FROM users WHERE email = 'imam.mehmet@sokut-baesweiler.de'),
  '2025-03-22',
  '10:00',
  '16:00',
  'Konferenzsaal',
  50,
  '{"en": "Quran Recitation Competition", "ar": "مسابقة تلاوة القرآن", "tr": "Kuran Okuma Yarışması"}'
);

-- Insert sample prayer times for the current week
INSERT INTO prayer_times (
  mosque_id,
  date,
  fajr,
  shuruk,
  dhuhr,
  asr,
  maghrib,
  isha
) VALUES 
-- Bilal Moschee prayer times
((SELECT id FROM mosques WHERE handle = 'bilal-moschee'), '2025-01-14', '06:15', '08:12', '12:45', '14:30', '16:48', '18:30'),
((SELECT id FROM mosques WHERE handle = 'bilal-moschee'), '2025-01-15', '06:14', '08:11', '12:46', '14:31', '16:49', '18:31'),
((SELECT id FROM mosques WHERE handle = 'bilal-moschee'), '2025-01-16', '06:13', '08:10', '12:47', '14:32', '16:50', '18:32'),
((SELECT id FROM mosques WHERE handle = 'bilal-moschee'), '2025-01-17', '06:12', '08:09', '12:48', '14:33', '16:51', '18:33'),

-- DITIB Lage prayer times
((SELECT id FROM mosques WHERE handle = 'ditib-lage'), '2025-01-14', '06:17', '08:14', '12:47', '14:32', '16:50', '18:32'),
((SELECT id FROM mosques WHERE handle = 'ditib-lage'), '2025-01-15', '06:16', '08:13', '12:48', '14:33', '16:51', '18:33'),
((SELECT id FROM mosques WHERE handle = 'ditib-lage'), '2025-01-16', '06:15', '08:12', '12:49', '14:34', '16:52', '18:34'),
((SELECT id FROM mosques WHERE handle = 'ditib-lage'), '2025-01-17', '06:14', '08:11', '12:50', '14:35', '16:53', '18:35'),

-- SoKuT Baesweiler prayer times
((SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'), '2025-01-14', '06:25', '08:22', '12:55', '14:40', '16:58', '18:40'),
((SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'), '2025-01-15', '06:24', '08:21', '12:56', '14:41', '16:59', '18:41'),
((SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'), '2025-01-16', '06:23', '08:20', '12:57', '14:42', '17:00', '18:42'),
((SELECT id FROM mosques WHERE handle = 'sokut-baesweiler'), '2025-01-17', '06:22', '08:19', '12:58', '14:43', '17:01', '18:43'),

-- Spenge Moschee prayer times
((SELECT id FROM mosques WHERE handle = 'spenge-moschee'), '2025-01-14', '06:18', '08:15', '12:48', '14:33', '16:51', '18:33'),
((SELECT id FROM mosques WHERE handle = 'spenge-moschee'), '2025-01-15', '06:17', '08:14', '12:49', '14:34', '16:52', '18:34'),
((SELECT id FROM mosques WHERE handle = 'spenge-moschee'), '2025-01-16', '06:16', '08:13', '12:50', '14:35', '16:53', '18:35'),
((SELECT id FROM mosques WHERE handle = 'spenge-moschee'), '2025-01-17', '06:15', '08:12', '12:51', '14:36', '16:54', '18:36');

-- Insert sample announcements
INSERT INTO announcements (
  id,
  title,
  content,
  mosque_id,
  created_by,
  priority,
  expiry_date,
  title_translations
) VALUES 
(
  uuid_generate_v4(),
  'Ramadan Vorbereitung 2025',
  'Liebe Geschwister, wir beginnen mit den Vorbereitungen für den heiligen Monat Ramadan. Weitere Informationen folgen in den kommenden Wochen.',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee'),
  (SELECT id FROM users WHERE email = 'imam.ahmed@bilal-moschee.de'),
  3,
  '2025-03-15',
  '{"en": "Ramadan Preparation 2025", "ar": "الاستعداد لرمضان ٢٠٢٥", "tr": "2025 Ramazan Hazırlığı"}'
),
(
  uuid_generate_v4(),
  'Neue Parkplätze verfügbar',
  'Ab sofort stehen zusätzliche Parkplätze hinter der Moschee zur Verfügung. Bitte nutzen Sie diese während der Gebetszeiten.',
  (SELECT id FROM mosques WHERE handle = 'ditib-lage'),
  (SELECT id FROM users WHERE email = 'imam.mustafa@ditib-lage.de'),
  2,
  '2025-06-30',
  '{"en": "New Parking Available", "ar": "مواقف سيارات جديدة متاحة", "tr": "Yeni Park Alanı Mevcut"}'
);

-- Update mosque member counts
UPDATE mosques SET num_anon_members = 
  CASE handle
    WHEN 'bilal-moschee' THEN 450
    WHEN 'ditib-lage' THEN 320
    WHEN 'sokut-baesweiler' THEN 280
    WHEN 'spenge-moschee' THEN 195
    ELSE num_anon_members
  END;

-- Add some lecture views
UPDATE lectures SET num_views = 
  CASE 
    WHEN title LIKE '%Rechte der Nachbarn%' THEN 234
    WHEN title LIKE '%Dankbarkeit%' THEN 178
    WHEN title LIKE '%Freitagsgebet%' THEN 156
    WHEN title LIKE '%Geduld%' THEN 89
    ELSE num_views
  END;
