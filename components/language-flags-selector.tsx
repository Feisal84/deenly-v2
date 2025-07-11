"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useCallback } from "react";

// Definiere die Sprachen mit ihren Flaggen-Emojis
const languages = [
  { code: "de", flag: "🇩🇪" },
  { code: "en", flag: "🇬🇧" },
  { code: "es", flag: "🇪🇸" },
  { code: "fr", flag: "🇫🇷" },
  { code: "tr", flag: "🇹🇷" },
  { code: "ru", flag: "🇷🇺" },
  { code: "ar", flag: "🇵🇸" }
];

export const LanguageFlagsSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = useCallback((newLocale: string) => {
    // Bei next/navigation müssen wir den Pfad manuell aktualisieren
    const currentPathname = pathname;
    // Entferne das aktuelle Locale aus dem Pfad, falls vorhanden
    const segments = currentPathname.split('/');
    const pathWithoutLocale = segments.length > 2 ? segments.slice(2).join('/') : '';
    
    // Navigiere zur neuen URL mit dem neuen Locale
    router.push(`/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`);
  }, [pathname, router]);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {languages.map(({ code, flag }) => (
        <Button 
          key={code}
          variant={locale === code ? "default" : "ghost"}
          size="sm"
          className={`px-2 min-w-0 h-8 ${locale === code ? 'bg-[hsl(var(--deenly-primary-button))]' : ''}`}
          onClick={() => handleLanguageChange(code)}
        >
          <span className="text-lg">{flag}</span>
        </Button>
      ))}
    </div>
  );
};
