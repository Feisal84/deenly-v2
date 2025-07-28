-- Add ONLY Missing Tables and Data
-- Run this ONLY if you have partial database setup

-- First, enable extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE prayer_calculation_method AS ENUM (
    'Egyptian General Authority of Survey',
    'Muslim World League',
    'Umm Al-Qura University, Makkah',
    'Islamic Society of North America',
    'Shia Ithna-Ashari, Leva Institute, Qum',
    'Institute of Geophysics, University of Tehran'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lecture_status AS ENUM ('Draft', 'Public', 'Archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('Admin', 'Imam', 'Member', 'Visitor');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create USERS table if it doesn't exist (THIS IS WHAT YOU NEED!)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  
  -- Authentication (linked to Supabase Auth)
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Role & Permissions
  role user_role DEFAULT 'Member',
  
  -- Associated Mosque
  mosque_id UUID REFERENCES mosques(id) ON DELETE SET NULL,
  
  -- Profile Information
  bio TEXT,
  profile_image VARCHAR(500),
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'de',
  notification_preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create other tables if they don't exist
CREATE TABLE IF NOT EXISTS lectures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  
  -- Type & Status
  type VARCHAR(50) DEFAULT 'Khutba',
  status lecture_status DEFAULT 'Draft',
  
  -- Associations
  mosque_id UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Translations
  title_translations JSONB DEFAULT '{}',
  translation_map JSONB DEFAULT '{}',
  
  -- Live Translation
  live_translation_id UUID,
  
  -- Engagement Metrics
  num_views INTEGER DEFAULT 0,
  
  -- Media
  audio_url VARCHAR(500),
  video_url VARCHAR(500),
  
  -- Scheduling
  delivery_date DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Associations
  mosque_id UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Scheduling
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  
  -- Location
  location VARCHAR(500),
  
  -- Capacity & Registration
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT FALSE,
  
  -- Translations
  title_translations JSONB DEFAULT '{}',
  description_translations JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prayer_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Associations
  mosque_id UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  
  -- Date
  date DATE NOT NULL,
  
  -- Prayer Times
  fajr TIME,
  shuruk TIME,
  dhuhr TIME,
  asr TIME,
  maghrib TIME,
  isha TIME,
  jumua TIME,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint to prevent duplicate dates per mosque
  UNIQUE(mosque_id, date)
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  
  -- Associations
  mosque_id UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Priority & Status
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Scheduling
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP WITH TIME ZONE,
  
  -- Translations
  title_translations JSONB DEFAULT '{}',
  content_translations JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content
  content TEXT NOT NULL,
  
  -- Associations
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Status
  is_approved BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure comment belongs to either lecture or event, not both
  CHECK ((lecture_id IS NOT NULL AND event_id IS NULL) OR (lecture_id IS NULL AND event_id IS NOT NULL))
);

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own data
DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth_user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth_user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_mosque_id ON users(mosque_id);
CREATE INDEX IF NOT EXISTS idx_lectures_mosque_id ON lectures(mosque_id);
CREATE INDEX IF NOT EXISTS idx_lectures_status ON lectures(status);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at (only if they don't exist)
DO $$ BEGIN
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert sample mosque data if mosques table is empty
INSERT INTO mosques (id, name, address, city, postal_code, handle, country, phone, email)
SELECT 
  uuid_generate_v4(),
  'Bilal Moschee Bielefeld',
  'Musterstraße 123',
  'Bielefeld',
  '33615',
  'bilal-moschee-bielefeld',
  'Germany',
  '+49 521 123456',
  'info@bilal-moschee.de'
WHERE NOT EXISTS (SELECT 1 FROM mosques WHERE handle = 'bilal-moschee-bielefeld');

INSERT INTO mosques (id, name, address, city, postal_code, handle, country, phone, email)
SELECT 
  uuid_generate_v4(),
  'DITIB Moschee Lage',
  'Moscheegasse 1',
  'Lage',
  '32791',
  'ditib-moschee-lage',
  'Germany',
  '+49 5232 987654',
  'info@ditib-lage.de'
WHERE NOT EXISTS (SELECT 1 FROM mosques WHERE handle = 'ditib-moschee-lage');

INSERT INTO mosques (id, name, address, city, postal_code, handle, country, phone, email)
SELECT 
  uuid_generate_v4(),
  'Sokut ICMG Baesweiler',
  'Islamstraße 10',
  'Baesweiler',
  '52499',
  'sokut-icmg-baesweiler',
  'Germany',
  '+49 2401 456789',
  'info@sokut-baesweiler.de'
WHERE NOT EXISTS (SELECT 1 FROM mosques WHERE handle = 'sokut-icmg-baesweiler');

INSERT INTO mosques (id, name, address, city, postal_code, handle, country, phone, email)
SELECT 
  uuid_generate_v4(),
  'Spenge Moschee',
  'Gebetsplatz 5',
  'Spenge',
  '32139',
  'spenge-moschee',
  'Germany',
  '+49 5225 123456',
  'info@spenge-moschee.de'
WHERE NOT EXISTS (SELECT 1 FROM mosques WHERE handle = 'spenge-moschee');

-- Success message
SELECT '✅ Database setup completed! All missing tables and data have been added.' as status;
