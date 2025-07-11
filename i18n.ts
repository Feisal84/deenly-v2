import {getRequestConfig} from 'next-intl/server';
import {defaultLocale} from './i18n.config';
 
export default getRequestConfig(async ({locale}) => {
  // Stelle sicher, dass locale immer ein String ist
  const resolvedLocale = locale || defaultLocale;
  
  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}/common.json`)).default
  };
});
