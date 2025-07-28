import FloatingAddButton from "@/components/floating-add-button";
import KhutbasDisplay from "@/components/khutbas-display";
import MosqueAnnouncement from "@/components/mosque-announcement";
import MosqueHeader from "@/components/mosque-header";
import PrayerTimesDisplayAdhan from "@/components/prayer-times-display-adhan";
import { Lecture, Mosque } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function MoscheeDetailPage({ params }: { params: Promise<{ handle: string; locale: string }> }) {
  const supabase = await createClient();
  const { handle, locale } = await params;
  
  // Funktion zur Überprüfung, ob eine Ankündigung angezeigt werden soll
  const shouldShowAnnouncement = (mosque: Mosque): boolean => {
    if (!mosque.announcement) return false;
    
    const now = new Date();
    let isValid = true;
    
    // Prüfe Startdatum (wenn vorhanden)
    if (mosque.announcement_date) {
      const startDate = new Date(mosque.announcement_date);
      if (startDate > now) {
        isValid = false;
      }
    }
    
    // Prüfe Ablaufdatum (wenn vorhanden)
    if (mosque.announcement_expiry) {
      const expiryDate = new Date(mosque.announcement_expiry);
      if (expiryDate < now) {
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  // Lade Moschee-Daten aus der Datenbank basierend auf dem Handle
  let mosque: Mosque | null = null;
  let khutbas: Lecture[] = [];
  
  try {
    // Moschee-Daten laden basierend auf dem Handle (statt ID)
    const { data: mosqueData, error: mosqueError } = await supabase
      .from('mosques')
      .select('*')
      .eq('handle', handle)
      .single();
      
    if (mosqueError) {
      console.error(mosqueError);
      return notFound();
    }
    
    mosque = mosqueData as Mosque;
    
    // Wenn diese Moschee nicht existiert oder keinen Handle hat
    if (!mosque || !mosque.handle) {
      return notFound();
    }
    
    // Khutbas laden - nur öffentliche Einträge, sortiert nach Erstellungsdatum, begrenzt auf 5
    try {
      const { data: khutbasData } = await supabase
        .from('lectures')
        .select('*')
        .eq('mosque_id', mosque.id) // Verwende die ID der Moschee
        .eq('status', 'Public') // Nur öffentliche Einträge
        .order('created_at', { ascending: false }) // Nach Erstellungsdatum sortieren (neueste zuerst)
        .limit(5); // Nur 5 Einträge
        
      if (khutbasData) {
        khutbas = khutbasData as Lecture[];
      }
    } catch (error) {
      console.error(error);
    }
    
   
  } catch (error) {
    console.error(error);
    return notFound();
  }
  
  return (
    <>
      <div className="w-full max-w-4xl mx-auto pt-10 md:pt-4 lg:pt-0 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <MosqueHeader mosque={mosque} />
        
        <MosqueAnnouncement mosque={mosque} shouldShow={shouldShowAnnouncement(mosque)} />
        
        {/* Gebetszeiten Komponente */}
        <PrayerTimesDisplayAdhan mosque={mosque} />

        {/* Khutbas Komponente */}
        <KhutbasDisplay initialKhutbas={khutbas} mosqueId={mosque.id} mosqueHandle={handle} />
      </div>
      
      {/* Floating Add Button for Khutbahs */}
      <FloatingAddButton mosqueId={mosque.id} />
    </>
  );
}
