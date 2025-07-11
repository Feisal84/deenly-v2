
/**
 * Typdefinitionen für die Deenly Moschee App
 */

export type Mosque = {
  id: string;
  name: string;
  legal_name?: string | null;
  representative_name?: string | null;
  address: string;
  city: string;
  state?: string | null;
  country?: string | null;
  postal_code: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  about?: string | null;
  hero_path?: string | null;
  services: string[];
  longitude?: number | null;
  latitude?: number | null;
  created_at: string;
  num_anon_members?: number | null;
  prayer_time_calculation: string;
  prayer_time_offsets?: {
    fajr?: number;
    shuruk?: number;
    dhuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
  } | null;
  jumua?: string | null;
  handle?: string | null;
  announcement?: string | null;
  announcement_date?: string | null;
  announcement_expiry?: string | null;
};

export type Lecture = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  num_views: number;
  type: string; // 'Lecture', 'Khutba', etc.
  mosque_id: string;
  status: string; // 'Public', 'Draft', etc.
  translation_map: object; // Mapping von Sprache zu Übersetzungen
  title_translations: object;
  live_translation_id?: string | null; // ID der Live-Übersetzung, wenn aktuell live
  
};

export type Event = {
  id: string;
  mosque_id: string;
  title: string;
  description?: string | null;
  date: string;
  time?: string | null;
  location?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type PrayerTime = {
  id: string;
  mosque_id: string;
  date: string;
  fajr?: string | null;
  shuruk?: string | null;
  dhuhr?: string | null;
  asr?: string | null;
  maghrib?: string | null;
  isha?: string | null;
  jumua?: string | null;
  created_at: string;
  updated_at?: string | null;
};

// Hilfsfunktionen für die Formatierung von Daten

/**
 * Formatiert ein Datum im deutschen Format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatiert eine Uhrzeit im deutschen Format
 */
export function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '-';
  
  // Wenn timeString ein vollständiges Datum-Zeit-Format ist
  if (timeString.includes('T') || timeString.includes(' ')) {
    return new Date(timeString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Wenn timeString nur die Uhrzeit ist (z.B. "14:30:00")
  return timeString.substring(0, 5);
}

/**
 * Gibt den Namen des Wochentags zurück
 */
export function getWeekdayName(day: number): string {
  const weekdays = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag'
  ];
  
  return weekdays[day] || '';
}
