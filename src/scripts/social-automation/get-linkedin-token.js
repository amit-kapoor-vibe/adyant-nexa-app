const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let input = process.argv[2];

if (!input) {
  console.error('Usage: node get-linkedin-token.js YOUR_CODE_OR_FULL_URL');
  process.exit(1);
}

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in environment');
  process.exit(1);
}

let code = input;
if (input.includes('?code=')) {
  code = input.split('?code=')[1].split('&')[0];
  console.log('Extracted code from URL...');
}

const REDIRECT_URI = 'http://localhost:3000/api/auth/linkedin/callback';

async function exchangeToken() {
  console.log('Exchanging code for access token...');

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error('Token exchange failed:', data);
    process.exit(1);
  }

  const accessToken = data.access_token;
  console.log('Access Token received!');

  console.log('Fetching LinkedIn User ID (URN)...');
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await profileRes.json();
  const linkedinUrn = `urn:li:person:${profile.sub}`;
  console.log(`LinkedIn URN: ${linkedinUrn}`);
  console.log(`Name: ${profile.name}`);

  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const expiresAt = data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('social_tokens')
        .upsert(
          {
            provider: 'linkedin',
            access_token: accessToken,
            refresh_token: data.refresh_token || null,
            token_expires_at: expiresAt,
            person_urn: linkedinUrn,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'provider' }
        );

      if (error) {
        console.error('Failed to store token in Supabase:', error);
      } else {
        console.log('\nToken stored in Supabase (social_tokens table)!');
      }
    } catch (err) {
      console.error('Supabase upsert failed:', err);
    }
  } else {
    const envPath = path.resolve(__dirname, '../../../.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('LINKEDIN_ACCESS_TOKEN=')) {
      envContent = envContent.replace(/LINKEDIN_ACCESS_TOKEN=.*/g, `LINKEDIN_ACCESS_TOKEN=${accessToken}`);
    } else {
      envContent += `\nLINKEDIN_ACCESS_TOKEN=${accessToken}`;
    }

    if (envContent.includes('LINKEDIN_URN=')) {
      envContent = envContent.replace(/LINKEDIN_URN=.*/g, `LINKEDIN_URN=${linkedinUrn}`);
    } else {
      envContent += `\nLINKEDIN_URN=${linkedinUrn}`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n.env.local updated (fallback — set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for Supabase storage)');
  }

  console.log(`\nLINKEDIN_ACCESS_TOKEN = ${accessToken.substring(0, 20)}...`);
  console.log(`LINKEDIN_URN          = ${linkedinUrn}`);
  console.log('\nLinkedIn integration ready!');
}

exchangeToken().catch(console.error);
