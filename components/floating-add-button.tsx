'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FloatingAddButtonProps {
  mosqueId?: string;
  className?: string;
}

export default function FloatingAddButton({ mosqueId, className = "" }: FloatingAddButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMosqueId, setUserMosqueId] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const supabase = createClient();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has Imam or Admin role
        const { data: userData } = await supabase
          .from('users')
          .select('role, mosque_id')
          .eq('auth_user_id', user.id)
          .single();
        
        if (userData && (userData.role === 'Imam' || userData.role === 'Admin')) {
          setIsAuthenticated(true);
          setUserMosqueId(userData.mosque_id);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleAddKhutbah = () => {
    if (isAuthenticated) {
      // If user is authenticated and belongs to this mosque, go directly to create khutbah
      if (mosqueId && userMosqueId === mosqueId) {
        router.push(`/${locale}/dashboard/lectures/new`);
      } else {
        // If authenticated but not for this mosque, go to dashboard
        router.push(`/${locale}/dashboard`);
      }
    } else {
      // Redirect to login page
      router.push(`/${locale}/auth/login`);
    }
  };

  // Show different button text based on auth status and mosque ownership
  const getButtonTitle = () => {
    if (isAuthenticated && mosqueId && userMosqueId === mosqueId) {
      return "Neue Khutbah für diese Moschee hinzufügen";
    } else if (isAuthenticated) {
      return "Zur Verwaltung gehen";
    } else {
      return "Anmelden um Khutbah hinzuzufügen";
    }
  };

  const getButtonColor = () => {
    if (isAuthenticated && mosqueId && userMosqueId === mosqueId) {
      return "bg-green-600 hover:bg-green-700"; // Green for own mosque
    } else if (isAuthenticated) {
      return "bg-blue-600 hover:bg-blue-700"; // Blue for authenticated but different mosque
    } else {
      return "bg-gray-600 hover:bg-gray-700"; // Gray for non-authenticated
    }
  };

  return (
    <Button
      onClick={handleAddKhutbah}
      className={`fixed bottom-6 right-6 z-[9999] rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-200 text-white border-2 border-white ${getButtonColor()} ${className}`}
      title={getButtonTitle()}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      }}
    >
      <Plus className="w-7 h-7" />
      <span className="sr-only">Khutbah hinzufügen</span>
    </Button>
  );
}
