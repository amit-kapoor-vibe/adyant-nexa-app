// ─── Shared TypeScript Interfaces ─────────────────────────────────────────────

export interface ProtocolItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
}

export interface MatrixRow {
  feature: string;
  nexa: string;
  others: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  tag: string;
  title: string;
  desc: string;
  metrics: [string, string][];
  quote: string;
  founder: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ScanState = "idle" | "scanning" | "result";

export interface IndustryConfig {
  id: string;
  name: string;
  minLabor: number;
  maxLabor: number;
  defaultLabor: number;
  avgTicketSize: number;
  conversionLift: number; // How much AI improves conversion (e.g. 0.15 for 15% boost)
  responseLoss: number; // % of revenue lost due to slow human response
}

export type Currency = "USD" | "INR";
