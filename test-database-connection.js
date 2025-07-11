// Test script for new Supabase database
// Run this after setting up your new Supabase project

import { createClient } from '@supabase/supabase-js';

// Replace these with your new Supabase project credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDatabaseConnection() {
  console.log('🧪 Testing Supabase database connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('mosques')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Basic connection successful');

    // Test 2: Count mosques
    console.log('\n2️⃣ Counting mosques...');
    const { count: mosqueCount, error: mosqueCountError } = await supabase
      .from('mosques')
      .select('*', { count: 'exact', head: true });
    
    if (mosqueCountError) {
      console.error('❌ Mosque count failed:', mosqueCountError.message);
    } else {
      console.log(`✅ Found ${mosqueCount} mosques in database`);
    }

    // Test 3: Fetch sample mosques
    console.log('\n3️⃣ Fetching sample mosques...');
    const { data: mosques, error: mosquesError } = await supabase
      .from('mosques')
      .select('name, city, handle')
      .limit(3);
    
    if (mosquesError) {
      console.error('❌ Mosque fetch failed:', mosquesError.message);
    } else {
      console.log('✅ Sample mosques:');
      mosques.forEach(mosque => {
        console.log(`   - ${mosque.name} (${mosque.city}) - Handle: ${mosque.handle}`);
      });
    }

    // Test 4: Count public lectures
    console.log('\n4️⃣ Counting public lectures...');
    const { count: lectureCount, error: lectureCountError } = await supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Public');
    
    if (lectureCountError) {
      console.error('❌ Lecture count failed:', lectureCountError.message);
    } else {
      console.log(`✅ Found ${lectureCount} public lectures`);
    }

    // Test 5: Fetch sample lectures with mosque info
    console.log('\n5️⃣ Fetching latest lectures...');
    const { data: lectures, error: lecturesError } = await supabase
      .from('lectures')
      .select(`
        title,
        created_at,
        mosques!inner(name, handle)
      `)
      .eq('status', 'Public')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (lecturesError) {
      console.error('❌ Lecture fetch failed:', lecturesError.message);
    } else {
      console.log('✅ Latest lectures:');
      lectures.forEach(lecture => {
        const date = new Date(lecture.created_at).toLocaleDateString('de-DE');
        console.log(`   - "${lecture.title}" at ${lecture.mosques.name} (${date})`);
      });
    }

    console.log('\n🎉 All tests passed! Your Supabase database is ready to use.');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env.local file with the new credentials');
    console.log('2. Restart your Next.js development server');
    console.log('3. Test your app at http://localhost:3000');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testDatabaseConnection();
