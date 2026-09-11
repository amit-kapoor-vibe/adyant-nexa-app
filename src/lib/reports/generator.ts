import { AssessmentResult } from "../engine/types";

export interface ReportCustomerInfo {
  businessName: string;
  city: string;
  name?: string;
  email?: string;
  phone?: string;
}

export function generateHtmlReport(result: AssessmentResult, customer: ReportCustomerInfo): string {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Adyant Nexa - D2C Readiness Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Syne:wght@700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #020202;
      color: #E5E5E5;
      padding: 40px;
      line-height: 1.5;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .logo span { color: #00F2FF; }
    .tag {
      font-family: monospace;
      font-size: 10px;
      color: #00F2FF;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: #080808;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 24px;
    }
    .card-title {
      font-size: 11px;
      color: #A3A3A3;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .score {
      font-family: 'Syne', sans-serif;
      font-size: 48px;
      font-weight: 800;
      color: #00F2FF;
      line-height: 1;
    }
    .opportunity {
      font-family: 'Syne', sans-serif;
      font-size: 32px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1;
    }
    
    .section-heading {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(0,242,255,0.3);
      padding-bottom: 8px;
    }
    
    .opp-item {
      background: #080808;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .opp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .opp-title {
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .opp-value {
      font-weight: 700;
      color: #00F2FF;
    }
    .opp-desc {
      font-size: 13px;
      color: #A3A3A3;
      margin-bottom: 8px;
    }
    .opp-action {
      font-size: 12px;
      color: #FFFFFF;
      background: rgba(0,242,255,0.05);
      border-left: 2px solid #00F2FF;
      padding: 8px 12px;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #737373;
    }

    @media print {
      body { background-color: #FFFFFF; color: #000000; padding: 20px; }
      .card, .opp-item { background: #F8F9FA; border-color: #E9ECEF; }
      .logo, .opportunity, .opp-title, .section-heading { color: #000000; }
      .score, .opp-value, .logo span, .tag { color: #008891; }
      .card-title, .opp-desc, .footer { color: #495057; }
      .opp-action { background: #E6F7F8; border-left-color: #008891; color: #000000; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="logo">ADYANT <span>NEXA</span></div>
      <div class="tag">D2C READINESS DIAGNOSTIC REPORT</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #A3A3A3;">
      <div><strong>Store:</strong> ${customer.businessName || "Retail Business"}</div>
      <div><strong>Location:</strong> ${customer.city || "India"}</div>
      <div><strong>Date:</strong> ${dateStr}</div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="card">
      <div class="card-title">D2C READINESS SCORE</div>
      <div class="score">${result.growthScore} <span style="font-size: 20px; color: #A3A3A3;">/ 100</span></div>
      <div style="font-size: 12px; color: #00F2FF; margin-top: 8px; font-weight: 600;">Status: ${(result.overallScoreStatus || "").replace(/_/g, " ").toUpperCase()}</div>
    </div>

    <div class="card">
      <div class="card-title">ESTIMATED ANNUAL GROWTH &amp; MARGIN OPPORTUNITY</div>
      <div class="opportunity">₹${result.totalEstimatedAnnualOpportunity.toLocaleString("en-IN")}</div>
      <div style="font-size: 12px; color: #A3A3A3; margin-top: 8px;">Potential annual recovery across inventory &amp; margin leakages.</div>
    </div>
  </div>

  <div class="section-heading">TOP PRIORITY PROFIT RECOVERY OPPORTUNITIES</div>

  ${result.topOpportunities.map((opp, idx) => `
    <div class="opp-item">
      <div class="opp-header">
        <div class="opp-title">#${idx + 1}. ${opp.title} (${opp.category.toUpperCase()})</div>
        <div class="opp-value">₹${opp.estimatedAnnualOpportunity.toLocaleString("en-IN")} / year</div>
      </div>
      <div class="opp-desc">${opp.issueSummary}</div>
      <div class="opp-action"><strong>Recommended Action:</strong> ${opp.recommendedAction}</div>
    </div>
  `).join("")}

  <div class="section-heading" style="margin-top: 30px;">90-DAY GROWTH ROADMAP SUMMARY</div>
  <div class="card" style="font-size: 13px; color: #A3A3A3; line-height: 1.6;">
    <p style="margin-bottom: 8px;"><strong>Phase 1 (Days 1–30):</strong> Implement SKU-level dead stock markdown rules to release locked working capital.</p>
    <p style="margin-bottom: 8px;"><strong>Phase 2 (Days 31–60):</strong> Enforce discount cap rules to protect gross margin velocity before season end.</p>
    <p><strong>Phase 3 (Days 61–90):</strong> Deploy automated WhatsApp customer repeat campaigns to lift repeat purchase rate to 35%+.</p>
  </div>

  <div class="footer">
    Adyant Nexa Business Growth Intelligence Platform &bull; www.adyantnexa.com &bull; Unit 716, 7th Floor, ILD Trade Centre, Sector 47, Gurugram, Haryana 122018<br />
    Contact: contact@adyantnexa.com &bull; +91 87007 20477 &bull; GSTIN: 06CPKPK2852M1ZH<br />
    <em>Disclaimer: All scores and numbers represent estimated indicative benchmark opportunities derived from input data. They represent potential recovery, not financial guarantees.</em>
  </div>

</body>
</html>
  `;
}
