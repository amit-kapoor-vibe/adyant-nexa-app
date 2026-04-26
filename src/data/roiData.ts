import { IndustryConfig } from "@/types";

export const ROI_INDUSTRIES: IndustryConfig[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    minLabor: 50000,
    maxLabor: 1000000,
    defaultLabor: 150000,
    avgTicketSize: 7500000, // ₹75 Lakhs
    conversionLift: 0.12, // 12% boost from instant response
    responseLoss: 0.45, // 45% leads die without 5-min response
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    minLabor: 25000,
    maxLabor: 500000,
    defaultLabor: 80000,
    avgTicketSize: 2500, // ₹2500
    conversionLift: 0.25, // 25% boost from 24/7 support
    responseLoss: 0.15, // 15% loss from slow FAQ resolution
  },
  {
    id: "b2b-saas",
    name: "B2B / SaaS",
    minLabor: 100000,
    maxLabor: 2000000,
    defaultLabor: 300000,
    avgTicketSize: 50000, // ₹50k annual ACV
    conversionLift: 0.18, // 18% boost from qualification
    responseLoss: 0.30, // 30% loss to faster competitors
  },
  {
    id: "luxury-retail",
    name: "Luxury / Premium Retail",
    minLabor: 40000,
    maxLabor: 400000,
    defaultLabor: 120000,
    avgTicketSize: 45000, // ₹45k
    conversionLift: 0.20, // 20% boost from personalized follow-up
    responseLoss: 0.25, // 25% drop-off
  }
];

export const ROI_GLOBAL_CONFIG = {
  nexaSetupINR: 125000,
  nexaSetupUSD: 1500,
  tokenCostPerLeadINR: 42,
  tokenCostPerLeadUSD: 0.50,
};
