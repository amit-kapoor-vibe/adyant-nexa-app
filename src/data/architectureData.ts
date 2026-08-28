import type { ProtocolItem, MatrixRow, CaseStudy } from "@/types";

// ─── Nexa Protocol Steps ──────────────────────────────────────────────────────
export const PROTOCOL: ProtocolItem[] = [
  {
    id: "01",
    title: "Store Data Inputs",
    tag: "DIAGNOSTIC",
    desc: "Feature: 7-step basic operational data input. Advantage: Captures revenue, inventory, discount, and buyer metrics. Benefit: Takes under 4 minutes with zero technical setup.",
  },
  {
    id: "02",
    title: "Benchmark Calculation Engine",
    tag: "CALCULATION",
    desc: "Feature: Deterministic Indian fashion retail benchmark model. Advantage: Compares your metrics to healthy industry standards. Benefit: Identifies exact profit leakage points in ₹.",
  },
  {
    id: "03",
    title: "Growth Score & Profit Map",
    tag: "ANALYSIS",
    desc: "Feature: Composite Growth Score (0-100). Advantage: Ranks inventory, margin, retention, and marketing opportunity areas. Benefit: Instant clarity on top priority recovery areas.",
  },
  {
    id: "04",
    title: "90-Day Execution Blueprint",
    tag: "ACTION PLAN",
    desc: "Feature: Tailored 90-day profit recovery roadmap. Advantage: SKU velocity rules, discount caps, and repeat buyer workflows. Benefit: Systematic bottom-line profit recovery.",
  },
];

// ─── Competitive Matrix ───────────────────────────────────────────────────────
export const MATRIX: MatrixRow[] = [
  { feature: "Approach", nexa: "FREE DIAGNOSTIC FIRST", others: "PITCH & SELL RETAINERS" },
  { feature: "Time to Insight", nexa: "UNDER 4 MINUTES", others: "2-4 WEEKS AUDIT DRAG" },
  { feature: "Actionability", nexa: "QUANTIFIED PROFIT OPPORTUNITY (₹)", others: "GENERIC ADVICE & SLIDES" },
  { feature: "Calculation Engine", nexa: "EXPLAINABLE RETAIL BENCHMARKS", others: "BLACK-BOX OPINION" },
  { feature: "Focus Area", nexa: "PROFIT LEAKAGE & NET MARGINS", others: "TOP-LINE TRAFFIC ONLY" },
  { feature: "Target Market", nexa: "INDIAN FASHION & APPAREL RETAIL", others: "ONE-SIZE-FITS-ALL" },
];

// ─── Case Studies ─────────────────────────────────────────────────────────────
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "01",
    client: "ETHNIC FASHION RETAILER",
    tag: "Jaipur Store & Online",
    title: "Unlocking ₹18.4 Lakhs Trapped in Dead Inventory",
    desc: "Diagnostic identified 28% slow-moving stock older than 120 days. Deployed targeted clearance velocity rules to release capital.",
    metrics: [["₹18.4L", "Capital Released"], ["28%", "Dead Stock Cut"], ["4 Mins", "Diagnostic"]],
    quote: "Adyant Nexa showed us exactly how much working capital was locked in old ethnic inventory. We cleared it within 60 days.",
    founder: "Jaipur Retail Owner",
  },
  {
    id: "02",
    client: "APPAREL STORE CHAIN",
    tag: "Multi-Store Retail",
    title: "Halting Unplanned Discount Margin Erosion",
    desc: "Diagnostic revealed blanket end-of-season discounts were destroying net profits. Implemented structured markdown caps.",
    metrics: [["+12%", "Net Margin Lift"], ["₹9.2L", "Profit Recovered"], ["90 Days", "Execution"]],
    quote: "We were discounting blindly every end-of-season. The Growth Score highlighted our margin leak immediately.",
    founder: "Delhi Apparel Director",
  },
  {
    id: "03",
    client: "D2C GARMENT BRAND",
    tag: "E-Commerce & Retail",
    title: "Lifting Customer Repeat Rates from 18% to 34%",
    desc: "Diagnosed severe repeat buyer drop-off. Set up automated WhatsApp winback campaigns for 60-day inactive apparel buyers.",
    metrics: [["34%", "Repeat Rate"], ["2.4x", "LTV Growth"], ["WhatsApp", "Automated"]],
    quote: "The repeat customer engine turned one-time buyers into repeat customers without burning extra ad budget.",
    founder: "Founder",
  },
];
