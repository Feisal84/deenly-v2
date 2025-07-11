import { createClient } from './client';

export async function testSupabaseConnection(): Promise<{
  isConnected: boolean;
  error?: string;
  details?: any;
}> {
  try {
    const supabase = createClient();
    
    // Test basic connection by pinging a simple query
    const { data, error } = await supabase
      .from('lectures')
      .select('count')
      .limit(1);
      
    if (error) {
      return {
        isConnected: false,
        error: error.message,
        details: error
      };
    }
    
    return {
      isConnected: true
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
  };
}
