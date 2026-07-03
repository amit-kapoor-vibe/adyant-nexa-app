import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: false,   // We handle tokens/codes manually in /auth/callback
    flowType: 'pkce',            // Use secure PKCE flow (authorization code exchange)
    persistSession: true,        // Store session in localStorage
    autoRefreshToken: true,      // Auto-refresh expired tokens
  }
});
