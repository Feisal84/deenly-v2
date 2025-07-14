"use server";

import { createClient } from "@/utils/supabase/server";

// Hier können in Zukunft andere serverseitige Aktionen implementiert werden
// die keine Authentifizierung erfordern

/**
 * Inkrementiert die Anzahl der Aufrufe (num_views) für einen Vortrag
 * durch direktes Update in der Datenbank
 */
export async function incrementLectureViews(lectureId: string): Promise<void> {
  try {
    const supabase = await createClient();
    
    // Verwende die SQL-Funktion zum sicheren Inkrementieren
    const { error } = await supabase.rpc('increment_lecture_views', { 
      lecture_id: lectureId 
    });
    
    if (error) {
      console.error("Fehler beim Aktualisieren der Aufrufe:", error);
      // Fallback: Wenn RPC nicht funktioniert, verwende einfaches SQL
      const { data: currentLecture, error: fetchError } = await supabase
        .from('lectures')
        .select('num_views')
        .eq('id', lectureId)
        .single();
        
      if (!fetchError && currentLecture) {
        const newViews = (currentLecture.num_views || 0) + 1;
        const { error: updateError } = await supabase
          .from('lectures')
          .update({ num_views: newViews })
          .eq('id', lectureId);
          
        if (updateError) {
          console.error("Fallback Update-Fehler:", updateError);
        }
      }
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Aufrufe:", error);
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
    
    if (mosqueError) {
      console.error("Fehler beim Zählen der Moscheen:", mosqueError);
    }
    
    // Lectures zählen
    const { count: lectureCount, error: lectureError } = await supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Public');
    
    if (lectureError) {
      console.error("Fehler beim Zählen der Lectures:", lectureError);
    }
    
    // Aufrufe summieren
    const { data: viewsData, error: viewsError } = await supabase
      .from('lectures')
      .select('num_views')
      .eq('status', 'Public');
    
    let totalViews = 0;
    if (viewsError) {
      console.error("Fehler beim Abrufen der Aufrufe:", viewsError);
    } else {
      totalViews = viewsData?.reduce((sum, lecture) => sum + (lecture.num_views || 0), 0) || 0;
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
