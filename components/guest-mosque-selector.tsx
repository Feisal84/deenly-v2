'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mosque } from '@/lib/types';
import { createClient } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GuestMosqueSelector() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const supabase = createClient();

  useEffect(() => {
    fetchMosques();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has Imam or Admin role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('auth_user_id', user.id)
          .single();
        
        setIsAuthenticated(userData?.role === 'Imam' || userData?.role === 'Admin');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const fetchMosques = async () => {
    try {
      const { data, error } = await supabase
        .from('mosques')
        .select('*')
        .order('name');

      if (error) throw error;
      setMosques(data || []);
    } catch (error) {
      console.error('Error fetching mosques:', error);
      // Fallback to demo data if needed
      setMosques([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMosqueSelect = async (mosque: Mosque) => {
    setSelecting(true);
    
    try {
      // Store mosque selection for guest users (ensure handle exists)
      if (mosque.handle) {
        localStorage.setItem('selectedMosque', mosque.handle);
        localStorage.setItem('selectedMosqueData', JSON.stringify(mosque));
        sessionStorage.setItem('selectedMosque', mosque.handle);
        
        // For mobile browsers, use location.replace to prevent back button loops
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const mosqueUrl = `/${locale}/moscheen/${mosque.handle}`;
        
        if (isMobile) {
          // Use replace instead of push for mobile to prevent navigation loops
          window.location.replace(mosqueUrl);
        } else {
          router.push(mosqueUrl);
        }
      }
      
    } catch (error) {
      console.error('Error selecting mosque:', error);
      setSelecting(false);
    }
  };

  const handleAddKhutbah = () => {
    if (isAuthenticated) {
      // Redirect to new khutbah creation page
      router.push(`/${locale}/dashboard/lectures/new`);
    } else {
      // Redirect to login page
      router.push(`/${locale}/auth/login`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Moscheen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Wählen Sie Ihre Moschee</h1>
            <p className="text-muted-foreground">
              Wählen Sie eine Moschee aus, um Khutbas, Gebetszeiten und Veranstaltungen zu sehen.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mosques.map((mosque) => (
              <Card key={mosque.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-full h-40 bg-muted rounded-lg mb-4 overflow-hidden">
                    {mosque.hero_path ? (
                      <img 
                        src={mosque.hero_path} 
                        alt={mosque.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Kein Bild verfügbar
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{mosque.name}</CardTitle>
                  <CardDescription>
                    {mosque.address}, {mosque.postal_code} {mosque.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleMosqueSelect(mosque)}
                    disabled={selecting}
                    className="w-full"
                  >
                    {selecting ? 'Wird ausgewählt...' : 'Moschee auswählen'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {mosques.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Keine Moscheen gefunden. Bitte versuchen Sie es später erneut.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Sind Sie Imam oder Administrator?
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${locale}/auth/login`)}
            >
              Anmelden
            </Button>
            
            {/* Temporary Debug Button - Remove this later */}
            <div className="mt-4">
              <Button 
                onClick={handleAddKhutbah}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Khutbah hinzufügen (Debug)
              </Button>
            </div>
          </div>

          {/* Floating Plus Button for Adding Khutbah */}
          <Button
            onClick={handleAddKhutbah}
            className="fixed bottom-6 right-6 z-[9999] rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white border-2 border-white"
            title={isAuthenticated ? "Neue Khutbah hinzufügen" : "Anmelden um Khutbah hinzuzufügen"}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <Plus className="w-7 h-7" />
            <span className="sr-only">Khutbah hinzufügen</span>
          </Button>
        </div>
      </div>
    </>
  );
}
