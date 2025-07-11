"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeSwitcherWrapper } from "@/components/theme-switcher-wrapper";
import { LanguageFlagsSelector } from "@/components/language-flags-selector";
import SimpleNavigation from "@/components/simple-navigation";

interface MobileMenuProps {
  locale: string;
  messages: any;
}

export function MobileMenu({ locale, messages }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Schließe das Menü, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu-container relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div 
          className="absolute top-14 left-1/2 transform -translate-x-1/2 w-screen sm:w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg rounded-xl border border-foreground/10 p-4 flex flex-col gap-4"
          style={{
            position: 'fixed',
            zIndex: 9999
          }}
        >
          <Link
            href="https://link.deenly.io/WiFdfX"
            className="bg-[hsl(var(--deenly-primary-button))] text-white hover:bg-[hsl(var(--deenly-primary-button)/90%)] rounded-full text-sm font-medium px-4 py-2 shadow-sm text-center"
            onClick={() => setIsOpen(false)}
          >
            {messages.navigation["download-app"]}
          </Link>

          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-3 items-center" onClick={(e) => e.stopPropagation()}>
              <LanguageFlagsSelector />
              <ThemeSwitcherWrapper />
            </div>
            <SimpleNavigation />
          </div>
        </div>
      )}
    </div>
  );
}
