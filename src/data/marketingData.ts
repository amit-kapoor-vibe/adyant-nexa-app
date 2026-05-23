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
    name: "VOLT_",
    basePrice: { usd: "$400", inr: "₹35,000" },
    performanceFee: "Flat Retainer (Zero Revenue Share)",
    description: "Ideal for early-stage brands looking to outsource expert media buying and kickstart growth.",
    features: [
      "Single Channel (Meta or Google)",
      "Standard Creative Strategy",
      "Basic Conversion Tracking Setup",
      "Looker Studio Analytics Sheet",
      "Monthly Performance Sync Call"
    ]
  },
  {
    name: "PULSE_",
    basePrice: { usd: "$900", inr: "₹75,000" },
    performanceFee: "+ 3% of Ad-Generated Revenue",
    description: "Multi-channel scaling engine. Full Server-Side Conversion API (CAPI) infrastructure.",
    features: [
      "Omni-channel (Meta + Google)",
      "Weekly Creative Strategy (5 scripts)",
      "Dedicated Server-Side CAPI Setup",
      "Real-Time Looker Studio Dashboard",
      "Bi-Weekly Strategy Sync Calls"
    ],
    highlight: true
  },
  {
    name: "NEXA_",
    basePrice: { usd: "$2,000", inr: "₹1,50,000" },
    performanceFee: "+ 5% of Ad-Generated Revenue",
    description: "Aggressive market dominance with a dedicated growth team and custom backend AI routers.",
    features: [
      "Full Omni-Channel Scale (Meta + Google + YouTube)",
      "Dedicated Account Growth Team",
      "Custom CRM & AI Leads Router Setup",
      "Weekly Strategy Deep Dives",
      "Priority Slack Scaling Support"
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

export const architectureTiers: PricingTier[] = [
  {
    name: "SPARK_",
    basePrice: { usd: "$1,500", inr: "₹1,20,000" },
    performanceFee: "Milestone Billed (50/50)",
    description: "Cinematic, single-page Next.js landing page built for ultra-high conversion and elite authority positioning.",
    features: [
      "Custom Cinematic Landing Page",
      "Sub-1.0s Guaranteed Load Speed",
      "Meta/Google Pixel CAPI Linkage",
      "High-Converting Sales Copywriting",
      "Full Mobile-First Optimization"
    ]
  },
  {
    name: "MATRIX_",
    basePrice: { usd: "$4,200", inr: "₹3,50,000" },
    performanceFee: "Milestone Billed (40/40/20)",
    description: "Complete headless Next.js e-commerce storefront with a Shopify or WooCommerce backend integration.",
    features: [
      "Headless E-commerce Storefront",
      "Up to 100 Products Catalog",
      "Custom Animated Cart Drawer",
      "Dedicated Server CAPI Attribution",
      "Interactive Product Catalog & Filters"
    ],
    highlight: true
  },
  {
    name: "NEXUS_",
    basePrice: { usd: "$9,000+", inr: "₹7,50,000+" },
    performanceFee: "Custom Enterprise Roadmap",
    description: "Bespoke web applications, custom CRM integrations, automated lead routers, and full serverless microservices.",
    features: [
      "Bespoke SaaS & Web Applications",
      "Unlimited Scale & Custom Database",
      "Custom CRM & Automation Pipelines",
      "Bespoke WhatsApp/Email Lead Router",
      "Dedicated Dev & Priority Maintenance"
    ],
    highlight: false
  }
];
