// Quick Google API Key Verification
// Tests the key against Google's Generative AI API

const API_KEY = 'AIzaSyBeCTCYPbJr0SjBH1qTStJVntFBpkUzmvM';

async function testKey() {
  console.log('🔑 Testing Google API Key...\n');
  console.log(`Key (first 20 chars): ${API_KEY.substring(0, 20)}...`);
  console.log(`Key length: ${API_KEY.length} characters\n`);

  // Check key format
  if (API_KEY.startsWith('AIza')) {
    console.log('✅ Key format: Standard Google API Key');
  } else if (API_KEY.startsWith('AQ.')) {
    console.log('⚠️  Key format: This looks like an OAuth token, not an API key');
    console.log('   Standard Google API keys start with "AIza"\n');
  } else {
    console.log('⚠️  Key format: Unrecognized format');
  }

  // Test 1: Try Gemini API (generativelanguage.googleapis.com)
  console.log('\n📡 Testing Gemini API endpoint...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Gemini API: Key is VALID!');
      console.log(`   Available models: ${data.models?.length || 0}`);
      if (data.models?.slice(0, 3)) {
        data.models.slice(0, 3).forEach(m => {
          console.log(`   - ${m.name}`);
        });
      }
    } else {
      console.log('❌ Gemini API: Key rejected');
      console.log(`   Error: ${data.error?.message || JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log('❌ Gemini API: Connection error');
    console.log(`   ${err.message}`);
  }

  // Test 2: Try Google Calendar API (to check general validity)
  console.log('\n📡 Testing Google Calendar API endpoint...');
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/colors?key=${API_KEY}`
    );
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Calendar API: Key is VALID!');
    } else {
      console.log('❌ Calendar API: Key rejected');
      console.log(`   Error: ${data.error?.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.log('❌ Calendar API: Connection error');
    console.log(`   ${err.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY');
  console.log('='.repeat(50));
  console.log(`
If your key starts with "AQ." it's likely an OAuth 2.0 token,
not a standard API key. You may need to:

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new API key (not OAuth client)
3. Enable the required APIs:
   - Generative Language API (for Gemini)
   - Calendar API
   - Gmail API
4. Copy the key (starts with "AIza...")
`);
}

testKey();
