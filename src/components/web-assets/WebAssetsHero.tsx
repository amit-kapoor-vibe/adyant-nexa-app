"use client";


import { FadeSection } from "@/components/FadeSection";
import { Heading } from "@/components/ui/Heading";

interface WebAssetsHeroProps {
  onAudit: () => void;
}

export const WebAssetsHero = ({ onAudit }: WebAssetsHeroProps) => {
  return (
    <section style={{ 
      padding: "clamp(120px, 15vw, 180px) 20px clamp(60px, 10vw, 100px)", 
      position: "relative", 
      overflow: "hidden", 
      background: "#020202", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <div className="ambient-orb" style={{ top: "10%", right: "10%", opacity: 0.15 }} />
      <div className="scan-overlay" />
      
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FadeSection>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 10, 
            padding: "8px 16px", 
            background: "rgba(0,242,255,0.05)", 
            border: "1px solid rgba(0,242,255,0.2)", 
            borderRadius: 100, 
            marginBottom: 32 
          }}>
            <div className="pulse-dot" />
            <span className="editorial-tag" style={{ fontSize: 9, letterSpacing: "0.2em", margin: 0 }}>Digital Real Estate Systems</span>
          </div>
          
          <Heading level="h1" className="glitch-text" id="web-assets-title" style={{ color: "#E5E5E5", marginBottom: 24 }}>
            Websites are <span style={{ opacity: 0.3 }}>Liabilities.</span><br />
            Assets are <span className="glitch-shimmer">Engines.</span>
          </Heading>
          
          <p style={{ 
            fontFamily: "var(--font-geist-mono)", 
            fontSize: "clamp(13px, 1.5vw, 16px)", 
            color: "rgba(229,229,229,0.45)", 
            lineHeight: 1.8, 
            maxWidth: 750, 
            margin: "0 auto 48px",
            padding: "0 10px"
          }}>
            Most agencies build &quot;digital brochures.&quot; We engineer high-performance Web Assets designed to convert traffic into revenue at the highest possible velocity. Powered by Next.js 15 and server-side precision.
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            <button onClick={() => {
              const el = document.getElementById('roi-engine');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} className="btn-primary" style={{ padding: "18px 36px", fontSize: 11, minWidth: 200 }}>Calculate ROI Impact</button>
            <button onClick={onAudit} className="btn-secondary" style={{ padding: "18px 36px", fontSize: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", minWidth: 200 }}>Scan My Current Site</button>
          </div>
        </FadeSection>
      </div>
    </section>
  );
};
