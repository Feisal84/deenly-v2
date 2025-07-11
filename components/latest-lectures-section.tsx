"use client";

import { Button } from "@/components/ui/button";
import { Lecture } from "@/lib/types";
import { getFallbackLectures } from "@/utils/fallback-data";
import { createClient } from "@/utils/supabase/client";
import { getSupabaseConfig, testSupabaseConnection } from "@/utils/supabase/connection-test";
import { AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LectureWithMosque extends Lecture {
  mosque?: {
    name: string;
    handle: string;
  };
}

export default function LatestLecturesSection() {
  const [lectures, setLectures] = useState<LectureWithMosque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const t = useTranslations("mosque");
  const actionT = useTranslations("actions");
  const locale = useLocale();

  useEffect(() => {
    async function fetchLatestLectures() {
      try {
        // First test the connection
        const config = getSupabaseConfig();
        console.log("Supabase Config:", config);
        
        const connectionTest = await testSupabaseConnection();
        console.log("Connection test result:", connectionTest);
        
        if (!connectionTest.isConnected) {
          console.error("Supabase connection failed:", connectionTest);
          setIsSupabaseAvailable(false);
          
          // Use fallback data instead of showing error
          const fallbackData = getFallbackLectures();
          setLectures(fallbackData);
          setUsingFallbackData(true);
          setIsLoading(false);
          return;
        }
        
        const supabase = createClient();
        console.log("Versuche Vorträge zu laden...");
        
        const { data, error } = await supabase
          .from("lectures")
          .select("*")
          .eq("status", "Public")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Supabase Fehler:", error.message, error.details, error.hint);
          console.error("Full error object:", error);
          setError(`Fehler beim Laden der Vorträge: ${error.message}`);
          setIsLoading(false);
          return;
        }
        
        console.log("Vorträge erfolgreich geladen:", data?.length || 0);
        
        // Wenn wir die Vorträge haben, laden wir die zugehörigen Moscheen
        if (data && data.length > 0) {
          const lecturesWithMosque: LectureWithMosque[] = [...data];
          
          // Für jeden Vortrag die zugehörige Moschee laden
          for (let i = 0; i < lecturesWithMosque.length; i++) {
            const lecture = lecturesWithMosque[i];
            try {
              const { data: mosqueData, error: mosqueError } = await supabase
                .from("mosques")
                .select("name, handle")
                .eq("id", lecture.mosque_id)
                .single();
                
              if (mosqueError) {
                console.error("Fehler beim Laden der Moschee:", mosqueError.message);
              } else if (mosqueData) {
                lecturesWithMosque[i] = {
                  ...lecture,
                  mosque: mosqueData
                };
              }
            } catch (error) {
              console.error("Fehler beim Laden der Moschee für Vortrag:", lecture.id, error);
            }
          }
          
          setLectures(lecturesWithMosque);
        } else {
          setLectures([]);
        }
      } catch (error) {
        console.error("Netzwerk- oder Verbindungsfehler:", error);
        setIsSupabaseAvailable(false);
        
        // Use fallback data instead of showing error
        const fallbackData = getFallbackLectures();
        setLectures(fallbackData);
        setUsingFallbackData(true);
        
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          console.warn("Using fallback data due to network connectivity issues");
        } else if (error instanceof Error && error.message.includes("environment variables")) {
          console.warn("Using fallback data due to missing Supabase configuration");
        } else if (error instanceof Error) {
          console.warn(`Using fallback data due to error: ${error.message}`);
        } else {
          console.warn("Using fallback data due to unknown connection error");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestLectures();
  }, []);

  // Hilfsfunktion zum Formatieren des Datums
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale);
  };

  // Hilfsfunktion zum Abrufen des lokalisierten Titels
  const getLocalizedTitle = (lecture: Lecture) => {
    if (!lecture.title_translations) return lecture.title;
    
    const translations = lecture.title_translations as Record<string, string>;
    
    if (translations[locale]) {
      return translations[locale];
    }
    
    if (translations["orig"]) {
      return translations["orig"];
    }
    
    return lecture.title;
  };

  // Hilfsfunktion zum Abschneiden des Inhalts
  const truncateContent = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  return (
    <section className="w-full py-12 px-4 md:px-6 bg-muted/80 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("latestKhutbas")}</h2>
          <Link href={`/${locale}/moscheen`}>
            <Button variant="outline" className="mt-4 md:mt-0">
              {t("mosqueNavLink", { defaultValue: "Moscheen entdecken" })}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {!isSupabaseAvailable 
                ? "Dienst vorübergehend nicht verfügbar" 
                : "Fehler beim Laden"
              }
            </h3>
            <p className="text-muted-foreground mb-2">
              {error}
            </p>
            <p className="text-muted-foreground mb-4">
              {!isSupabaseAvailable 
                ? "Unsere Datenbank ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut." 
                : "Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support."
              }
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()} 
                className="mr-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded hover:bg-primary/20"
              >
                Seite neu laden
              </button>
              <Link href={`/${locale}/moscheen`}>
                <Button>
                  {t("mosqueNavLink", { defaultValue: "Moscheen entdecken" })}
                </Button>
              </Link>
            </div>
          </div>
        ) : lectures.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t("noKhutbas")}</p>
            <Link href={`/${locale}/moscheen`}>
              <Button>
                {t("mosqueNavLink", { defaultValue: "Moscheen entdecken" })}
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {usingFallbackData && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">ⓘ Demo-Modus:</span> Da unsere Datenbank momentan nicht erreichbar ist, werden Beispieldaten angezeigt.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lectures.map((lecture) => (
              <div 
                key={lecture.id} 
                className="bg-card border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium line-clamp-2">
                      {getLocalizedTitle(lecture)}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(lecture.created_at)}
                    </span>
                  </div>
                  
                  {lecture.mosque && lecture.mosque.name && (
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground">
                        {t("mosque")}: {" "}
                        {lecture.mosque.handle ? (
                          <Link 
                            href={`/${locale}/moscheen/${lecture.mosque.handle}`}
                            className="text-primary hover:underline"
                          >
                            {lecture.mosque.name}
                          </Link>
                        ) : (
                          <span>{lecture.mosque.name}</span>
                        )}
                      </span>
                    </div>
                  )}
                  
                  {lecture.content && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {truncateContent(lecture.content)}
                    </p>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild={!!(lecture.mosque?.handle)}
                      className="text-primary hover:text-primary/80"
                    >
                      {lecture.mosque?.handle ? (
                        <Link href={`/${locale}/moscheen/${lecture.mosque.handle}/lecture/${lecture.id}`}>
                          {actionT("readMore", { defaultValue: "Mehr lesen" })}
                        </Link>
                      ) : (
                        <span>{actionT("readMore", { defaultValue: "Mehr lesen" })}</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
