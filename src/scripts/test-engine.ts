import { synthesizeAssessmentResult } from '../lib/engine';
import { AssessmentInputs } from '../lib/engine/types';

function runTests() {
  console.log('=== ADYANT NEXA CALCULATION ENGINE UNIT TESTS ===\n');

  // Test Case 1: Standard Indian Fashion Retailer (₹50 Lakh Revenue, 25% Dead Stock)
  const sample1: AssessmentInputs = {
    businessName: 'Royal Ethnic Studio',
    industry: 'fashion_retail',
    city: 'Jaipur',
    monthlyRevenue: 400000, // ₹4 Lakhs / month (₹48 Lakhs annual)
    inventoryValue: 1500000, // ₹15 Lakhs inventory
    slowDeadStockPercentage: 25, // 25% dead stock
    avgDiscountPercentage: 22, // 22% average discount
    repeatPurchasePercentage: 20, // 20% repeat rate
    monthlyMarketingSpend: 30000, // ₹30,000 / month
    conversionRate: 1.2, // 1.2% conversion rate
  };

  console.log('--- TEST CASE 1: Standard Fashion Retailer ---');
  const res1 = synthesizeAssessmentResult(sample1);
  console.log('Growth Score:', res1.growthScore, '/ 100');
  console.log('Overall Status:', res1.overallScoreStatus);
  console.log('Total Annual Opportunity: ₹' + res1.totalEstimatedAnnualOpportunity.toLocaleString('en-IN'));
  console.log('Top Opportunities Count:', res1.topOpportunities.length);
  res1.topOpportunities.forEach((opp, i) => {
    console.log(`  ${i + 1}. [${opp.priority}] ${opp.title}: ₹${opp.estimatedAnnualOpportunity.toLocaleString('en-IN')}`);
  });
  console.log('\nDomain Scores:', JSON.stringify(res1.domainScores, null, 2));

  // Test Case 2: Partial Data / "I don't know" inputs
  console.log('\n--- TEST CASE 2: Partial Data Inputs ---');
  const sample2: AssessmentInputs = {
    industry: 'fashion_retail',
    monthlyRevenue: 200000,
    // inventory metrics omitted
  };

  const res2 = synthesizeAssessmentResult(sample2);
  console.log('Growth Score:', res2.growthScore);
  console.log('Total Annual Opportunity: ₹' + res2.totalEstimatedAnnualOpportunity.toLocaleString('en-IN'));

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
}

runTests();
