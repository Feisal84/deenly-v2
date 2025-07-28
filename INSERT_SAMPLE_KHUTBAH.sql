-- Insert Sample Khutbah for Bilal Moschee
-- Run this in Supabase SQL Editor

-- First, let's check if we have the necessary data
SELECT 
  'Mosques:' as type, 
  id, 
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

-- Insert sample khutbah/lecture
-- Replace 'USER-ID-HERE' with an actual user ID from the query above

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
  delivery_date,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'Die Bedeutung der Dankbarkeit im Islam',
  '<!-- Khutbah Content -->
<div class="khutbah-content">
  <h2>Die Bedeutung der Dankbarkeit im Islam</h2>
  
  <div class="opening">
    <p><strong>Im Namen Allahs, des Allerbarmers, des Barmherzigen</strong></p>
    <p>Alles Lob gebührt Allah, dem Herrn der Welten. Wir preisen Ihn, bitten Ihn um Hilfe und um Vergebung. Wir suchen Zuflucht bei Allah vor dem Übel unserer Seelen und vor unseren schlechten Taten.</p>
  </div>

  <div class="main-content">
    <h3>Liebe Geschwister im Islam,</h3>
    
    <p>Heute möchte ich über eines der wichtigsten Konzepte in unserem Glauben sprechen: <strong>Shukr</strong> - die Dankbarkeit gegenüber Allah.</p>
    
    <p>Allah (swt) sagt im Heiligen Quran:</p>
    <blockquote>
      "Und wenn ihr die Gnaden Allahs zählen wolltet, könntet ihr sie nicht erfassen. Wahrlich, Allah ist Allvergebend, Barmherzig." 
      <cite>(Quran 16:18)</cite>
    </blockquote>
    
    <h4>Was bedeutet wahre Dankbarkeit?</h4>
    <ul>
      <li><strong>Mit dem Herzen:</strong> Die Anerkennung, dass alle Segnungen von Allah kommen</li>
      <li><strong>Mit der Zunge:</strong> Allah für Seine Gaben zu preisen und zu danken</li>
      <li><strong>Mit den Taten:</strong> Die Segnungen im Gehorsam gegenüber Allah zu nutzen</li>
    </ul>
    
    <h4>Die Früchte der Dankbarkeit:</h4>
    <p>Allah verspricht denjenigen, die dankbar sind:</p>
    <blockquote>
      "Und als euer Herr ankündigte: Wenn ihr dankbar seid, werde Ich euch gewiss noch mehr geben."
      <cite>(Quran 14:7)</cite>
    </blockquote>
    
    <h4>Praktische Wege zur Dankbarkeit:</h4>
    <ol>
      <li><strong>Tägliches Dhikr:</strong> "Alhamdulillahi rabbil alameen"</li>
      <li><strong>Reflexion:</strong> Über die kleinen und großen Segnungen nachdenken</li>
      <li><strong>Teilen:</strong> Von dem geben, was Allah uns gegeben hat</li>
      <li><strong>Geduld:</strong> Auch in schweren Zeiten Allahs Weisheit vertrauen</li>
    </ol>
  </div>

  <div class="conclusion">
    <h3>Dua und Schluss</h3>
    <p>Möge Allah uns zu denjenigen machen, die wahrhaft dankbar sind. Möge Er unsere Herzen mit Dankbarkeit erfüllen und uns mehr von Seinen Segnungen gewähren.</p>
    
    <p><strong>Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhab an-nar.</strong></p>
    <p><em>Unser Herr, gib uns Gutes in dieser Welt und Gutes in der nächsten Welt und bewahre uns vor der Strafe des Feuers.</em></p>
  </div>

  <div class="references">
    <h4>Referenzen:</h4>
    <ul>
      <li>Quran 16:18</li>
      <li>Quran 14:7</li>
      <li>Sahih al-Bukhari</li>
      <li>Sahih Muslim</li>
    </ul>
  </div>
</div>',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') AND role = 'Admin' LIMIT 1),
  '{"en": "The Importance of Gratitude in Islam", "tr": "İslamda Şükrün Önemi", "ar": "أهمية الشكر في الإسلام"}',
  '{"en": "Gratitude, thankfulness, shukr, blessings, Allah", "tr": "şükür, minnet, nimet, Allah", "ar": "شكر، نعمة، الله"}',
  0,
  CURRENT_DATE,
  NOW(),
  NOW()
);

-- Insert a second sample khutbah
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
  delivery_date,
  created_at,
  updated_at
) VALUES (
  uuid_generate_v4(),
  'Brüderlichkeit und Einheit in der Ummah',
  '<!-- Khutbah Content -->
<div class="khutbah-content">
  <h2>Brüderlichkeit und Einheit in der Ummah</h2>
  
  <div class="opening">
    <p><strong>Bismillahir-Rahmanir-Rahim</strong></p>
    <p>Alhamdulillahi rabbil alameen. As-salatu was-salamu ala rasulillahil-kareem.</p>
  </div>

  <div class="main-content">
    <h3>Liebe Brüder und Schwestern,</h3>
    
    <p>Der Islam lehrt uns, dass alle Gläubigen eine große Familie sind - die Ummah. Der Prophet (Friede sei mit ihm) sagte:</p>
    
    <blockquote>
      "Die Gläubigen sind in ihrer Liebe, Barmherzigkeit und ihrem Mitgefühl füreinander wie ein Körper: Wenn ein Glied leidet, wacht der ganze Körper in Fieber und Schlaflosigkeit auf."
      <cite>(Sahih al-Bukhari und Muslim)</cite>
    </blockquote>
    
    <h4>Die Säulen der islamischen Brüderlichkeit:</h4>
    <ul>
      <li><strong>Liebe für Allah:</strong> Einander um Allahs willen lieben</li>
      <li><strong>Gegenseitige Unterstützung:</strong> In guten und schweren Zeiten</li>
      <li><strong>Vergebung:</strong> Fehler verzeihen und Versöhnung suchen</li>
      <li><strong>Gerechtigkeit:</strong> Fair und ehrlich miteinander umgehen</li>
    </ul>
    
    <h4>Praktische Schritte zur Stärkung der Gemeinschaft:</h4>
    <ol>
      <li>Regelmäßige Teilnahme am Gemeinschaftsgebet</li>
      <li>Besuch kranker Geschwister</li>
      <li>Unterstützung bedürftiger Familien</li>
      <li>Teilnahme an Moscheeveranstaltungen</li>
      <li>Respektvoller Umgang trotz Meinungsverschiedenheiten</li>
    </ol>
  </div>

  <div class="conclusion">
    <p>Möge Allah unsere Gemeinschaft stärken und uns zu wahren Brüdern und Schwestern im Glauben machen.</p>
    <p><strong>Ameen</strong></p>
  </div>
</div>',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') AND role = 'Admin' LIMIT 1),
  '{"en": "Brotherhood and Unity in the Ummah", "tr": "Ümmette Kardeşlik ve Birlik", "ar": "الأخوة والوحدة في الأمة"}',
  '{"en": "brotherhood, unity, ummah, community, solidarity", "tr": "kardeşlik, birlik, ümmet, toplum", "ar": "أخوة، وحدة، أمة، جماعة"}',
  0,
  CURRENT_DATE - INTERVAL '7 days',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
);

-- Verify the insertions
SELECT 
  l.title,
  l.type,
  l.status,
  l.delivery_date,
  m.name as mosque_name,
  u.full_name as created_by_name
FROM lectures l
JOIN mosques m ON l.mosque_id = m.id
LEFT JOIN users u ON l.created_by = u.id
WHERE m.handle = 'bilal-moschee-bielefeld'
ORDER BY l.created_at DESC;
