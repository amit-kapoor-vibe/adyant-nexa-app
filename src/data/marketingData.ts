export interface MarketingFeature {
  title: string;
  advantage: string;
  benefit: string;
  icon: string;
}

export interface PricingTier {
  name: string;
  basePrice: { usd: string; inr: string };
  performanceFee: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export const marketingFeatures: MarketingFeature[] = [
  {
    title: "Algorithmic Personas",
    advantage: "AI-driven market research & buyer mapping.",
    benefit: "We identify exactly WHO buys before spending $1.",
    icon: "Target"
  },
  {
    title: "Unblockable Tracking",
    advantage: "Server-Side CAPI (Conversion API) Infrastructure.",
    benefit: "Zero data loss from iOS 14 or ad-blockers. 100% ROI clarity.",
    icon: "ShieldCheck"
  },
  {
    title: "Hyper-Velocity Testing",
    advantage: "50+ AI-optimized creative iterations per week.",
    benefit: "Faster 'winning' ads and lower Cost Per Acquisition (CPA).",
    icon: "Zap"
  }
];

export const setupFees = {
  standard: { usd: "$2,000", inr: "₹1,65,000" },
  tracking: { usd: "$1,500", inr: "₹1,25,000" },
  total: { usd: "$3,500+", inr: "₹2,90,000+" }
};

export const pricingTiers: PricingTier[] = [
  {
    name: "SPARK_",
    basePrice: { usd: "$125", inr: "₹10,500" },
    performanceFee: "Redeemable Audit Included",
    description: "A high-end cinematic landing page designed to outshine your competition and capture elite leads.",
    features: [
      "Single-Page Architecture",
      "Sub-0.5s Load Time",
      "Mobile-First Design",
      "Neural Motion Graphics",
      "Basic SEO Optimization"
    ]
  },
  {
    name: "VOLT_",
    basePrice: { usd: "$416", inr: "₹34,500" },
    performanceFee: "10% of Revenue Share",
    description: "Ideal for brands scaling from $10k to $50k monthly spend. Includes AI Persona Mapping.",
    features: [
      "Meta or Google Management",
      "Basic CAPI Integration",
      "Weekly Strategic Syncs",
      "AI Ad Copy Generation",
      "Standard Creative Audit"
    ],
    highlight: true
  },
  {
    name: "PULSE_",
    basePrice: { usd: "$1,000", inr: "₹83,500" },
    performanceFee: "15% of Ad-Generated Revenue",
    description: "Aggressive multi-channel dominance. Full Server-Side CAPI Infrastructure.",
    features: [
      "Omni-channel (Meta + Google)",
      "Full Server-Side CAPI Setup",
      "Custom AI Sales Funnels",
      "24/7 Real-time Dashboard",
      "Priority Scaling Support"
    ],
    highlight: false
  }
];

export const comparisonData = {
  traditional: [
    "Vague Audience Interests",
    "Manual Bidding & Guesswork",
    "Broken Browser Tracking",
    "Slow Monthly Reports",
    "Flat Management Fees"
  ],
  adyantNexa: [
    "AI-Mapped Buyer Personas",
    "Algorithmic Scaling Engines",
    "Server-Side CAPI Precision",
    "Real-Time Revenue Dashboards",
    "Incentivized Performance Fees"
  ]
};
