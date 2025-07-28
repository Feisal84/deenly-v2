#!/usr/bin/env node

/**
 * Test script to verify the 4 mosques are correctly set up in the database
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
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMosques() {
  console.log('🔍 Checking mosques in database...\n');
  
  try {
    const { data: mosques, error } = await supabase
      .from('mosques')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('❌ Error fetching mosques:', error.message);
      return;
    }
    
    console.log(`📊 Total mosques found: ${mosques.length}\n`);
    
    const expectedMosques = [
      'Bilal Moschee',
      'DITIB Moschee Lage', 
      'SoKuT Icmg Baesweiler',
      'Spenge Moschee'
    ];
    
    // Check if we have exactly the 4 expected mosques
    const mosqueNames = mosques.map(m => m.name);
    const hasAllExpected = expectedMosques.every(name => mosqueNames.includes(name));
    const hasOnlyExpected = mosqueNames.every(name => expectedMosques.includes(name));
    
    if (hasAllExpected && hasOnlyExpected && mosques.length === 4) {
      console.log('✅ Perfect! Database contains exactly the 4 required mosques:\n');
    } else {
      console.log('⚠️  Database mosque configuration needs attention:\n');
    }
    
    // Display each mosque
    mosques.forEach((mosque, index) => {
      console.log(`${index + 1}. 🕌 ${mosque.name}`);
      console.log(`   📍 ${mosque.address}, ${mosque.city} ${mosque.postal_code}`);
      console.log(`   🌐 Handle: ${mosque.handle}`);
      if (mosque.phone) console.log(`   📞 Phone: ${mosque.phone}`);
      if (mosque.email) console.log(`   📧 Email: ${mosque.email}`);
      if (mosque.website) console.log(`   🌐 Website: ${mosque.website}`);
      console.log(`   🕰️  Jumua: ${mosque.jumua_time}`);
      console.log(`   📍 Coordinates: ${mosque.latitude}, ${mosque.longitude}`);
      console.log('');
    });
    
    // Check for missing expected mosques
    const missingMosques = expectedMosques.filter(name => !mosqueNames.includes(name));
    if (missingMosques.length > 0) {
      console.log('❌ Missing mosques:');
      missingMosques.forEach(name => console.log(`   - ${name}`));
      console.log('');
    }
    
    // Check for unexpected mosques
    const unexpectedMosques = mosqueNames.filter(name => !expectedMosques.includes(name));
    if (unexpectedMosques.length > 0) {
      console.log('⚠️  Unexpected mosques (should be removed):');
      unexpectedMosques.forEach(name => console.log(`   - ${name}`));
      console.log('');
    }
    
    // Check handles
    console.log('🔗 Handles check:');
    const expectedHandles = [
      'bilal-moschee-bielefeld',
      'ditib-moschee-lage',
      'sokut-icmg-baesweiler', 
      'spenge-moschee'
    ];
    
    mosques.forEach(mosque => {
      const hasCorrectHandle = expectedHandles.includes(mosque.handle);
      console.log(`   ${hasCorrectHandle ? '✅' : '❌'} ${mosque.name}: ${mosque.handle}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function main() {
  console.log('🚀 Verifying 4-Mosque Database Setup...');
  console.log('📊 Supabase URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');
  console.log('');
  
  await verifyMosques();
  
  console.log('✨ Verification completed!');
}

main().catch(console.error);
