import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './i18n.config';
 
export default getRequestConfig(async ({locale}) => {
  // Ensure locale is valid, fallback to default if undefined or invalid
  const validLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}/common.json`)).default
  };
});
