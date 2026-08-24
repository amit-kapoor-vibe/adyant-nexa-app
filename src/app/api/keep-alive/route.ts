import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isCronAuthorized = cronSecret && (
      authHeader === `Bearer ${cronSecret}` || 
      urlObj.searchParams.get("key") === cronSecret
    );

    if (!isCronAuthorized) {
      const authResult = await verifyAdmin(req);
      if (!(authResult as { authorized: true }).authorized) return authResult as NextResponse;
    }

    const rl = await checkRateLimit(req, "default");
    if (!rl.success) {
      return NextResponse.json({ status: 'error', message: 'Rate limit exceeded' }, { status: 429 });
    }

    const { error } = await privilegedSupabase.from('leads').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      console.log('Keep-alive ping resulted in error (but still kept DB awake):', error.message);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase pinged successfully to stay awake.',
      time: new Date().toISOString()
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error('Keep-alive error:', error);
    return NextResponse.json({ status: 'error', message: msg }, { status: 500 });
  }
}
