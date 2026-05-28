/**
 * NEXA Analytics Utility
 * Designed for elite-level tracking of user interactions and performance.
 */

type EventName = 
  | 'scan_initiated' 
  | 'lead_submitted' 
  | 'whatsapp_clicked' 
  | 'error_occurred' 
  | 'api_latency';

// Extend Window for third-party analytics globals
declare global {
  interface Window {
    fbq?: (type: string, event: string, params?: EventParams) => void;
    gtag?: (command: string, event: string, params?: EventParams) => void;
  }
}

interface EventParams {
  [key: string]: unknown;
}

export const trackEvent = (name: EventName, params: EventParams = {}) => {
  const timestamp = new Date().toISOString();
  
  // 1. Development Logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ANALYTICS] ${timestamp} | Event: ${name}`, params);
  }

  // 2. Meta Pixel (if available)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, params);
  }

  // 3. Google Analytics (if available)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }

  // 4. Custom Server-side Logging (Placeholder)
  // In a real elite app, we would send this to a beacon or specialized endpoint
};

export const trackLatency = (apiName: string, duration: number) => {
  trackEvent('api_latency', {
    api: apiName,
    duration_ms: duration,
  });
};
