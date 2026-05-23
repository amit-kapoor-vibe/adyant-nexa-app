import type { ProtocolItem, MatrixRow, CaseStudy } from "@/types";

// ─── Nexa Protocol Steps ──────────────────────────────────────────────────────
export const PROTOCOL: ProtocolItem[] = [
  {
    id: "01",
    title: "Revenue Audit",
    tag: "DIAGNOSTIC",
    desc: "Feature: 48-hour deep ecosystem scan. Advantage: Uncovers hidden friction. Benefit: Recovers wasted marketing spend instantly.",
  },
  {
    id: "02",
    title: "Elite Architecture",
    tag: "ENGINEERING",
    desc: "Feature: Next.js 16/React 19 build. Advantage: Sub-0.5s load times. Benefit: Maximum SEO ranking and zero bounce rate.",
  },
  {
    id: "03",
    title: "Autonomous Sync",
    tag: "INTEGRATION",
    desc: "Feature: NEXA AI Agent deployment. Advantage: 24/7 lead qualification. Benefit: $10k+ monthly labor savings and qualified pipeline.",
  },
  {
    id: "04",
    title: "Algorithmic Scale",
    tag: "SCALING",
    desc: "Feature: CAPI-driven ad scaling. Advantage: 100% tracking accuracy. Benefit: Predictable revenue growth and market dominance.",
  },
];

// ─── Competitive Matrix ───────────────────────────────────────────────────────
export const MATRIX: MatrixRow[] = [
  { feature: "Tech Stack", nexa: "NEXT.JS 16 (OS-LEVEL)", others: "WORDPRESS / BLOATED THEMES" },
  { feature: "Speed to Market", nexa: "7-DAY DEPLOYMENT", others: "1-3 MONTH DRAG" },
  { feature: "Lead Capture", nexa: "AUTONOMOUS AI AGENT", others: "BASIC STATIC FORMS" },
  { feature: "Data Integrity", nexa: "SERVER-SIDE SYNC", others: "BROWSER-BASED (LOSSY)" },
  { feature: "ROI Focus", nexa: "GUARANTEED SAVINGS", others: "HOPE-BASED MARKETING" },
  { feature: "Mobile Exp.", nexa: "PWA (APP-LIKE)", others: "STANDARD MOBILE VIEW" },
];

// ─── Case Studies ─────────────────────────────────────────────────────────────
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "01",
    client: "SUPERWHEELS",
    tag: "Luxury D2C",
    title: "From Slow & Overpriced to Fast & Responsive",
    desc: "Rebuilt a bloated agency site into a mobile-first performance machine. Scaled organic traffic and significantly reduced ad-bounce rates.",
    metrics: [["98/100", "Speed"], ["Next.js", "Stack"], ["7 Days", "Build"]],
    quote: "Since working with Adyant Nexa, our site's speed and responsiveness have improved dramatically.",
    founder: "Prashant",
  },
  {
    id: "02",
    client: "TEMPTATION THREAD",
    tag: "Fashion D2C",
    title: "Scaling D2C Growth via Performance Architecture",
    desc: "Implemented server-side tracking and high-speed landing pages to slash CAC. Managed ₹20L+ monthly ad spend with record ROAS.",
    metrics: [["-40%", "CAC"], ["3.2x", "ROI"], ["₹20L+", "Managed"]],
    quote: "Nobody runs ads at this level. Our acquisition costs halved within the first month alone.",
    founder: "Founder",
  },
  {
    id: "03",
    client: "INDO UVR",
    tag: "B2B Manufacturing",
    title: "Automating High-Ticket Lead Generation",
    desc: "Transformed a static corporate site into a 24/7 lead engine with automated WhatsApp funnels and CRM synchronization.",
    metrics: [["Zero", "Leakage"], ["WhatsApp", "Sync"], ["82%", "Conv."]],
    quote: "Adyant Nexa handles our entire platform with exceptional care. Every feature we need — it's delivered fast.",
    founder: "RAKESH",
  },
];
