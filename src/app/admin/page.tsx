"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Database, Mail, Phone, Calendar, RefreshCw, Search, 
  Trophy, MessageCircle, Skull, Download, Upload, Plus, 
  Trash2, CheckSquare, Square, StickyNote, X,
  TrendingUp, FileText, BarChart3, CreditCard, Activity, Target
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- Types ---
interface Lead {
  id: string; created_at: string; name: string; email: string;
  phone: string; business_type: string; budget: string; message: string;
  status: "NEW" | "CONTACTED" | "HOT" | "COLD" | "VICTORY" | "DEAD"; notes?: string;
}

type TabState = "GRID" | "FINANCE" | "ANALYTICS";

const STATUS_OPTIONS = ["ALL", "NEW", "CONTACTED", "HOT", "COLD", "VICTORY", "DEAD"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabState>("GRID");
  
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

  // Finance State (Mock)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // --- Lead Operations ---
  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) console.error(error); else setLeads(data || []);
    setLoading(false);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.from("leads").insert([newLead]);
    if (!error) { setShowAddModal(false); setNewLead({ name: "", email: "", phone: "", business_type: "", budget: "", message: "", status: "NEW" }); fetchLeads(); }
    setLoading(false);
  };

  const updateStatus = async (ids: string[], newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).in("id", ids);
    if (!error) { fetchLeads(); setSelectedLeads([]); }
  };

  const deleteLeads = async (ids: string[]) => {
    if (!confirm("Confirm mass deletion from Neural Grid?")) return;
    const { error } = await supabase.from("leads").delete().in("id", ids);
    if (!error) { fetchLeads(); setSelectedLeads([]); }
  };

  const saveNote = async () => {
    if (!noteModal) return;
    const { error } = await supabase.from("leads").update({ notes: noteModal.text }).eq("id", noteModal.id);
    if (!error) { fetchLeads(); setNoteModal(null); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const downloadCSV = (ids?: string[]) => {
    const targetLeads = ids ? leads.filter(l => ids.includes(l.id)) : filteredLeads;
    const headers = ["S.No", "Date", "Name", "Email", "Phone", "Business", "Budget", "Status", "Notes"];
    const rows = targetLeads.map((l, i) => [i + 1, new Date(l.created_at).toLocaleDateString(), l.name, l.email, l.phone, l.business_type, l.budget, l.status, (l.notes || "").replace(/,/g, ";")]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", `adyant_leads_${ids ? 'selected' : 'all'}.csv`); link.click();
  };

  useEffect(() => {
    let results = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone.includes(searchTerm)
    );
    if (activeStatus !== "ALL") results = results.filter(l => l.status === activeStatus);
    setFilteredLeads(results);
  }, [searchTerm, leads, activeStatus]);

  useEffect(() => { fetchLeads(); }, []);

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) setSelectedLeads([]);
    else setSelectedLeads(filteredLeads.map(l => l.id));
  };

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
                { id: "GRID", label: "Intelligence Grid", icon: Database },
                { id: "FINANCE", label: "Financial Ops", icon: TrendingUp },
                { id: "ANALYTICS", label: "Meta Analytics", icon: Activity }
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
          <button onClick={handleLogout} className="btn-util" style={{ fontSize: 10 }}>DISCONNECT <X size={14}/></button>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "40px" }}>
        
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
        {activeTab === "FINANCE" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Revenue Dashboard */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
              <div className="glass-panel" style={{ padding: 32, borderLeft: "2px solid #00F2FF" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>MONTHLY RECURRING (MRR)</div>
                <div style={{ fontSize: 40, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff" }}>$12,450</div>
                <div style={{ fontSize: 12, color: "#00FF66", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={12}/> +15% from last month</div>
              </div>
              <div className="glass-panel" style={{ padding: 32, borderLeft: "2px solid #00FF66" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>TOTAL PROCESSED (YTD)</div>
                <div style={{ fontSize: 40, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff" }}>$84,000</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>Via Stripe & Razorpay</div>
              </div>
              <div className="glass-panel" style={{ padding: 32, borderLeft: "2px solid #FF3333" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>PENDING INVOICES</div>
                <div style={{ fontSize: 40, fontFamily: "var(--font-syne)", fontWeight: 800, color: "#fff" }}>$4,150</div>
                <div style={{ fontSize: 12, color: "#FF3333", marginTop: 8 }}>3 Invoices Overdue</div>
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
                    <th style={thStyle}>Client</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Date Issued</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "INV-2026-042", client: "Apex Tech Corp", amount: "$1,000.00", date: "May 01, 2026", status: "PAID" },
                    { id: "INV-2026-043", client: "Neon Studios", amount: "$416.00", date: "May 05, 2026", status: "PENDING" },
                    { id: "INV-2026-044", client: "Global Trade LLC", amount: "₹1,25,000", date: "Apr 28, 2026", status: "OVERDUE" }
                  ].map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={tdStyle}><span style={{ fontFamily: "var(--font-geist-mono)", color: "#00F2FF", fontSize: 12 }}>{inv.id}</span></td>
                      <td style={tdStyle}><span style={{ fontWeight: 700, fontSize: 14 }}>{inv.client}</span></td>
                      <td style={tdStyle}><span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}>{inv.amount}</span></td>
                      <td style={tdStyle}>{inv.date}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          padding: "4px 8px", fontSize: 9, fontFamily: "var(--font-geist-mono)", fontWeight: 800,
                          background: inv.status === "PAID" ? "rgba(0,255,102,0.1)" : inv.status === "PENDING" ? "rgba(255,204,0,0.1)" : "rgba(255,51,51,0.1)",
                          color: inv.status === "PAID" ? "#00FF66" : inv.status === "PENDING" ? "#FFCC00" : "#FF3333"
                        }}>{inv.status}</span>
                      </td>
                      <td style={tdStyle}>
                        <button className="btn-util" style={{ fontSize: 10, padding: "6px 12px" }}>View PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

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
              <button className="btn-util" style={{ margin: "24px auto 0" }}>Configure Meta API</button>
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
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 20 }}>Generate Neural Invoice_</h3>
                <button onClick={() => setShowInvoiceModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={24}/></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <select style={inputStyle}>
                  <option>Select Client from Grid...</option>
                  <option>Apex Tech Corp</option>
                  <option>Neon Studios</option>
                </select>
                <div style={{ display: "flex", gap: 12 }}>
                  <select style={{...inputStyle, flex: 1}}>
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <input placeholder="Amount" style={{...inputStyle, flex: 3}} />
                </div>
                <input placeholder="Description (e.g. VOLT Plan - Month 1 EMI)" style={inputStyle} />
                
                <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                  <button className="btn-util" style={{ flex: 1, justifyContent: "center", padding: 16 }}><FileText size={16}/> Create PDF</button>
                  <button className="btn-primary" style={{ flex: 1, padding: 16, fontSize: 12 }}><CreditCard size={16}/> Send Payment Link</button>
                </div>
              </div>
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
const modalBoxStyle: React.CSSProperties = { width: "100%", maxWidth: 500, padding: 40, borderTop: "2px solid #00F2FF" };

function getStatusColor(status: string, bg: boolean) {
  switch (status) {
    case "VICTORY": return bg ? "rgba(0,255,102,0.1)" : "#00FF66";
    case "HOT": return bg ? "rgba(255,51,51,0.1)" : "#FF3333";
    case "CONTACTED": return bg ? "rgba(0,242,255,0.1)" : "#00F2FF";
    case "DEAD": return bg ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.3)";
    default: return bg ? "rgba(255,255,255,0.05)" : "#fff";
  }
}

