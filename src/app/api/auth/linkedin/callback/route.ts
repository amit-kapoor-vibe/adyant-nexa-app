/**
 * Adyant Nexa - LinkedIn OAuth Callback Handler
 * Automatically captures auth code and exchanges for access token
 * Route: /api/auth/linkedin/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;
const REDIRECT_URI = 'http://localhost:3000/api/auth/linkedin/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Step 1: Exchange code for access token
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      return NextResponse.json({ 
        error: 'Token exchange failed', 
        details: tokenData 
      }, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Get LinkedIn User URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const linkedinUrn = `urn:li:person:${profile.sub}`;

    // Step 3: Save to .env.local
    const envPath = path.resolve(process.cwd(), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

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

    // Return success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LinkedIn Connected!</title>
          <style>
            body { font-family: sans-serif; background: #020202; color: #E5E5E5; 
                   display: flex; align-items: center; justify-content: center; 
                   height: 100vh; margin: 0; flex-direction: column; }
            .card { background: #111; border: 1px solid #00F2FF; border-radius: 12px; 
                    padding: 40px; text-align: center; max-width: 500px; }
            h1 { color: #00F2FF; margin-bottom: 10px; }
            p { color: #aaa; margin: 8px 0; }
            .urn { background: #1a1a1a; padding: 8px 16px; border-radius: 6px; 
                   font-family: monospace; color: #00F2FF; margin-top: 16px; 
                   word-break: break-all; }
            .success { color: #00ff88; font-size: 48px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✅</div>
            <h1>LinkedIn Connected!</h1>
            <p>Welcome, <strong>${profile.name}</strong></p>
            <p>.env.local mein save ho gaya!</p>
            <div class="urn">${linkedinUrn}</div>
            <p style="margin-top:24px; color:#666;">Ab yeh tab band karo aur pipeline use karo.</p>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Internal error', details: message }, { status: 500 });
  }
}
