"use server";

import { createClient } from "@/utils/supabase/server";

// AI Translation Service
const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'de': 'German',
  'tr': 'Turkish',
  'ar': 'Arabic',
  'fr': 'French',
  'es': 'Spanish',
  'ru': 'Russian'
};

/**
 * Translates text using OpenAI API with retry logic for rate limits
 */
async function translateWithAI(text: string, targetLanguage: string, sourceLanguage: string = 'en', retries: number = 3): Promise<string> {
  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("OpenAI API key not found. Translation skipped.");
      return text; // Return original text if no API key
    }

    const languageName = SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES];
    if (!languageName) {
      console.warn(`Unsupported language: ${targetLanguage}`);
      return text;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in Islamic religious content. Translate the following text to ${languageName} while preserving the Islamic terminology, Quranic verses (keep Arabic text), and religious context. Maintain the same structure and formatting.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      // If rate limited and we have retries left, wait and retry
      if (response.status === 429 && retries > 0) {
        console.log(`Rate limited, retrying in 5 seconds... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return translateWithAI(text, targetLanguage, sourceLanguage, retries - 1);
      }
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || text;
    
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error);
    return text; // Return original text on error
  }
}

/**
 * Translates khutbah content into multiple languages using AI
 */
export async function translateKhutbah(title: string, content: string, sourceLanguage: string = 'en') {
  const translations: Record<string, any> = {};
  
  // Languages to translate to (excluding source language)
  const targetLanguages = Object.keys(SUPPORTED_LANGUAGES).filter(lang => lang !== sourceLanguage);
  
  console.log(`Starting AI translation for khutbah: ${title}`);
  
  for (const lang of targetLanguages) {
    try {
      console.log(`Translating to ${SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]}...`);
      
      // Translate title
      const translatedTitle = await translateWithAI(title, lang, sourceLanguage);
      
      // Translate content (split into chunks if too long)
      const translatedContent = await translateWithAI(content, lang, sourceLanguage);
      
      translations[lang] = {
        title: translatedTitle,
        content: translatedContent
      };
      
      // Add longer delay to avoid rate limiting (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`Failed to translate to ${lang}:`, error);
      // Keep original text as fallback
      translations[lang] = {
        title: title,
        content: content
      };
    }
  }
  
  console.log(`Translation completed for ${Object.keys(translations).length} languages`);
  return translations;
}

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
 * Creates a new lecture for authenticated imams/admins with AI translations
 */
export async function createLecture(lectureData: {
  title: string;
  content: string;
  type: string;
  status: 'Draft' | 'Public';
  mosque_id: string;
  created_by: string;
  enableAITranslation?: boolean;
}) {
  const supabase = await createClient();
  
  try {
    let titleTranslations = { orig: lectureData.title };
    let translationMap: Record<string, any> = {};
    
    // Generate AI translations if enabled
    if (lectureData.enableAITranslation) {
      console.log("Generating AI translations for khutbah...");
      const aiTranslations = await translateKhutbah(lectureData.title, lectureData.content);
      
      // Build title translations
      Object.keys(aiTranslations).forEach(lang => {
        titleTranslations[lang as keyof typeof titleTranslations] = aiTranslations[lang].title;
      });
      
      // Build content translations map
      translationMap = aiTranslations;
    }

    const { data, error } = await supabase
      .from("lectures")
      .insert({
        title: lectureData.title,
        content: lectureData.content,
        type: lectureData.type,
        status: lectureData.status,
        mosque_id: lectureData.mosque_id,
        created_by: lectureData.created_by,
        num_views: 0,
        title_translations: titleTranslations,
        translation_map: translationMap
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
