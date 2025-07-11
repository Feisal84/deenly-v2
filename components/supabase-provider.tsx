"use client";

import { testSupabaseConnection } from "@/utils/supabase/connection-test";
import { ReactNode, useEffect, useState } from "react";
import SupabaseErrorBoundary from "./supabase-error-boundary";

interface SupabaseProviderProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType;
  enableFallback?: boolean;
}

export default function SupabaseProvider({ 
  children, 
  fallbackComponent,
  enableFallback = true 
}: SupabaseProviderProps) {
  const [connectionStatus, setConnectionStatus] = useState<{
    isChecking: boolean;
    isConnected: boolean;
    error?: string;
  }>({
    isChecking: true,
    isConnected: true
  });

  useEffect(() => {
    async function checkConnection() {
      try {
        const result = await testSupabaseConnection();
        setConnectionStatus({
          isChecking: false,
          isConnected: result.isConnected,
          error: result.error
        });
      } catch (error) {
        setConnectionStatus({
          isChecking: false,
          isConnected: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    checkConnection();
  }, []);

  if (connectionStatus.isChecking) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!connectionStatus.isConnected && enableFallback) {
    const error = new Error(connectionStatus.error || "Supabase connection failed");
    return (
      <SupabaseErrorBoundary 
        error={error} 
        reset={() => window.location.reload()}
        fallbackComponent={fallbackComponent}
      />
    );
  }

  return <>{children}</>;
}
