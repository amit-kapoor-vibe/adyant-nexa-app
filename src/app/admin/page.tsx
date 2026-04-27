"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Database, Activity, Mail, Phone, Calendar, RefreshCw, Search, CheckCircle2, XCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  budget: string;
  message: string;
  status: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
    } else {
      setLeads(data || []);
      setFilteredLeads(data || []);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      setFilteredLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const results = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    );
    setFilteredLeads(results);
  }, [searchTerm, leads]);

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#020202", color: "#E5E5E5", fontFamily: "var(--font-inter)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 24, marginBottom: 40 }}>
          <div>
            <span className="editorial-tag" style={{ display: "flex", alignItems: "center", gap: 8, color: "#00F2FF", marginBottom: 12 }}>
              <Database size={14} /> CENTRAL COMMAND
            </span>
            <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1 }}>
              Intelligence <span style={{ color: "rgba(255,255,255,0.2)" }}>Hub.</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button 
              onClick={fetchLeads} 
              disabled={loading}
              style={{ 
                background: "rgba(0,242,255,0.1)", border: "1px solid rgba(0,242,255,0.3)", color: "#00F2FF", 
                padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase"
              }}
            >
              <RefreshCw size={14} className={loading ? "spin-animation" : ""} />
              Sync Data
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", 
                padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                fontFamily: "var(--font-geist-mono)", fontSize: 12, textTransform: "uppercase"
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: 32 }}>
          <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} size={18} />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 16px 16px 48px", color: "#fff", borderRadius: 8, outline: "none",
              fontFamily: "var(--font-inter)", fontSize: 14
            }}
          />
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #00F2FF" }}>
            <span className="editorial-tag" style={{ fontSize: 10, opacity: 0.5 }}>TOTAL LEADS</span>
            <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, marginTop: 8 }}>{leads.length}</div>
          </div>
          <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #FF3333" }}>
            <span className="editorial-tag" style={{ fontSize: 10, opacity: 0.5 }}>HOT LEADS</span>
            <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, marginTop: 8 }}>
              {leads.filter(l => l.status === "HOT").length}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: 24, borderLeft: "2px solid #00FF66" }}>
            <span className="editorial-tag" style={{ fontSize: 10, opacity: 0.5 }}>NEW ENQUIRIES</span>
            <div style={{ fontSize: 32, fontFamily: "var(--font-syne)", fontWeight: 800, marginTop: 8 }}>
              {leads.filter(l => l.status === "NEW").length}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
              <Activity className="spin-animation" style={{ margin: "0 auto", marginBottom: 16 }} />
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>Decrypting incoming transmissions...</p>
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
              <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>No leads acquired yet.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Client Details</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>Business Profile</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <motion.tr 
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: "4px 8px", background: lead.status === "HOT" ? "rgba(255,51,51,0.1)" : "rgba(0,242,255,0.1)", 
                        color: lead.status === "HOT" ? "#FF3333" : "#00F2FF", fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700 
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>{lead.name}</div>
                      <div style={{ fontFamily: "var(--font-inter)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{lead.message.substring(0, 50)}{lead.message.length > 50 ? "..." : ""}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        <Mail size={12} color="#00F2FF" /> {lead.email}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        <Phone size={12} color="#00F2FF" /> {lead.phone}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 12, color: "#fff", marginBottom: 4 }}>{lead.business_type}</div>
                      <div style={{ fontSize: 12, color: "#00FF66", fontFamily: "var(--font-geist-mono)" }}>Budget: {lead.budget}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        <Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button 
                          onClick={() => updateLeadStatus(lead.id, "CONTACTED")}
                          title="Mark as Contacted"
                          style={actionButtonStyle("#00FF66")}
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button 
                          onClick={() => updateLeadStatus(lead.id, "ARCHIVED")}
                          title="Archive Lead"
                          style={actionButtonStyle("rgba(255,255,255,0.2)")}
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "16px 24px",
  fontFamily: "var(--font-geist-mono)",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.3)"
};

const tdStyle: React.CSSProperties = {
  padding: "24px",
  verticalAlign: "top"
};

const actionButtonStyle = (color: string): React.CSSProperties => ({
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${color}`,
  color: color,
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s"
});
