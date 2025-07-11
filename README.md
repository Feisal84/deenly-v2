# Deenly - Die Moschee Khutba App

Deenly ist eine Web-Anwendung, die aktuelle Informationen zu Khutbas (Freitagspredigten) und anderen Aktivitäten in Moscheen bereitstellt. Die App ermöglicht es Benutzern, Moscheen in ihrer Nähe zu entdecken und auf dem Laufenden zu bleiben.

## Features

- Übersicht über Moscheen
- Detailseiten für jede einzelne Moschee
- Anzeige von Khutbas/Freitagspredigten
- Anzeige von Veranstaltungen
- Benutzerauthentifizierung via Supabase
- Responsives Design für mobile und Desktop-Nutzung

## Technologie-Stack

- **Frontend:** Next.js 14+ mit App Router, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL-Datenbank, Auth, Storage)
- **Hosting:** Vercel (optional)

## Datenbankmodell

Die App verwendet die folgenden Tabellen:

- **moscheen** - Grundlegende Informationen zu Moscheen
- **khutbas** - Freitagspredigten mit Datum, Titel, Beschreibung usw.
- **veranstaltungen** - Veranstaltungen und Aktivitäten in den Moscheen
- **gebetszeiten** - Gebetszeiten für jede Moschee
- **oeffnungszeiten** - Öffnungszeiten der Moscheen

Das vollständige Datenbankschema findest du in `supabase/migrations/20241216_init_schema.sql`.

## Projektstruktur

```en
/app                # Next.js App Router
  /page.tsx         # Startseite
  /layout.tsx       # Layout-Komponente mit Navigation
  /mosques         # Moscheen-Übersichtsseite
    /page.tsx
  /mosques/[handle]    # Moschee-Detailseite
    /page.tsx
  /(auth-pages)     # Authentifizierungsseiten

/components         # Wiederverwendbare Komponenten
  /deenly-hero.tsx  # Hero-Komponente für die Startseite
  ...

/lib                # Hilfsfunktionen und Typdefinitionen
  /types.ts         # TypeScript-Typdefinitionen

/utils/supabase     # Supabase-Hilfsfunktionen
  /server.ts        # Server-Client für Supabase
  ...

/supabase           # Supabase-Migrations
  /migrations
    /20241216_init_schema.sql  # Datenbankschema
```

## Deployment

Die App kann einfach auf Vercel deployt werden:

1. Pushe dein Repository zu GitHub
2. Verbinde es mit deinem Vercel-Account
3. Setze die Umgebungsvariablen in Vercel
4. Deploye die App

## Mitwirken

Beiträge sind willkommen! Bitte erstelle einen Issue oder Pull Request, wenn du Verbesserungen oder neue Features vorschlagen möchtest.

## Lizenz

[MIT](LICENSE)

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
"# deenly-v2" 
