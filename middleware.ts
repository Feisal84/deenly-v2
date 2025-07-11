import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n.config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  // Zuerst Supabase-Session aktualisieren
  const response = await updateSession(request);
  
  // Dann intl Middleware anwenden
  const pathname = request.nextUrl.pathname;

  // Skip intl middleware for paths that don't need localization
  if (
    pathname.includes('/_next') ||
    pathname.includes('/api') ||
    pathname.includes('/images') ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return response;
  }

  // Wir können response nicht direkt an intlMiddleware übergeben,
  // daher erstellen wir eine neue URL mit dem Pfad und führen intlMiddleware mit request aus
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except for
    // - API routes
    // - /_next (Next.js internals)
    // - /static (public files)
    // - favicon.ico, manifest.json (static files)
    // - SVG, PNG, JPG, JPEG, GIF, WEBP, ICO file extensions
    "/((?!api|_next|static|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)"
  ]
};
