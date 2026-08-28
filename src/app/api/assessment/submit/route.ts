import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { synthesizeAssessmentResult } from "@/lib/engine";
import { AssessmentInputs } from "@/lib/engine/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateBodySize } from "@/lib/validation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

const AssessmentSubmissionSchema = z.object({
  businessName: z.string().max(200).optional(),
  industry: z.enum(["fashion_retail", "footwear_retail", "general_retail"]).optional(),
  city: z.string().max(100).optional(),
  storeCount: z.number().min(1).max(500).optional(),
  channelType: z.enum(["offline", "online", "hybrid"]).optional(),
  yearsInBusiness: z.number().min(0).max(100).optional(),
  annualRevenueRange: z.string().max(100).optional(),

  monthlyRevenue: z.number().min(0).optional(),
  monthlyTransactions: z.number().min(0).optional(),
  averageOrderValue: z.number().min(0).optional(),

  inventoryValue: z.number().min(0).optional(),
  slowDeadStockPercentage: z.number().min(0).max(100).optional(),
  inventoryAgeingDays: z.number().min(0).optional(),

  monthlyMarketingSpend: z.number().min(0).optional(),
  monthlyLeads: z.number().min(0).optional(),
  conversionRate: z.number().min(0).max(100).optional(),

  newCustomersMonthly: z.number().min(0).optional(),
  repeatCustomersMonthly: z.number().min(0).optional(),
  repeatPurchasePercentage: z.number().min(0).max(100).optional(),

  grossMarginPercentage: z.number().min(0).max(100).optional(),
  avgDiscountPercentage: z.number().min(0).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    if (!validateBodySize(request)) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const rl = await checkRateLimit(request, "assessment");
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit reached. Please wait before submitting another assessment." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = AssessmentSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid assessment data", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const inputs: AssessmentInputs = parsed.data;
    const result = synthesizeAssessmentResult(inputs);

    let assessmentId = `temp_${Date.now()}`;

    if (privilegedSupabase) {
      try {
        // Insert business
        const { data: businessData } = await privilegedSupabase
          .from("businesses")
          .insert([
            {
              name: inputs.businessName || "Unnamed Business",
              industry: inputs.industry || "fashion_retail",
              city: inputs.city || "Not Specified",
              store_count: inputs.storeCount || 1,
              channel_type: inputs.channelType || "offline",
              years_in_business: inputs.yearsInBusiness || 1,
            },
          ])
          .select()
          .single();

        const businessId = businessData?.id || null;

        // Insert assessment
        const { data: assessmentData } = await privilegedSupabase
          .from("assessments")
          .insert([
            {
              business_id: businessId,
              raw_inputs: inputs,
              engine_version: result.engineVersion,
            },
          ])
          .select()
          .single();

        if (assessmentData?.id) {
          assessmentId = assessmentData.id;

          // Insert Growth Score record
          await privilegedSupabase.from("growth_scores").insert([
            {
              assessment_id: assessmentId,
              overall_score: result.growthScore,
              inventory_score: result.domainScores.inventory.score,
              marketing_score: result.domainScores.marketing.score,
              retention_score: result.domainScores.retention.score,
              margin_score: result.domainScores.margins.score,
              total_estimated_leakage: result.totalEstimatedAnnualOpportunity,
              domain_scores: result.domainScores,
            },
          ]);

          // Insert Top Opportunities
          if (result.topOpportunities.length > 0) {
            const oppRows = result.topOpportunities.map((opp) => ({
              assessment_id: assessmentId,
              category: opp.category,
              title: opp.title,
              issue_summary: opp.issueSummary,
              estimated_annual_opportunity: opp.estimatedAnnualOpportunity,
              priority: opp.priority,
              recommended_action: opp.recommendedAction,
            }));
            await privilegedSupabase.from("opportunities").insert(oppRows);
          }
        }
      } catch (dbErr) {
        console.error("Supabase Save Warning:", dbErr);
      }
    }

    // Telegram Notification
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const escapeHtml = (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const tgMsg =
          `⚡ <b>NEW GROWTH ASSESSMENT COMPLETED</b>\n\n` +
          `<b>Business:</b> ${escapeHtml(inputs.businessName || "Unnamed Store")}\n` +
          `<b>City:</b> ${escapeHtml(inputs.city || "Not specified")}\n` +
          `<b>Growth Score:</b> ${result.growthScore} / 100\n` +
          `<b>Estimated Annual Opportunity:</b> ₹${result.totalEstimatedAnnualOpportunity.toLocaleString("en-IN")}\n\n` +
          `<b>Top Opportunity:</b> ${escapeHtml(result.topOpportunities[0]?.title || "N/A")}\n` +
          `<b>View Admin Console:</b> https://adyantnexa.com/admin`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: tgMsg, parse_mode: "HTML" }),
        });
      }
    } catch (tgErr) {
      console.error("Telegram Notification Error:", tgErr);
    }

    return NextResponse.json({
      success: true,
      assessmentId,
      result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Calculation failed";
    console.error("Assessment submit error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
