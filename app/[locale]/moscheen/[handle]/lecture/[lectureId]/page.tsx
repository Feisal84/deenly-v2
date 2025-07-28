import { incrementLectureViews } from "@/app/actions";
import LectureContent from "@/components/lecture-content";
import { Lecture } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// Diese Seite zeigt einen einzelnen Vortrag (Lecture/Khutba) an
export default async function LecturePage({
  params,
}: {
  params: Promise<{ handle: string; lectureId: string; locale: string }>;
}) {
  const { handle, lectureId, locale } = await params;
  const supabase = await createClient();

  let lecture: Lecture | null = null;
  let mosqueName: string | null = null;

  try {
    // Lade den Vortrag aus der Datenbank
    const { data: lectureData, error: lectureError } = await supabase
      .from("lectures")
      .select("*")
      .eq("id", lectureId)
      .single();

    if (lectureError || !lectureData) {
      console.error("Fehler beim Laden des Vortrags:", lectureError);
      return notFound();
    }

    lecture = lectureData as Lecture;

    // Prüfe, ob der Vortrag öffentlich ist
    if (lecture.status !== "Public") {
      return notFound();
    }
    
    // Lade die Moschee-Daten separat
    const { data: mosqueData, error: mosqueError } = await supabase
      .from("mosques")
      .select("name")
      .eq("id", lecture.mosque_id)
      .single();
      
    if (mosqueError) {
      console.error("Fehler beim Laden der Moschee:", mosqueError);
    } else if (mosqueData) {
      mosqueName = mosqueData.name;
    }

    // Aktualisiere die Aufrufe (num_views) mit verbesserter Fehlerbehandlung
    // Dies läuft asynchron im Hintergrund und blockiert die Seite nicht
    incrementLectureViews(lectureId).catch((viewError) => {
      // Stille Behandlung von View-Increment-Fehlern
      console.warn("View-Count konnte nicht aktualisiert werden:", viewError?.message || viewError);
    });

  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    return notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-20 md:pt-4 lg:pt-0">
      <LectureContent lecture={lecture} mosqueName={mosqueName} locale={locale} handle={handle} />
    </div>
  );
}
