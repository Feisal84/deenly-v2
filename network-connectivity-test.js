/**
 * Comprehensive Server-Side Network Connectivity Test
 * This script tests various network connectivity scenarios to identify the root cause
 * of the "fetch failed" error when connecting to Supabase from Node.js
 */

import { createClient } from '@supabase/supabase-js';
import https from 'https';
import { URL } from 'url';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Starting comprehensive server-side connectivity test...');
console.log('📍 Supabase URL:', SUPABASE_URL);
console.log('🔑 Anon Key (first 20 chars):', SUPABASE_ANON_KEY?.substring(0, 20) + '...');

async function test1_BasicHTTPSRequest() {
  console.log('\n🧪 Test 1: Basic HTTPS request to Supabase');
  
  return new Promise((resolve) => {
    const url = new URL(SUPABASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log('✅ HTTPS request successful');
      console.log('📊 Status Code:', res.statusCode);
      console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📦 Response data length:', data.length);
        resolve({ success: true, statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log('❌ HTTPS request failed:', error.message);
      console.log('🔍 Error code:', error.code);
      console.log('🔍 Error details:', error);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log('⏰ HTTPS request timed out');
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });

    req.end();
  });
}

async function test2_NodeFetch() {
  console.log('\n🧪 Test 2: Node.js fetch() API');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    console.log('✅ Fetch successful');
    console.log('📊 Status:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📦 Response length:', text.length);
    
    return { success: true, status: response.status, data: text };
  } catch (error) {
    console.log('❌ Fetch failed:', error.message);
    console.log('🔍 Error name:', error.name);
    console.log('🔍 Error cause:', error.cause);
    console.log('🔍 Full error:', error);
    return { success: false, error: error.message };
  }
}

async function test3_SupabaseClient() {
  console.log('\n🧪 Test 3: Supabase client connection');
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false
      }
    });
    
    console.log('📡 Attempting to connect to Supabase...');
    
    const { data, error } = await supabase
      .from('mosques')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase query failed:', error.message);
      console.log('🔍 Error details:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase client connection successful');
    console.log('📊 Data:', data);
    return { success: true, data };
  } catch (error) {
    console.log('❌ Supabase client connection failed:', error.message);
    console.log('🔍 Error details:', error);
    return { success: false, error: error.message };
  }
}

async function test4_DNSResolution() {
  console.log('\n🧪 Test 4: DNS resolution test');
  
  const { promisify } = require('util');
  const dns = require('dns');
  const lookup = promisify(dns.lookup);
  
  try {
    const url = new URL(SUPABASE_URL);
    const result = await lookup(url.hostname);
    console.log('✅ DNS resolution successful');
    console.log('🌐 IP Address:', result.address);
    console.log('📋 Address family:', result.family);
    return { success: true, ip: result.address };
  } catch (error) {
    console.log('❌ DNS resolution failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function test5_EnvironmentCheck() {
  console.log('\n🧪 Test 5: Environment and configuration check');
  
  console.log('🔧 Node.js version:', process.version);
  console.log('🔧 Platform:', process.platform);
  console.log('🔧 Architecture:', process.arch);
  console.log('🔧 Environment variables:');
  console.log('   - HTTP_PROXY:', process.env.HTTP_PROXY || 'not set');
  console.log('   - HTTPS_PROXY:', process.env.HTTPS_PROXY || 'not set');
  console.log('   - NO_PROXY:', process.env.NO_PROXY || 'not set');
  console.log('   - NODE_TLS_REJECT_UNAUTHORIZED:', process.env.NODE_TLS_REJECT_UNAUTHORIZED || 'not set');
  
  // Check if URL is valid
  try {
    const url = new URL(SUPABASE_URL);
    console.log('✅ Supabase URL is valid');
    console.log('🌐 Hostname:', url.hostname);
    console.log('🔌 Port:', url.port || '443 (default)');
    console.log('📁 Pathname:', url.pathname);
  } catch (error) {
    console.log('❌ Invalid Supabase URL:', error.message);
    return { success: false, error: 'Invalid URL' };
  }
  
  return { success: true };
}

async function runAllTests() {
  console.log('🚀 Running comprehensive server-side connectivity tests...\n');
  
  const results = {};
  
  results.environment = await test5_EnvironmentCheck();
  results.dns = await test4_DNSResolution();
  results.https = await test1_BasicHTTPSRequest();
  results.fetch = await test2_NodeFetch();
  results.supabase = await test3_SupabaseClient();
  
  console.log('\n📊 SUMMARY OF RESULTS:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${test.toUpperCase()}: ${status}`);
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  // Provide recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('='.repeat(50));
  
  if (!results.dns.success) {
    console.log('❌ DNS resolution failed - check your internet connection or DNS settings');
  } else if (!results.https.success && !results.fetch.success) {
    console.log('❌ Both HTTPS and fetch failed - likely a network/firewall issue');
    console.log('   - Check if your firewall is blocking outbound HTTPS connections');
    console.log('   - Check if you are behind a corporate proxy');
    console.log('   - Try setting NODE_TLS_REJECT_UNAUTHORIZED=0 temporarily for testing');
  } else if (!results.fetch.success) {
    console.log('❌ Node.js fetch failed but HTTPS works - potential Node.js fetch issue');
    console.log('   - Try updating Node.js to the latest version');
    console.log('   - Consider using a different HTTP client (axios, node-fetch)');
  } else if (!results.supabase.success) {
    console.log('❌ Supabase client failed - check your credentials and database setup');
    console.log('   - Verify your Supabase project is active (not paused)');
    console.log('   - Check if the mosques table exists');
    console.log('   - Verify RLS policies allow access');
  } else {
    console.log('✅ All tests passed! The connection should be working.');
  }
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. If DNS fails: Check internet connectivity and DNS settings');
  console.log('2. If HTTPS fails: Check firewall and proxy settings');
  console.log('3. If fetch fails: Try updating Node.js or use alternative HTTP client');
  console.log('4. If Supabase fails: Run database-schema-final.sql in Supabase SQL Editor');
  console.log('5. If all pass: Restart Next.js dev server and test again');
}

// Run the tests
runAllTests().catch(console.error);
