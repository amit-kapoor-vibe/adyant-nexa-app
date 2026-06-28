import "server-only";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function extractAccessTokenFromHeaders(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.replace("Bearer ", "");
  if (bearer) return bearer;

  const cookieHeader = req.headers.get("cookie") || "";
  const authCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.includes("-auth-token="));

  if (!authCookie) return null;

  try {
    const rawValue = decodeURIComponent(authCookie.split("=").slice(1).join("="));
    const parsed = JSON.parse(rawValue);
    return parsed?.access_token || null;
  } catch {
    return null;
  }
}

export async function verifyAdmin(
  req: Request
): Promise<{ authorized: true; email: string } | NextResponse> {
  const token = extractAccessTokenFromHeaders(req);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return { authorized: true, email: user.email || "" };
  } catch {
    return NextResponse.json({ error: "Auth verification failed" }, { status: 401 });
  }
}
