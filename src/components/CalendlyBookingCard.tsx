"use client";

import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { openCalendly } from "./CalendlyBadge";

export function CalendlyBookingCard() {
  return (
    <div
      style={{
        marginTop: "1.75rem",
        padding: "1.25rem",
        borderRadius: "16px",
        backgroundColor: "rgba(0, 71, 255, 0.04)",
        border: "1px solid rgba(0, 71, 255, 0.16)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Calendar size={16} color="#0047FF" />
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--accent-color)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Direct Calendar Booking
        </span>
      </div>

      <h4
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--text-color)",
          marginBottom: "4px",
        }}
      >
        Schedule Strategy Session
      </h4>

      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--muted-text)",
          lineHeight: 1.45,
          margin: "0 0 12px 0",
        }}
      >
        Book a direct 1-on-1 walkthrough on Calendly with Adyant Nexa&apos;s team to evaluate your revenue engine and conversion velocity.
      </p>

      <button
        type="button"
        onClick={() => openCalendly()}
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "0.75rem 1rem",
          fontSize: "0.82rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
        aria-label="Schedule Strategy Session with Adyant Nexa's Team"
      >
        <span>Schedule With Adyant Nexa&apos;s Team</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
