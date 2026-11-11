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

export type LeadChannel = "WHATSAPP" | "INSTAGRAM" | "FACEBOOK" | "WEB";

export interface LeadMessage {
  role: "user" | "model";
  text: string;
  timestamp?: string;
}

export interface LeadQualification {
  status?: "HOT" | "WARM" | "COLD" | "UNQUALIFIED";
  score?: number;
  budget_aed?: string;
  preferred_areas?: string[];
  property_type?: string;
  timeline?: string;
  golden_visa_interested?: boolean;
  agency_name?: string;
  team_size?: string;
  monthly_lead_volume?: string;
  current_pain_point?: string;
  simulation_active?: boolean;
  google_meet_requested?: boolean;
  preferred_slot?: string | null;
  lead_email?: string | null;
}

export interface LeadRecord {
  id?: string;
  raw_jid: string;
  phone: string;
  display_title: string;
  formatted_phone: string;
  channel?: LeadChannel;
  is_lid?: boolean;
  push_name?: string;
  last_message: string;
  qualification: LeadQualification;
  action?: string;
  human_takeover?: boolean;
  messages: LeadMessage[];
  updated_at?: string;
}

export interface MetaMessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    is_echo?: boolean;
    attachments?: Array<{ type: string; payload: Record<string, unknown> }>;
  };
  postback?: {
    mid: string;
    title: string;
    payload: string;
  };
}

export interface MetaWebhookEntry {
  id: string;
  time: number;
  messaging?: MetaMessagingEvent[];
  standby?: MetaMessagingEvent[];
}

export interface MetaWebhookPayload {
  object: "page" | "instagram";
  entry: MetaWebhookEntry[];
}
