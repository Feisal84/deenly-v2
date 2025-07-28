'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Lecture {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  created_at: string;
  num_views: number;
}

interface User {
  id: string;
  name: string;
  role: string;
  mosque_id: string;
}

export default function LecturesManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const t = useTranslations('lecture');
  const locale = useLocale();
  const supabase = createClient();

  useEffect(() => {
    const checkAuthAndFetchLectures = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (userError || !userData || !['Admin', 'Imam'].includes(userData.role)) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      setUser(userData);

      // Fetch lectures for this mosque
      const { data: lecturesData, error: lecturesError } = await supabase
        .from('lectures')
        .select('*')
        .eq('mosque_id', userData.mosque_id)
        .eq('created_by', userData.id)
        .order('created_at', { ascending: false });

      if (lecturesError) {
        setError(`Fehler beim Laden der Vorträge: ${lecturesError.message}`);
      } else {
        setLectures(lecturesData || []);
      }

      setLoading(false);
    };

    checkAuthAndFetchLectures();
  }, [router, locale, supabase]);

  const handleDelete = async (lectureId: string) => {
    if (!confirm(t('confirmDelete', { defaultValue: 'Sind Sie sicher, dass Sie diesen Vortrag löschen möchten?' }))) {
      return;
    }

    const { error } = await supabase
      .from('lectures')
      .delete()
      .eq('id', lectureId);

    if (error) {
      setError(`Fehler beim Löschen: ${error.message}`);
    } else {
      setLectures(lectures.filter(lecture => lecture.id !== lectureId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Public':
        return 'text-green-600 bg-green-100';
      case 'Draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'Archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Public':
        return t('public', { defaultValue: 'Öffentlich' });
      case 'Draft':
        return t('draft', { defaultValue: 'Entwurf' });
      case 'Archived':
        return t('archived', { defaultValue: 'Archiviert' });
      default:
        return status;
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="mb-4"
          >
            ← {t('backToDashboard', { defaultValue: 'Zurück zum Dashboard' })}
          </Button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {t('manageLectures', { defaultValue: 'Vorträge verwalten' })}
            </h1>
            <Button onClick={() => router.push(`/${locale}/dashboard/lectures/new`)}>
              {t('addLecture', { defaultValue: 'Neuen Vortrag hinzufügen' })}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lectures List */}
        {lectures.length === 0 ? (
          <div className="bg-card border rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {t('noLectures', { defaultValue: 'Keine Vorträge vorhanden' })}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('noLecturesDescription', { defaultValue: 'Sie haben noch keine Vorträge erstellt. Erstellen Sie Ihren ersten Vortrag.' })}
            </p>
            <Button onClick={() => router.push(`/${locale}/dashboard/lectures/new`)}>
              {t('createFirstLecture', { defaultValue: 'Ersten Vortrag erstellen' })}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <div key={lecture.id} className="bg-card border rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{lecture.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lecture.status)}`}>
                        {getStatusText(lecture.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{t('type', { defaultValue: 'Typ' })}: {lecture.type}</span>
                      <span>{t('created', { defaultValue: 'Erstellt' })}: {formatDate(lecture.created_at)}</span>
                      <span>{t('views', { defaultValue: 'Aufrufe' })}: {lecture.num_views}</span>
                    </div>
                    
                    <p className="text-muted-foreground line-clamp-2">
                      {lecture.content.substring(0, 200)}
                      {lecture.content.length > 200 ? '...' : ''}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {lecture.status === 'Public' && (
                      <Link href={`/${locale}/moscheen/${user.mosque_id}/lecture/${lecture.id}`}>
                        <Button variant="outline" size="sm">
                          {t('view', { defaultValue: 'Anzeigen' })}
                        </Button>
                      </Link>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/${locale}/dashboard/lectures/${lecture.id}/edit`)}
                    >
                      {t('edit', { defaultValue: 'Bearbeiten' })}
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(lecture.id)}
                    >
                      {t('delete', { defaultValue: 'Löschen' })}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
