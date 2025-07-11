// Diese Prüfung ist nur für die Supabase-Konfiguration
// aber keine Authentifizierung erforderlich

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
