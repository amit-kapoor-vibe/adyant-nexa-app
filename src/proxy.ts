import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function extractAccessToken(req: NextRequest): string | null {
  // 1. Try Authorization header first
  const authHeader = req.headers.get('authorization')
  const bearer = authHeader?.replace('Bearer ', '')
  if (bearer) return bearer

  // 2. Fallback to cookies
  const allCookies = req.cookies.getAll()
  const authCookie = allCookies.find(c => c.name.includes('-auth-token'))
  if (!authCookie) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(authCookie.value))
    return parsed?.access_token || null
  } catch {
    return authCookie.value || null
  }
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = path.startsWith('/admin')
  const isProtectedApi =
    path.startsWith('/api/social-automation') ||
    path.startsWith('/api/keep-alive')

  if (!isProtectedRoute && !isProtectedApi) {
    return NextResponse.next()
  }

  const token = extractAccessToken(req)

  if (!token) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
      }
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const adminEmailsEnv = ADMIN_EMAIL || "mit.kapur@gmail.com,mit.kapoor@gmail.com,amit.kapoor@gmail.com,amit.kapur@gmail.com,amit.kapoor.vibe@gmail.com";
    const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase());

    if (adminEmails.length > 0 && adminEmails[0] !== "") {
      const userEmail = user.email?.toLowerCase() || "";
      if (!adminEmails.includes(userEmail)) {
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL('/', req.nextUrl))
        }
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const response = NextResponse.next()
    response.headers.set('x-user-email', user.email || '')
    return response
  } catch {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return NextResponse.json({ error: 'Auth verification failed' }, { status: 401 })
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/social-automation/:path*',
    '/api/keep-alive/:path*',
  ],
}
