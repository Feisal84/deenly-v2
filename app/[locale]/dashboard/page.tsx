'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Mosque {
  id: string;
  name: string;
  handle: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  mosque_id: string;
  mosque?: Mosque;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Get user data with mosque info
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          *,
          mosques(id, name, handle)
        `)
        .eq('auth_user_id', authUser.id)
        .single();

      if (error || !userData || !['Admin', 'Imam'].includes(userData.role)) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      setUser({
        ...userData,
        mosque: userData.mosques
      });
      setLoading(false);
    };

    checkAuth();
  }, [router, locale, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
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
        <div className="bg-card border rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {t('welcome', { defaultValue: 'Willkommen' })}, {user.name}
              </h1>
              <p className="text-muted-foreground">
                {user.role} • {user.mosque?.name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              {t('logout', { defaultValue: 'Abmelden' })}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Lecture */}
          <div className="bg-card border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">
              {t('addLecture', { defaultValue: 'Neuen Vortrag hinzufügen' })}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('addLectureDescription', { defaultValue: 'Erstellen Sie eine neue Khutba oder einen Vortrag' })}
            </p>
            <Button 
              className="w-full"
              onClick={() => router.push(`/${locale}/dashboard/lectures/new`)}
            >
              {t('createLecture', { defaultValue: 'Vortrag erstellen' })}
            </Button>
          </div>

          {/* Manage Lectures */}
          <div className="bg-card border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">
              {t('manageLectures', { defaultValue: 'Vorträge verwalten' })}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('manageLecturesDescription', { defaultValue: 'Bearbeiten Sie Ihre veröffentlichten Vorträge' })}
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push(`/${locale}/dashboard/lectures`)}
            >
              {t('viewLectures', { defaultValue: 'Vorträge anzeigen' })}
            </Button>
          </div>

          {/* Mosque Settings */}
          {user.role === 'Admin' && (
            <div className="bg-card border rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">
                {t('mosqueSettings', { defaultValue: 'Moschee-Einstellungen' })}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('mosqueSettingsDescription', { defaultValue: 'Verwalten Sie Ihre Moschee-Informationen' })}
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/${locale}/dashboard/mosque`)}
              >
                {t('manageMosque', { defaultValue: 'Moschee verwalten' })}
              </Button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-card border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t('recentActivity', { defaultValue: 'Aktuelle Aktivitäten' })}
          </h3>
          <p className="text-muted-foreground">
            {t('noRecentActivity', { defaultValue: 'Keine aktuellen Aktivitäten vorhanden' })}
          </p>
        </div>
      </div>
    </div>
  );
}
