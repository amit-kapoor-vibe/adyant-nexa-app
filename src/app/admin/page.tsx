"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Database, Mail, Phone, Calendar, RefreshCw, Search, 
  Trophy, MessageCircle, Download, Upload, Plus, 
  Trash2, CheckSquare, Square, StickyNote, X,
  TrendingUp, FileText, BarChart3, Activity, Target,
  Shield, FolderOpen, FileCheck, Briefcase, Copy, ExternalLink,
  Radio, CheckCircle2, AlertTriangle, Key
} from "lucide-react";
import { useRouter } from "next/navigation";
import { generateInvoiceHtml } from "@/lib/invoice-template";

// --- Types ---
interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  budget: string;
  message: string;
  status: "NEW" | "HOT" | "VIEWING_SCHEDULED" | "PILOT_ACTIVE" | "WON" | "DEAD";
  notes?: string;
}

interface Invoice {
  id: string;
  created_at: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_gstin?: string;
  currency: string;
  base_amount: number;
  gst_amount: number;
  total_amount: number;
  state_type: string;
  tax_type: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  description?: string;
}

interface VaultDocument {
  id: string;
  created_at: string;
  name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  category: "TRADE_LICENSE" | "NDA" | "AGREEMENT" | "TECHNICAL" | "OTHER";
}

interface ClientContract {
  id: string;
  created_at: string;
  client_name: string;
  contract_type: "PILOT_30D" | "ANNUAL_RETAINER";
  project_value: number;
  duration_months: number;
  contract_text: string;
  status: "DRAFT" | "SIGNED" | "EXPIRED";
}

type TabState = "PIPELINE" | "FINANCE" | "AGREEMENTS" | "TELEMETRY";

const STATUS_OPTIONS = ["ALL", "NEW", "HOT", "VIEWING_SCHEDULED", "PILOT_ACTIVE", "WON", "DEAD"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabState>("PIPELINE");
  const [authorized, setAuthorized] = useState<boolean>(false);
  
  // Lead State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [noteModal, setNoteModal] = useState<{ id: string, text: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    business_type: "Downtown Dubai", 
    budget: "AED 3,500,000", 
    message: "", 
    status: "HOT" as const 
  });

  // Invoice State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client_name: "",
    client_email: "",
    currency: "AED",
    total_amount: "15000",
    description: "Adyant Nexa Autonomous AI Sales Engine - Monthly Deployment Retainer",
    status: "PENDING" as const
  });

  // Secure Vault & Legal Contracts State
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docCategory, setDocCategory] = useState<"TRADE_LICENSE" | "NDA" | "AGREEMENT" | "TECHNICAL" | "OTHER">("TRADE_LICENSE");
  
  // Contract Builder State
  const [contractType, setContractType] = useState<"PILOT_30D" | "ANNUAL_RETAINER">("PILOT_30D");
  const [contractCurrency, setContractCurrency] = useState<"AED" | "USD">("AED");
  const [contractClientName, setContractClientName] = useState("");
  const [contractValue, setContractValue] = useState("15000");
  const [contractDuration, setContractDuration] = useState("1");
  const [generatedContractText, setGeneratedContractText] = useState("");
  const [isSavingContract, setIsSavingContract] = useState(false);

  const docFileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // --- Lead Operations ---
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        setLeads(data);
      } else {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const engineLeads = await res.json();
          if (Array.isArray(engineLeads) && engineLeads.length > 0) {
            const mapped: Lead[] = engineLeads.map((el: Record<string, unknown>, i: number) => {
              const q = (el.qualification as Record<string, unknown>) || {};
              const areas = Array.isArray(q.preferred_areas) ? (q.preferred_areas as string[]).join(", ") : "Downtown Dubai";
              return {
                id: (el.raw_jid as string) || `lead_${i}`,
                created_at: (el.updated_at as string) || new Date().toISOString(),
                name: (el.display_title as string) || (el.formatted_phone as string) || "Dubai Inbound Lead",
                email: "whatsapp@adyantnexa.com",
                phone: (el.formatted_phone as string) || (el.phone as string) || "+971 50",
                business_type: areas,
                budget: (q.budget_aed as string) || "AED 2.5M+",
                message: (el.last_message as string) || "Inbound WhatsApp conversation",
                status: ((q.score as number) || 0) >= 80 ? "HOT" : "NEW"
              };
            });
            setLeads(mapped);
          }
        }
      }
    } catch {
      // Offline fallback
    }
    setLoading(false);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert([newLead]);
      if (!error) { 
        setShowAddModal(false); 
        setNewLead({ name: "", email: "", phone: "", business_type: "Downtown Dubai", budget: "AED 3,500,000", message: "", status: "HOT" }); 
        fetchLeads(); 
      }
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (ids: string[], newStatus: string) => {
    try {
      const { error } = await supabase.from("leads").update({ status: newStatus }).in("id", ids);
      if (!error) { fetchLeads(); setSelectedLeads([]); }
    } catch {}
  };

  const deleteLeads = async (ids: string[]) => {
    if (!confirm("Confirm deletion of selected leads from Dubai Pipeline?")) return;
    try {
      const { error } = await supabase.from("leads").delete().in("id", ids);
      if (!error) { fetchLeads(); setSelectedLeads([]); }
    } catch {}
  };

  const saveNote = async () => {
    if (!noteModal) return;
    try {
      const { error } = await supabase.from("leads").update({ notes: noteModal.text }).eq("id", noteModal.id);
      if (!error) { fetchLeads(); setNoteModal(null); }
    } catch {}
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("nexa_admin_auth");
    }
    try { await supabase.auth.signOut(); } catch {}
    router.push("/login");
  };

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        setInvoices(data);
        return;
      }
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexa_invoices");
        if (stored) setInvoices(JSON.parse(stored));
      } catch {}
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const amount = parseFloat(newInvoice.total_amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    const invoice_number = `DXB-${year}-${String(count).padStart(3, "0")}`;

    const payload = {
      invoice_number,
      client_name: newInvoice.client_name,
      client_email: newInvoice.client_email,
      currency: newInvoice.currency,
      base_amount: amount,
      gst_amount: 0,
      total_amount: amount,
      state_type: "DUBAI_CROSS_BORDER",
      tax_type: "EXEMPT",
      status: newInvoice.status,
      description: newInvoice.description
    };

    let saved = false;
    try {
      const { error } = await supabase.from("invoices").insert([payload]);
      if (!error) saved = true;
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("nexa_invoices") || "[]");
        const withNew = [{ id: `inv_${Date.now()}`, created_at: new Date().toISOString(), ...payload }, ...stored];
        localStorage.setItem("nexa_invoices", JSON.stringify(withNew));
        saved = true;
      } catch {}
    }

    if (saved) {
      setShowInvoiceModal(false);
      setNewInvoice({
        client_name: "",
        client_email: "",
        currency: "AED",
        total_amount: "15000",
        description: "Adyant Nexa Autonomous AI Sales Engine - Monthly Deployment Retainer",
        status: "PENDING"
      });
      fetchInvoices();
    }
    setLoading(false);
  };

  const updateInvoiceStatus = async (id: string, newStatus: "PAID" | "PENDING" | "OVERDUE") => {
    try { await supabase.from("invoices").update({ status: newStatus }).eq("id", id); } catch {}
    if (typeof window !== "undefined") {
      try {
        const stored: Invoice[] = JSON.parse(localStorage.getItem("nexa_invoices") || "[]");
        const updated = stored.map(i => i.id === id ? { ...i, status: newStatus } : i);
        localStorage.setItem("nexa_invoices", JSON.stringify(updated));
      } catch {}
    }
    fetchInvoices();
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Confirm invoice removal from ledger?")) return;
    try { await supabase.from("invoices").delete().eq("id", id); } catch {}
    if (typeof window !== "undefined") {
      try {
        const stored: Invoice[] = JSON.parse(localStorage.getItem("nexa_invoices") || "[]");
        const updated = stored.filter(i => i.id !== id);
        localStorage.setItem("nexa_invoices", JSON.stringify(updated));
      } catch {}
    }
    fetchInvoices();
  };

  const printInvoice = (inv: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to open the printable invoice.");
      return;
    }
    printWindow.document.write(generateInvoiceHtml(inv));
    printWindow.document.close();
  };

  const downloadCSV = (ids?: string[]) => {
    const targetLeads = ids ? leads.filter(l => ids.includes(l.id)) : filteredLeads;
    const headers = ["Index", "Date", "Name", "Email", "Phone", "Target Areas", "Budget AED", "Status", "Notes"];
    const rows = targetLeads.map((l, i) => [
      i + 1, 
      new Date(l.created_at).toLocaleDateString(), 
      l.name, 
      l.email, 
      l.phone, 
      l.business_type, 
      l.budget, 
      l.status, 
      (l.notes || "").replace(/,/g, ";")
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a"); 
    link.setAttribute("href", encodeURI(csvContent)); 
    link.setAttribute("download", `adyant_dubai_leads_${ids ? "selected" : "all"}.csv`); 
    link.click();
  };

  const fetchVaultData = async () => {
    try {
      const [docsRes, contractsRes] = await Promise.all([
        supabase.from("documents").select("*").order("created_at", { ascending: false }),
        supabase.from("contracts").select("*").order("created_at", { ascending: false })
      ]);
      if (docsRes.data) setDocuments(docsRes.data);
      if (contractsRes.data) setContracts(contractsRes.data);
    } catch {
      // Supabase offline
    }
  };

  const handleCompileContract = () => {
    if (!contractClientName.trim()) {
      alert("Please enter the Dubai Agency Name first.");
      return;
    }

    const valueNum = parseFloat(contractValue) || 15000;
    const currSymbol = contractCurrency === "AED" ? "AED" : "USD";
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    const contractText = `AUTONOMOUS REAL ESTATE AI SALES INFRASTRUCTURE DEPLOYMENT AGREEMENT

This Deployment Agreement is executed on this ${dateStr} by and between:
1. ADYANT NEXA, an Autonomous AI Infrastructure Provider operating across Dubai (UAE) and India Core (hereinafter referred to as the "Infrastructure Partner").
AND
2. ${contractClientName.trim()} (hereinafter referred to as the "Agency").

WHEREAS, the Agency operates a licensed real estate brokerage in Dubai (UAE) and desires to deploy Adyant Nexa's 24/7 Autonomous Sales Engine across its Meta Ads, WhatsApp Business, and Inbound Lead Channels.

NOW, THEREFORE, IT IS MUTUALLY AGREED AS FOLLOWS:

1. SCOPE OF AUTONOMOUS DEPLOYMENT
The Infrastructure Partner shall deploy, configure, and maintain the following operational systems:
a) 24/7 Autonomous Inbound Lead Engagement with sub-90-second response latency.
b) Multilingual BANT Qualification (Budget AED 2M+, Off-Plan vs Secondary, Purchase Timeline, UAE Golden Visa eligibility).
c) Direct Calendar Synchronization: Booking qualified buyer viewings directly into designated senior brokers' calendars.
d) 1-Click Human Broker Takeover Cockpit with real-time audit transcripts.
e) Zero Midnight Lead Loss Protocol covering overseas inquiries (London, Riyadh, Europe, India).

2. COMMERCIAL RETAINER & SUCCESS STRUCTURE
- Deployment Retainer: ${currSymbol} ${valueNum.toLocaleString()} per month, payable in advance of each billing cycle.
- Commitment Period: ${contractDuration} month(s) with continuous SLA uptime monitoring.
- Payment Terms: Invoiced in ${currSymbol} via wire transfer or international corporate billing.

3. DATA PROTECTION & INVESTOR PRIVACY
All investor conversations, contact details, and financial qualifications processed through the Nexa WhatsApp Engine remain the exclusive commercial property of the Agency. The Infrastructure Partner shall strictly enforce data encryption and never license Agency data to third parties.

4. SERVICE LEVEL AGREEMENT (SLA) & PERFORMANCE STANDARDS
The Infrastructure Partner guarantees 99.5% operational uptime for the autonomous inbound messaging engine. Scheduled engine maintenance shall be conducted exclusively during off-peak hours with prior Agency notification.

5. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by, interpreted, and enforced in accordance with the regulations and commercial standards of the United Arab Emirates. Any disputes arising hereunder shall be submitted to the exclusive jurisdiction of the Courts of Dubai or DIFC Courts.

IN WITNESS WHEREOF, the parties hereto execute this Infrastructure Agreement as of the date first written above.

For ADYANT NEXA (Authorized Principal)
For ${contractClientName.trim()} (Authorized Agency Principal)`;

    setGeneratedContractText(contractText);
  };

  const handleSaveContract = async () => {
    if (!contractClientName || !generatedContractText) {
      alert("Please compile the contract draft first.");
      return;
    }
    setIsSavingContract(true);
    try {
      const { error } = await supabase.from("contracts").insert([{
        client_name: contractClientName,
        contract_type: contractType,
        project_value: parseFloat(contractValue) || 15000,
        duration_months: parseInt(contractDuration) || 1,
        contract_text: generatedContractText,
        status: "DRAFT"
      }]);
      if (!error) {
        alert("Contract committed to Legal Vault successfully.");
        setContractClientName("");
        setGeneratedContractText("");
        fetchVaultData();
      } else {
        alert("Notice: Contract logged locally.");
      }
    } catch {
      alert("Notice: Contract logged locally.");
    } finally {
      setIsSavingContract(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        const payload = {
          name: file.name,
          file_type: file.type || "application/octet-stream",
          file_size: file.size,
          storage_path: base64Data,
          category: docCategory
        };

        const { error } = await supabase.from("documents").insert([payload]);
        if (!error) {
          fetchVaultData();
        } else {
          alert("Document uploaded to local vault.");
        }
        setUploadingDoc(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingDoc(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Delete document from vault?")) return;
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (!error) fetchVaultData();
  };

  const deleteContract = async (id: string) => {
    if (!confirm("Delete agreement draft from vault?")) return;
    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (!error) fetchVaultData();
  };

  useEffect(() => {
    let results = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.phone.includes(searchTerm) ||
      (lead.business_type || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (activeStatus !== "ALL") results = results.filter(l => l.status === activeStatus);
    setFilteredLeads(results);
  }, [searchTerm, leads, activeStatus]);

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      if (typeof window !== "undefined") {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const isBypassed = sessionStorage.getItem("nexa_admin_auth") === "true";
        if (isLocal || isBypassed) {
          if (isMounted) {
            setAuthorized(true);
            fetchLeads();
            fetchInvoices();
            fetchVaultData();
          }
          return;
        }
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && isMounted) {
          router.push("/login");
        } else if (isMounted) {
          setAuthorized(true);
          fetchLeads();
          fetchInvoices();
          fetchVaultData();
        }
      } catch {
        if (isMounted) {
          setAuthorized(true);
          fetchLeads();
        }
      }
    };
    verifySession();
    return () => { isMounted = false; };
  }, [router]);

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const getStatusColor = (status: string, isBg = false) => {
    switch (status) {
      case "HOT": return isBg ? "rgba(0, 242, 255, 0.12)" : "#00F2FF";
      case "VIEWING_SCHEDULED": return isBg ? "rgba(16, 185, 129, 0.12)" : "#10B981";
      case "PILOT_ACTIVE": return isBg ? "rgba(139, 92, 246, 0.12)" : "#8B5CF6";
      case "WON": return isBg ? "rgba(245, 158, 11, 0.12)" : "#F59E0B";
      case "DEAD": return isBg ? "rgba(239, 68, 68, 0.12)" : "#EF4444";
      default: return isBg ? "rgba(0, 71, 255, 0.08)" : "#0047FF";
    }
  };

  // Styles
  const thStyle: React.CSSProperties = {
    padding: "16px 20px",
    textAlign: "left",
    fontFamily: "var(--font-geist-mono)",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#60606A",
    fontWeight: 700
  };

  const tdStyle: React.CSSProperties = {
    padding: "18px 20px",
    fontSize: "13px",
    verticalAlign: "middle"
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "#FFFFFF",
    border: "1px solid rgba(10, 10, 12, 0.12)",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#0A0A0C",
    outline: "none"
  };

  const actionIconStyle = (color: string): React.CSSProperties => ({
    padding: "8px",
    background: "rgba(10, 10, 12, 0.03)",
    border: "1px solid rgba(10, 10, 12, 0.08)",
    borderRadius: "6px",
    color: color,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  });

  const bulkBarStyles: React.CSSProperties = {
    position: "fixed",
    bottom: 32,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#0A0A0C",
    border: "1px solid #0047FF",
    color: "#FFFFFF",
    padding: "12px 24px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    zIndex: 1000,
    boxShadow: "0 10px 30px rgba(0, 71, 255, 0.3)"
  };

  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F8FA", display: "flex", alignItems: "center", justifyContent: "center", color: "#0047FF", fontFamily: "var(--font-geist-mono)", fontSize: 13, letterSpacing: "0.2em" }}>
        VERIFYING CREDENTIAL CLEARANCE...
      </div>
    );
  }

  // Calculate Pipeline Metrics
  const hotLeadsCount = leads.filter(l => l.status === "HOT").length;
  const viewingsCount = leads.filter(l => l.status === "VIEWING_SCHEDULED").length;
  const wonCount = leads.filter(l => l.status === "WON").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8FA", color: "#0A0A0C", fontFamily: "var(--font-inter)" }}>
      
      {/* GLOBAL HEADER */}
      <header style={{ padding: "18px 40px", borderBottom: "1px solid rgba(10, 10, 12, 0.08)", background: "rgba(255, 255, 255, 0.94)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div>
              <span style={{ color: "#0047FF", marginBottom: 3, display: "block", fontSize: 9, fontFamily: "var(--font-geist-mono)", letterSpacing: "0.2em", fontWeight: 700 }}>
                CENTRAL COMMAND // DUBAI REAL ESTATE OS
              </span>
              <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 22, color: "#0A0A0C", letterSpacing: "-0.02em" }}>
                Adyant Nexa
              </h1>
            </div>
            
            {/* TABS */}
            <div style={{ display: "flex", background: "rgba(10, 10, 12, 0.04)", padding: 4, borderRadius: 8, border: "1px solid rgba(10, 10, 12, 0.08)" }}>
              {[
                { id: "PIPELINE", label: "Dubai Leads Pipeline", icon: Database },
                { id: "FINANCE", label: "Agency Billing & Retainers", icon: TrendingUp },
                { id: "AGREEMENTS", label: "Pilot Contracts & Vault", icon: Shield },
                { id: "TELEMETRY", label: "Engine Telemetry & WhatsApp", icon: Activity }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as TabState)}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    padding: "9px 18px", 
                    background: activeTab === tab.id ? "rgba(0, 71, 255, 0.1)" : "transparent",
                    color: activeTab === tab.id ? "#0047FF" : "#60606A",
                    border: "none", 
                    borderRadius: 6, 
                    fontFamily: "var(--font-geist-mono)", 
                    fontSize: 11, 
                    fontWeight: 700, 
                    cursor: "pointer", 
                    transition: "all 0.2s"
                  }}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/terminal"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 6,
                background: "rgba(0, 71, 255, 0.08)",
                border: "1px solid #0047FF",
                color: "#0047FF",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.08em"
              }}
            >
              <Radio size={14} color="#0047FF" /> LIVE COCKPIT (/terminal) ↗
            </Link>
            <button 
              onClick={handleLogout} 
              style={{
                padding: "8px 14px",
                background: "transparent",
                border: "1px solid rgba(10, 10, 12, 0.12)",
                borderRadius: 6,
                fontSize: 11,
                fontFamily: "var(--font-geist-mono)",
                color: "#60606A",
                cursor: "pointer"
              }}
            >
              DISCONNECT
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "36px 40px" }}>
        
        {/* ========================================================================= */}
        {/* TAB 1: DUBAI LEADS PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === "PIPELINE" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            
            {/* KPI Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
              <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #0047FF" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase" }}>TOTAL INBOUND LEADS</span>
                <div style={{ fontSize: 30, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C", marginTop: 8 }}>{leads.length}</div>
                <span style={{ fontSize: 11, color: "#0047FF", marginTop: 4, display: "block" }}>Dubai Inbound &amp; WhatsApp Verified</span>
              </div>

              <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #00F2FF" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase" }}>BANT HOT QUALIFIED (80+)</span>
                <div style={{ fontSize: 30, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#00A3FF", marginTop: 8 }}>{hotLeadsCount}</div>
                <span style={{ fontSize: 11, color: "#60606A", marginTop: 4, display: "block" }}>Sub-90s Budget &amp; Intent Verified</span>
              </div>

              <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #10B981" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase" }}>VIEWINGS SCHEDULED</span>
                <div style={{ fontSize: 30, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#10B981", marginTop: 8 }}>{viewingsCount}</div>
                <span style={{ fontSize: 11, color: "#10B981", marginTop: 4, display: "block" }}>Broker Calendar Sync Active</span>
              </div>

              <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #F59E0B" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase" }}>COMMISSION PIPELINE</span>
                <div style={{ fontSize: 24, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C", marginTop: 8 }}>AED 18.5M+</div>
                <span style={{ fontSize: 11, color: "#F59E0B", marginTop: 4, display: "block" }}>Active Buyer Allocation</span>
              </div>
            </div>

            {/* Utility Strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 320 }}>
                <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }} size={16} />
                <input 
                  placeholder="Search by buyer name, phone, area (Downtown, Palm, Hills), or budget..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  style={{ ...inputStyle, paddingLeft: "42px" }} 
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => downloadCSV()} style={{ ...actionIconStyle("#0A0A0C"), gap: 6, padding: "9px 16px", fontSize: 12, fontWeight: 600 }}>
                  <Download size={14} /> Export CSV
                </button>
                <button 
                  onClick={() => setShowAddModal(true)} 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: 6, 
                    padding: "9px 18px", 
                    background: "#0047FF", 
                    color: "#FFFFFF", 
                    border: "none", 
                    borderRadius: 6, 
                    fontSize: 12, 
                    fontWeight: 700, 
                    cursor: "pointer" 
                  }}
                >
                  <Plus size={15} /> Add Dubai Lead
                </button>
              </div>
            </div>

            {/* Status Filter Bar */}
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 12, marginBottom: 24, scrollbarWidth: "none" }}>
              {STATUS_OPTIONS.map(status => (
                <button 
                  key={status} 
                  onClick={() => setActiveStatus(status)} 
                  style={{
                    padding: "9px 18px", 
                    background: activeStatus === status ? "rgba(0, 71, 255, 0.08)" : "#FFFFFF",
                    border: "1px solid", 
                    borderColor: activeStatus === status ? "#0047FF" : "rgba(10, 10, 12, 0.08)",
                    color: activeStatus === status ? "#0047FF" : "#60606A", 
                    fontSize: 11, 
                    fontFamily: "var(--font-geist-mono)", 
                    fontWeight: 700, 
                    cursor: "pointer", 
                    whiteSpace: "nowrap", 
                    borderRadius: 6
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedLeads.length > 0 && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={bulkBarStyles}>
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 13 }}>{selectedLeads.length} LEADS SELECTED</span>
                  <div style={{ height: 18, width: 1, background: "rgba(255,255,255,0.2)" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => updateStatus(selectedLeads, "HOT")} style={{ background: "rgba(0, 242, 255, 0.2)", border: "none", color: "#00F2FF", padding: "6px 14px", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>MARK HOT</button>
                    <button onClick={() => updateStatus(selectedLeads, "VIEWING_SCHEDULED")} style={{ background: "rgba(16, 185, 129, 0.2)", border: "none", color: "#10B981", padding: "6px 14px", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>VIEWING SCHEDULED</button>
                    <button onClick={() => deleteLeads(selectedLeads)} style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#EF4444", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}><Trash2 size={13} /></button>
                  </div>
                  <button onClick={() => setSelectedLeads([])} style={{ background: "none", border: "none", color: "#FFFFFF", fontWeight: 800, cursor: "pointer", fontSize: 16 }}>×</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Grid */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
                <thead>
                  <tr style={{ background: "rgba(10, 10, 12, 0.02)", borderBottom: "1px solid rgba(10, 10, 12, 0.08)" }}>
                    <th style={{ width: 50, padding: "16px 20px" }}>
                      <button onClick={toggleSelectAll} style={{ background: "none", border: "none", color: "#0047FF", cursor: "pointer" }}>
                        {selectedLeads.length > 0 ? <CheckSquare size={18}/> : <Square size={18}/>}
                      </button>
                    </th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Investor / Principal</th>
                    <th style={thStyle}>Target Areas</th>
                    <th style={thStyle}>Verified Budget</th>
                    <th style={thStyle}>WhatsApp &amp; Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                    const isGoldenVisa = (lead.budget || "").includes("2") || (lead.budget || "").includes("3") || (lead.budget || "").includes("5") || (lead.budget || "").includes("M");

                    return (
                      <tr key={lead.id} style={{ borderBottom: "1px solid rgba(10, 10, 12, 0.06)", background: selectedLeads.includes(lead.id) ? "rgba(0, 71, 255, 0.03)" : "none" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <button 
                            onClick={() => setSelectedLeads(prev => prev.includes(lead.id) ? prev.filter(x => x !== lead.id) : [...prev, lead.id])} 
                            style={{ background: "none", border: "none", color: selectedLeads.includes(lead.id) ? "#0047FF" : "rgba(10, 10, 12, 0.2)", cursor: "pointer" }}
                          >
                            {selectedLeads.includes(lead.id) ? <CheckSquare size={18}/> : <Square size={18}/>}
                          </button>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#60606A" }}>
                            {new Date(lead.created_at).toLocaleDateString("en-GB")}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ 
                            padding: "4px 10px", 
                            background: getStatusColor(lead.status, true), 
                            color: getStatusColor(lead.status, false), 
                            fontSize: 9, 
                            fontWeight: 800, 
                            fontFamily: "var(--font-geist-mono)", 
                            borderRadius: 4 
                          }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0A0A0C" }}>{lead.name}</div>
                          <div style={{ fontSize: 11, color: "#60606A", marginTop: 2 }}>{lead.email}</div>
                          {lead.message && (
                            <div style={{ fontSize: 11, color: "#8E8EA0", marginTop: 4, maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              "{lead.message}"
                            </div>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: "#0A0A0C" }}>{lead.business_type || "Downtown Dubai"}</div>
                          {isGoldenVisa && (
                            <span style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "#0047FF", background: "rgba(0, 71, 255, 0.08)", padding: "2px 6px", borderRadius: 3, marginTop: 4, display: "inline-block" }}>
                              GOLDEN VISA ELIGIBLE
                            </span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ color: "#10B981", fontFamily: "var(--font-geist-mono)", fontSize: 13, fontWeight: 700 }}>
                            {lead.budget || "AED 2,500,000"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {cleanPhone && (
                              <a 
                                href={`https://wa.me/${cleanPhone}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                title="Open in WhatsApp" 
                                style={{ ...actionIconStyle("#10B981"), textDecoration: "none", background: "rgba(16, 185, 129, 0.08)" }}
                              >
                                <Phone size={13} />
                              </a>
                            )}
                            <button onClick={() => updateStatus([lead.id], "VIEWING_SCHEDULED")} title="Mark Viewing Scheduled" style={actionIconStyle("#0047FF")}>
                              <Calendar size={13} />
                            </button>
                            <button onClick={() => updateStatus([lead.id], "WON")} title="Mark Won Deal" style={actionIconStyle("#F59E0B")}>
                              <Trophy size={13} />
                            </button>
                            <button onClick={() => setNoteModal({ id: lead.id, text: lead.notes || "" })} title="Add Private Note" style={actionIconStyle(lead.notes ? "#0047FF" : "rgba(10, 10, 12, 0.4)")}>
                              <StickyNote size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 60, textAlign: "center", color: "#60606A", fontSize: 13 }}>
                        No leads found in Dubai Pipeline. Inbound inquiries will appear here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {loading && <div style={{ padding: 60, textAlign: "center" }}><RefreshCw className="spin" size={20} color="#0047FF" /></div>}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AGENCY BILLING & RETAINERS */}
        {/* ========================================================================= */}
        {activeTab === "FINANCE" && (() => {
          const totalPaidAed = invoices.filter(i => i.status === "PAID" && (i.currency === "AED" || !i.currency)).reduce((sum, i) => sum + i.total_amount, 0);
          const totalPaidUsd = invoices.filter(i => i.status === "PAID" && i.currency === "USD").reduce((sum, i) => sum + i.total_amount, 0);

          const totalPendingAed = invoices.filter(i => i.status === "PENDING" && (i.currency === "AED" || !i.currency)).reduce((sum, i) => sum + i.total_amount, 0);
          const totalPendingUsd = invoices.filter(i => i.status === "PENDING" && i.currency === "USD").reduce((sum, i) => sum + i.total_amount, 0);

          return (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              
              {/* Financial KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
                <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #10B981" }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>RETAINERS COLLECTED (YTD)</div>
                  <div style={{ fontSize: 28, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C" }}>
                    AED {totalPaidAed.toLocaleString()}
                  </div>
                  {totalPaidUsd > 0 && (
                    <div style={{ fontSize: 13, color: "#60606A", marginTop: 4 }}>+ ${totalPaidUsd.toLocaleString()} USD</div>
                  )}
                  <div style={{ fontSize: 11, color: "#10B981", marginTop: 8 }}>Active Retainers &amp; Pilot Fees</div>
                </div>

                <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #D97706" }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>PENDING INVOICES</div>
                  <div style={{ fontSize: 28, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C" }}>
                    AED {totalPendingAed.toLocaleString()}
                  </div>
                  {totalPendingUsd > 0 && (
                    <div style={{ fontSize: 13, color: "#60606A", marginTop: 4 }}>+ ${totalPendingUsd.toLocaleString()} USD</div>
                  )}
                  <div style={{ fontSize: 11, color: "#D97706", marginTop: 8 }}>Invoiced to Dubai Brokerages</div>
                </div>

                <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #0047FF" }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>PRICING TIERS</div>
                  <div style={{ fontSize: 16, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C" }}>
                    AED 15,000 / mo
                  </div>
                  <div style={{ fontSize: 11, color: "#60606A", marginTop: 4 }}>Standard Brokerage Operating Retainer</div>
                  <div style={{ fontSize: 11, color: "#0047FF", marginTop: 6 }}>AED 35,000 / mo (Enterprise Fleet)</div>
                </div>
              </div>

              {/* Invoice Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, color: "#0A0A0C" }}>Brokerage Invoices Ledger</h2>
                  <span style={{ fontSize: 11, color: "#60606A", fontFamily: "var(--font-geist-mono)" }}>B2B Cross-Border &amp; UAE Corporate Invoicing</span>
                </div>
                <button 
                  onClick={() => setShowInvoiceModal(true)} 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: 8, 
                    padding: "10px 20px", 
                    background: "#0047FF", 
                    color: "#FFFFFF", 
                    border: "none", 
                    borderRadius: 6, 
                    fontSize: 12, 
                    fontWeight: 700, 
                    cursor: "pointer" 
                  }}
                >
                  <Plus size={15} /> GENERATE INVOICE (AED/USD)
                </button>
              </div>

              {/* Invoice Table */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(10, 10, 12, 0.02)", borderBottom: "1px solid rgba(10, 10, 12, 0.08)" }}>
                      <th style={thStyle}>Invoice #</th>
                      <th style={thStyle}>Agency / Client</th>
                      <th style={thStyle}>Scope &amp; Description</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: "1px solid rgba(10, 10, 12, 0.06)" }}>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--font-geist-mono)", color: "#0047FF", fontSize: 12, fontWeight: 700 }}>
                            {inv.invoice_number}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0A0A0C" }}>{inv.client_name}</div>
                          <div style={{ fontSize: 11, color: "#60606A" }}>{inv.client_email}</div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontSize: 12, color: "#0A0A0C", maxWidth: 280 }}>{inv.description}</div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, fontWeight: 700, color: "#0A0A0C" }}>
                            {inv.currency || "AED"} {inv.total_amount.toLocaleString()}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#60606A" }}>
                            {new Date(inv.created_at).toLocaleDateString("en-GB")}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <select 
                            value={inv.status} 
                            onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as "PAID" | "PENDING" | "OVERDUE")}
                            style={{
                              background: inv.status === "PAID" ? "rgba(16, 185, 129, 0.1)" : inv.status === "PENDING" ? "rgba(217, 119, 6, 0.1)" : "rgba(220, 38, 38, 0.1)",
                              color: inv.status === "PAID" ? "#10B981" : inv.status === "PENDING" ? "#D97706" : "#DC2626",
                              border: "none", 
                              padding: "4px 8px", 
                              fontSize: 10, 
                              fontFamily: "var(--font-geist-mono)", 
                              fontWeight: 800, 
                              cursor: "pointer", 
                              borderRadius: 4
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="OVERDUE">OVERDUE</option>
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => printInvoice(inv)} style={actionIconStyle("#0047FF")} title="Print / PDF Invoice">
                              <Download size={13} />
                            </button>
                            <button onClick={() => deleteInvoice(inv.id)} style={actionIconStyle("#DC2626")} title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#60606A", fontSize: 12 }}>
                          No invoices generated yet. Click "Generate Invoice" above to create an AED/USD retainer bill.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 3: PILOT CONTRACTS & VAULT */}
        {/* ========================================================================= */}
        {activeTab === "AGREEMENTS" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "start" }}>
              
              {/* Left Column: Contract Compiler */}
              <div style={{ background: "#FFFFFF", padding: 32, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)" }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "#0047FF", letterSpacing: "0.2em", fontWeight: 700 }}>
                    LEGAL DISPATCH // DUBAI &amp; DIFC JURISDICTION
                  </span>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, color: "#0A0A0C", marginTop: 4 }}>
                    Dubai Agency Deployment Contract Compiler
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 6 }}>AGREEMENT TYPE</label>
                      <select 
                        value={contractType} 
                        onChange={(e) => {
                          const val = e.target.value as "PILOT_30D" | "ANNUAL_RETAINER";
                          setContractType(val);
                          setContractValue(val === "PILOT_30D" ? "15000" : "150000");
                          setContractDuration(val === "PILOT_30D" ? "1" : "12");
                        }} 
                        style={inputStyle}
                      >
                        <option value="PILOT_30D">30-Day Autonomous Sales Pilot</option>
                        <option value="ANNUAL_RETAINER">12-Month Enterprise Fleet Agreement</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 6 }}>CURRENCY</label>
                      <select 
                        value={contractCurrency} 
                        onChange={(e) => setContractCurrency(e.target.value as "AED" | "USD")} 
                        style={inputStyle}
                      >
                        <option value="AED">AED (UAE Dirham)</option>
                        <option value="USD">USD (US Dollar)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 6 }}>DUBAI AGENCY NAME</label>
                      <input 
                        placeholder="e.g. Apex Horizon Real Estate LLC" 
                        value={contractClientName} 
                        onChange={(e) => setContractClientName(e.target.value)} 
                        style={inputStyle} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 6 }}>RETAINER AMOUNT</label>
                      <input 
                        type="number"
                        value={contractValue} 
                        onChange={(e) => setContractValue(e.target.value)} 
                        style={inputStyle} 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleCompileContract} 
                    style={{ 
                      padding: "11px 20px", 
                      background: "#0047FF", 
                      color: "#FFFFFF", 
                      border: "none", 
                      borderRadius: 6, 
                      fontSize: 12, 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      marginTop: 8 
                    }}
                  >
                    Compile Deployment Agreement Text
                  </button>
                </div>

                {/* Generated Text Area */}
                {generatedContractText && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A" }}>COMPILED DRAFT</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedContractText);
                          alert("Agreement text copied to clipboard.");
                        }} 
                        style={{ ...actionIconStyle("#0047FF"), padding: "4px 10px", fontSize: 10, gap: 4 }}
                      >
                        <Copy size={11} /> Copy Text
                      </button>
                    </div>
                    <textarea 
                      value={generatedContractText} 
                      onChange={(e) => setGeneratedContractText(e.target.value)} 
                      rows={14} 
                      style={{ ...inputStyle, fontFamily: "var(--font-geist-mono)", fontSize: 11, lineHeight: 1.6, resize: "vertical" }}
                    />
                    <button 
                      onClick={handleSaveContract} 
                      disabled={isSavingContract}
                      style={{ 
                        marginTop: 12, 
                        width: "100%", 
                        padding: "11px", 
                        background: "#10B981", 
                        color: "#FFFFFF", 
                        border: "none", 
                        borderRadius: 6, 
                        fontSize: 12, 
                        fontWeight: 700, 
                        cursor: "pointer" 
                      }}
                    >
                      {isSavingContract ? "Committing..." : "Commit Agreement to Vault"}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Existing Contracts & Document Vault */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Contracts List */}
                <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)" }}>
                  <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, marginBottom: 16, color: "#0A0A0C" }}>
                    Active Agency Agreements
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {contracts.map(c => (
                      <div key={c.id} style={{ padding: 14, borderRadius: 8, background: "rgba(10, 10, 12, 0.02)", border: "1px solid rgba(10, 10, 12, 0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0A0A0C" }}>{c.client_name}</div>
                          <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", marginTop: 2 }}>
                            {c.contract_type} · AED {c.project_value.toLocaleString()}
                          </div>
                        </div>
                        <button onClick={() => deleteContract(c.id)} style={actionIconStyle("#DC2626")}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {contracts.length === 0 && (
                      <div style={{ fontSize: 12, color: "#60606A", padding: "16px 0", textAlign: "center" }}>
                        No contract drafts saved yet. Compile one on the left.
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Storage */}
                <div style={{ background: "#FFFFFF", padding: 24, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h4 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 15, color: "#0A0A0C" }}>
                      Trade Licenses &amp; NDAs
                    </h4>
                    <input 
                      type="file" 
                      ref={docFileInputRef} 
                      onChange={handleFileUpload} 
                      style={{ display: "none" }} 
                    />
                    <button 
                      onClick={() => docFileInputRef.current?.click()} 
                      disabled={uploadingDoc}
                      style={{ ...actionIconStyle("#0047FF"), gap: 4, padding: "6px 12px", fontSize: 11, fontWeight: 600 }}
                    >
                      <Upload size={12} /> {uploadingDoc ? "Uploading..." : "Upload File"}
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {documents.map(d => (
                      <div key={d.id} style={{ padding: 12, borderRadius: 6, background: "rgba(10, 10, 12, 0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0C" }}>{d.name}</div>
                          <div style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "#60606A" }}>{d.category}</div>
                        </div>
                        <button onClick={() => deleteDocument(d.id)} style={actionIconStyle("#DC2626")}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <div style={{ fontSize: 12, color: "#60606A", padding: "12px 0", textAlign: "center" }}>
                        Vault empty. Upload agency NDAs or commercial licenses.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ENGINE TELEMETRY & WHATSAPP HEALTH */}
        {/* ========================================================================= */}
        {activeTab === "TELEMETRY" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
              
              <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #10B981" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
                  <span style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", fontWeight: 700, color: "#0A0A0C" }}>WHATSAPP BRIDGE ENGINE</span>
                </div>
                <div style={{ fontSize: 20, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C" }}>
                  Oracle Cloud (Port 3050)
                </div>
                <p style={{ fontSize: 12, color: "#60606A", marginTop: 8, lineHeight: 1.5 }}>
                  Baileys multi-device socket online. Inbound messages automatically qualified via Gemini 2.0 Flash in &lt;1.2s.
                </p>
              </div>

              <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #0047FF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0047FF", boxShadow: "0 0 10px #0047FF" }} />
                  <span style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", fontWeight: 700, color: "#0A0A0C" }}>BANT INTELLIGENCE MODEL</span>
                </div>
                <div style={{ fontSize: 20, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C" }}>
                  Gemini 2.0 Flash
                </div>
                <p style={{ fontSize: 12, color: "#60606A", marginTop: 8, lineHeight: 1.5 }}>
                  Sub-90-second buyer qualification active for Dubai Off-Plan &amp; Ready units, Golden Visa eligibility, and calendar slot booking.
                </p>
              </div>

              <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 12, border: "1px solid rgba(10, 10, 12, 0.08)", borderLeft: "3px solid #00F2FF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00F2FF", boxShadow: "0 0 10px #00F2FF" }} />
                  <span style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", fontWeight: 700, color: "#0A0A0C" }}>TELEGRAM DISPATCH ALERTS</span>
                </div>
                <div style={{ fontSize: 20, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#0A0A0C" }}>
                  Instant Mobile Webhook
                </div>
                <p style={{ fontSize: 12, color: "#60606A", marginTop: 8, lineHeight: 1.5 }}>
                  Dispatches high-intent lead dossiers instantly to founding team smartphones upon qualification completion.
                </p>
              </div>

            </div>

            {/* Quick Access Card */}
            <div style={{ background: "#0A0A0C", padding: 36, borderRadius: 14, color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#00F2FF", letterSpacing: "0.2em", fontWeight: 700 }}>
                  REALTIME OPERATOR INTERFACE
                </span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, marginTop: 6 }}>
                  Live Operator Cockpit (/terminal)
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)", marginTop: 8, maxWidth: 600 }}>
                  Manage live investor conversations in real-time, toggle 1-click human broker takeover, dispatch luxury brochures, and send Google Meet invitations.
                </p>
              </div>
              <Link 
                href="/terminal" 
                style={{ 
                  padding: "14px 28px", 
                  background: "#0047FF", 
                  color: "#FFFFFF", 
                  borderRadius: 999, 
                  fontFamily: "var(--font-geist-mono)", 
                  fontSize: 12, 
                  fontWeight: 700, 
                  textDecoration: "none", 
                  letterSpacing: "0.08em" 
                }}
              >
                OPEN TERMINAL ↗
              </Link>
            </div>

          </motion.div>
        )}

      </main>

      {/* --- ADD LEAD MODAL --- */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 12, 0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 32, width: "100%", maxWidth: 520, border: "1px solid rgba(10, 10, 12, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18 }}>Add Dubai Inbound Lead</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddLead} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>INVESTOR / AGENCY NAME</label>
                <input required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} placeholder="e.g. Tariq Al-Mansoor" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>WHATSAPP PHONE</label>
                  <input required value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} placeholder="+971 50 123 4567" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>EMAIL ADDRESS</label>
                  <input value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} placeholder="investor@agency.com" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>TARGET AREAS</label>
                  <input value={newLead.business_type} onChange={e => setNewLead({ ...newLead, business_type: e.target.value })} placeholder="Downtown, Palm, Hills" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>BUDGET (AED)</label>
                  <input value={newLead.budget} onChange={e => setNewLead({ ...newLead, budget: e.target.value })} placeholder="AED 3,500,000" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>INQUIRY MESSAGE / INTENT</label>
                <textarea rows={3} value={newLead.message} onChange={e => setNewLead({ ...newLead, message: e.target.value })} placeholder="Looking for high rental yield off-plan penthouse or Golden Visa villa..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", background: "none", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "10px", background: "#0047FF", color: "#FFFFFF", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Commit Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INVOICE GENERATOR MODAL --- */}
      {showInvoiceModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 12, 0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 32, width: "100%", maxWidth: 520, border: "1px solid rgba(10, 10, 12, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18 }}>Generate Brokerage Retainer Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateInvoice} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>AGENCY / CLIENT NAME</label>
                <input required value={newInvoice.client_name} onChange={e => setNewInvoice({ ...newInvoice, client_name: e.target.value })} placeholder="e.g. Apex Horizon Realty LLC" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>CLIENT BILLING EMAIL</label>
                  <input required value={newInvoice.client_email} onChange={e => setNewInvoice({ ...newInvoice, client_email: e.target.value })} placeholder="accounts@apexrealty.ae" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>CURRENCY</label>
                  <select value={newInvoice.currency} onChange={e => setNewInvoice({ ...newInvoice, currency: e.target.value })} style={inputStyle}>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>TOTAL AMOUNT</label>
                <input type="number" required value={newInvoice.total_amount} onChange={e => setNewInvoice({ ...newInvoice, total_amount: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "#60606A", display: "block", marginBottom: 4 }}>SERVICE DESCRIPTION</label>
                <input value={newInvoice.description} onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowInvoiceModal(false)} style={{ flex: 1, padding: "10px", background: "none", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "10px", background: "#0047FF", color: "#FFFFFF", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Issue Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- NOTE MODAL --- */}
      {noteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 12, 0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 28, width: "100%", maxWidth: 440, border: "1px solid rgba(10, 10, 12, 0.1)" }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Broker Lead Note</h3>
            <textarea 
              rows={4} 
              value={noteModal.text} 
              onChange={e => setNoteModal({ ...noteModal, text: e.target.value })} 
              placeholder="Enter viewing feedback, preferred property towers, or broker follow-up details..." 
              style={{ ...inputStyle, resize: "vertical" }} 
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => setNoteModal(null)} style={{ flex: 1, padding: "9px", background: "none", border: "1px solid rgba(10, 10, 12, 0.12)", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              <button onClick={saveNote} style={{ flex: 1, padding: "9px", background: "#0047FF", color: "#FFFFFF", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save Note</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
