/**
 * Adyant Nexa - Growth Intelligence Engine Types
 * Domain-driven calculation types for retail business diagnostics.
 */

export type IndustryType = 'fashion_retail' | 'footwear_retail' | 'general_retail';
export type ChannelType = 'offline' | 'online' | 'hybrid';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type OpportunityCategory = 'inventory' | 'margins' | 'retention' | 'marketing';

export interface AssessmentInputs {
  // Business Profile
  businessName?: string;
  industry?: IndustryType;
  city?: string;
  storeCount?: number;
  channelType?: ChannelType;
  yearsInBusiness?: number;
  annualRevenueRange?: string;

  // Sales
  monthlyRevenue?: number;
  monthlyTransactions?: number;
  averageOrderValue?: number;

  // Inventory
  inventoryValue?: number;
  slowDeadStockPercentage?: number;
  inventoryAgeingDays?: number;
  stockTurnoverRatio?: number;

  // Marketing
  monthlyMarketingSpend?: number;
  monthlyLeads?: number;
  usesPaidAds?: boolean;
  conversionRate?: number;

  // Customer Retention
  newCustomersMonthly?: number;
  repeatCustomersMonthly?: number;
  repeatPurchasePercentage?: number;
  avgCustomerFrequency?: number;

  // Margins & Expenses
  grossMarginPercentage?: number;
  avgDiscountPercentage?: number;
  operatingExpensePercentage?: number;
}

export interface DomainScore {
  score: number; // 0 to 100
  label: string;
  status: 'EXCELLENT' | 'HEALTHY' | 'MODERATE_LEAKAGE' | 'SEVERE_LEAKAGE';
  summary: string;
}

export interface CalculatedOpportunity {
  category: OpportunityCategory;
  title: string;
  issueSummary: string;
  estimatedAnnualOpportunity: number;
  priority: PriorityLevel;
  recommendedAction: string;
  isSufficientData: boolean;
}

export interface EngineResult {
  engineVersion: string;
  growthScore: number; // 0 to 100
  overallScoreStatus: 'HIGH_EFFICIENCY' | 'MODERATE_EFFICIENCY' | 'SIGNIFICANT_LEAKAGE' | 'CRITICAL_LEAKAGE';
  totalEstimatedAnnualOpportunity: number;
  domainScores: {
    inventory: DomainScore;
    margins: DomainScore;
    retention: DomainScore;
    marketing: DomainScore;
  };
  topOpportunities: CalculatedOpportunity[];
  allOpportunities: CalculatedOpportunity[];
  calculatedAt: string;
  disclaimer: string;
}

export interface RetailBenchmark {
  industry: IndustryType;
  healthyDeadStockPct: number; // e.g. 12 (%)
  healthyGrossMarginPct: number; // e.g. 50 (%)
  healthyDiscountPct: number; // e.g. 15 (%)
  targetRepeatRatePct: number; // e.g. 35 (%)
  healthyCacRevenuePct: number; // e.g. 10 (%)
  inventoryCarryingCostRate: number; // 0.20 (20% per year)
}
