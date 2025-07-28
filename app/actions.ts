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
    
    // Verwende zuerst die SQL-Funktion zum sicheren Inkrementieren
    const { error: rpcError } = await supabase.rpc('increment_lecture_views', { 
      lecture_id: lectureId 
    });
    
    // Wenn RPC-Funktion nicht existiert oder fehlschlägt, verwende Fallback
    if (rpcError) {
      console.warn("RPC-Funktion nicht verfügbar, verwende Fallback:", rpcError.message);
      
      // Fallback: Hole aktuellen Wert und inkrementiere
      const { data: currentLecture, error: fetchError } = await supabase
        .from('lectures')
        .select('num_views')
        .eq('id', lectureId)
        .single();
        
      if (fetchError) {
        console.error("Fehler beim Abrufen des aktuellen Wertes:", fetchError);
        return;
      }
      
      if (currentLecture) {
        const newViews = (currentLecture.num_views || 0) + 1;
        const { error: updateError } = await supabase
          .from('lectures')
          .update({ num_views: newViews })
          .eq('id', lectureId);
          
        if (updateError) {
          console.error("Fehler beim Update der Aufrufe:", updateError);
        } else {
          console.log(`Aufrufe erfolgreich aktualisiert: ${newViews} für Lecture ${lectureId}`);
        }
      }
    } else {
      console.log(`Aufrufe erfolgreich über RPC inkrementiert für Lecture ${lectureId}`);
    }
  } catch (error) {
    console.error("Unerwarteter Fehler beim Aktualisieren der Aufrufe:", error);
  }
}

/**
 * Holt Statistikdaten aus der Datenbank:
 * - Anzahl der Moscheen
 * - Anzahl der Lectures/Khutbas
 * - Gesamtanzahl der Aufrufe
 */
export async function fetchStatistics() {
  const supabase = await createClient();
  
  try {
    // Anzahl der Moscheen
    const { count: mosqueCount } = await supabase
      .from("mosques")
      .select("*", { count: "exact", head: true });

    // Anzahl der öffentlichen Lectures
    const { count: lectureCount } = await supabase
      .from("lectures")
      .select("*", { count: "exact", head: true })
      .eq("status", "Public");

    // Gesamtanzahl der Aufrufe
    const { data: viewsData } = await supabase
      .from("lectures")
      .select("num_views")
      .eq("status", "Public");

    const totalViews = viewsData?.reduce((sum, lecture) => sum + (lecture.num_views || 0), 0) || 0;

    return {
      mosqueCount: mosqueCount || 0,
      lectureCount: lectureCount || 0,
      totalViews
    };
  } catch (error) {
    console.error("Fehler beim Laden der Statistiken:", error);
    return {
      mosqueCount: 0,
      lectureCount: 0,
      totalViews: 0
    };
  }
}

/**
 * Creates a new lecture for authenticated imams/admins
 */
export async function createLecture(lectureData: {
  title: string;
  content: string;
  type: string;
  status: 'Draft' | 'Public';
  mosque_id: string;
  created_by: string;
}) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from("lectures")
      .insert({
        ...lectureData,
        num_views: 0,
        title_translations: { orig: lectureData.title },
        translation_map: {}
      })
      .select()
      .single();

    if (error) {
      console.error("Fehler beim Erstellen des Vortrags:", error);
      throw new Error(`Fehler beim Erstellen des Vortrags: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unerwarteter Fehler beim Erstellen des Vortrags:", error);
    throw error;
  }
}
