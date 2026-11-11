"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding?: boolean;
      }) => void;
      initPopupWidget: (options: { url: string }) => void;
      closePopupWidget: () => void;
    };
  }
}

export const CALENDLY_URL = "https://calendly.com/mit-kapur";

export function openCalendly(url: string = CALENDLY_URL) {
  if (typeof window === "undefined") return;
  if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
    window.Calendly.initPopupWidget({ url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function CalendlyBadge() {
  useEffect(() => {
    // 1. Inject Calendly Stylesheet if not already present
    const cssId = "calendly-widget-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // 2. Initialize badge widget
    const initBadge = () => {
      if (!window.Calendly || typeof window.Calendly.initBadgeWidget !== "function") return;
      
      const existingBadge = document.querySelector(".calendly-badge-widget");
      if (existingBadge) {
        existingBadge.remove();
      }

      window.Calendly.initBadgeWidget({
        url: CALENDLY_URL,
        text: "Schedule with Adyant Nexa's team",
        color: "#0047FF",
        textColor: "#ffffff",
        branding: true,
      });
    };

    // 3. Inject Calendly Script if not already present
    const scriptId = "calendly-widget-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = initBadge;
      document.body.appendChild(script);
    } else {
      if (window.Calendly) {
        initBadge();
      } else {
        script.addEventListener("load", initBadge);
      }
    }

    return () => {
      const badge = document.querySelector(".calendly-badge-widget");
      if (badge) {
        badge.remove();
      }
    };
  }, []);

  return (
    <style jsx global>{`
      /* Adyant Nexa Brand Themed Calendly Badge */
      .calendly-badge-widget {
        right: 24px !important;
        bottom: 24px !important;
        z-index: 9990 !important;
      }

      .calendly-badge-widget .calendly-badge-content {
        background-color: #0047FF !important;
        color: #FFFFFF !important;
        font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        letter-spacing: 0.01em !important;
        height: 46px !important;
        line-height: 46px !important;
        padding: 0 22px !important;
        border-radius: 9999px !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        box-shadow: 0 10px 28px rgba(0, 71, 255, 0.38), 0 2px 8px rgba(10, 10, 12, 0.12) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.2s ease !important;
        cursor: pointer !important;
      }

      .calendly-badge-widget .calendly-badge-content:hover {
        background-color: #0036CC !important;
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 14px 36px rgba(0, 71, 255, 0.5), 0 4px 12px rgba(10, 10, 12, 0.16) !important;
      }

      /* Sky Cyan Pulse Indicator inside Calendly Badge */
      .calendly-badge-widget .calendly-badge-content::before {
        content: "";
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #38BDF8;
        box-shadow: 0 0 8px #38BDF8;
        margin-right: 9px;
        flex-shrink: 0;
      }

      /* Institutional Glass Backdrop for Calendly Popup Modal */
      .calendly-overlay {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        background-color: rgba(10, 10, 12, 0.72) !important;
        z-index: 99999 !important;
      }

      .calendly-popup {
        border-radius: 20px !important;
        overflow: hidden !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45), 0 0 40px rgba(0, 71, 255, 0.18) !important;
      }

      .calendly-popup-close {
        background-color: #0A0A0C !important;
        border-radius: 50% !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
      }

      @media (max-width: 640px) {
        .calendly-badge-widget {
          right: 16px !important;
          bottom: 16px !important;
        }
        .calendly-badge-widget .calendly-badge-content {
          height: 42px !important;
          line-height: 42px !important;
          padding: 0 16px !important;
          font-size: 12px !important;
        }
      }
    `}</style>
  );
}
