import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint is used by cron jobs to keep the Supabase project active
// Supabase pauses free projects after 7 days of inactivity.
export async function GET() {
  try {
    // A simple query to ensure the database is accessed.
    // We limit to 1 and only fetch the ID to make it as lightweight as possible.
    const { error } = await supabase.from('leads').select('id').limit(1);
    
    // Even if the table doesn't exist or we get an error, the API request 
    // reaches Supabase and counts as activity, preventing it from pausing.
    if (error && error.code !== 'PGRST116') {
      console.log('Keep-alive ping resulted in error (but still kept DB awake):', error.message);
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase pinged successfully to stay awake.', 
      time: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Keep-alive error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
