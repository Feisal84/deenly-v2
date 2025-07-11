"use server";

import { createClient } from "@/utils/supabase/server";

// Hier können in Zukunft andere serverseitige Aktionen implementiert werden
// die keine Authentifizierung erfordern

/**
 * Inkrementiert die Anzahl der Aufrufe (num_views) für einen Vortrag
 * durch Aufruf der Supabase Edge Function "incr-lecture-viewer"
 */
export async function incrementLectureViews(lectureId: string): Promise<void> {
  try {
    const supabase = await createClient();
    
    // Rufe die Edge Function auf
    const { error } = await supabase.functions.invoke("incr-lecture-viewer", {
      body: { id: lectureId },
    });
    
    if (error) {
      console.error("Fehler beim Aktualisieren der Aufrufe:", error);
    }
  } catch (error) {
    console.error("Fehler beim Aufrufen der Edge Function:", error);
  }
}

/**
 * Holt Statistikdaten aus der Datenbank:
 * - Anzahl der Moscheen
 * - Anzahl der Lectures/Khutbas
 * - Gesamtanzahl der Aufrufe
 */
export async function fetchStatistics() {
  try {
    const supabase = await createClient();
    
    // Moscheen zählen
    const { count: mosqueCount, error: mosqueError } = await supabase
      .from('mosques')
      .select('*', { count: 'exact', head: true });
    
    // Lectures zählen
    const { count: lectureCount, error: lectureError } = await supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Public');
    
    // Summe der Aufrufe berechnen
    const { data: viewsData, error: viewsError } = await supabase
      .from('lectures')
      .select('num_views')
      .eq('status', 'Public');
    
    const totalViews = viewsData?.reduce((sum, lecture) => sum + (lecture.num_views || 0), 0) || 0;
    
    if (mosqueError || lectureError || viewsError) {
      console.error("Fehler beim Abrufen der Statistiken:", mosqueError || lectureError || viewsError);
      // Fallback zu den Standard-Werten
      return {
        mosques: 120,
        lectures: 5000,
        views: 250000
      };
    }
    
    return {
      mosques: mosqueCount || 0,
      lectures: lectureCount || 0,
      views: totalViews
    };
  } catch (error) {
    console.error("Fehler beim Abrufen der Statistiken:", error);
    // Fallback zu den Standard-Werten
    return {
      mosques: 120,
      lectures: 5000,
      views: 250000
    };
  }
}
