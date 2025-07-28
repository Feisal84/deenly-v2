#!/usr/bin/env node

/**
 * Database Function Check and Creation Script
 * This script checks if the increment_lecture_views function exists
 * and creates it if it doesn't exist.
 */

// Load environment variables manually
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.trim().startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Fehlende Umgebungsvariablen!');
  console.error('   Stellen Sie sicher, dass NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local gesetzt sind.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateFunction() {
  console.log('🔍 Überprüfe Datenbankfunktion increment_lecture_views...');
  
  try {
    // Test if function exists by trying to call it with a dummy UUID
    const { error: testError } = await supabase.rpc('increment_lecture_views', { 
      lecture_id: '00000000-0000-0000-0000-000000000000'
    });
    
    if (testError && testError.message.includes('function increment_lecture_views(uuid) does not exist')) {
      console.log('⚠️  Funktion increment_lecture_views existiert nicht. Erstelle sie...');
      
      // Create the function
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION increment_lecture_views(lecture_id UUID)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          UPDATE lectures 
          SET num_views = COALESCE(num_views, 0) + 1,
              updated_at = now()
          WHERE id = lecture_id;
          
          -- Log the operation
          RAISE NOTICE 'incremented views for lecture %', lecture_id;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE LOG 'Error incrementing views for lecture %: %', lecture_id, SQLERRM;
        END;
        $$;
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql: createFunctionSQL 
      });
      
      if (createError) {
        console.error('❌ Fehler beim Erstellen der Funktion:', createError.message);
        console.log('💡 Versuche alternative Methode...');
        
        // Alternative: Create via direct SQL execution
        console.log('📝 Bitte führen Sie folgendes SQL in Ihrem Supabase SQL Editor aus:');
        console.log('='.repeat(60));
        console.log(createFunctionSQL);
        console.log('='.repeat(60));
      } else {
        console.log('✅ Funktion increment_lecture_views erfolgreich erstellt!');
        
        // Test the function again
        const { error: testError2 } = await supabase.rpc('increment_lecture_views', { 
          lecture_id: '00000000-0000-0000-0000-000000000000'
        });
        
        if (testError2 && !testError2.message.includes('0 rows')) {
          console.log('⚠️  Funktion existiert, aber Test fehlgeschlagen:', testError2.message);
        } else {
          console.log('✅ Funktion funktioniert korrekt!');
        }
      }
    } else if (testError && testError.message.includes('0 rows')) {
      console.log('✅ Funktion increment_lecture_views existiert und funktioniert!');
    } else if (testError) {
      console.log('⚠️  Unerwarteter Fehler beim Testen der Funktion:', testError.message);
    } else {
      console.log('✅ Funktion increment_lecture_views existiert und funktioniert!');
    }
    
    // Test basic database connectivity
    console.log('🔍 Teste Datenbankverbindung...');
    const { data: testQuery, error: connectError } = await supabase
      .from('lectures')
      .select('id')
      .limit(1);
      
    if (connectError) {
      console.error('❌ Datenbankverbindungsfehler:', connectError.message);
    } else {
      console.log('✅ Datenbankverbindung erfolgreich!');
    }
    
  } catch (error) {
    console.error('❌ Unerwarteter Fehler:', error.message);
  }
}

async function main() {
  console.log('🚀 Starte Datenbankfunktion-Überprüfung...');
  console.log('📊 Supabase URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NICHT GESETZT');
  console.log('');
  
  await checkAndCreateFunction();
  
  console.log('');
  console.log('✨ Überprüfung abgeschlossen!');
}

main().catch(console.error);
