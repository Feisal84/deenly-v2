'use client';

import { useState, useEffect } from 'react';
import { Lecture, formatDate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

interface KhutbasDisplayProps {
  initialKhutbas: Lecture[];
  mosqueId: string;
  mosqueHandle: string;
  className?: string;
}

export default function KhutbasDisplay({ initialKhutbas, mosqueId, mosqueHandle, className = "" }: KhutbasDisplayProps) {
  const [khutbas, setKhutbas] = useState<Lecture[]>(initialKhutbas);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialKhutbas.length === 5);
  const locale = useLocale();
  const t = useTranslations('actions');
  const errorT = useTranslations('errors');
  const mosqueT = useTranslations('mosque');

  const getLocalizedTitle = (khutba: Lecture) => {
    if (!khutba.title_translations) return khutba.title;
    
    const translations = khutba.title_translations as Record<string, string>;
    
    // Versuche, die Übersetzung in der aktuellen Sprache zu finden
    if (translations[locale]) {
      return translations[locale];
    }
    
    // Fallback: Wenn die aktuelle Sprache nicht verfügbar ist, versuche "orig"
    if (translations["orig"]) {
      return translations["orig"];
    }
    
    // Falls nichts davon klappt, verwende den Standard-Titel
    return khutba.title;
  };

  const loadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/mosques/${mosqueId}/lectures?skip=${khutbas.length}`);
      const data = await response.json();
      
      if (data.lectures && data.lectures.length > 0) {
        setKhutbas([...khutbas, ...data.lectures]);
        setHasMore(data.lectures.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(`${errorT('loadingMoreKhutbas')}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`mb-8 md:mb-10 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 md:mb-6 border-b pb-2">{mosqueT('latestKhutbas')}</h2>
      {khutbas.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {khutbas.map((khutba) => (
            <div key={khutba.id} className="border rounded-lg p-3 md:p-4 hover:border-primary hover:shadow-md transition-all">
              <Link 
                href={`/${locale}/moscheen/${mosqueHandle}/lecture/${khutba.id}`}
                className="block"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <h3 className="text-base md:text-lg font-medium mb-1 sm:mb-0">{getLocalizedTitle(khutba)}</h3>
                  <span className="text-xs sm:text-sm text-muted-foreground sm:ml-2 sm:flex-shrink-0">
                    {formatDate(khutba.created_at)}
                  </span>
                </div>
                {khutba.content && (
                  <p className="text-muted-foreground text-xs sm:text-sm mt-2 line-clamp-2">
                    {khutba.content.substring(0, 150)}...
                  </p>
                )}
              </Link>
            </div>
          ))}
          
          {hasMore && (
            <div className="mt-6 text-center">
              <Button 
                onClick={loadMore} 
                disabled={isLoading} 
                variant="outline"
              >
                {isLoading ? t('loading') : t('loadMore')}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          {mosqueT('noKhutbas')}
        </p>
      )}
    </section>
  );
}
