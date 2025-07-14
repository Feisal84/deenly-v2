"use client";

import { Button } from "@/components/ui/button";
import { Lecture } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
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
  const t = useTranslations("mosque");
  const actionT = useTranslations("actions");
  const locale = useLocale();

  useEffect(() => {
    async function fetchLatestLectures() {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from("lectures")
          .select(`
            *,
            mosques!inner(name, handle)
          `)
          .eq("status", "Public")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          setError(error.message);
        } else {
          // Transform data to include mosque information
          const lecturesWithMosque = data?.map(lecture => ({
            ...lecture,
            mosque: lecture.mosques
          })) || [];
          setLectures(lecturesWithMosque);
        }
        
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
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
            <p className="text-red-500 mb-4">Fehler beim Laden: {error}</p>
            <Link href={`/${locale}/moscheen`}>
              <Button>
                {t("mosqueNavLink", { defaultValue: "Moscheen entdecken" })}
              </Button>
            </Link>
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
        )}
      </div>
    </section>
  );
}
