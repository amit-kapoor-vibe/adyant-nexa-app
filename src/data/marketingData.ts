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
    name: "THE NEURAL BLUEPRINT",
    basePrice: { usd: "$60", inr: "₹4,999" },
    performanceFee: "100% Fully Redeemable",
    description: "Our entry-level protocol. A deep-scan audit and scaling roadmap. Fully redeemable against any full-scale plan.",
    features: [
      "48-Hour Neural Audit",
      "Revenue Leak Identification",
      "Strategic Scaling Roadmap",
      "Modular Growth Blueprint",
      "Fully Redeemable Token"
    ]
  },
  {
    name: "THE CATALYST",
    basePrice: { usd: "$1,499", inr: "₹1,24,000" },
    performanceFee: "10% of Revenue Share",
    description: "Ideal for brands scaling from $10k to $50k monthly spend. Precision Meta/Google management.",
    features: [
      "Meta or Google Management",
      "Basic CAPI Integration",
      "Weekly Strategic Syncs",
      "AI Ad Copy Generation",
      "Standard Creative Audit"
    ]
  },
  {
    name: "THE ACCELERATOR",
    basePrice: { usd: "$2,999", inr: "₹2,49,000" },
    performanceFee: "15% of Ad-Generated Revenue",
    description: "Aggressive multi-channel dominance for high-growth brands aiming for market leadership.",
    features: [
      "Omni-channel (Meta + Google)",
      "Full Server-Side CAPI Setup",
      "Custom AI Sales Funnels",
      "24/7 Real-time Dashboard",
      "Priority Scaling Support"
    ],
    highlight: true
  },
  {
    name: "THE DOMINATOR",
    basePrice: { usd: "Custom", inr: "Custom" },
    performanceFee: "Negotiable %",
    description: "Complete Revenue Operations and digital ecosystem for global market leaders.",
    features: [
      "Global Scale Execution",
      "Multi-Agent AI Ecosystem",
      "CRM & Sales Integration",
      "Bespoke Creative Studio",
      "Daily Optimization Sprints"
    ]
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
