import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = createClient(supabaseUrl, supabaseServiceKey);

function getRedirectUri(request: NextRequest): string {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  if (host && !host.includes('localhost')) {
    return `${protocol}://${host}/api/auth/linkedin/callback`;
  }
  return 'http://localhost:3000/api/auth/linkedin/callback';
}

export async function GET(request: NextRequest) {
  const authResult = await verifyAdmin(request);
  if (!(authResult as { authorized: true }).authorized) {
    return new NextResponse('<!DOCTYPE html><html><head><title>Unauthorized</title></head><body style="font-family:sans-serif;background:#020202;color:#E5E5E5;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h1 style="color:#ff4444;">401 - Unauthorized</h1></body></html>', { status: 401, headers: { 'Content-Type': 'text/html' } });
  }

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
    const redirectUri = getRedirectUri(request);

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
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
    const refreshToken = tokenData.refresh_token || null;
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;

    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const linkedinUrn = `urn:li:person:${profile.sub}`;

    const { error: upsertError } = await privilegedSupabase
      .from('social_tokens')
      .upsert(
        {
          provider: 'linkedin',
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: expiresAt,
          person_urn: linkedinUrn,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'provider' }
      );

    if (upsertError) {
      console.error('Failed to store LinkedIn token in Supabase:', upsertError);
    }

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
            <div class="success">\u2705</div>
            <h1>LinkedIn Connected!</h1>
            <p>Welcome, <strong>${profile.name}</strong></p>
            <p>Token stored securely in database.</p>
            <div class="urn">${linkedinUrn}</div>
            <p style="margin-top:24px; color:#666;">You can close this tab now.</p>
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
