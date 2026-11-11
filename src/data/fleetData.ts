export interface PillarItem {
  id: string;
  index: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
}

export interface PortfolioProperty {
  id: string;
  developer: string;
  title: string;
  specs: string;
  desc: string;
  image: string;
}

export const SYSTEM_PILLARS: PillarItem[] = [
  {
    id: "bant",
    index: "01 // BANT FILTERING",
    title: "Real Budgets Only",
    desc: "Filters out window shoppers before calling your team. Confirms Golden Visa eligibility (AED 2M+), down payments, and unit preferences directly on WhatsApp.",
    image: "/images/luxury-penthouse.jpg",
    imageAlt: "Downtown Luxury Penthouse",
  },
  {
    id: "scheduling",
    index: "02 // VIP SCHEDULING",
    title: "Lock Viewings Instantly",
    desc: "Syncs with your brokers' Google Calendar and Calendly. Sends WhatsApp viewing pins and calendar invites to high-intent buyers in under 2 minutes.",
    image: "/images/modern-interior.jpg",
    imageAlt: "Contemporary Luxury Interior",
  },
  {
    id: "supervision",
    index: "03 // LIVE SUPERVISION",
    title: "1-Click Human Takeover",
    desc: "Sales directors can monitor live incoming chats in the Command Centre and take over anytime without alerting the buyer or breaking conversational flow.",
    image: "/images/prime-villa.jpg",
    imageAlt: "Prime Dubai Villa Residence",
  },
];

export const FLEET_PORTFOLIO: PortfolioProperty[] = [
  {
    id: "emaar",
    developer: "DOWNTOWN // OFF-PLAN INQUIRY",
    title: "Downtown Dubai & Creek Harbour",
    specs: "FROM AED 2.4M · 80/20 HANDOVER · 9.2% YIELD",
    desc: "High-floor luxury residences with unobstructed Burj Khalifa panoramas and direct private access to Dubai Mall.",
    image: "/images/dubai-skyline.jpg",
  },
  {
    id: "sobha",
    developer: "LAGOON VILLAS // 1% PAYMENT PLAN",
    title: "Sobha Hartland II Lagoon Villas",
    specs: "FROM AED 3.8M · 1% MONTHLY PLAN · GOLDEN VISA",
    desc: "Waterfront crystal lagoon sanctuary featuring biophilic European design finishes and private botanical parklands.",
    image: "/images/prime-villa.jpg",
  },
  {
    id: "marina",
    developer: "COASTAL // HIGH RENTAL YIELD",
    title: "Marina Waterfront Penthouses",
    specs: "FROM AED 2.1M · 10% SHORT-TERM YIELD · YACHT BERTH",
    desc: "Prime high-occupancy coastal units optimized for ultra-high rental yields and short-stay executive hospitality.",
    image: "/images/waterfront-towers.jpg",
  },
];
