import { IndustryType, RetailBenchmark } from './types';

/**
 * Benchmark standards for Indian Retail Businesses.
 * Primary focus on Fashion & Apparel Retailers.
 */
export const RETAIL_BENCHMARKS: Record<IndustryType, RetailBenchmark> = {
  fashion_retail: {
    industry: 'fashion_retail',
    healthyDeadStockPct: 12,
    healthyGrossMarginPct: 50,
    healthyDiscountPct: 15,
    targetRepeatRatePct: 35,
    healthyCacRevenuePct: 10,
    inventoryCarryingCostRate: 0.20,
  },
  footwear_retail: {
    industry: 'footwear_retail',
    healthyDeadStockPct: 10,
    healthyGrossMarginPct: 48,
    healthyDiscountPct: 12,
    targetRepeatRatePct: 30,
    healthyCacRevenuePct: 8,
    inventoryCarryingCostRate: 0.20,
  },
  general_retail: {
    industry: 'general_retail',
    healthyDeadStockPct: 8,
    healthyGrossMarginPct: 35,
    healthyDiscountPct: 10,
    targetRepeatRatePct: 40,
    healthyCacRevenuePct: 6,
    inventoryCarryingCostRate: 0.18,
  },
};

export function getBenchmark(industry: IndustryType = 'fashion_retail'): RetailBenchmark {
  return RETAIL_BENCHMARKS[industry] || RETAIL_BENCHMARKS.fashion_retail;
}
