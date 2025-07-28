#!/usr/bin/env node

/**
 * Automated Database Update Script - 4 Mosques Only
 * This script will automatically update your database with the 4 required mosques
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

// The 4 required mosques data
const requiredMosques = [
  {
    name: 'Bilal Moschee',
    legal_name: 'Bilal Moschee e.V.',
    address: 'Schildescher Str. 69',
    city: 'Bielefeld',
    state: 'Nordrhein-Westfalen',
    country: 'Germany',
    postal_code: '33611',
    phone: '+4952198629199',
    email: 'info@alx.de',
    website: 'https://www.aikv.de',
    about: 'In unserer Moschee bieten wir eine Vielzahl von Dienstleistungen an. Von religiöser Bildung bis hin zu Gemeindeveranstaltungen haben wir alles, was Sie brauchen, um mit Ihrem Glauben und Ihrer Gemeinde in Kontakt zu treten.',
    latitude: 52.0302,
    longitude: 8.5325,
    prayer_time_calculation: 'standard',
    jumua: '13:45',
    handle: 'bilal-moschee-bielefeld',
    services: ['Religious Education', 'Community Events', 'Prayer Services', 'Youth Programs']
  },
  {
    name: 'DITIB Moschee Lage',
    legal_name: 'DITIB Moschee Lage e.V.',
    address: 'Detmolder Str. 48',
    city: 'Lage',
    state: 'Nordrhein-Westfalen',
    country: 'Germany',
    postal_code: '32791',
    phone: null,
    email: null,
    website: null,
    about: 'DITIB Moschee in Lage bietet religiöse Dienstleistungen und Gemeinschaftsaktivitäten für die lokale muslimische Gemeinde.',
    latitude: 51.9892,
    longitude: 8.7879,
    prayer_time_calculation: 'standard',
    jumua: '13:30',
    handle: 'ditib-moschee-lage',
    services: ['Prayer Services', 'Religious Education', 'Community Services']
  },
  {
    name: 'SoKuT Icmg Baesweiler',
    legal_name: 'SoKuT Icmg Baesweiler e.V.',
    address: 'Breite Str. 64',
    city: 'Baesweiler',
    state: 'Nordrhein-Westfalen',
    country: 'Germany',
    postal_code: '52499',
    phone: null,
    email: null,
    website: null,
    about: 'SoKuT Icmg Moschee in Baesweiler dient der lokalen muslimischen Gemeinde mit religiösen Dienstleistungen und kulturellen Aktivitäten.',
    latitude: 50.9095,
    longitude: 6.1886,
    prayer_time_calculation: 'standard',
    jumua: '13:30',
    handle: 'sokut-icmg-baesweiler',
    services: ['Prayer Services', 'Cultural Programs', 'Community Events']
  },
  {
    name: 'Spenge Moschee',
    legal_name: 'Spenge Moschee e.V.',
    address: 'Ravensberger Str. 35',
    city: 'Spenge',
    state: 'Nordrhein-Westfalen',
    country: 'Germany',
    postal_code: '32139',
    phone: null,
    email: null,
    website: null,
    about: 'Die Spenge Moschee bietet religiöse Dienstleistungen und Gemeinschaftsunterstützung für die muslimische Gemeinde in Spenge.',
    latitude: 52.1344,
    longitude: 8.4891,
    prayer_time_calculation: 'standard',
    jumua: '13:30',
    handle: 'spenge-moschee',
    services: ['Prayer Services', 'Community Support', 'Religious Education']
  }
];

async function updateDatabase() {
  console.log('🚀 Starting database update...\n');
  
  try {
    // Step 1: Get current mosques
    console.log('📊 Checking current mosques...');
    const { data: currentMosques, error: fetchError } = await supabase
      .from('mosques')
      .select('*');
      
    if (fetchError) {
      console.error('❌ Error fetching current mosques:', fetchError.message);
      return;
    }
    
    console.log(`   Found ${currentMosques.length} existing mosques\n`);
    
    // Step 2: Delete all existing mosques
    console.log('🗑️  Removing all existing mosques...');
    const { error: deleteError } = await supabase
      .from('mosques')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
    if (deleteError) {
      console.error('❌ Error deleting mosques:', deleteError.message);
      return;
    }
    
    console.log('   ✅ All existing mosques removed\n');
    
    // Step 3: Insert the 4 required mosques
    console.log('📥 Inserting 4 required mosques...');
    
    for (let i = 0; i < requiredMosques.length; i++) {
      const mosque = requiredMosques[i];
      console.log(`   ${i + 1}. Adding ${mosque.name}...`);
      
      const { error: insertError } = await supabase
        .from('mosques')
        .insert([mosque]);
        
      if (insertError) {
        console.error(`   ❌ Error inserting ${mosque.name}:`, insertError.message);
      } else {
        console.log(`   ✅ ${mosque.name} added successfully`);
      }
    }
    
    console.log('\n🔍 Verifying final state...');
    
    // Step 4: Verify the result
    const { data: finalMosques, error: verifyError } = await supabase
      .from('mosques')
      .select('name, city, handle')
      .order('name');
      
    if (verifyError) {
      console.error('❌ Error verifying results:', verifyError.message);
      return;
    }
    
    console.log('\n✅ Database update completed successfully!');
    console.log(`📊 Total mosques: ${finalMosques.length}`);
    console.log('\n🕌 Your mosques are now:');
    finalMosques.forEach((mosque, index) => {
      console.log(`   ${index + 1}. ${mosque.name} (${mosque.city}) - Handle: ${mosque.handle}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function main() {
  console.log('🔄 Database Update: 4 Mosques Only');
  console.log('📊 Supabase URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');
  console.log('');
  
  // Ask for confirmation
  console.log('⚠️  WARNING: This will replace ALL existing mosques with the 4 specified ones.');
  console.log('   This action cannot be undone and will remove all mosque-related data.');
  console.log('');
  
  await updateDatabase();
  
  console.log('\n✨ Update process completed!');
  console.log('💡 You can now refresh your application to see only the 4 mosques.');
}

main().catch(console.error);
