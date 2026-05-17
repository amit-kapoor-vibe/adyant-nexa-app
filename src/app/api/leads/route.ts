import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── PRIVILEGED SUPABASE CLIENT (BACKEND ONLY) ───
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // 1. Insert into Supabase using Privileged Client (Bypasses RLS)
    const { data: leadData, error: dbError } = await privilegedSupabase
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
      return NextResponse.json({ 
        error: "Supabase Error: " + dbError.message,
        details: dbError
      }, { status: 500 });
    }

    // ─── TELEGRAM NOTIFICATION (NEURAL ALERT) ───
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const telegramMsg = `🚨 *NEW LEAD CAPTURED* 🚨\n\n` +
                            `👤 *Name:* ${name}\n` +
                            `📧 *Email:* ${email}\n` +
                            `📞 *Phone:* ${phone}\n` +
                            `💼 *Business:* ${business || "Not Specified"}\n` +
                            `💰 *Budget:* ${budget || "Not Specified"}\n\n` +
                            `📝 *Message:* ${message || "No message"}\n\n` +
                            `🔗 *Command Center:* https://adyantnexa.com/admin`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMsg,
            parse_mode: "Markdown"
          })
        });
      }
    } catch (tgError) {
      console.error("Telegram Notification Failed:", tgError);
    }

    return NextResponse.json({ success: true, record_id: leadData.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Lead Automation Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

