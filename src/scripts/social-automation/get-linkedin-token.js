/**
 * Adyant Nexa - LinkedIn Token Exchange Script
 * Run: node src/scripts/social-automation/get-linkedin-token.js YOUR_CODE_HERE
 */

const fs = require('fs');
const path = require('path');

const CLIENT_ID = '862059544d6ku4';
const CLIENT_SECRET = 'WPL_AP1.IMg0ovDKSLgZZG6j.HsPzDw==';
const REDIRECT_URI = 'http://localhost:3000/api/auth/linkedin/callback';

let input = process.argv[2];

if (!input) {
  console.error('❌ Usage: node get-linkedin-token.js YOUR_CODE_OR_FULL_URL');
  process.exit(1);
}

// Accept full URL or just the code
let code = input;
if (input.includes('?code=')) {
  code = input.split('?code=')[1].split('&')[0];
  console.log('🔍 Extracted code from URL...');
}

async function exchangeToken() {
  console.log('🔄 Exchanging code for access token...');

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
    console.error('❌ Token exchange failed:', data);
    process.exit(1);
  }

  const accessToken = data.access_token;
  console.log('✅ Access Token received!');

  // Get User URN
  console.log('🔍 Fetching LinkedIn User ID (URN)...');
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await profileRes.json();
  const linkedinUrn = `urn:li:person:${profile.sub}`;
  console.log(`✅ LinkedIn URN: ${linkedinUrn}`);
  console.log(`✅ Name: ${profile.name}`);

  // Update .env.local
  const envPath = path.resolve(__dirname, '../../../.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Replace or append LINKEDIN_ACCESS_TOKEN
  if (envContent.includes('LINKEDIN_ACCESS_TOKEN=')) {
    envContent = envContent.replace(/LINKEDIN_ACCESS_TOKEN=.*/g, `LINKEDIN_ACCESS_TOKEN=${accessToken}`);
  } else {
    envContent += `\nLINKEDIN_ACCESS_TOKEN=${accessToken}`;
  }

  // Replace or append LINKEDIN_URN
  if (envContent.includes('LINKEDIN_URN=')) {
    envContent = envContent.replace(/LINKEDIN_URN=.*/g, `LINKEDIN_URN=${linkedinUrn}`);
  } else {
    envContent += `\nLINKEDIN_URN=${linkedinUrn}`;
  }

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('\n🎉 .env.local updated successfully!');
  console.log(`   LINKEDIN_ACCESS_TOKEN = ${accessToken.substring(0, 20)}...`);
  console.log(`   LINKEDIN_URN          = ${linkedinUrn}`);
  console.log('\n✅ LinkedIn integration ready! Ab tum live post kar sakte ho.');
}

exchangeToken().catch(console.error);
