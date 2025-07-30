'use client';

import { createLecture } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  mosque_id: string;
}

export default function NewLecturePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Khutba');
  const [status, setStatus] = useState<'Draft' | 'Public'>('Draft');
  const [enableAITranslation, setEnableAITranslation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const t = useTranslations('lecture');
  const locale = useLocale();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Get user data
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (error || !userData || !['Admin', 'Imam'].includes(userData.role)) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, [router, locale, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError(null);

    try {
      const result = await createLecture({
        title,
        content,
        type,
        status,
        mosque_id: user.mosque_id,
        created_by: user.id,
        enableAITranslation
      });

      if (result.success) {
        setSuccess(true);
        
        // Redirect after successful creation
        setTimeout(() => {
          router.push(`/${locale}/dashboard/lectures`);
        }, 2000);
      } else {
        setError('Fehler beim Speichern des Vortrags');
      }

    } catch (err: any) {
      setError(`Fehler beim Speichern: ${err.message || 'Ein unerwarteter Fehler ist aufgetreten'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="mb-4"
          >
            ← {t('backToDashboard', { defaultValue: 'Zurück zum Dashboard' })}
          </Button>
          <h1 className="text-3xl font-bold">
            {t('createNewLecture', { defaultValue: 'Neuen Vortrag erstellen' })}
          </h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {t('lectureCreated', { defaultValue: 'Vortrag erfolgreich erstellt! Sie werden weitergeleitet...' })}
          </div>
        )}

        {/* Form */}
        <div className="bg-card border rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                {t('title', { defaultValue: 'Titel' })} *
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={t('titlePlaceholder', { defaultValue: 'Geben Sie den Titel des Vortrags ein' })}
                className="w-full"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                {t('type', { defaultValue: 'Typ' })}
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Khutba">Khutba (Freitagspredigt)</option>
                <option value="Lecture">Vortrag</option>
                <option value="Dua">Dua</option>
                <option value="Quran">Quran-Rezitation</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                {t('content', { defaultValue: 'Inhalt' })} *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={15}
                placeholder={t('contentPlaceholder', { defaultValue: 'Geben Sie den Inhalt des Vortrags ein...\n\nSie können auch arabischen Text verwenden.' })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('contentHint', { defaultValue: 'Verwenden Sie Absätze für bessere Lesbarkeit. Arabischer Text wird automatisch richtig ausgerichtet.' })}
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                {t('status', { defaultValue: 'Status' })}
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Draft' | 'Public')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Draft">{t('draft', { defaultValue: 'Entwurf' })}</option>
                <option value="Public">{t('public', { defaultValue: 'Öffentlich' })}</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                {status === 'Draft' 
                  ? t('draftHint', { defaultValue: 'Entwürfe sind nur für Sie sichtbar' })
                  : t('publicHint', { defaultValue: 'Öffentliche Vorträge sind für alle sichtbar' })
                }
              </p>
            </div>

            {/* AI Translation */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enableAITranslation}
                  onChange={(e) => setEnableAITranslation(e.target.checked)}
                  className="w-4 h-4 text-primary border-2 rounded focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium">
                    {t('enableAITranslation', { defaultValue: 'KI-Übersetzung aktivieren' })}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {t('aiTranslationHint', { defaultValue: 'Automatische Übersetzung in 7 Sprachen (Deutsch, Englisch, Türkisch, Arabisch, Französisch, Spanisch, Russisch)' })}
                  </p>
                </div>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saving || !title.trim() || !content.trim()}
                className="flex-1"
              >
                {saving 
                  ? t('saving', { defaultValue: 'Speichern...' })
                  : status === 'Draft'
                    ? t('saveDraft', { defaultValue: 'Als Entwurf speichern' })
                    : t('publish', { defaultValue: 'Veröffentlichen' })
                }
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`/${locale}/dashboard`)}
                disabled={saving}
              >
                {t('cancel', { defaultValue: 'Abbrechen' })}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
