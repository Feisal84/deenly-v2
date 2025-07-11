-- Deenly Mosque App Database Schema
-- Run this in your Supabase SQL Editor

-- Create Mosques Table
CREATE TABLE IF NOT EXISTS mosques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    legal_name TEXT,
    representative_name TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT DEFAULT 'Deutschland',
    postal_code TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    about TEXT,
    hero_path TEXT,
    services TEXT[] DEFAULT '{}',
    longitude DECIMAL,
    latitude DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    num_anon_members INTEGER DEFAULT 0,
    prayer_time_calculation TEXT DEFAULT 'standard',
    prayer_time_offsets JSONB DEFAULT '{}',
    jumua TEXT,
    handle TEXT UNIQUE,
    announcement TEXT,
    announcement_date TIMESTAMP WITH TIME ZONE,
    announcement_expiry TIMESTAMP WITH TIME ZONE
);

-- Create Lectures Table
CREATE TABLE IF NOT EXISTS lectures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL DEFAULT 'system',
    num_views INTEGER DEFAULT 0,
    type TEXT DEFAULT 'Khutba',
    mosque_id UUID REFERENCES mosques(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Public', 'Private')),
    translation_map JSONB DEFAULT '{}',
    title_translations JSONB DEFAULT '{}',
    live_translation_id TEXT
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mosque_id UUID REFERENCES mosques(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Prayer Times Table
CREATE TABLE IF NOT EXISTS prayer_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mosque_id UUID REFERENCES mosques(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    fajr TIME,
    shuruk TIME,
    dhuhr TIME,
    asr TIME,
    maghrib TIME,
    isha TIME,
    jumua TIME,
    UNIQUE(mosque_id, date)
);

-- Enable Row Level Security
ALTER TABLE mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Public Access
-- Mosques: Public read access
CREATE POLICY "Public mosques are viewable by everyone" ON mosques
    FOR SELECT USING (true);

-- Lectures: Only public lectures are viewable
CREATE POLICY "Public lectures are viewable by everyone" ON lectures
    FOR SELECT USING (status = 'Public');

-- Events: Public read access
CREATE POLICY "Public events are viewable by everyone" ON events
    FOR SELECT USING (true);

-- Prayer Times: Public read access
CREATE POLICY "Public prayer times are viewable by everyone" ON prayer_times
    FOR SELECT USING (true);

-- Insert Sample Data
-- Sample Mosques
INSERT INTO mosques (name, address, city, postal_code, handle, country, about, services) VALUES
('Masjid Al-Noor', 'Musterstraße 123', 'Berlin', '10115', 'al-noor-berlin', 'Deutschland', 
 'Eine friedliche Moschee im Herzen Berlins, die der Gemeinschaft seit 1995 dient.',
 ARRAY['Gebet', 'Bildung', 'Gemeindeveranstaltungen', 'Jugendprogramme']
),
('Islamisches Zentrum München', 'Wallnerstraße 1-5', 'München', '80333', 'iz-muenchen', 'Deutschland',
 'Ein wichtiges islamisches Zentrum in München mit umfassenden religiösen und sozialen Diensten.',
 ARRAY['Gebet', 'Bildung', 'Heirat', 'Beratung', 'Sprachkurse']
),
('Moschee Hamburg Centrum', 'Steindamm 101', 'Hamburg', '20099', 'moschee-hamburg', 'Deutschland',
 'Eine lebendige Moscheegemeinschaft in Hamburg, die Menschen aller Hintergründe willkommen heißt.',
 ARRAY['Gebet', 'Bildung', 'Sozialarbeit', 'Interfaith Dialog']
),
('Merkez Moschee Duisburg', 'Warbruckstraße 51', 'Duisburg', '47051', 'merkez-duisburg', 'Deutschland',
 'Eine der größten Moscheen in Nordrhein-Westfalen mit einer starken türkisch-deutschen Gemeinde.',
 ARRAY['Gebet', 'Bildung', 'Kulturelle Veranstaltungen', 'Jugendarbeit']
);

-- Sample Lectures/Khutbas
INSERT INTO lectures (title, content, type, status, mosque_id, title_translations, created_by) VALUES
('Die Bedeutung des Gebets im Islam', 
 'Das Gebet (Salah) ist eine der fünf Säulen des Islam und stellt eine direkte Verbindung zwischen dem Gläubigen und Allah dar. In dieser Khutba werden wir die spirituelle, psychologische und soziale Bedeutung des regelmäßigen Gebets erörtern.

Das Gebet ist nicht nur ein Ritual, sondern eine Quelle der inneren Ruhe und des Friedens. Es erinnert uns an unsere Verantwortung gegenüber Allah und unseren Mitmenschen. Durch das fünfmalige tägliche Gebet strukturieren wir unseren Tag und finden Momente der Besinnung inmitten des hektischen Alltags.

Prophet Muhammad (Friede sei mit ihm) sagte: "Das Gebet ist das Licht des Gläubigen." Dieses Licht erhellt nicht nur unser Herz, sondern strahlt auch auf unser Verhalten und unsere Beziehungen zu anderen aus.',
 'Khutba', 'Public', 
 (SELECT id FROM mosques WHERE handle = 'al-noor-berlin' LIMIT 1),
 '{"de": "Die Bedeutung des Gebets im Islam", "ar": "أهمية الصلاة في الإسلام", "en": "The Importance of Prayer in Islam", "tr": "İslam''da Namazın Önemi"}',
 'Imam Ahmad Al-Masri'
),

('Gemeinschaft und Zusammenhalt in der Ummah',
 'Die islamische Gemeinschaft (Ummah) ist mehr als nur eine Gruppe von Menschen, die denselben Glauben teilen. Sie ist eine spirituelle Familie, die durch Liebe, Respekt und gegenseitige Unterstützung verbunden ist.

In unserer heutigen Zeit, in der Individualismus oft über Gemeinschaftssinn gestellt wird, erinnert uns der Islam daran, dass wir füreinander verantwortlich sind. Der Prophet (Friede sei mit ihm) sagte: "Die Gläubigen sind in ihrer Liebe, Barmherzigkeit und ihrem Mitgefühl füreinander wie ein Körper: Wenn ein Glied leidet, wacht der ganze Körper in Fieber und Schlaflosigkeit."

Diese Metapher zeigt uns, dass das Wohlergehen jedes Einzelnen mit dem Wohlergehen der gesamten Gemeinschaft verbunden ist. Wir sind aufgerufen, unsere Nachbarn zu kennen, den Bedürftigen zu helfen und eine Gesellschaft aufzubauen, die auf Gerechtigkeit und Barmherzigkeit basiert.',
 'Khutba', 'Public',
 (SELECT id FROM mosques WHERE handle = 'iz-muenchen' LIMIT 1),
 '{"de": "Gemeinschaft und Zusammenhalt in der Ummah", "ar": "المجتمع والتماسك في الأمة", "en": "Community and Unity in the Ummah", "tr": "Ümmet''te Toplum ve Birlik"}',
 'Imam Yusuf Al-Andalusi'
),

('Dankbarkeit und Geduld im täglichen Leben',
 'Dankbarkeit (Shukr) und Geduld (Sabr) sind zwei fundamentale Eigenschaften, die jeden Muslim prägen sollten. Sie sind die Schlüssel zu einem erfüllten und spirituell reichen Leben, unabhängig von den äußeren Umständen.

Dankbarkeit bedeutet nicht nur, Allah für die offensichtlichen Segnungen zu danken, sondern auch in schwierigen Zeiten die verborgenen Weisheiten zu erkennen. Wenn wir dankbar sind, transformiert sich unsere Perspektive auf das Leben. Wir sehen Möglichkeiten statt Hindernisse, Lektionen statt Verluste.

Geduld ist die Schwester der Dankbarkeit. Sie lehrt uns, in Prüfungen standhaft zu bleiben und auf Allahs Weisheit zu vertrauen. Geduld ist nicht passive Resignation, sondern aktives Vertrauen und kontinuierliche Anstrengung, während wir auf Allahs Hilfe warten.

Zusammen bilden Dankbarkeit und Geduld ein starkes Fundament für ein Leben im Einklang mit islamischen Werten.',
 'Khutba', 'Public',
 (SELECT id FROM mosques WHERE handle = 'moschee-hamburg' LIMIT 1),
 '{"de": "Dankbarkeit und Geduld im täglichen Leben", "ar": "الشكر والصبر في الحياة اليومية", "en": "Gratitude and Patience in Daily Life", "tr": "Günlük Hayatta Şükür ve Sabır"}',
 'Imam Hassan Al-Baghdadi'
),

('Die Rolle der Familie im Islam',
 'Die Familie ist im Islam die Grundlage der Gesellschaft. Sie ist der erste Ort, an dem Werte vermittelt, Liebe gelebt und Charakter geformt wird. In einer Zeit, in der traditionelle Familienstrukturen herausgefordert werden, ist es wichtig, die islamische Perspektive auf Familie zu verstehen und zu leben.

Islam betont die Bedeutung von Respekt zwischen Ehepartnern, liebevoller Erziehung der Kinder und Fürsorge für die Eltern. Diese Prinzipien schaffen nicht nur harmonische Beziehungen innerhalb der Familie, sondern stärken auch die gesamte Gesellschaft.

Die Rechte und Pflichten in der Familie sind ausgewogen verteilt. Männer und Frauen haben komplementäre Rollen, die sich gegenseitig ergänzen und unterstützen. Kinder lernen durch das Beispiel ihrer Eltern die Werte von Respekt, Verantwortung und Mitgefühl.

Möge Allah uns allen helfen, starke, liebevolle Familien aufzubauen, die als Lichttürme in unserer Gesellschaft fungieren.',
 'Khutba', 'Public',
 (SELECT id FROM mosques WHERE handle = 'merkez-duisburg' LIMIT 1),
 '{"de": "Die Rolle der Familie im Islam", "ar": "دور العائلة في الإسلام", "en": "The Role of Family in Islam", "tr": "İslam''da Ailenin Rolü"}',
 'Imam Mehmet Özkan'
);

-- Sample Events
INSERT INTO events (mosque_id, title, description, date, time) VALUES
((SELECT id FROM mosques WHERE handle = 'al-noor-berlin' LIMIT 1), 
 'Islamischer Kalligrafie Workshop', 
 'Lernen Sie die Kunst der arabischen Kalligrafie in unserem zweiwöchigen Workshop.',
 CURRENT_DATE + INTERVAL '7 days', '14:00:00'),

((SELECT id FROM mosques WHERE handle = 'iz-muenchen' LIMIT 1),
 'Iftar-Dinner für die Gemeinde',
 'Gemeinsames Fastenbrechen mit traditionellen Speisen aus verschiedenen islamischen Ländern.',
 CURRENT_DATE + INTERVAL '3 days', '19:30:00'),

((SELECT id FROM mosques WHERE handle = 'moschee-hamburg' LIMIT 1),
 'Interreligiöser Dialog: Islam und Christentum',
 'Eine offene Diskussion zwischen muslimischen und christlichen Gelehrten über gemeinsame Werte.',
 CURRENT_DATE + INTERVAL '10 days', '18:00:00'),

((SELECT id FROM mosques WHERE handle = 'merkez-duisburg' LIMIT 1),
 'Arabisch-Sprachkurs für Anfänger',
 'Beginnen Sie Ihre Reise, die Sprache des Korans zu lernen.',
 CURRENT_DATE + INTERVAL '14 days', '16:00:00');

-- Sample Prayer Times (for today and tomorrow)
INSERT INTO prayer_times (mosque_id, date, fajr, dhuhr, asr, maghrib, isha, jumua) VALUES
((SELECT id FROM mosques WHERE handle = 'al-noor-berlin' LIMIT 1), 
 CURRENT_DATE, '05:30:00', '12:15:00', '15:45:00', '18:20:00', '20:00:00', '13:00:00'),
 
((SELECT id FROM mosques WHERE handle = 'iz-muenchen' LIMIT 1), 
 CURRENT_DATE, '05:35:00', '12:20:00', '15:50:00', '18:25:00', '20:05:00', '13:15:00'),
 
((SELECT id FROM mosques WHERE handle = 'moschee-hamburg' LIMIT 1), 
 CURRENT_DATE, '05:25:00', '12:10:00', '15:40:00', '18:15:00', '19:55:00', '12:45:00'),
 
((SELECT id FROM mosques WHERE handle = 'merkez-duisburg' LIMIT 1), 
 CURRENT_DATE, '05:32:00', '12:18:00', '15:48:00', '18:22:00', '20:02:00', '13:00:00');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lectures_status ON lectures(status);
CREATE INDEX IF NOT EXISTS idx_lectures_mosque_id ON lectures(mosque_id);
CREATE INDEX IF NOT EXISTS idx_lectures_created_at ON lectures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mosques_handle ON mosques(handle);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_prayer_times_mosque_date ON prayer_times(mosque_id, date);

-- Create a view for public lectures with mosque information
CREATE OR REPLACE VIEW public_lectures_with_mosques AS
SELECT 
    l.*,
    m.name as mosque_name,
    m.handle as mosque_handle,
    m.city as mosque_city
FROM lectures l
JOIN mosques m ON l.mosque_id = m.id
WHERE l.status = 'Public'
ORDER BY l.created_at DESC;

COMMENT ON TABLE mosques IS 'Stores information about Islamic mosques and centers';
COMMENT ON TABLE lectures IS 'Stores khutbas, lectures, and religious content';
COMMENT ON TABLE events IS 'Stores upcoming events and programs at mosques';
COMMENT ON TABLE prayer_times IS 'Daily prayer times for each mosque';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Deenly Mosque App database schema created successfully!';
    RAISE NOTICE 'Tables created: mosques, lectures, events, prayer_times';
    RAISE NOTICE 'Sample data inserted for % mosques and % lectures', 
        (SELECT COUNT(*) FROM mosques), 
        (SELECT COUNT(*) FROM lectures);
END $$;
