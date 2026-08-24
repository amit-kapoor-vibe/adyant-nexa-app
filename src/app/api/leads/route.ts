import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/rate-limit";
import { LeadSchema, validateBodySize } from "@/lib/validation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    if (!validateBodySize(request)) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const rl = await checkRateLimit(request, "leads");
    if (!rl.success) {
      return NextResponse.json({
        error: "Neural link saturated. Please try again in 24 hours or use WhatsApp for priority sync."
      }, { status: 429, headers: { "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Limit": String(rl.limit) } });
    }

    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, phone, business, message, budget } = parsed.data;

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
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const escapeHtml = (str: string) =>
          str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const telegramMsg = `<b>NEW LEAD CAPTURED</b>\n\n` +
                            `<b>Name:</b> ${escapeHtml(name || "")}\n` +
                            `<b>Email:</b> ${escapeHtml(email || "")}\n` +
                            `<b>Phone:</b> ${escapeHtml(phone || "")}\n` +
                            `<b>Business:</b> ${escapeHtml(business || "Not Specified")}\n` +
                            `<b>Budget:</b> ${escapeHtml(String(budget || "Not Specified"))}\n\n` +
                            `<b>Message:</b> ${escapeHtml(message || "No message")}\n\n` +
                            `<b>Command Center:</b> https://adyantnexa.com/admin`;

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMsg,
            parse_mode: "HTML"
          })
        });

        if (!tgRes.ok) {
          const tgErr = await tgRes.text();
          console.error("Telegram API Error response:", tgErr);
        }
      } else {
        console.warn("Telegram alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment.");
      }
    } catch (tgError) {
      console.error("Telegram Notification Failed:", tgError);
    }

    return NextResponse.json({ success: true, record_id: leadData.id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Lead Automation Error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
