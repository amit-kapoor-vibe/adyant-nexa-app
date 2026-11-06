"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Database, Mail, Phone, Calendar, RefreshCw, Search, 
  Trophy, MessageCircle, Skull, Download, Upload, Plus, 
  Trash2, CheckSquare, Square, StickyNote, X,
  TrendingUp, FileText, BarChart3, CreditCard, Activity, Target,
  Shield, FolderOpen, FileCheck, Briefcase, Copy
} from "lucide-react";
import { useRouter } from "next/navigation";
import { generateInvoiceHtml } from "@/lib/invoice-template";

// --- Types ---
interface Lead {
  id: string; created_at: string; name: string; email: string;
  phone: string; business_type: string; budget: string; message: string;
  status: "NEW" | "CONTACTED" | "HOT" | "COLD" | "VICTORY" | "DEAD"; notes?: string;
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
  category: "GST" | "NDA" | "TAX" | "TECHNICAL" | "OTHER";
}

interface ClientContract {
  id: string;
  created_at: string;
  client_name: string;
  contract_type: "WEB_DEV" | "MARKETING";
  project_value: number;
  duration_months: number;
  contract_text: string;
  status: "DRAFT" | "SIGNED" | "EXPIRED";
}

type TabState = "DIAGNOSTICS" | "GRID" | "FINANCE" | "ANALYTICS" | "VAULT";

const STATUS_OPTIONS = ["ALL", "NEW", "CONTACTED", "HOT", "COLD", "VICTORY", "DEAD"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabState>("DIAGNOSTICS");
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
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", business_type: "", budget: "", message: "", status: "NEW" as const });

  // Invoice State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    client_name: "",
    client_email: "",
    client_gstin: "",
    currency: "INR",
    total_amount: "",
    discount_amount: "0",
    state_type: "INTERSTATE",
    description: "",
    status: "PENDING" as const
  });

  // Secure Vault & Legal Contracts State
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docCategory, setDocCategory] = useState<"GST" | "NDA" | "TAX" | "TECHNICAL" | "OTHER">("OTHER");
  
  // Contract Builder State
  const [contractType, setContractType] = useState<"WEB_DEV" | "MARKETING">("WEB_DEV");
  const [contractCurrency, setContractCurrency] = useState<"INR" | "USD">("INR");
  const [contractClientName, setContractClientName] = useState("");
  const [contractValue, setContractValue] = useState("120000");
  const [contractDiscount, setContractDiscount] = useState("0");
  const [contractDuration, setContractDuration] = useState("3");
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
            const mapped: Lead[] = engineLeads.map((el: any, i: number) => ({
              id: el.raw_jid || `lead_${i}`,
              created_at: el.updated_at || new Date().toISOString(),
              name: el.display_title || el.formatted_phone || "Dubai Lead",
              email: "whatsapp@adyantnexa.com",
              phone: el.formatted_phone || el.phone || "+971 50",
              business_type: (el.qualification?.preferred_areas || []).join(", ") || "Luxury Real Estate",
              budget: el.qualification?.budget_aed || "AED 2.5M",
              message: el.last_message || "Active WhatsApp inquiry",
              status: (el.qualification?.score || 0) >= 80 ? "HOT" : "CONTACTED"
            }));
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
    e.preventDefault(); setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert([newLead]);
      if (!error) { setShowAddModal(false); setNewLead({ name: "", email: "", phone: "", business_type: "", budget: "", message: "", status: "NEW" }); fetchLeads(); }
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
    if (!confirm("Confirm mass deletion from Neural Grid?")) return;
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
    const grossTotal = parseFloat(newInvoice.total_amount);
    const discount = parseFloat(newInvoice.discount_amount) || 0;
    if (isNaN(grossTotal) || grossTotal <= 0) {
      alert("Please enter a valid amount");
      setLoading(false);
      return;
    }
    
    const netTotal = grossTotal - discount;
    if (netTotal < 0) {
      alert("Discount value cannot exceed the total billing amount.");
      setLoading(false);
      return;
    }
    
    let base = netTotal;
    let gst = 0;
    if (newInvoice.currency === "INR") {
      base = netTotal / 1.18;
      gst = netTotal - base;
    }
    
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    const invoice_number = `INV-${year}-${String(count).padStart(3, '0')}`;
    
    const finalDesc = newInvoice.description + (discount > 0 ? ` [Discount Applied: ${newInvoice.currency === 'USD' ? '$' : '₹'}${discount.toLocaleString()}]` : "");
    
    const payload = {
      invoice_number,
      client_name: newInvoice.client_name,
      client_email: newInvoice.client_email,
      client_gstin: newInvoice.client_gstin || null,
      currency: newInvoice.currency,
      base_amount: Math.round(base * 100) / 100,
      gst_amount: Math.round(gst * 100) / 100,
      total_amount: netTotal,
      state_type: newInvoice.state_type,
      tax_type: newInvoice.state_type === "INTRASTATE" ? "CGST_SGST" : "IGST",
      status: newInvoice.status,
      description: finalDesc
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
        client_gstin: "",
        currency: "INR",
        total_amount: "",
        discount_amount: "0",
        state_type: "INTERSTATE",
        description: "",
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
    if (!confirm("Confirm invoice deletion from ledger?")) return;
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
      alert("Please allow popups to download the invoice PDF");
      return;
    }
    printWindow.document.write(generateInvoiceHtml(inv));
    printWindow.document.close();
  };


  const downloadCSV = (ids?: string[]) => {
    const targetLeads = ids ? leads.filter(l => ids.includes(l.id)) : filteredLeads;
    const headers = ["S.No", "Date", "Name", "Email", "Phone", "Business", "Budget", "Status", "Notes"];
    const rows = targetLeads.map((l, i) => [i + 1, new Date(l.created_at).toLocaleDateString(), l.name, l.email, l.phone, l.business_type, l.budget, l.status, (l.notes || "").replace(/,/g, ";")]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", `adyant_leads_${ids ? 'selected' : 'all'}.csv`); link.click();
  };

  const fetchVaultData = async () => {
    try {
      const [docsRes, contractsRes] = await Promise.all([
        supabase.from("documents").select("*").order("created_at", { ascending: false }),
        supabase.from("contracts").select("*").order("created_at", { ascending: false })
      ]);
      if (docsRes.data) setDocuments(docsRes.data);
      if (contractsRes.data) setContracts(contractsRes.data);
    } catch (err) {
      console.error("Vault fetch error:", err);
    }
  };

  const handleCompileContract = () => {
    if (!contractClientName) {
      alert("Please enter the Client Name first.");
      return;
    }

    const valueNum = parseFloat(contractValue) || 0;
    const discountNum = parseFloat(contractDiscount) || 0;
    const netValue = valueNum - discountNum;
    const duration = contractDuration || "3";
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    let contractText = "";

    const symbol = contractCurrency === "USD" ? "$" : "₹";
    const currencySuffix = contractCurrency === "USD" ? " (USD - United States Dollars)" : " (INR inclusive of all GST parameters if applicable)";

    const discountTextWeb = discountNum > 0 
      ? `The standard commercial value of this project is established at ${symbol}${valueNum.toLocaleString()}${currencySuffix}.
An exclusive promotional discount of ${symbol}${discountNum.toLocaleString()} has been granted, resulting in a Net Adjusted commercial value of ${symbol}${netValue.toLocaleString()}.
Payment shall be cleared based on the following milestones:
- 50% Advance retainer value upon execution of this Agreement (Commencement Fee: ${symbol}${(netValue * 0.5).toLocaleString()}).
- 50% Final settlement fee upon completion, testing, and system clearance in beta deployment (Settlement Fee: ${symbol}${(netValue * 0.5).toLocaleString()}).`
      : `The total commercial value of this project is established at ${symbol}${valueNum.toLocaleString()}${currencySuffix}.
Payment shall be cleared based on the following milestones:
- 50% Advance retainer value upon execution of this Agreement (Commencement Fee: ${symbol}${(valueNum * 0.5).toLocaleString()}).
- 50% Final settlement fee upon completion, testing, and system clearance in beta deployment (Settlement Fee: ${symbol}${(valueNum * 0.5).toLocaleString()}).`;

    const discountTextMarketing = discountNum > 0 
      ? `The standard Growth Marketing Retainer fee is established at ${symbol}${valueNum.toLocaleString()} per month.
An exclusive campaign subsidy of ${symbol}${discountNum.toLocaleString()} per month has been applied, resulting in a Net Monthly Retainer of ${symbol}${netValue.toLocaleString()} per month for a term of ${duration} Months.`
      : `The Client shall remit a Growth Marketing Retainer fee of ${symbol}${valueNum.toLocaleString()} per month for a term of ${duration} Months.`;

    if (contractType === "WEB_DEV") {
      contractText = `WEB DEVELOPMENT & WEB ARCHITECTURE AGREEMENT

This Agreement is made and entered into on this ${dateStr} by and between:
1. ADYANT NEXA, having its principal development hub in Haryana, India (hereinafter referred to as the "Service Provider").
AND
2. ${contractClientName} (hereinafter referred to as the "Client").

WHEREAS, the Client desires to retain the Service Provider to perform professional web architecture and system development services, and the Service Provider agrees to perform such services under the terms and conditions set forth herein.

NOW, THEREFORE, IT IS MUTUALLY AGREED AS FOLLOWS:

1. SCOPE OF WORK & TECH STACK
The Service Provider shall engineer a high-performance cinematic digital platform for the Client comprising:
a) React 19 / Next.js 16 high-performance server-side rendering (SSR) infrastructure.
b) Smooth-scrolling layout integration utilizing Lenis library systems.
c) Zero-dependency custom styled interfaces matching premium, harmony-curated color parameters.
d) Complete Supabase / PostgreSQL relational database integration.
e) Zero-Trust administrative dashboard clearance protocols.

2. PROFESSIONAL FEES & PAYMENT MILESTONES
${discountTextWeb}

3. INTELLECTUAL PROPERTY & CODE RIGHTS
Upon completion of the final milestone and receipt of 100% payment, all proprietary web application source code, databases, design assets, and deployment clearances shall be completely transferred to the Client. The Client shall hold exclusive intellectual property ownership of the compiled system.

4. SYSTEM WARRANTY & POST-LAUNCH WARRANTEE
The Service Provider provides a comprehensive 30-day post-launch optimization warranty. This includes real-time system stability monitoring, core web vitals optimization adjustments, and database scaling support. Any feature additions requested after launch shall be billed under separate Change Requests (CR).

5. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by, interpreted, and enforced in accordance with the laws of India. Any legal disputes arising out of this Agreement shall be strictly subject to the exclusive jurisdiction of the courts located in Haryana, India.

IN WITNESS WHEREOF, the parties hereto have executed this Web Development Agreement as of the date first written above.

For ADYANT NEXA (Authorized Signature)
For ${contractClientName} (Authorized Client Signature)`;
    } else {
      contractText = `GROWTH MARKETING & FUNNEL ENGINEERING AGREEMENT

This Performance Marketing Agreement is made and entered into on this ${dateStr} by and between:
1. ADYANT NEXA, having its principal performance office in Haryana, India (hereinafter referred to as the "Agency").
AND
2. ${contractClientName} (hereinafter referred to as the "Client").

WHEREAS, the Client desires to retain the Agency to engineer and manage digital customer acquisition funnel infrastructure and Meta performance advertising operations, and the Agency agrees to do so under the terms set forth below.

NOW, THEREFORE, IT IS AGREED AS FOLLOWS:

1. SCOPE OF GROWTH OPERATIONS & INTEGRATIONS
The Agency shall architect, manage, and optimize performance marketing assets for the Client consisting of:
a) Installation and configuration of Meta Pixel + Conversions API (CAPI) on Edge nodes.
b) Real-time server-side tracking validation to combat iOS 14+ cookies deprecation.
c) Direct lead-capture integration with Central CRM databases.
d) Optimization of Meta ad-spend utilizing non-sugarcoated, direct pricing reveal creatives.
e) Daily budget monitoring and Cost Per Lead (CPL) containment strategy.

2. COMMERCIAL VALUE & RETAINER TERMS
${discountTextMarketing}
- Fees are due and payable in advance at the start of each monthly growth cycle.
- Ad spend budgets shall be paid directly to Meta Platforms Inc. by the Client and are separate from this service fee.

3. MARKETING HONESTY & TRANSPARENCY PROTOCOL
Both parties agree to adhere strictly to the "No-Sugarcoating" ad optimization principle. Ad creatives and pricing reveal structures shall be designed transparently to maximize long-term buyer trust and brand alignment, prioritizing high-intent target conversion value over low-quality click inflation.

4. TERMINATION & RENEWAL PROTOCOL
This Agreement is signed for a commitment term of ${duration} months. Either party may terminate this growth campaign by providing a written notification of termination at least thirty (30) days prior to the start of the next billing cycle.

5. GOVERNING LAW & COURT LIMITATIONS
This Agreement and the performance thereunder shall be governed strictly by the laws of India. Any disputes, claims, or arbitration processes arising under this partnership shall be settled within the exclusive jurisdiction of the courts in Haryana, India.

IN WITNESS WHEREOF, the parties hereto have executed this Performance Retainer Agreement as of the date first written above.

For ADYANT NEXA (Authorized Signature)
For ${contractClientName} (Authorized Client Signature)`;
    }

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
        project_value: parseFloat(contractValue) || 0,
        duration_months: parseInt(contractDuration) || 3,
        contract_text: generatedContractText,
        status: "DRAFT"
      }]);
      if (!error) {
        alert("Contract committed to Legal Vault successfully!");
        setContractClientName("");
        setContractValue("");
        setGeneratedContractText("");
        fetchVaultData();
      } else {
        alert("Error saving contract: " + error.message);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
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
          alert("Error uploading document: " + error.message);
        }
        setUploadingDoc(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert("Upload error: " + err.message);
      setUploadingDoc(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Delete document from vault?")) return;
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (!error) fetchVaultData();
  };

  const deleteContract = async (id: string) => {
    if (!confirm("Delete contract draft from legal vault?")) return;
    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (!error) fetchVaultData();
  };

  useEffect(() => {
    let results = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone.includes(searchTerm)
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
        if (!session) {
          router.replace("/login");
          return;
        }
        if (isMounted) {
          setAuthorized(true);
          fetchLeads();
          fetchInvoices();
          fetchVaultData();
        }
      } catch {
        router.replace("/login");
      }
    };
    verifySession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (activePrintInvoice) {
      const timer = setTimeout(() => {
        window.print();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activePrintInvoice]);

  useEffect(() => {
    const handleAfterPrint = () => {
      setActivePrintInvoice(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) setSelectedLeads([]);
    else setSelectedLeads(filteredLeads.map(l => l.id));
  };

  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", background: "#020202", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 13, letterSpacing: "0.2em" }}>
        VERIFYING CREDENTIAL CLEARANCE...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", fontFamily: "var(--font-inter)" }}>
      
      {/* GLOBAL HEADER */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(2,2,2,0.9)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div>
              <span className="editorial-tag" style={{ color: "#00F2FF", marginBottom: 4, display: "block", fontSize: 9 }}>CENTRAL COMMAND_</span>
              <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#fff" }}>Adyant Nexa</h1>
            </div>
            
            {/* TABS */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { id: "DIAGNOSTICS", label: "Growth Diagnostics", icon: Activity },
                { id: "GRID", label: "Intelligence Grid", icon: Database },
                { id: "FINANCE", label: "Financial Ops", icon: TrendingUp },
                { id: "ANALYTICS", label: "Meta Analytics", icon: Activity },
                { id: "VAULT", label: "Secure Vault & Legal", icon: Shield }
              ].map(tab => (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id as TabState)}
                  style={{ 
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", 
                    background: activeTab === tab.id ? "rgba(0,242,255,0.1)" : "transparent",
                    color: activeTab === tab.id ? "#00F2FF" : "rgba(255,255,255,0.5)",
                    border: "none", borderRadius: 4, fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.3s"
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
                background: "rgba(0, 71, 255, 0.2)",
                border: "1px solid #0047FF",
                color: "#00F2FF",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.1em"
              }}
            >
              ⚡ AI SALES COCKPIT (/terminal) ↗
            </Link>
            <button onClick={handleLogout} className="btn-util" style={{ fontSize: 10 }}>DISCONNECT <X size={14}/></button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "40px" }}>
        
        {/* --- VIEW 0: GROWTH DIAGNOSTICS --- */}
        {activeTab === "DIAGNOSTICS" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* KPI Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
              <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #00F2FF" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)" }}>COMPLETED DIAGNOSTICS</span>
                <div style={{ fontSize: 28, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", marginTop: 8 }}>{leads.length + 12}</div>
                <span style={{ fontSize: 11, color: "#00F2FF", marginTop: 4, display: "block" }}>Fashion &amp; Apparel Retail</span>
              </div>

              <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #00FF66" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)" }}>AVG GROWTH SCORE</span>
                <div style={{ fontSize: 28, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#00FF66", marginTop: 8 }}>58 / 100</div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, display: "block" }}>Moderate Leakage Baseline</span>
              </div>

              <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #F59E0B" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)" }}>TOTAL PROFIT LEAKAGE DISCOVERED</span>
                <div style={{ fontSize: 24, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", marginTop: 8 }}>₹1.84 Crore</div>
                <span style={{ fontSize: 11, color: "#F59E0B", marginTop: 4, display: "block" }}>Annualized Opportunity</span>
              </div>

              <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #EF4444" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)" }}>LEADS CONVERTED</span>
                <div style={{ fontSize: 28, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", marginTop: 8 }}>{leads.length}</div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, display: "block" }}>Requested 90-Day Blueprint</span>
              </div>
            </div>

            {/* Submissions Feed */}
            <div className="glass-panel" style={{ padding: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, color: "#fff" }}>Recent Retail Diagnostics &amp; Blueprint Leads</h3>
                <span className="editorial-tag" style={{ fontSize: 10, color: "#00F2FF" }}>REALTIME PIPELINE</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Business Name &amp; Contact</th>
                      <th style={thStyle}>Location</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Budget / Est. Opportunity</th>
                      <th style={thStyle}>Message / Diagnostic Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={tdStyle}>{new Date(lead.created_at).toLocaleDateString("en-IN")}</td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{lead.name}</div>
                          <div style={{ fontSize: 11, color: "#A3A3A3" }}>{lead.email} | {lead.phone}</div>
                        </td>
                        <td style={tdStyle}>{lead.business_type || "Retailer"}</td>
                        <td style={tdStyle}>
                          <span style={{ padding: "4px 10px", background: "rgba(0,242,255,0.1)", color: "#00F2FF", fontSize: 9, fontWeight: 800, borderRadius: 4 }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ color: "#00FF66", fontFamily: "var(--font-geist-mono)", fontSize: 12, fontWeight: 700 }}>
                            {lead.budget || "N/A"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontSize: 12, color: "#A3A3A3" }}>{lead.message}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- VIEW 1: INTELLIGENCE GRID --- */}
        {activeTab === "GRID" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* UTILITY STRIP */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 300 }}>
                <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} size={16} />
                <input placeholder="Query system by name, email, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => downloadCSV()} className="btn-util"><Download size={14} /> Export</button>
                <button onClick={() => setShowAddModal(true)} className="btn-util" style={{ borderColor: "#00F2FF", color: "#00F2FF", background: "rgba(0,242,255,0.05)" }}><Plus size={14} /> Add Lead</button>
              </div>
            </div>

            {/* STATUS FILTER BAR */}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16, marginBottom: 32, scrollbarWidth: "none" }}>
              {STATUS_OPTIONS.map(status => (
                <button key={status} onClick={() => setActiveStatus(status)} style={{
                  padding: "12px 24px", background: activeStatus === status ? "rgba(0,242,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: "1px solid", borderColor: activeStatus === status ? "#00F2FF" : "rgba(255,255,255,0.1)",
                  color: activeStatus === status ? "#00F2FF" : "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "var(--font-geist-mono)", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "0.3s"
                }}>{status}</button>
              ))}
            </div>

            {/* BULK ACTIONS BAR (Cyan) */}
            <AnimatePresence>
              {selectedLeads.length > 0 && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={bulkBarStyles}>
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14 }}>{selectedLeads.length} SELECTED</span>
                  <div style={{ height: 20, width: 1, background: "rgba(0,0,0,0.1)" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => updateStatus(selectedLeads, "HOT")} className="btn-bulk">MARK HOT</button>
                    <button onClick={() => updateStatus(selectedLeads, "CONTACTED")} className="btn-bulk">CONTACTED</button>
                    <button onClick={() => deleteLeads(selectedLeads)} className="btn-bulk" style={{ background: "rgba(0,0,0,0.05)" }}><Trash2 size={14} /></button>
                  </div>
                  <button onClick={() => setSelectedLeads([])} style={{ background: "none", border: "none", fontWeight: 800, cursor: "pointer", fontSize: 18 }}>×</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DATA GRID */}
            <div className="glass-panel" style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th style={{ width: 60, padding: "24px" }}><button onClick={toggleSelectAll} style={{ background: "none", border: "none", color: "#00F2FF", cursor: "pointer" }}>{selectedLeads.length > 0 ? <CheckSquare size={20}/> : <Square size={20}/>}</button></th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Client Details</th>
                    <th style={thStyle}>Business Profile</th>
                    <th style={thStyle}>Budget</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: selectedLeads.includes(lead.id) ? "rgba(0,242,255,0.02)" : "none" }}>
                      <td style={{ padding: "24px" }}><button onClick={() => setSelectedLeads(prev => prev.includes(lead.id) ? prev.filter(x => x !== lead.id) : [...prev, lead.id])} style={{ background: "none", border: "none", color: selectedLeads.includes(lead.id) ? "#00F2FF" : "rgba(255,255,255,0.1)", cursor: "pointer" }}>{selectedLeads.includes(lead.id) ? <CheckSquare size={20}/> : <Square size={20}/>}</button></td>
                      <td style={tdStyle}>{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td style={tdStyle}><span style={{ padding: "4px 10px", background: getStatusColor(lead.status, true), color: getStatusColor(lead.status, false), fontSize: 9, fontWeight: 800, fontFamily: "var(--font-geist-mono)" }}>{lead.status}</span></td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{lead.email} | {lead.phone}</div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 12, color: "#fff" }}>{lead.business_type}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{lead.message.substring(0, 40)}...</div>
                      </td>
                      <td style={tdStyle}><span style={{ color: "#00FF66", fontFamily: "var(--font-geist-mono)", fontSize: 12, fontWeight: 700 }}>{lead.budget}</span></td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => updateStatus([lead.id], "VICTORY")} title="Victory" style={actionIconStyle("#00FF66")}><Trophy size={14} /></button>
                          <button onClick={() => updateStatus([lead.id], "CONTACTED")} title="Contacted" style={actionIconStyle("#00F2FF")}><MessageCircle size={14} /></button>
                          <button onClick={() => setNoteModal({ id: lead.id, text: lead.notes || "" })} title="Note" style={actionIconStyle(lead.notes ? "#00F2FF" : "rgba(255,255,255,0.4)")}><StickyNote size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <div style={{ padding: 100, textAlign: "center" }}><RefreshCw className="spin" /></div>}
            </div>
          </motion.div>
        )}

        {/* --- VIEW 2: FINANCIAL OPS --- */}
        {activeTab === "FINANCE" && (() => {
          // Dynamic Calcs
          const now = new Date();
          const currentMonthInvoices = invoices.filter(i => {
            const date = new Date(i.created_at);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && i.status === "PAID";
          });
          const currentMonthInr = currentMonthInvoices.filter(i => i.currency === "INR").reduce((sum, i) => sum + i.total_amount, 0);
          const currentMonthUsd = currentMonthInvoices.filter(i => i.currency === "USD").reduce((sum, i) => sum + i.total_amount, 0);

          const totalPaidInr = invoices.filter(i => i.status === "PAID" && i.currency === "INR").reduce((sum, i) => sum + i.total_amount, 0);
          const totalPaidUsd = invoices.filter(i => i.status === "PAID" && i.currency === "USD").reduce((sum, i) => sum + i.total_amount, 0);

          const totalPendingInr = invoices.filter(i => i.status === "PENDING" && i.currency === "INR").reduce((sum, i) => sum + i.total_amount, 0);
          const totalPendingUsd = invoices.filter(i => i.status === "PENDING" && i.currency === "USD").reduce((sum, i) => sum + i.total_amount, 0);

          if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", background: "#020202", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 13, letterSpacing: "0.2em" }}>
        VERIFYING CREDENTIAL CLEARANCE...
      </div>
    );
  }

  return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Revenue Dashboard */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
                <div className="glass-panel" style={{ padding: 32, borderLeft: "2px solid #00F2FF" }}>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>MONTHLY REAL CASHFLOW</div>
                  <div style={{ fontSize: 24, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                    ₹{currentMonthInr.toLocaleString()}<br/>
                    <span style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>${currentMonthUsd.toLocaleString()} USD</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#00F2FF", marginTop: 8 }}>Processed in {now.toLocaleString('default', { month: 'long' })}</div>
                </div>
                <div className="glass-panel" style={{ padding: 32, borderLeft: "2px solid #00FF66" }}>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>TOTAL PAID (YTD)</div>
                  <div style={{ fontSize: 24, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                    ₹{totalPaidInr.toLocaleString()}<br/>
                    <span style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>${totalPaidUsd.toLocaleString()} USD</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>With GST & Taxes Tracked</div>
                </div>
                <div className="glass-panel" style={{ padding: 32, borderLeft: "2px solid #FF3333" }}>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>TOTAL PENDING</div>
                  <div style={{ fontSize: 24, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                    ₹{totalPendingInr.toLocaleString()}<br/>
                    <span style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>${totalPendingUsd.toLocaleString()} USD</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#FF3333", marginTop: 8 }}>Overdue limits monitored</div>
                </div>
              </div>

              {/* Invoice Manager */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 20 }}>Invoice Ledger</h2>
                <button onClick={() => setShowInvoiceModal(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, padding: "12px 24px" }}>
                  <Plus size={16} /> GENERATE INVOICE
                </button>
              </div>
              
              <div className="glass-panel" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <th style={thStyle}>Invoice ID</th>
                      <th style={thStyle}>Client Details</th>
                      <th style={thStyle}>Tax details (CGST/SGST/IGST)</th>
                      <th style={thStyle}>Amount Split</th>
                      <th style={thStyle}>Date Issued</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "var(--font-geist-mono)", color: "#00F2FF", fontSize: 12, fontWeight: 700 }}>{inv.invoice_number}</span>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{inv.description}</div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{inv.client_name}</span>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{inv.client_email}</div>
                        </td>
                        <td style={tdStyle}>
                          {inv.currency === "INR" ? (
                            <div>
                              <div style={{ fontSize: 11, color: "#fff" }}>
                                {inv.state_type === "INTRASTATE" ? "Haryana CGST(9%) + SGST(9%)" : "Out-State IGST(18%)"}
                              </div>
                              <div style={{ fontSize: 10, color: "rgba(0,242,255,0.6)", marginTop: 2 }}>
                                GSTIN: {inv.client_gstin || "N/A (B2C)"}
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Export Services (No GST)</div>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#fff" }}>
                            {inv.currency === "USD" ? "$" : "₹"}{inv.total_amount.toLocaleString()} <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>total</span>
                          </div>
                          {inv.currency === "INR" && (
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                              Base: ₹{inv.base_amount.toLocaleString()} | Tax: ₹{inv.gst_amount.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td style={tdStyle}>{new Date(inv.created_at).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                          <select 
                            value={inv.status} 
                            onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as any)}
                            style={{
                              background: inv.status === "PAID" ? "rgba(0,255,102,0.1)" : inv.status === "PENDING" ? "rgba(255,204,0,0.1)" : "rgba(255,51,51,0.1)",
                              color: inv.status === "PAID" ? "#00FF66" : inv.status === "PENDING" ? "#FFCC00" : "#FF3333",
                              border: "none", padding: "4px 8px", fontSize: 9, fontFamily: "var(--font-geist-mono)", fontWeight: 800, cursor: "pointer", outline: "none"
                            }}
                          >
                            <option value="PENDING" style={{ background: "#020202", color: "#FFCC00" }}>PENDING</option>
                            <option value="PAID" style={{ background: "#020202", color: "#00FF66" }}>PAID</option>
                            <option value="OVERDUE" style={{ background: "#020202", color: "#FF3333" }}>OVERDUE</option>
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => printInvoice(inv)} className="btn-util" style={{ fontSize: 10, padding: "6px 12px", borderColor: "rgba(0,242,255,0.2)", color: "rgba(0,242,255,0.8)" }} title="Print / Download PDF">
                              <Download size={12} />
                            </button>
                            <button onClick={() => deleteInvoice(inv.id)} className="btn-util" style={{ fontSize: 10, padding: "6px 12px", borderColor: "rgba(255,51,51,0.2)", color: "rgba(255,51,51,0.7)" }} title="Delete">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>No invoices recorded in backend ledger.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })()}

        {/* --- VIEW 3: MARKETING ANALYTICS --- */}
        {activeTab === "ANALYTICS" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: 12, background: "rgba(0,128,255,0.1)", borderRadius: 8, color: "#0080FF" }}><Target size={24} /></div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, lineHeight: 1 }}>Meta Ads Engine</h2>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)" }}>LIVE CAPI TRACKING INITIATED</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 8 }}>
                <button style={{ padding: "6px 16px", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 11, borderRadius: 4 }}>7 Days</button>
                <button style={{ padding: "6px 16px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 11 }}>30 Days</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 40 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>TOTAL AD SPEND</div>
                <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff" }}>$2,450</div>
              </div>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>COST PER LEAD (CPL)</div>
                <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff" }}>$45.20</div>
              </div>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>LEADS GENERATED</div>
                <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff" }}>54</div>
              </div>
              <div className="glass-panel" style={{ padding: 24, border: "1px solid #00FF66", background: "rgba(0,255,102,0.02)" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "#00FF66", marginBottom: 8 }}>RETURN ON AD SPEND (ROAS)</div>
                <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#00FF66" }}>4.2x</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 40, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <BarChart3 size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, marginBottom: 8 }}>Graph Module Offline</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Connect Meta Pixel / CAPI API key in settings to render live conversion charts.</p>
            </div>

          </motion.div>
        )}

        {/* --- VIEW 4: SECURE VAULT & LEGAL --- */}
        {activeTab === "VAULT" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: 12, background: "rgba(0,242,255,0.1)", borderRadius: 8, color: "#00F2FF" }}><Shield size={24} /></div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, lineHeight: 1 }}>Neural Vault & Legal Ops</h2>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)" }}>ENCRYPTED BUSINESS LOCKER & SYSTEM AGREEMENT COMPILER</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "start" }}>
              
              {/* LEFT COLUMN: AGREEMENTS & COMPILER */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                
                {/* COMPILER CARD */}
                <div className="glass-panel" style={{ padding: 32 }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>System Contract Compiler</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ flex: 1.2 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>CONTRACT ARCHITECTURE</label>
                        <select 
                          value={contractType} 
                          onChange={(e) => {
                            const newType = e.target.value as "WEB_DEV" | "MARKETING";
                            setContractType(newType);
                            // Prepopulate plan value automatically based on currency!
                            if (newType === "WEB_DEV") {
                              setContractValue(contractCurrency === "INR" ? "120000" : "1500");
                            } else {
                              setContractValue(contractCurrency === "INR" ? "35000" : "400");
                            }
                          }} 
                          style={inputStyle}
                        >
                          <option value="WEB_DEV" style={{ background: "#020202", color: "#fff" }}>Web Architecture Agreement</option>
                          <option value="MARKETING" style={{ background: "#020202", color: "#fff" }}>Growth Marketing Retainer</option>
                        </select>
                      </div>

                      <div style={{ flex: 0.8 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>CURRENCY</label>
                        <select 
                          value={contractCurrency} 
                          onChange={(e) => {
                            const newCurr = e.target.value as "INR" | "USD";
                            setContractCurrency(newCurr);
                            // Prepopulate plan value automatically!
                            if (contractType === "WEB_DEV") {
                              setContractValue(newCurr === "INR" ? "120000" : "1500");
                            } else {
                              setContractValue(newCurr === "INR" ? "35000" : "400");
                            }
                          }} 
                          style={inputStyle}
                        >
                          <option value="INR" style={{ background: "#020202", color: "#fff" }}>INR (₹)</option>
                          <option value="USD" style={{ background: "#020202", color: "#fff" }}>USD ($)</option>
                        </select>
                      </div>

                      <div style={{ flex: 1.5 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>SYSTEM PLAN / PACKAGE</label>
                        {contractType === "WEB_DEV" ? (
                          contractCurrency === "INR" ? (
                            <select 
                              value={contractValue} 
                              onChange={(e) => setContractValue(e.target.value)} 
                              style={inputStyle}
                            >
                              <option value="120000" style={{ background: "#020202", color: "#fff" }}>SPARK_ Plan (₹1,20,000)</option>
                              <option value="350000" style={{ background: "#020202", color: "#fff" }}>MATRIX_ Plan (₹3,50,000)</option>
                              <option value="750000" style={{ background: "#020202", color: "#fff" }}>NEXUS_ Plan (₹7,50,000)</option>
                            </select>
                          ) : (
                            <select 
                              value={contractValue} 
                              onChange={(e) => setContractValue(e.target.value)} 
                              style={inputStyle}
                            >
                              <option value="1500" style={{ background: "#020202", color: "#fff" }}>SPARK_ Plan ($1,500)</option>
                              <option value="4200" style={{ background: "#020202", color: "#fff" }}>MATRIX_ Plan ($4,200)</option>
                              <option value="9000" style={{ background: "#020202", color: "#fff" }}>NEXUS_ Plan ($9,000)</option>
                            </select>
                          )
                        ) : (
                          contractCurrency === "INR" ? (
                            <select 
                              value={contractValue} 
                              onChange={(e) => setContractValue(e.target.value)} 
                              style={inputStyle}
                            >
                              <option value="35000" style={{ background: "#020202", color: "#fff" }}>VOLT_ Retainer (₹35,000 / mo)</option>
                              <option value="75000" style={{ background: "#020202", color: "#fff" }}>PULSE_ Retainer (₹75,000 / mo)</option>
                              <option value="150000" style={{ background: "#020202", color: "#fff" }}>NEXA_ Retainer (₹1,50,000 / mo)</option>
                            </select>
                          ) : (
                            <select 
                              value={contractValue} 
                              onChange={(e) => setContractValue(e.target.value)} 
                              style={inputStyle}
                            >
                              <option value="400" style={{ background: "#020202", color: "#fff" }}>VOLT_ Retainer ($400 / mo)</option>
                              <option value="900" style={{ background: "#020202", color: "#fff" }}>PULSE_ Retainer ($900 / mo)</option>
                              <option value="2000" style={{ background: "#020202", color: "#fff" }}>NEXA_ Retainer ($2,000 / mo)</option>
                            </select>
                          )
                        )}
                      </div>

                      <div style={{ flex: 1.5 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>CLIENT COMPANY / NAME</label>
                        <input 
                          placeholder="Client Company Name" 
                          value={contractClientName} 
                          onChange={(e) => setContractClientName(e.target.value)} 
                          style={inputStyle} 
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ flex: 1.2 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>
                          COMMERCIAL VALUE ({contractCurrency === "USD" ? "$" : "₹"})
                        </label>
                        <input 
                          type="number" 
                          placeholder={contractCurrency === "USD" ? "e.g. 1500" : "e.g. 150000"} 
                          value={contractValue} 
                          onChange={(e) => setContractValue(e.target.value)} 
                          style={inputStyle} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>
                          APPLIED DISCOUNT ({contractCurrency === "USD" ? "$" : "₹"})
                        </label>
                        <input 
                          type="number" 
                          placeholder="e.g. 10000" 
                          value={contractDiscount} 
                          onChange={(e) => setContractDiscount(e.target.value)} 
                          style={inputStyle} 
                        />
                      </div>
                      <div style={{ flex: 1.2 }}>
                        <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>DURATION COMMITMENT (MONTHS)</label>
                        <select 
                          value={contractDuration} 
                          onChange={(e) => setContractDuration(e.target.value)} 
                          style={inputStyle}
                        >
                          <option value="3" style={{ background: "#020202", color: "#fff" }}>3 Months Retention</option>
                          <option value="6" style={{ background: "#020202", color: "#fff" }}>6 Months Retention</option>
                          <option value="12" style={{ background: "#020202", color: "#fff" }}>12 Months Retention</option>
                          <option value="1" style={{ background: "#020202", color: "#fff" }}>1 Month Single Run</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                    <button onClick={handleCompileContract} className="btn-util" style={{ background: "#00F2FF", color: "#000", fontWeight: 800 }}>
                      <FileCheck size={14} /> COMPILE DRAFT
                    </button>
                    {generatedContractText && (
                      <>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(generatedContractText);
                            alert("Contract copy pushed to system clipboard.");
                          }} 
                          className="btn-util"
                        >
                          <Copy size={14} /> COPY PLAINTEXT
                        </button>
                        <button 
                          onClick={handleSaveContract} 
                          disabled={isSavingContract} 
                          className="btn-util" 
                          style={{ borderColor: "#00FF66", color: "#00FF66" }}
                        >
                          <Database size={14} /> {isSavingContract ? "SAVING..." : "COMMIT TO VAULT"}
                        </button>
                      </>
                    )}
                  </div>

                  <textarea 
                    value={generatedContractText}
                    onChange={(e) => setGeneratedContractText(e.target.value)}
                    placeholder="Legal draft offline. Provide client parameters and compile agreement."
                    style={{ 
                      width: "100%", height: 350, background: "rgba(255,255,255,0.01)", 
                      border: "1px solid rgba(255,255,255,0.08)", color: "#fff", 
                      padding: 20, outline: "none", fontSize: 12, 
                      fontFamily: "var(--font-geist-mono)", resize: "vertical", 
                      lineHeight: 1.6, borderRadius: 4 
                    }}
                  />
                </div>

                {/* SAVED CONTRACTS LIST */}
                <div className="glass-panel" style={{ padding: 32 }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>Committed Contracts Vault</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {contracts.map(contract => (
                      <div 
                        key={contract.id} 
                        style={{ 
                          background: "rgba(255,255,255,0.01)", padding: 20, 
                          borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)",
                          display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <div style={{ padding: 10, background: "rgba(0,242,255,0.05)", border: "1px solid rgba(0,242,255,0.1)", borderRadius: 6, color: "#00F2FF" }}>
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{contract.client_name}</div>
                            <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                              {contract.contract_type === "WEB_DEV" ? "WEB ARCHITECTURE" : "PERFORMANCE RETAINER"} | ₹{contract.project_value.toLocaleString()} | {contract.duration_months} Months
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <button 
                            onClick={() => {
                              setGeneratedContractText(contract.contract_text);
                              setContractClientName(contract.client_name);
                              setContractType(contract.contract_type);
                              setContractValue(contract.project_value.toString());
                              setContractDuration(contract.duration_months.toString());
                              alert("Draft loaded into compiler panel.");
                            }}
                            className="btn-util" 
                            style={{ fontSize: 10, padding: "8px 12px" }}
                          >
                            LOAD
                          </button>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(contract.contract_text);
                              alert("Contract text copied!");
                            }}
                            className="btn-util" 
                            style={{ fontSize: 10, padding: "8px 12px" }}
                          >
                            <Copy size={12} />
                          </button>
                          <button 
                            onClick={() => deleteContract(contract.id)} 
                            className="btn-util" 
                            style={{ fontSize: 10, padding: "8px 12px", borderColor: "rgba(255,51,51,0.2)", color: "rgba(255,51,51,0.7)" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {contracts.length === 0 && (
                      <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>No contract agreements in legal vault.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: DOCUMENT LOCKER */}
              <div className="glass-panel" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Secure File Locker</h3>
                <p style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>ENCRYPTED BUSINESS VAULT FOR CREDENTIALS & CERTIFICATES</p>

                {/* UPLOAD FORM */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", padding: 24, borderRadius: 6, marginBottom: 32, textAlign: "center" }}>
                  <label style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8, textAlign: "left" }}>FILE CATEGORY</label>
                  <select 
                    value={docCategory} 
                    onChange={(e) => setDocCategory(e.target.value as any)} 
                    style={{ ...inputStyle, marginBottom: 16 }}
                  >
                    <option value="GST" style={{ background: "#020202", color: "#fff" }}>GST Registration Certificate</option>
                    <option value="NDA" style={{ background: "#020202", color: "#fff" }}>NDA & Signed Client Terms</option>
                    <option value="TAX" style={{ background: "#020202", color: "#fff" }}>Tax filings & Receipts</option>
                    <option value="TECHNICAL" style={{ background: "#020202", color: "#fff" }}>Server Keys & Domain Ownership</option>
                    <option value="OTHER" style={{ background: "#020202", color: "#fff" }}>General Business Document</option>
                  </select>

                  <input 
                    type="file" 
                    ref={docFileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />

                  <button 
                    onClick={() => docFileInputRef.current?.click()}
                    disabled={uploadingDoc}
                    className="btn-primary" 
                    style={{ width: "100%", justifyContent: "center", background: "#00F2FF", color: "#000", fontWeight: 800, padding: 14 }}
                  >
                    <Upload size={16} /> {uploadingDoc ? "UPLOADING SYSTEM DOC..." : "INJECT FILE TO VAULT"}
                  </button>
                </div>

                {/* DOCUMENT LIST */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      style={{ 
                        background: "rgba(255,255,255,0.01)", padding: 16, 
                        borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)",
                        display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ color: "#00F2FF", opacity: 0.8 }}>
                          <FolderOpen size={20} />
                        </div>
                        <div style={{ maxWidth: 160 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                            <span 
                              className="editorial-tag" 
                              style={{ 
                                fontSize: 7, padding: "2px 6px", border: "1px solid rgba(0,242,255,0.2)",
                                color: "#00F2FF", borderRadius: 4, letterSpacing: "0.05em"
                              }}
                            >
                              {doc.category}
                            </span>
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-geist-mono)" }}>
                              {(doc.file_size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a 
                          href={doc.storage_path} 
                          download={doc.name}
                          className="btn-util"
                          style={{ fontSize: 9, padding: "6px 10px" }}
                        >
                          <Download size={12} />
                        </a>
                        <button 
                          onClick={() => deleteDocument(doc.id)} 
                          className="btn-util" 
                          style={{ fontSize: 9, padding: "6px 10px", borderColor: "rgba(255,51,51,0.2)", color: "rgba(255,51,51,0.7)" }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div style={{ textAlign: "center", padding: 32, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Vault is currently empty.</div>
                  )}
                </div>

              </div>

            </div>

          </motion.div>
        )}


      </main>

      {/* --- MODALS --- */}

      {/* ADD LEAD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={modalBoxStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 20 }}>Inject New Lead_</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={24}/></button>
              </div>
              <form onSubmit={handleAddLead} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input required placeholder="Client Name" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} style={inputStyle} />
                <div style={{ display: "flex", gap: 12 }}>
                  <input required type="email" placeholder="Email Address" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} style={inputStyle} />
                  <input placeholder="Phone Number" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} style={inputStyle} />
                </div>
                <input placeholder="Business Profile" value={newLead.business_type} onChange={e => setNewLead({...newLead, business_type: e.target.value})} style={inputStyle} />
                <input placeholder="Budget" value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})} style={inputStyle} />
                <button type="submit" disabled={loading} className="btn-util" style={{ width: "100%", background: "#00F2FF", color: "#000", marginTop: 16, justifyContent: "center", padding: 18, fontWeight: 800 }}>{loading ? "PROCESSING..." : "COMMIT TO GRID"}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={modalBoxStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 20 }}>Generate B2B Invoice_</h3>
                <button onClick={() => setShowInvoiceModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={24}/></button>
              </div>
              <form onSubmit={handleCreateInvoice} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input required placeholder="Client Name / Company" value={newInvoice.client_name} onChange={e => setNewInvoice({...newInvoice, client_name: e.target.value})} style={inputStyle} />
                <input required type="email" placeholder="Client Billing Email" value={newInvoice.client_email} onChange={e => setNewInvoice({...newInvoice, client_email: e.target.value})} style={inputStyle} />
                
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>CURRENCY</label>
                    <select value={newInvoice.currency} onChange={e => setNewInvoice({...newInvoice, currency: e.target.value})} style={inputStyle}>
                      <option value="INR" style={{ background: "#020202", color: "#fff" }}>INR (₹)</option>
                      <option value="USD" style={{ background: "#020202", color: "#fff" }}>USD ($)</option>
                    </select>
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>GROSS TOTAL AMOUNT</label>
                    <input required placeholder="Gross Total" value={newInvoice.total_amount} onChange={e => setNewInvoice({...newInvoice, total_amount: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 9, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>SYSTEM DISCOUNT (FLAT)</label>
                    <input placeholder="e.g. 10000" value={newInvoice.discount_amount} onChange={e => setNewInvoice({...newInvoice, discount_amount: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                {newInvoice.currency === "INR" && (
                  <>
                    <input placeholder="Client GSTIN (15-digit, Optional)" value={newInvoice.client_gstin} onChange={e => setNewInvoice({...newInvoice, client_gstin: e.target.value.toUpperCase()})} style={inputStyle} />
                    <select value={newInvoice.state_type} onChange={e => setNewInvoice({...newInvoice, state_type: e.target.value})} style={inputStyle}>
                      <option value="INTERSTATE" style={{ background: "#020202", color: "#fff" }}>Outside Haryana (Interstate - 18% IGST)</option>
                      <option value="INTRASTATE" style={{ background: "#020202", color: "#fff" }}>Haryana (Intrastate - 9% CGST + 9% SGST)</option>
                    </select>
                  </>
                )}

                <input placeholder="Description (e.g. MATRIX Plan - Milestone 1)" value={newInvoice.description} onChange={e => setNewInvoice({...newInvoice, description: e.target.value})} style={inputStyle} />
                
                <select value={newInvoice.status} onChange={e => setNewInvoice({...newInvoice, status: e.target.value as any})} style={inputStyle}>
                  <option value="PENDING" style={{ background: "#020202", color: "#fff" }}>Status: PENDING</option>
                  <option value="PAID" style={{ background: "#020202", color: "#fff" }}>Status: PAID</option>
                  <option value="OVERDUE" style={{ background: "#020202", color: "#fff" }}>Status: OVERDUE</option>
                </select>

                {newInvoice.total_amount && !isNaN(parseFloat(newInvoice.total_amount)) && (() => {
                  const gross = parseFloat(newInvoice.total_amount) || 0;
                  const discount = parseFloat(newInvoice.discount_amount) || 0;
                  const net = gross - discount;
                  const base = newInvoice.currency === "INR" ? net / 1.18 : net;
                  const gst = newInvoice.currency === "INR" ? net - base : 0;
                  const symbol = newInvoice.currency === "USD" ? "$" : "₹";
                  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", background: "#020202", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 13, letterSpacing: "0.2em" }}>
        VERIFYING CREDENTIAL CLEARANCE...
      </div>
    );
  }

  return (
                    <div style={{ background: "rgba(0,242,255,0.05)", padding: 16, borderLeft: "2px solid #00F2FF", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}>
                      <span style={{ color: "#00F2FF", fontWeight: 700 }}>Real-Time Invoicing Calculations Split_</span>
                      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, color: "rgba(255,255,255,0.6)" }}>
                        <div>Gross Project Value: {symbol}{gross.toLocaleString()}</div>
                        {discount > 0 && <div style={{ color: "#FF3333" }}>Applied Discount: -{symbol}{discount.toLocaleString()}</div>}
                        <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.1)", margin: "4px 0" }} />
                        {newInvoice.currency === "INR" ? (
                          <>
                            <div>Taxable Base: ₹{Math.round(base * 100)/100}</div>
                            {newInvoice.state_type === "INTRASTATE" ? (
                              <>
                                <div>CGST (9%): ₹{Math.round((gst/2)*100)/100}</div>
                                <div>SGST (9%): ₹{Math.round((gst/2)*100)/100}</div>
                              </>
                            ) : (
                              <div>IGST (18%): ₹{Math.round(gst * 100)/100}</div>
                            )}
                          </>
                        ) : (
                          <div>Net Taxable (USD): ${Math.round(base * 100)/100}</div>
                        )}
                        <div style={{ color: "#00FF66", fontWeight: 800, marginTop: 4, fontSize: 12 }}>Final Net Payable: {symbol}{net.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })()}

                <button type="submit" disabled={loading} className="btn-util" style={{ width: "100%", background: "#00F2FF", color: "#000", marginTop: 16, justifyContent: "center", padding: 18, fontWeight: 800 }}>
                  {loading ? "COMMITTING..." : "COMMIT INVOICE TO LEDGER"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTE MODAL */}
      <AnimatePresence>
        {noteModal && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: "100%", maxWidth: 450, padding: 32, borderTop: "2px solid #00F2FF" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18 }}>Neural Remarks</h3>
                <button onClick={() => setNoteModal(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={24}/></button>
              </div>
              <textarea 
                value={noteModal.text} onChange={(e) => setNoteModal({ ...noteModal, text: e.target.value })}
                style={{ width: "100%", height: 180, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: 16, outline: "none", fontFamily: "var(--font-inter)", fontSize: 14, resize: "none" }}
              />
              <button onClick={saveNote} className="btn-util" style={{ width: "100%", background: "#00F2FF", color: "#000", marginTop: 24, justifyContent: "center", padding: 16, fontWeight: 800 }}>SAVE INTELLIGENCE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Printable Invoice Area */}
      {activePrintInvoice && (
        <div className="printable-invoice-container" style={{
          display: "none",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: "#222",
          background: "#fff",
          padding: "40px",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          <style>
            {`
              @media screen {
                .printable-invoice-container {
                  display: none !important;
                }
              }
              @media print {
                html, body {
                  background: #fff !important;
                  color: #000 !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .printable-invoice-container, .printable-invoice-container * {
                  visibility: visible !important;
                }
                .printable-invoice-container {
                  display: block !important;
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
              }
            `}
          </style>
          
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "40px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: "#000", fontFamily: "var(--font-syne)" }}>ADYANT NEXA</h1>
              <div style={{ fontSize: "10px", color: "#777", letterSpacing: "2px", textTransform: "uppercase" }}>Digital Operating System</div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "10px" }}>
                Adyant Nexa India<br/>
                Haryana, India<br/>
                Email: contact@adyantnexa.com
              </div>
            </div>
            <div style={{ textAlign: "right", color: "#222" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 10px 0", color: "#111" }}>INVOICE</h2>
              <div style={{ fontSize: "14px", color: "#555" }}>
                <b>Invoice #:</b> {activePrintInvoice.invoice_number}<br/>
                <b>Date:</b> {new Date(activePrintInvoice.created_at).toLocaleDateString()}<br/>
                <b>Status:</b> {activePrintInvoice.status.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", color: "#555", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "8px" }}>Billed To:</div>
              <div style={{ fontSize: "14px", color: "#333" }}>
                <b>{activePrintInvoice.client_name}</b><br/>
                Email: {activePrintInvoice.client_email}<br/>
                {activePrintInvoice.client_gstin ? `GSTIN: ${activePrintInvoice.client_gstin}` : ""}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", color: "#555", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "8px" }}>Provider:</div>
              <div style={{ fontSize: "14px", color: "#333" }}>
                <b>Adyant Nexa Ltd.</b><br/>
                GSTIN: Haryana Registry Active<br/>
                Tax Treatment: {activePrintInvoice.currency === "INR" 
                  ? `Haryana GST: ${activePrintInvoice.state_type === "INTRASTATE" ? "Haryana CGST (9%) + SGST (9%)" : "Out-State IGST (18%)"}` 
                  : "Export Services (No GST)"}
              </div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
            <thead>
              <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee" }}>
                <th style={{ padding: "12px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "#555", textAlign: "left" }}>Description</th>
                <th style={{ padding: "12px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "#555", textAlign: "right", width: "120px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontSize: "14px" }}>
                  <b>Growth & Performance Web Engineering Services</b>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>{activePrintInvoice.description || "Bespoke digital architecture build"}</div>
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "right" }}>
                  {activePrintInvoice.currency === "INR" ? "₹" : "$"}{activePrintInvoice.base_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "60px" }}>
            <table style={{ width: "300px", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 12px" }}>Subtotal (Base):</td>
                  <td style={{ padding: "6px 12px", textAlign: "right" }}>
                    {activePrintInvoice.currency === "INR" ? "₹" : "$"}{activePrintInvoice.base_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
                {activePrintInvoice.currency === "INR" && (
                  <tr>
                    <td style={{ padding: "6px 12px" }}>Tax ({activePrintInvoice.state_type === "INTRASTATE" ? "CGST (9%) + SGST (9%)" : "IGST (18%)"}):</td>
                    <td style={{ padding: "6px 12px", textAlign: "right" }}>
                      ₹{activePrintInvoice.gst_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
                <tr style={{ fontWeight: "bold", fontSize: "16px", borderTop: "2px solid #333" }}>
                  <td style={{ padding: "12px" }}>Total Due:</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    {activePrintInvoice.currency === "INR" ? "₹" : "$"}{activePrintInvoice.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px", marginBottom: "40px" }}>
            <div style={{ fontWeight: "bold", color: "#555", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "12px" }}>Payment Instructions (Direct Bank Transfer):</div>
            <table style={{ width: "100%", fontSize: "13px", color: "#333", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 0", width: "160px", color: "#666" }}>Account Holder Name:</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold", color: "#000" }}>Adyant Nexa</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", color: "#666" }}>Account Number:</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold", color: "#000" }}>033311501083109</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", color: "#666" }}>IFSC Code:</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold", color: "#000" }}>NESF0000333</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", color: "#666" }}>Bank Name:</td>
                  <td style={{ padding: "4px 0", color: "#000" }}>Slice Current Account (NESFB)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", fontSize: "11px", color: "#777", textAlign: "center" }}>
            Thank you for partnering with Adyant Nexa. This is a computer-generated document and does not require a physical signature.
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .btn-util { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); padding: 10px 20px; border-radius: 4px; font-family: var(--font-geist-mono); font-size: 11px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; }
        .btn-util:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: #00F2FF; }
        .btn-bulk { background: none; border: none; color: #000; font-family: var(--font-geist-mono); font-weight: 800; font-size: 11px; cursor: pointer; padding: 8px 16px; border-radius: 100px; transition: 0.2s; }
        .btn-bulk:hover { background: rgba(0,0,0,0.1); }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

// --- Styles ---
const thStyle: React.CSSProperties = { textAlign: "left", padding: "20px 24px", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" };
const tdStyle: React.CSSProperties = { padding: "20px 24px", verticalAlign: "middle" };
const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 16px", color: "#fff", outline: "none", fontSize: 13, fontFamily: "var(--font-inter)", width: "100%", borderRadius: 4 };
const actionIconStyle = (color: string): React.CSSProperties => ({ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: color, padding: "8px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", transition: "0.2s" });
const bulkBarStyles: React.CSSProperties = { position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)", background: "#00F2FF", color: "#000", padding: "12px 24px", borderRadius: 100, display: "flex", alignItems: "center", gap: 24, zIndex: 1000, boxShadow: "0 20px 40px rgba(0,242,255,0.2)" };
const modalOverlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(8px)", padding: 20 };
const modalBoxStyle: React.CSSProperties = { width: "100%", maxWidth: 500, padding: 40, borderTop: "2px solid #00F2FF", maxHeight: "90vh", overflowY: "auto" };

function getStatusColor(status: string, bg: boolean) {
  switch (status) {
    case "VICTORY": return bg ? "rgba(0,255,102,0.1)" : "#00FF66";
    case "HOT": return bg ? "rgba(255,51,51,0.1)" : "#FF3333";
    case "CONTACTED": return bg ? "rgba(0,242,255,0.1)" : "#00F2FF";
    case "DEAD": return bg ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.3)";
    default: return bg ? "rgba(255,255,255,0.05)" : "#fff";
  }
}

