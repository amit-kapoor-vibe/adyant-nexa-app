import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ─── BACKEND RATE LIMITING (IP-BASED) ───
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const MAX_LEADS_PER_DAY = 5;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (userLimit) {
      // Reset count every 24 hours
      if (now - userLimit.lastReset > 24 * 60 * 60 * 1000) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
      } else if (userLimit.count >= MAX_LEADS_PER_DAY) {
        return NextResponse.json({ 
          error: "Neural link saturated. Please try again in 24 hours or use WhatsApp for priority sync." 
        }, { status: 429 });
      } else {
        userLimit.count += 1;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    const { name, email, phone, business, message, budget } = await request.json();

    // 1. Insert into Supabase
    const { data: leadData, error: dbError } = await supabase
      .from('leads')
      .insert([
        { 
          name, 
          email, 
          phone, 
          business_type: business || "Not Specified", 
          budget: budget ? String(budget) : "0",
          message: message || "No message provided",
          status: (message && message.includes("CRITICAL")) ? "HOT" : "NEW"
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Insertion Error:", dbError);
      return NextResponse.json({ error: "Failed to securely store lead." }, { status: 500 });
    }

    // (Optional: You can still trigger Lark/Webhooks here for email notifications if needed)

    return NextResponse.json({ success: true, record_id: leadData.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Lead Automation Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

