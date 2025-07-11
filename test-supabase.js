// Simple test to verify Supabase connection
const SUPABASE_URL = "https://uuynujqvdhrsocqddxxn.supabase.co";

async function testSupabaseReachability() {
  try {
    console.log("Testing Supabase URL:", SUPABASE_URL);
    
    // Test basic HTTP connectivity
    const response = await fetch(SUPABASE_URL + "/rest/v1/", {
      method: "GET",
      headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eW51anF2ZGhyc29jcWRkeHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTE3ODYsImV4cCI6MjA2MTY2Nzc4Nn0.CXfhMSz2CgFo8rCsEPGIHIAsmGjrOBRtAn5LQO4SSNI",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eW51anF2ZGhyc29jcWRkeHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTE3ODYsImV4cCI6MjA2MTY2Nzc4Nn0.CXfhMSz2CgFo8rCsEPGIHIAsmGjrOBRtAn5LQO4SSNI"
      }
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log("✅ Supabase is reachable");
      return true;
    } else {
      console.log("❌ Supabase returned error status");
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to reach Supabase:", error.message);
    return false;
  }
}

// Run the test
testSupabaseReachability().then(result => {
  console.log("Connection test result:", result);
});
