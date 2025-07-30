'use client';

import { Lecture, formatDate } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

interface LectureContentProps {
  lecture: Lecture;
  mosqueName: string | null;
  locale: string;
  handle?: string; // Optionaler Handle für die Verlinkung zur Moschee
}

export default function LectureContent({ lecture, mosqueName, locale, handle }: LectureContentProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'original' | 'translation'>('translation');
  const [fontSize, setFontSize] = useState(100); // Prozentsatz der Basis-Schriftgröße
  
  // Übersetzungen laden
  const t = useTranslations('lecture');

  // Hilfsfunktion zum Abrufen des lokalisierten Titels
  const getLocalizedTitle = () => {
    try {
      if (!lecture.title_translations) return lecture.title;
      
      const translations = lecture.title_translations as Record<string, string>;
      
      // Safely check if translations is an object
      if (!translations || typeof translations !== 'object') {
        return lecture.title;
      }
      
      // Check if we have a translation for the current locale
      if (translations[locale]) {
        return translations[locale];
      }
      
      // Fallback to original title
      if (translations["orig"]) {
        return translations["orig"];
      }
      
      return lecture.title;
    } catch (error) {
      console.error('Error getting localized title:', error);
      return lecture.title;
    }
  };

  // Hilfsfunktion zur Überprüfung, ob Übersetzungen verfügbar sind
  const hasTranslations = () => {
    return lecture.translation_map && 
      typeof lecture.translation_map === 'object' &&
      Object.keys(lecture.translation_map).length > 0;
  };

  // Prüfen, ob die Sprache von rechts nach links gelesen wird (RTL)
  const isRTL = (language: string) => {
    return language === 'ar'; // Arabisch ist RTL
  };

  // Prüft, ob ein Text arabische Zeichen enthält
  const containsArabic = (text: string) => {
    // Unicode-Bereich für arabische Schrift: U+0600 bis U+06FF
    // Zusätzliche arabische Zeichen: U+0750 bis U+077F, U+08A0 bis U+08FF
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
  };

  // Funktion zum Erstellen des übersetzten Fließtextes in der aktuellen Sprache
  const getTranslationText = () => {
    try {
      if (!hasTranslations()) return null;

      const translationMap = lecture.translation_map as Record<string, any>;
      
      // Safely check if translationMap is an object
      if (!translationMap || typeof translationMap !== 'object') {
        return null;
      }
      
      // New structure: { "en": { title: "...", content: "..." }, "de": { ... }, ... }
      if (translationMap[locale] && typeof translationMap[locale] === 'object' && translationMap[locale].content) {
        return translationMap[locale].content;
      }
      
      // Fallback to original content if no translation for current locale
      if (translationMap['orig'] && typeof translationMap['orig'] === 'object' && translationMap['orig'].content) {
        return translationMap['orig'].content;
      }
      
      // If no structured translations, return null to show original
      return null;
    } catch (error) {
      console.error('Error getting translation text:', error);
      return null;
    }
  };

  // Der übersetzte Inhalt als Fließtext
  const translatedContent = getTranslationText();

  // Formatieren des Vortragsinhalt mit Absätzen und RTL-Unterstützung
  const formatContent = (content: string, lang: string = 'orig') => {
    // Bestimmen, ob Text von rechts nach links gelesen wird
    const isRightToLeft = isRTL(lang);
    
    return content.split('\n').map((paragraph, index) => {
      // Prüfen, ob dieser Absatz arabischen Text enthält
      const paragraphHasArabic = containsArabic(paragraph);
      const shouldUseRTL = isRightToLeft || paragraphHasArabic;
      
      return (
        <p 
          key={index} 
          className={`${paragraph.trim().startsWith('#') ? 'font-bold mt-4' : 'mt-2'} ${shouldUseRTL ? 'text-right' : ''}`}
          dir={shouldUseRTL ? 'rtl' : 'ltr'}
          style={{ fontSize: `${fontSize}%` }}
        >
          {paragraph.trim().startsWith('#') ? paragraph.substring(1).trim() : paragraph}
        </p>
      );
    });
  };

  // Funktionen zur Steuerung der Schriftgröße
  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 10, 200)); // Max 200%
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 10, 60)); // Min 60%
  };

  const resetFontSize = () => {
    setFontSize(100); // Zurücksetzen auf Standard
  };

  return (
    <article className="bg-card border rounded-lg shadow-sm p-6 mb-8">
      <header className="mb-6">
        <h1 
          className="text-3xl font-bold mb-2"
          dir={isRTL(locale) || containsArabic(getLocalizedTitle()) ? 'rtl' : 'ltr'}
          style={{
            textAlign: isRTL(locale) || containsArabic(getLocalizedTitle()) ? 'right' : 'left',
            fontSize: `calc(1.875rem * ${fontSize/100})` // Anpassung der text-3xl Größe
          }}
        >
          {getLocalizedTitle()}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2 sm:gap-4">
          {mosqueName && handle && (
            <div>
              <span className="font-medium">{t('mosque')}:</span>{" "}
              <Link href={`/${locale}/moscheen/${handle}`} className="hover:text-primary hover:underline">
                {mosqueName}
              </Link>
            </div>
          )}
          <div>
            <span className="font-medium">{t('date')}:</span> {formatDate(lecture.created_at)}
          </div>
          <div>
            <span className="font-medium">{t('views')}:</span> {lecture.num_views}
          </div>
        </div>
      </header>

      {hasTranslations() && translatedContent && (
        <div className="mb-6 border-b">
          <div className="flex space-x-4 -mb-px">
            <button
              onClick={() => setActiveTab('translation')}
              className={`py-2 px-4 ${
                activeTab === 'translation'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {t('translation')}
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`py-2 px-4 ${
                activeTab === 'original'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {t('original')}
            </button>
          </div>
        </div>
      )}

      {/* Schriftgröße-Steuerelemente */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-muted-foreground">{t('fontSize')}:</span>
        <div className="flex items-center border rounded-md">
          <button
            onClick={decreaseFontSize}
            className="flex items-center justify-center h-8 w-8 text-lg border-r hover:bg-muted"
            aria-label={t('decreaseFontSize')}
            title={t('decreaseFontSize')}
          >
            {t('decreaseFontSizeSymbol')}
          </button>
          <button
            onClick={resetFontSize}
            className="flex items-center justify-center h-8 px-2 text-xs border-r hover:bg-muted"
            aria-label={t('resetFontSize')}
            title={t('resetFontSize')}
          >
            {fontSize}%
          </button>
          <button
            onClick={increaseFontSize}
            className="flex items-center justify-center h-8 w-8 text-lg hover:bg-muted"
            aria-label={t('increaseFontSize')}
            title={t('increaseFontSize')}
          >
            {t('increaseFontSizeSymbol')}
          </button>
        </div>
      </div>

      <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
        {activeTab === 'translation' && translatedContent ? (
          formatContent(translatedContent, locale)
        ) : (
          formatContent(lecture.content)
        )}
      </div>
    </article>
  );
}
