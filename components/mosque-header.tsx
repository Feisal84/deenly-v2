"use client";

import { useTranslations } from 'next-intl';
import { Mosque } from '@/lib/types';

interface MosqueHeaderProps {
  mosque: Mosque;
}

export default function MosqueHeader({ mosque }: MosqueHeaderProps) {
  const t = useTranslations('mosque');

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 md:mb-10">
      <div className="w-full md:w-3/4">
        <div className="h-48 sm:h-56 md:h-80 bg-[hsl(var(--deenly-background))/30%] rounded-lg overflow-hidden">
          {mosque.hero_path ? (
            <img 
              src={mosque.hero_path} 
              alt={mosque.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--deenly-background-secondary))/20%]">
              <span className="text-[hsl(var(--deenly-text-secondary))]">{t('noImage')}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-3 text-[hsl(var(--deenly-text-primary))]">{mosque.name}</h1>
        <p className="text-lg mb-4 text-[hsl(var(--deenly-text-secondary))]">
          {mosque.address}, {mosque.postal_code} {mosque.city}
        </p>
        
        <div className="space-y-2 mb-6">
          {mosque.phone && (
            <p className="text-sm text-[hsl(var(--deenly-text-primary))]">
              <span className="font-medium">{t('phone')}:</span> {mosque.phone}
            </p>
          )}
          {mosque.email && (
            <p className="text-sm text-[hsl(var(--deenly-text-primary))]">
              <span className="font-medium">{t('email')}:</span> {mosque.email}
            </p>
          )}
          {mosque.website && (
            <p className="text-sm text-[hsl(var(--deenly-text-primary))]">
              <span className="font-medium">{t('website')}:</span>{" "}
              <a 
                href={mosque.website} 
                target="_blank" 
                rel="noreferrer"
                className="text-[hsl(var(--deenly-text-secondary))] hover:underline"
              >
                {mosque.website}
              </a>
            </p>
          )}
          {mosque.jumua && (
            <p className="text-sm text-[hsl(var(--deenly-text-primary))]">
              <span className="font-medium">{t('fridayPrayer')}:</span> {mosque.jumua} {t('hour')}
            </p>
          )}
        </div>
        
        <p className="text-[hsl(var(--deenly-text-secondary))]">
          {mosque.about || t('noDescription')}
        </p>
      </div>
    </div>
  );
}
