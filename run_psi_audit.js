const psiKey = "AIzaSyDninOfeOG9ootusXcvJ0ZMtnDTRhpRFOw";
const url = "https://adyant-nexa-5f907.web.app";

async function runAudit() {
  console.log(`Starting Technical Audit for ${url}...`);
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${psiKey}&category=PERFORMANCE&strategy=MOBILE`);
    const data = await res.json();
    
    const score = data.lighthouseResult.categories.performance.score * 100;
    const audits = data.lighthouseResult.audits;
    
    console.log(`\n--- AUDIT REPORT ---`);
    console.log(`Performance Score: ${score.toFixed(0)}/100`);
    console.log(`LCP (Speed): ${audits['largest-contentful-paint'].displayValue}`);
    console.log(`TBT (Input Lag): ${audits['total-blocking-time'].displayValue}`);
    console.log(`CLS (Layout Stability): ${audits['cumulative-layout-shift'].displayValue}`);
    
    console.log(`\n--- BOTTLENECKS ---`);
    const diagnostics = data.lighthouseResult.audits['diagnostics']?.details?.items || [];
    console.log(JSON.stringify(diagnostics, null, 2));
    
    const opportunities = Object.values(audits).filter(a => a.details && a.details.type === 'opportunity' && a.score < 0.9);
    opportunities.forEach(o => console.log(`- ${o.title}: ${o.displayValue}`));

  } catch (e) {
    console.error(`Audit failed: ${e.message}`);
  }
}

runAudit();
