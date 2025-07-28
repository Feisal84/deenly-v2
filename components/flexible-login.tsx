'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AuthStep = 'email' | 'password' | 'otp';

export default function FlexibleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<AuthStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('navigation'); // Changed from 'auth' to 'navigation'
  const locale = useLocale();
  const supabase = createClient();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Starting authentication for email:', email);
    console.log('Password provided:', !!password);

    // First, try to determine if user exists and what auth method to use
    // Try password authentication first (preferred for admin users)
    if (password) {
      console.log('Attempting password authentication');
      return handlePasswordLogin();
    }

    // If no password provided, try OTP method
    console.log('Attempting OTP authentication');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false // Don't create new users
        }
      });

      console.log('OTP request result:', { error });

      if (error) {
        console.error('OTP request error:', error);
        // If OTP fails, maybe user needs password
        setError(`OTP-Fehler: ${error.message}. Bitte geben Sie Ihr Passwort ein oder prüfen Sie Ihre E-Mail.`);
        setStep('password');
      } else {
        console.log('OTP sent successfully');
        setStep('otp');
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error during OTP request:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Ungültige Anmeldedaten. Versuchen Sie es mit OTP-Code.');
          setStep('otp');
          // Try to send OTP as fallback
          await supabase.auth.signInWithOtp({ email });
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        await checkUserRole(data.user.id);
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Starting OTP verification for email:', email);
    console.log('OTP code length:', otpCode.length);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email'
      });

      console.log('OTP verification response:', { data, error });

      if (error) {
        console.error('OTP verification error:', error);
        setError(`Ungültiger OTP-Code: ${error.message}`);
        return;
      }

      if (data.user) {
        console.log('OTP verification successful, user:', data.user.email);
        await checkUserRole(data.user.id);
      } else {
        console.error('No user data returned from OTP verification');
        setError('Keine Benutzerdaten erhalten. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      console.error('Unexpected error during OTP verification:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async (authUserId: string) => {
    console.log('Checking user role for auth user ID:', authUserId);
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, mosque_id, mosques(name, handle)')
        .eq('auth_user_id', authUserId)
        .single();

      console.log('User role query result:', { userData, userError });

      if (userError) {
        console.error('Database error when checking user role:', userError);
        if (userError.code === 'PGRST116') {
          setError('Benutzer nicht in der Datenbank gefunden. Bitte kontaktieren Sie den Administrator.');
        } else {
          setError(`Datenbankfehler: ${userError.message}`);
        }
        return;
      }

      if (!userData) {
        console.error('No user data found for auth user ID:', authUserId);
        setError('Benutzer nicht gefunden. Kontaktieren Sie den Administrator.');
        return;
      }

      console.log('User found with role:', userData.role, 'mosque_id:', userData.mosque_id);

      if (userData.role === 'Imam' || userData.role === 'Admin') {
        // Show success message before redirect
        setError(null);
        setLoading(true);
        
        // More robust redirect for mobile browsers
        const dashboardUrl = `/${locale}/dashboard`;
        
        console.log('Login successful, redirecting to:', dashboardUrl);
        
        // Try multiple redirect methods for better mobile compatibility
        try {
          router.push(dashboardUrl);
        } catch (routerError) {
          console.log('Router.push failed, using window.location');
          // Fallback to window.location for mobile browsers
          window.location.href = dashboardUrl;
        }
        
        // Additional fallback after a short delay
        setTimeout(() => {
          if (window.location.pathname !== dashboardUrl) {
            console.log('Final fallback redirect');
            window.location.replace(dashboardUrl);
          }
        }, 1000);
      } else {
        console.error('User has insufficient role:', userData.role);
        setError(`Sie haben keine Berechtigung für den Admin-Bereich. Ihre Rolle: ${userData.role}`);
      }
    } catch (err) {
      console.error('Role check error:', err);
      setError('Fehler beim Überprüfen der Benutzerrolle');
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          E-Mail
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="imam@moschee.de"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Passwort
          <span className="text-sm text-muted-foreground">(optional - falls verfügbar)</span>
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort eingeben oder leer lassen für OTP"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Anmelden...' : 'Anmelden'}
      </Button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={(e) => { e.preventDefault(); handlePasswordLogin(); }} className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">E-Mail: {email}</p>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Passwort
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Ihr Passwort eingeben"
          autoFocus
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Anmelden...' : 'Mit Passwort anmelden'}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => setStep('email')}
      >
        Zurück
      </Button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          OTP-Code wurde an {email} gesendet
        </p>
      </div>
      
      <div>
        <label htmlFor="otp" className="block text-sm font-medium mb-1">
          OTP-Code
        </label>
        <Input
          id="otp"
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          required
          placeholder="6-stelliger Code"
          maxLength={6}
          autoFocus
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Überprüfen...' : 'Code bestätigen'}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => setStep('email')}
      >
        Zurück
      </Button>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'email' && 'Anmelden'}
            {step === 'password' && 'Passwort eingeben'}
            {step === 'otp' && 'OTP-Code eingeben'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Melden Sie sich als Imam oder Administrator an'}
            {step === 'password' && 'Geben Sie Ihr Passwort ein'}
            {step === 'otp' && 'Geben Sie den 6-stelligen Code aus Ihrer E-Mail ein'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && renderEmailStep()}
          {step === 'password' && renderPasswordStep()}
          {step === 'otp' && renderOtpStep()}

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md mt-4">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
