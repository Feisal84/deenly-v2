"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useCallback } from "react";

// Definiere die Reihenfolge der Sprachen für den Toggle
const languages = ["de", "en", "es", "fr", "tr", "ru", "ar"];

export const LanguageSwitcherToggle = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const getNextLanguage = (currentLocale: string) => {
    const currentIndex = languages.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % languages.length;
    return languages[nextIndex];
  };

  const handleToggle = useCallback(() => {
    const nextLocale = getNextLanguage(locale);
    
    // Bei next/navigation müssen wir den Pfad manuell aktualisieren
    const currentPathname = pathname;
    // Entferne das aktuelle Locale aus dem Pfad, falls vorhanden
    const segments = currentPathname.split('/');
    const pathWithoutLocale = segments.length > 2 ? segments.slice(2).join('/') : '';
    
    // Navigiere zur neuen URL mit dem neuen Locale
    router.push(`/${nextLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`);
  }, [locale, pathname, router]);

  const getLanguageLabel = (lang: string) => {
    switch(lang) {
      case "de": return "DE";
      case "en": return "EN";
      case "es": return "ES";
      case "fr": return "FR";
      case "tr": return "TR";
      case "ru": return "RU";
      case "ar": return "AR";
      default: return lang.toUpperCase();
    }
  };

  return (
    <Button 
      variant="outline" 
      size={"sm"} 
      className="border border-foreground/20 rounded-full h-8 min-w-8 px-3"
      onClick={handleToggle}
    >
      {getLanguageLabel(locale)} → {getLanguageLabel(getNextLanguage(locale))}
    </Button>
  );
};
