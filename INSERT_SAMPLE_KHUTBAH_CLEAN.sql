-- Insert Sample Khutbah for Bilal Moschee - CLEAN VERSION
-- Run this in Supabase SQL Editor

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

-- Delete existing sample khutbahs for Bilal Moschee to avoid duplicates
DELETE FROM lectures 
WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld')
AND title IN (
  'The Importance of Teaching Children the Qur''an',
  'Die Bedeutung der Dankbarkeit im Islam',
  'Brüderlichkeit und Einheit in der Ummah'
);

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
  created_at
) VALUES (
  uuid_generate_v4(),
  'The Importance of Teaching Children the Qur''an',
  'All praise is due to Allah, who revealed to us the Noble Qur''an, a light and guidance for all the worlds.

We bear witness that there is no deity worthy of worship except Allah, and we bear witness that our Prophet Muhammad is the Messenger of Allah and the Seal of the Prophets. May Allah send His peace, blessings, and mercy upon him, his family, and all his companions.

To proceed: I advise you, servants of Allah, and myself, to have taqwa of Allah. Allah the Most High said: ﴿الم* ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى ‌لِلْمُتَّقِينَ﴾

"Alif, Lām, Meem. This is the Book about which there is no doubt, a guidance for those conscious of Allah."

O Believers, The Qur''an is the speech of Allah. It is a book that stands alone in its perfection, majesty, and beauty. There is nothing like it among those who came before, nor any equal to it among those who will come after. It is a source of strength for parents and a fortress for children. It is an everlasting miracle and a decisive proof, as Allah the Almighty said: ﴿فَلِلَّهِ الْحُجَّةُ الْبَالِغَةُ﴾

"So, to Allah belongs the conclusive argument."

Its message is precise and clear. Its proofs are evident. It is protected from any addition or omission.

Allah the Exalted said: ﴿لَا يَأْتِيهِ الْبَاطِلُ مِنْ بَيْنِ يَدَيْهِ وَلَا مِنْ خَلْفِهِ تَنْزِيلٌ مِنْ حَكِيمٍ حَمِيدٍ﴾

"Falsehood cannot approach it from before it or behind it; [it is] a revelation from [He who is] Wise and Praiseworthy."

O servants of Allah, it is the Glorious Qur''an, there is nothing greater or more beneficial that a father or mother can give to their children than teaching them the Qur''an. So, dear father, do you know why you should teach your child the Qur''an? What are the hoped-for fruits?

ʿAbdullāh ibn ʿAmr ibn al-ʿĀṣ (may Allah be pleased with them both) said: "You must adhere to the Quran. Learn it and teach it to your children, for you will be questioned about it, and rewarded for it, and it is a sufficient reminder for those who understand."

(Sharḥ Ṣaḥīḥ al-Bukhārī by Ibn Baṭṭāl)

By learning the Qur''an, tranquility, guidance, and mercy descend upon our children. Allah the Most High said: ﴿وَإِنَّهُ لَهُدًى وَرَحْمَةٌ لِلْمُؤْمِنِينَ﴾

"And indeed, it is guidance and mercy for the believers."

Through it, their bond with their Lord is strengthened, their thinking becomes enlightened, and thus, Allah protects them from hardship in their life''s journey.

As Allah Almighty said: ﴿مَا أَنْزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَى﴾

"We have not sent down the Qur''an to you that you be distressed."

Yes, through the Qur''an, our children''s lives will be filled with happiness, and their character will be elevated, following the guidance of their Prophet ﷺ, for the character of the Prophet of Allah ﷺ was the Quran", as described by the mother of the Believers, ʿĀ''ishah (may Allah be pleased with her).

And when our children are consistent in memorizing the Qur''an, their minds become trained in understanding, focus, connecting between verses, and distinguishing between similar passages. Their intelligence is elevated, their memory becomes more active, their comprehension improves, their language strengthens, and their eloquence begins to shine, because they are living with the Qur''an in a rich linguistic environment, filled with beautiful expressions and eloquent styles, adorned with over seventy thousand words.

Indeed, it is the Qur''an, about which Allah says: ﴿بِلِسَانٍ عَرَبِيٍّ مُبِينٍ﴾

"The Trustworthy Spirit has brought it down … in a clear Arabic language."

Just imagine the linguistic richness and mental abilities our children would gain if they memorized a portion of their Lord''s Book.

How much knowledge would they acquire about the environment and its elements, the celestial bodies and their movements, and the stories of past nations and the lessons they hold? More than that, how much would they enjoy the serenity of the soul, its peace and purity, the clearing of sorrow, the tranquillity of the heart, and the elevation of the spirit? Allah the Exalted said: ﴿الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾

"Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured"

So blessed are the hearts that have drawn from the fountain of the Qur''an, bliss be upon them, and glad tidings to them, glad tidings and congratulations to them.

Allah the Exalted said: ﴿إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾

"Indeed, this Qur''an guides to that which is most upright."

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنْكُمْ﴾

"O you who have believed, obey Allah and obey the Messenger and those in authority among you."

I say these words of mine, and I seek Allah''s forgiveness for myself and for you. So, seek His forgiveness, indeed, He is the Most Forgiving, the Most Merciful.',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  COALESCE(
    (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') AND role IN ('Admin', 'Imam') LIMIT 1),
    (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::uuid
  ),
  '{"en": "The Importance of Teaching Children the Qur''an", "de": "Die Bedeutung des Quran-Unterrichts für Kinder", "tr": "Çocuklara Kuran Öğretmenin Önemi", "ar": "أهمية تعليم الأطفال القرآن"}',
  '{"en": "Quran, children, education, teaching, parenting", "de": "Quran, Kinder, Bildung, Lehre, Erziehung", "tr": "Kuran, çocuklar, eğitim, öğretim", "ar": "قرآن، أطفال، تعليم، تربية"}',
  0,
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
  created_at
) VALUES (
  uuid_generate_v4(),
  'Brüderlichkeit und Einheit in der Ummah',
  'Bismillahir-Rahmanir-Rahim

Alhamdulillahi rabbil alameen. As-salatu was-salamu ala rasulillahil-kareem.

Liebe Brüder und Schwestern,

Der Islam lehrt uns, dass alle Gläubigen eine große Familie sind - die Ummah.

Der Prophet (Friede sei mit ihm) sagte:

"Die Gläubigen sind in ihrer Liebe und ihrem Mitgefühl wie ein Körper: Wenn ein Glied leidet, wacht der ganze Körper auf." (Sahih al-Bukhari)

Die Säulen der islamischen Brüderlichkeit:

- Liebe für Allah: Einander um Allahs willen lieben
- Unterstützung: In guten und schweren Zeiten
- Vergebung: Fehler verzeihen  
- Gerechtigkeit: Fair miteinander umgehen

Praktische Schritte:

1. Regelmäßige Teilnahme am Gemeinschaftsgebet
2. Besuch kranker Geschwister
3. Unterstützung bedürftiger Familien
4. Respektvoller Umgang

Möge Allah unsere Gemeinschaft stärken. Ameen',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  COALESCE(
    (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') AND role IN ('Admin', 'Imam') LIMIT 1),
    (SELECT id FROM users WHERE mosque_id = (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld') LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::uuid
  ),
  '{"en": "Brotherhood and Unity in the Ummah", "tr": "Ümmette Kardeşlik ve Birlik", "ar": "الأخوة والوحدة في الأمة"}',
  '{"en": "brotherhood, unity, ummah", "tr": "kardeşlik, birlik", "ar": "أخوة، وحدة"}',
  0,
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
LEFT JOIN users u ON l.created_by::uuid = u.id
WHERE m.handle = 'bilal-moschee-bielefeld'
ORDER BY l.created_at DESC;
