-- Insert Sample Khutbah for Bilal Moschee - SIMPLIFIED VERSION
-- Run t  '{"en": "gratitude, thankfulness, shukr", "tr": "şükür, minnet", "ar": "شكر، حمد"}',
  0,
  NOW(),
  NOW()
); Supabase SQL Editor

-- First, check existing data
SELECT 
  'Mosques:' as type, 
  id::text, 
  name, 
  handle 
FROM mosques 
WHERE handle = 'bilal-moschee-bielefeld'
UNION ALL
SELECT 
  'Users:' as type, 
  u.id::text, 
  u.full_name, 
  u.role::text 
FROM users u 
JOIN mosques m ON u.mosque_id = m.id 
WHERE m.handle = 'bilal-moschee-bielefeld';

-- Insert first sample khutbah
INSERT INTO lectures (
  id,
  title,
  content,
  type,
  status,
  mosque_id,
  created_by,
  title_translations,
  translation_map,
  num_views,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'Die Bedeutung der Dankbarkeit im Islam',
  '<h2>Die Bedeutung der Dankbarkeit im Islam</h2>
<p><strong>Im Namen Allahs, des Allerbarmers, des Barmherzigen</strong></p>
<p>Alles Lob gebührt Allah, dem Herrn der Welten.</p>

<h3>Liebe Geschwister im Islam,</h3>
<p>Heute sprechen wir über eines der wichtigsten Konzepte: <strong>Shukr</strong> - die Dankbarkeit gegenüber Allah.</p>

<p>Allah sagt im Heiligen Quran:</p>
<blockquote>Und wenn ihr die Gnaden Allahs zählen wolltet, könntet ihr sie nicht erfassen. (Quran 16:18)</blockquote>

<h4>Was bedeutet wahre Dankbarkeit?</h4>
<ul>
<li><strong>Mit dem Herzen:</strong> Die Anerkennung, dass alle Segnungen von Allah kommen</li>
<li><strong>Mit der Zunge:</strong> Allah für Seine Gaben zu preisen</li>
<li><strong>Mit den Taten:</strong> Die Segnungen im Gehorsam zu nutzen</li>
</ul>

<h4>Die Früchte der Dankbarkeit:</h4>
<blockquote>Wenn ihr dankbar seid, werde Ich euch gewiss noch mehr geben. (Quran 14:7)</blockquote>

<h4>Praktische Wege:</h4>
<ol>
<li>Tägliches Dhikr: Alhamdulillahi rabbil alameen</li>
<li>Reflexion über Allahs Segnungen</li>
<li>Teilen mit anderen</li>
<li>Geduld in schweren Zeiten</li>
</ol>

<p>Möge Allah uns zu dankbaren Menschen machen. <strong>Ameen</strong></p>',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') AND role IN ('Admin', 'Imam') LIMIT 1),
  '{"en": "The Importance of Gratitude in Islam", "tr": "İslamda Şükrün Önemi", "ar": "أهمية الشكر في الإسلام"}',
  '{"en": "gratitude, thankfulness, shukr", "tr": "şükür, minnet", "ar": "شكر، حمد"}',
  0,
  CURRENT_DATE,
  NOW(),
  NOW()
);

-- Insert second sample khutbah  
INSERT INTO lectures (
  id,
  title,
  content,
  type,
  status,
  mosque_id,
  created_by,
  title_translations,
  translation_map,
  num_views,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'Brüderlichkeit und Einheit in der Ummah',
  '<h2>Brüderlichkeit und Einheit in der Ummah</h2>
<p><strong>Bismillahir-Rahmanir-Rahim</strong></p>
<p>Alhamdulillahi rabbil alameen. As-salatu was-salamu ala rasulillahil-kareem.</p>

<h3>Liebe Brüder und Schwestern,</h3>
<p>Der Islam lehrt uns, dass alle Gläubigen eine große Familie sind - die Ummah.</p>

<p>Der Prophet (Friede sei mit ihm) sagte:</p>
<blockquote>Die Gläubigen sind in ihrer Liebe und ihrem Mitgefühl wie ein Körper: Wenn ein Glied leidet, wacht der ganze Körper auf. (Sahih al-Bukhari)</blockquote>

<h4>Die Säulen der islamischen Brüderlichkeit:</h4>
<ul>
<li><strong>Liebe für Allah:</strong> Einander um Allahs willen lieben</li>
<li><strong>Unterstützung:</strong> In guten und schweren Zeiten</li>
<li><strong>Vergebung:</strong> Fehler verzeihen</li>
<li><strong>Gerechtigkeit:</strong> Fair miteinander umgehen</li>
</ul>

<h4>Praktische Schritte:</h4>
<ol>
<li>Regelmäßige Teilnahme am Gemeinschaftsgebet</li>
<li>Besuch kranker Geschwister</li>
<li>Unterstützung bedürftiger Familien</li>
<li>Respektvoller Umgang</li>
</ol>

<p>Möge Allah unsere Gemeinschaft stärken. <strong>Ameen</strong></p>',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') AND role IN ('Admin', 'Imam') LIMIT 1),
  '{"en": "Brotherhood and Unity in the Ummah", "tr": "Ümmette Kardeşlik ve Birlik", "ar": "الأخوة والوحدة في الأمة"}',
  '{"en": "brotherhood, unity, ummah", "tr": "kardeşlik, birlik", "ar": "أخوة، وحدة"}',
  0,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
);

-- Verify the insertions
SELECT 
  l.title,
  l.type,
  l.status,
  l.created_at::date as created_date,
  m.name as mosque_name,
  COALESCE(u.full_name, 'No user assigned') as created_by_name
FROM lectures l
JOIN mosques m ON l.mosque_id = m.id
LEFT JOIN users u ON l.created_by = u.id
WHERE m.handle = 'bilal-moschee-bielefeld'
ORDER BY l.created_at DESC;
