import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { synthesizeAssessmentResult } from "@/lib/engine";
import { generateHtmlReport } from "@/lib/reports/generator";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const privilegedSupabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing assessment ID parameter" }, { status: 400 });
    }

    let result: any = null;
    let customer: any = { businessName: "Retail Store", city: "India" };

    if (privilegedSupabase && !id.startsWith("temp_")) {
      const { data: assessmentData } = await privilegedSupabase
        .from("assessments")
        .select("raw_inputs, business_id")
        .eq("id", id)
        .single();

      if (assessmentData?.raw_inputs) {
        result = synthesizeAssessmentResult(assessmentData.raw_inputs);
        customer.businessName = assessmentData.raw_inputs.businessName || "Retail Store";
        customer.city = assessmentData.raw_inputs.city || "India";
      }

      if (assessmentData?.business_id) {
        const { data: biz } = await privilegedSupabase
          .from("businesses")
          .select("name, city")
          .eq("id", assessmentData.business_id)
          .single();
        if (biz) {
          customer.businessName = biz.name || customer.businessName;
          customer.city = biz.city || customer.city;
        }
      }
    }

    // Fallback default demonstration report if temp ID
    if (!result) {
      result = synthesizeAssessmentResult({
        businessName: "Fashion Store",
        industry: "fashion_retail",
        city: "India",
        monthlyRevenue: 500000,
        inventoryValue: 1500000,
        slowDeadStockPercentage: 22,
        avgDiscountPercentage: 18,
        repeatPurchasePercentage: 20,
      });
    }

    const htmlContent = generateHtmlReport(result, customer);

    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
