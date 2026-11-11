"use client";

import { useState } from "react";

export function RoiYieldCalculator() {
  const [leads, setLeads] = useState<number>(300);

  const extraViewings = Math.round(leads * 0.15);
  const commission = Math.round(extraViewings * 0.1 * 40000);

  return (
    <section className="roi-section" id="roi">
      <div className="roi-grid">
        <div>
          <div className="roi-badge">
            AGENCY REVENUE IMPACT
          </div>
          <h2 className="roi-h2">
            <span className="roi-h2-title">
              Stop burning <br />
              ad spend.
            </span>
            <em className="roi-h2-accent">Capture every lead.</em>
          </h2>
          <p className="roi-sub">
            When ad leads wait more than 15 minutes, conversion rates drop by 391%. Adyant Nexa eliminates the leak entirely by engaging in 1.2 seconds.
          </p>

          <a
            href="https://wa.me/?text=Hi%2C%20I%20am%20a%20Dubai%20Real%20Estate%20Agency%20Principal.%20I%20want%20to%20pilot%20Adyant%20Nexa."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-primary roi-cta-btn"
            aria-label="Claim Pilot Deployment via WhatsApp (opens in new window)"
          >
            Claim Pilot Deployment ↗
          </a>
        </div>

        <div className="slider-container">
          <div className="slider-top">
            <label htmlFor="roi-leads-slider" className="slider-lbl">
              MONTHLY INBOUND PROPERTY LEADS
            </label>
            <span className="slider-val" aria-live="polite">{leads}</span>
          </div>
          <input
            id="roi-leads-slider"
            type="range"
            min="50"
            max="1000"
            step="25"
            value={leads}
            className="styled-range"
            aria-label="Monthly inbound property leads"
            aria-valuemin={50}
            aria-valuemax={1000}
            aria-valuenow={leads}
            aria-valuetext={`${leads} leads per month`}
            onChange={(e) => setLeads(Number(e.target.value))}
          />

          <div className="result-split">
            <div>
              <div className="result-num">+{extraViewings}</div>
              <div className="result-lbl">Extra Qualified Viewings Booked / mo</div>
            </div>
            <div>
              <div className="result-num" style={{ color: "var(--cyan-bright)" }}>
                AED {commission.toLocaleString()}
              </div>
              <div className="result-lbl">Estimated Commission Uplift (@ 2% on AED 2M)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
