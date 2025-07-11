"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

interface SupabaseErrorBoundaryProps {
  error: Error;
  reset: () => void;
  fallbackComponent?: React.ComponentType;
}

export default function SupabaseErrorBoundary({ 
  error, 
  reset, 
  fallbackComponent: FallbackComponent 
}: SupabaseErrorBoundaryProps) {
  const isSupabaseError = error.message.includes("Failed to fetch") || 
                         error.message.includes("supabase") ||
                         error.message.includes("database");

  if (FallbackComponent) {
    return <FallbackComponent />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        
        <h2 className="text-xl font-semibold mb-2">
          {isSupabaseError ? "Verbindungsproblem" : "Ein Fehler ist aufgetreten"}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          {isSupabaseError 
            ? "Unsere Datenbank ist momentan nicht erreichbar. Dies kann ein vorübergehendes Problem sein."
            : "Es ist ein unerwarteter Fehler aufgetreten."
          }
        </p>
        
        <div className="space-y-2">
          <Button 
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
          
          <p className="text-xs text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
}
