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
    autoRefreshToken: false,     // Avoid unhandled background fetch failures if offline or project paused
    lock: false as any,          // Avoid browser lock contention on concurrent mounts
  },
  global: {
    fetch: async (...args) => {
      try {
        return await fetch(...args);
      } catch (err) {
        console.warn('[Supabase Network Notice] Connection unavailable:', (err as Error)?.message);
        return new Response(JSON.stringify({ error: 'Supabase service unreachable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    },
  },
});
