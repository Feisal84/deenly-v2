"use client";

import { useTranslations } from 'next-intl';
import { InfoIcon } from "lucide-react";
import { Mosque } from '@/lib/types';

interface MosqueAnnouncementProps {
  mosque: Mosque;
  shouldShow: boolean;
}

export default function MosqueAnnouncement({ mosque, shouldShow }: MosqueAnnouncementProps) {
  const t = useTranslations('mosque');

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-10 bg-deenly-background dark:bg-deenly-text-primary/30 border border-deenly-background-teal dark:border-deenly-background-dark rounded-lg p-3 md:p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <InfoIcon className="h-4 w-4 md:h-5 md:w-5 text-deenly-text-secondary dark:text-deenly-button-bg" />
        </div>
        <div className="ml-2 md:ml-3 flex-1">
          <h3 className="text-xs md:text-sm font-medium text-deenly-text-primary dark:text-deenly-background-teal">{t('announcement')}</h3>
          <div className="mt-1 md:mt-2 text-xs md:text-sm text-deenly-text-secondary dark:text-deenly-background-secondary">
            <p>{mosque.announcement}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
