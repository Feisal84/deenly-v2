import { createClient } from './client';

export async function testSupabaseConnection(): Promise<{
  isConnected: boolean;
  error?: string;
  details?: any;
  debug?: any;
}> {
  try {
    // First check if environment variables are properly set
    const config = getSupabaseConfig();
    console.log('🔧 Supabase Config Check:', {
      hasUrl: !!config.url,
      hasKey: config.hasKey,
      urlLength: config.url?.length || 0,
      keyLength: config.keyLength,
      url: config.url ? `${config.url.substring(0, 30)}...` : 'missing'
    });

    if (!config.url || !config.hasKey) {
      return {
        isConnected: false,
        error: 'Missing Supabase environment variables',
        details: config,
        debug: 'Check your .env.local file'
      };
    }

    const supabase = createClient();
    
    // Test basic connection with a simple health check first
    console.log('🔍 Testing Supabase connection...');
    
    // Try a simple RPC call or basic table existence check
    const { data, error } = await supabase
      .rpc('version', {})
      .limit(1);
      
    // If RPC fails, try a basic table query but handle missing tables
    if (error) {
      console.log('🔄 RPC failed, trying basic table check...');
      const { data: tableData, error: tableError } = await supabase
        .from('mosques')
        .select('id')
        .limit(1);
        
      if (tableError) {
        console.error('❌ Supabase query error:', tableError);
        return {
          isConnected: false,
          error: tableError.message || 'Query failed',
          details: tableError,
          debug: {
            code: tableError.code,
            hint: tableError.hint,
            details: tableError.details,
            message: 'Database tables may not exist. Run the schema first!'
          }
        };
      }
    }
    
    console.log('✅ Supabase connection successful');
    return {
      isConnected: true,
      debug: 'Connection test passed'
    };
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error',
      details: error,
      debug: {
        type: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined
      }
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
