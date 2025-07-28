#!/usr/bin/env node

/**
 * Check Database Schema - Find correct column names
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking mosque table schema...\n');
  
  try {
    // Get one mosque to see the actual structure
    const { data: mosques, error } = await supabase
      .from('mosques')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    if (mosques && mosques.length > 0) {
      console.log('📋 Available columns in mosques table:');
      const columns = Object.keys(mosques[0]);
      columns.forEach((col, index) => {
        console.log(`   ${index + 1}. ${col} = ${mosques[0][col]}`);
      });
    } else {
      console.log('⚠️  No mosques found to check schema');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkSchema();
