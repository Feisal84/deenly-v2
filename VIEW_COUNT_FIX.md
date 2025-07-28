# Fix für "Fehler beim Aktualisieren der Aufrufe"

## Problem

Der Server-Fehler `Fehler beim Aktualisieren der Aufrufe: {}` tritt auf, weil die PostgreSQL-Funktion `increment_lecture_views` in der Supabase-Datenbank nicht existiert.

## Ursache

- Die Anwendung versucht, eine SQL-Funktion `increment_lecture_views` aufzurufen
- Diese Funktion wurde noch nicht in der Datenbank erstellt
- Der Fallback-Code hatte unzureichende Fehlerbehandlung

## Lösung

### 1. SQL-Funktion in Supabase erstellen

Gehen Sie zu Ihrem Supabase-Dashboard:

1. Öffnen Sie https://app.supabase.com/
2. Wählen Sie Ihr Projekt aus
3. Gehen Sie zu "SQL Editor"
4. Führen Sie folgenden SQL-Code aus:

```sql
CREATE OR REPLACE FUNCTION increment_lecture_views(lecture_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE lectures
    SET num_views = COALESCE(num_views, 0) + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = lecture_id;

    -- Log success (optional)
    RAISE NOTICE 'Successfully incremented views for lecture %', lecture_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE LOG 'Error incrementing views for lecture %: %', lecture_id, SQLERRM;
END;
$$ language 'plpgsql' SECURITY DEFINER;
```

### 2. Code-Verbesserungen implementiert

Die folgenden Dateien wurden verbessert:

#### `app/actions.ts`

- Bessere Fehlerbehandlung für RPC-Aufrufe
- Klarere Fehlermeldungen und Logging
- Robusterer Fallback-Mechanismus

#### `app/[locale]/moscheen/[handle]/lecture/[lectureId]/page.tsx`

- Asynchrone Ausführung der View-Inkrementierung
- Seiten-Rendering wird nicht durch View-Fehler blockiert
- Verbesserte Fehlerbehandlung

### 3. Testen der Lösung

Nach der SQL-Ausführung können Sie testen:

```bash
cd "c:\DEENLY PROJECT COMPLETE\deenly-v2"
node check-database-function.js
```

### 4. Alternative Lösung (falls SQL-Zugriff nicht möglich)

Falls Sie keinen SQL-Zugriff haben, wurde der Code so verbessert, dass er auch ohne die RPC-Funktion funktioniert:

- Der Fallback-Mechanismus verwendet direkte UPDATE-Statements
- Fehler werden still behandelt und blockieren nicht die Anwendung
- Logging erfolgt für Debugging-Zwecke

## Vorteile der Lösung

1. **Atomare Updates**: Die SQL-Funktion stellt sicher, dass View-Counts korrekt inkrementiert werden
2. **Bessere Performance**: RPC-Aufrufe sind effizienter als mehrere separate Queries
3. **Robuste Fehlerbehandlung**: Die Anwendung funktioniert auch bei Datenbankproblemen
4. **Nicht-blockierend**: Lecture-Seiten laden auch bei View-Count-Fehlern

## Status

✅ **Code-Verbesserungen implementiert**
🔄 **SQL-Funktion muss noch in Supabase erstellt werden**
🧪 **Test-Script verfügbar** (`check-database-function.js`)

## Nächste Schritte

1. SQL-Funktion in Supabase-Dashboard ausführen
2. Anwendung neu starten
3. Lecture-Seite testen
4. Fehler sollten verschwunden sein
