-- Insert Sample Khutbah with AI Translations - ADVANCED VERSION
-- This script inserts khutbah with pre-generated translations
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
  'The Importance of Teaching Children the Quran',
  'Die Bedeutung der Dankbarkeit im Islam',
  'Brüderlichkeit und Einheit in der Ummah'
);

-- Insert sample khutbah with AI translations
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
  'The Importance of Teaching Children the Quran',
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
  -- Multi-language title translations
  '{
    "en": "The Importance of Teaching Children the Quran",
    "de": "Die Bedeutung des Quran-Unterrichts für Kinder",
    "tr": "Çocuklara Kuran Öğretmenin Önemi", 
    "ar": "أهمية تعليم الأطفال القرآن",
    "fr": "L importance d enseigner le Coran aux enfants",
    "es": "La importancia de enseñar el Corán a los niños",
    "ru": "Важность обучения детей Корану"
  }'::jsonb,
  -- Translation map with sample translations (simplified to avoid JSON errors)
  '{
    "de": {
      "title": "Die Bedeutung des Quran-Unterrichts für Kinder",
      "content": "Alles Lob gebührt Allah, der uns den edlen Quran offenbarte, ein Licht und eine Führung für alle Welten. Wir bezeugen, dass es keine Gottheit gibt, die der Anbetung würdig ist, außer Allah, und wir bezeugen, dass unser Prophet Muhammad der Gesandte Allahs und das Siegel der Propheten ist."
    },
    "tr": {
      "title": "Çocuklara Kuran Öğretmenin Önemi",
      "content": "Hamd, bize Kerim Kuranı, tüm alemler için bir nur ve hidayet olarak indiren Allaha mahsustur. Allahtan başka hiçbir ilahın ibadet edilmeye layık olmadığına şahitlik ederiz ve Peygamberimiz Muhammedin Allahın Resulü ve peygamberlerin sonuncusu olduğuna şahitlik ederiz."
    },
    "ar": {
      "title": "أهمية تعليم الأطفال القرآن",
      "content": "الحمد لله الذي أنزل علينا القرآن الكريم نوراً وهداية للعالمين. نشهد أن لا إله إلا الله وحده لا شريك له، ونشهد أن محمداً رسول الله وخاتم النبيين. صلى الله عليه وعلى آله وصحبه أجمعين."
    },
    "fr": {
      "title": "L importance d enseigner le Coran aux enfants", 
      "content": "Toute louange appartient à Allah, qui nous a révélé le Noble Coran, lumière et guidance pour tous les mondes. Nous témoignons qu il n y a de divinité digne d adoration qu Allah, et nous témoignons que notre Prophète Muhammad est le Messager d Allah et le Sceau des Prophètes."
    }
  }'::jsonb,
  25,
  NOW()
);

-- Verify the insertions
SELECT 
  l.title,
  l.type,
  l.status,
  l.created_at::date as created_date,
  m.name as mosque_name,
  COALESCE(u.full_name, 'No user assigned') as created_by_name,
  jsonb_object_keys(l.title_translations) as available_languages
FROM lectures l
JOIN mosques m ON l.mosque_id = m.id
LEFT JOIN users u ON l.created_by::uuid = u.id
WHERE m.handle = 'bilal-moschee-bielefeld'
ORDER BY l.created_at DESC;

-- Show translation capabilities
SELECT 
  'Translation Test' as info,
  l.title as original_title,
  l.title_translations->>'de' as german_title,
  l.title_translations->>'tr' as turkish_title,
  l.title_translations->>'ar' as arabic_title
FROM lectures l
JOIN mosques m ON l.mosque_id = m.id
WHERE m.handle = 'bilal-moschee-bielefeld'
AND l.title = 'The Importance of Teaching Children the Quran';
