"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCallback } from "react";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = useCallback(
    (newLocale: string) => {
      // Bei next/navigation müssen wir den Pfad manuell aktualisieren
      const currentPathname = pathname;
      // Entferne das aktuelle Locale aus dem Pfad, falls vorhanden
      const segments = currentPathname.split('/');
      const pathWithoutLocale = segments.length > 2 ? segments.slice(2).join('/') : '';
      
      // Navigiere zur neuen URL mit dem neuen Locale
      router.push(`/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`);
    },
    [pathname, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={"sm"} 
          className="border border-foreground/20 rounded-full h-8 min-w-8 px-3"
        >
          {locale === "de" ? "DE" : locale === "en" ? "EN" : locale === "es" ? "ES" : locale === "fr" ? "FR" : locale === "tr" ? "TR" : locale === "ru" ? "RU" : "AR"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content border-[hsl(var(--deenly-background-secondary))]" align="start">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="de">
            <span>Deutsch</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="en">
            <span>English</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="es">
            <span>Español</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="fr">
            <span>Français</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="tr">
            <span>Türkçe</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="ru">
            <span>Русский</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 text-[hsl(var(--deenly-text-primary))]" value="ar">
            <span>العربية</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
