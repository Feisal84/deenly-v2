-- Deenly v2 Supabase Database Schema
-- Complete database setup for mosque management platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types
CREATE TYPE prayer_calculation_method AS ENUM (
  'Egyptian General Authority of Survey',
  'Muslim World League',
  'Umm Al-Qura University, Makkah',
  'Islamic Society of North America',
  'Shia Ithna-Ashari, Leva Institute, Qum',
  'Institute of Geophysics, University of Tehran'
);

CREATE TYPE lecture_status AS ENUM ('Draft', 'Public', 'Archived');
CREATE TYPE user_role AS ENUM ('Admin', 'Imam', 'Member', 'Visitor');

-- MOSQUES TABLE
CREATE TABLE mosques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  representative_name VARCHAR(255),
  
  -- Address Information
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Germany',
  postal_code VARCHAR(20) NOT NULL,
  
  -- Contact Information
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(500),
  
  -- Description & Services
  about TEXT,
  services TEXT[] DEFAULT '{}',
  
  -- Location Data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Prayer Times Configuration
  prayer_time_calculation prayer_calculation_method DEFAULT 'Egyptian General Authority of Survey',
  prayer_time_offsets JSONB DEFAULT '{}',
  jumua_time TIME DEFAULT '13:30',
  
  -- Media & Display
  hero_path VARCHAR(500),
  handle VARCHAR(100) UNIQUE,
  
  -- Announcements
  announcement TEXT,
  announcement_date TIMESTAMP WITH TIME ZONE,
  announcement_expiry TIMESTAMP WITH TIME ZONE,
  
  -- Statistics
  num_anon_members INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  
  -- Authentication (will be handled by Supabase Auth)
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

-- LECTURES (KHUTBAS) TABLE
CREATE TABLE lectures (
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

-- EVENTS TABLE
CREATE TABLE events (
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

-- PRAYER TIMES TABLE
CREATE TABLE prayer_times (
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

-- ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  
  -- Associations
  mosque_id UUID NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Priority & Status
  priority INTEGER DEFAULT 1, -- 1 = low, 5 = high
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

-- COMMENTS TABLE (for lectures and events)
CREATE TABLE comments (
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

-- INDEXES for performance
CREATE INDEX idx_mosques_city ON mosques(city);
CREATE INDEX idx_mosques_handle ON mosques(handle);
CREATE INDEX idx_mosques_location ON mosques USING GIST(ST_Point(longitude, latitude));

CREATE INDEX idx_lectures_mosque_id ON lectures(mosque_id);
CREATE INDEX idx_lectures_status ON lectures(status);
CREATE INDEX idx_lectures_created_at ON lectures(created_at DESC);

CREATE INDEX idx_events_mosque_id ON events(mosque_id);
CREATE INDEX idx_events_date ON events(event_date);

CREATE INDEX idx_prayer_times_mosque_date ON prayer_times(mosque_id, date);

CREATE INDEX idx_announcements_mosque_id ON announcements(mosque_id);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_announcements_expiry ON announcements(expiry_date);

CREATE INDEX idx_comments_lecture_id ON comments(lecture_id);
CREATE INDEX idx_comments_event_id ON comments(event_id);

-- Enable Row Level Security
ALTER TABLE mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Mosques: Public read access
CREATE POLICY "Mosques are publicly readable" ON mosques
FOR SELECT USING (true);

CREATE POLICY "Mosque admins can update their mosque" ON mosques
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.mosque_id = mosques.id 
    AND users.role IN ('Admin', 'Imam')
  )
);

-- Lectures: Public read for published, restricted write
CREATE POLICY "Published lectures are publicly readable" ON lectures
FOR SELECT USING (status = 'Public');

CREATE POLICY "Mosque members can create lectures" ON lectures
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.mosque_id = lectures.mosque_id 
    AND users.role IN ('Admin', 'Imam')
  )
);

CREATE POLICY "Authors can update their lectures" ON lectures
FOR UPDATE USING (
  created_by IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);

-- Events: Public read, restricted write
CREATE POLICY "Events are publicly readable" ON events
FOR SELECT USING (true);

CREATE POLICY "Mosque members can create events" ON events
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.mosque_id = events.mosque_id 
    AND users.role IN ('Admin', 'Imam')
  )
);

-- Prayer Times: Public read, restricted write
CREATE POLICY "Prayer times are publicly readable" ON prayer_times
FOR SELECT USING (true);

CREATE POLICY "Mosque members can manage prayer times" ON prayer_times
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.mosque_id = prayer_times.mosque_id 
    AND users.role IN ('Admin', 'Imam')
  )
);

-- Announcements: Public read, restricted write
CREATE POLICY "Active announcements are publicly readable" ON announcements
FOR SELECT USING (is_active = true AND (expiry_date IS NULL OR expiry_date > NOW()));

CREATE POLICY "Mosque members can manage announcements" ON announcements
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.mosque_id = announcements.mosque_id 
    AND users.role IN ('Admin', 'Imam')
  )
);

-- Users: Users can read their own data
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth_user_id = auth.uid());

-- Comments: Authenticated users can comment
CREATE POLICY "Approved comments are publicly readable" ON comments
FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments" ON comments
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own comments" ON comments
FOR UPDATE USING (
  user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  )
);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_mosques_updated_at BEFORE UPDATE ON mosques FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_times_updated_at BEFORE UPDATE ON prayer_times FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
