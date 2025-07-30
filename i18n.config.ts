export const locales = ['de', 'en', 'es', 'fr', 'tr', 'ru', 'ar', 'it'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export default {
  defaultLocale,
  locales,
  localePrefix: 'always',
  getMessageFallback: ({ key, namespace }: { key: string; namespace?: string }) => key
};
