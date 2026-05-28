// Glass Morphism Theme - Default for all UI pages
// Import: import { S, METAL, METAL_SM, PILL } from "@/lib/theme";

const METAL = (loading = false, danger = false) => ({
  background: loading
    ? "#0d1525"
    : danger
    ? "linear-gradient(145deg, #e04060 0%, #b02040 20%, #801030 50%, #b02040 75%, #e04060 100%)"
    : "linear-gradient(145deg, #d0dce8 0%, #a0b4c8 18%, #6880a0 42%, #507090 55%, #8090a8 72%, #c8d8e8 90%, #e8f0f8 100%)",
  color: loading ? "#334455" : "#050d1a",
  fontWeight: "bold",
  letterSpacing: "0.1rem",
  border: loading ? "1px solid #1a2535" : "1px solid rgba(200,230,255,0.55)",
  boxShadow: loading
    ? "none"
    : danger
    ? "0 2px 10px rgba(180,0,30,0.45), inset 0 1px 0 rgba(255,180,180,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)"
    : "0 2px 14px rgba(0,60,140,0.5), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.18)",
  textShadow: loading ? "none" : "0 1px 1px rgba(255,255,255,0.55)",
  cursor: loading ? "not-allowed" : "pointer",
  padding: "0.75rem 1rem",
  fontSize: "0.85rem",
  borderRadius: "6px",
  width: "100%",
  opacity: loading ? 0.5 : 1,
  transition: "opacity 0.2s",
});

const METAL_SM = (disabled = false, danger = false) => ({
  ...METAL(false, danger),
  padding: "3px 10px",
  fontSize: "0.75rem",
  width: "auto",
  letterSpacing: "0.05rem",
  opacity: disabled ? 0.4 : 1,
  cursor: disabled ? "not-allowed" : "pointer",
});

const PILL = (active) => ({
  background: active ? "rgba(13, 32, 64, 0.6)" : "transparent",
  border: `1px solid ${active ? "rgba(26, 80, 128, 0.8)" : "rgba(26, 48, 80, 0.5)"}`,
  color: active ? "#4fc3f7" : "#2a6a9a",
  padding: "4px 12px",
  fontSize: "0.68rem",
  borderRadius: "6px",
  cursor: "pointer",
  letterSpacing: "0.08rem",
  fontWeight: active ? "600" : "normal",
  transition: "all 0.2s",
  backdropFilter: "blur(4px)",
  boxShadow: active ? "0 0 12px rgba(79, 195, 247, 0.2)" : "none",
});

const S = {
  page: {
    background: "linear-gradient(135deg, #070d1a 0%, #0a1425 50%, #050810 100%)",
    color: "#81d4fa",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1.5rem",
    boxSizing: "border-box",
  },
  title: { fontSize: "1.9rem", letterSpacing: "0.25rem", marginBottom: "0.4rem", color: "#4fc3f7", textAlign: "center", textShadow: "0 0 20px rgba(79, 195, 247, 0.3)" },
  subtitle: { fontSize: "0.7rem", letterSpacing: "0.2rem", color: "#2a4a6a", marginBottom: "2.5rem", textAlign: "center" },
  layout: { display: "flex", gap: "2rem", width: "100%", maxWidth: "1100px", alignItems: "flex-start", flexWrap: "wrap" },
  card: { background: "rgba(10, 18, 32, 0.4)", border: "1px solid rgba(26, 48, 80, 0.6)", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" },
  formCard: { width: "320px", flexShrink: 0 },
  listCard: { flex: 1, minWidth: "300px" },
  cardHead: { fontSize: "0.68rem", letterSpacing: "0.18rem", color: "#4fc3f7", borderBottom: "1px solid rgba(26, 80, 128, 0.5)", paddingBottom: "0.65rem", marginBottom: "0.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", textShadow: "0 0 8px rgba(79, 195, 247, 0.2)" },
  headRight: { display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" },
  label: { fontSize: "0.65rem", letterSpacing: "0.13rem", color: "#4fc3f7", marginBottom: "0.35rem", display: "block", textShadow: "0 0 6px rgba(79, 195, 247, 0.15)" },
  input: { background: "rgba(5, 13, 26, 0.6)", color: "#81d4fa", border: "1px solid rgba(26, 48, 80, 0.5)", padding: "0.55rem 0.85rem", fontSize: "0.95rem", borderRadius: "6px", width: "100%", boxSizing: "border-box", outline: "none", backdropFilter: "blur(4px)", transition: "all 0.2s" },
  searchInput: { background: "rgba(5, 13, 26, 0.6)", color: "#81d4fa", border: "1px solid rgba(26, 48, 80, 0.5)", padding: "0.4rem 0.75rem", fontSize: "0.85rem", borderRadius: "6px", width: "100%", boxSizing: "border-box", outline: "none", backdropFilter: "blur(4px)" },
  textarea: { background: "rgba(5, 13, 26, 0.6)", color: "#81d4fa", border: "1px solid rgba(26, 48, 80, 0.5)", padding: "0.55rem 0.85rem", fontSize: "0.9rem", borderRadius: "6px", width: "100%", boxSizing: "border-box", outline: "none", minHeight: "90px", resize: "vertical", fontFamily: "Arial, sans-serif", backdropFilter: "blur(4px)" },
  descInput: { background: "rgba(6, 15, 30, 0.7)", color: "#81d4fa", border: "1px solid rgba(26, 64, 96, 0.5)", padding: "2px 6px", fontSize: "0.78rem", borderRadius: "4px", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "Arial, sans-serif", marginTop: "2px", backdropFilter: "blur(3px)" },
  iconBtn: { background: "rgba(10, 20, 35, 0.5)", border: "1px solid rgba(26, 58, 90, 0.6)", color: "#4fc3f7", cursor: "pointer", borderRadius: "5px", padding: "4px 10px", fontSize: "0.9rem", backdropFilter: "blur(4px)", transition: "all 0.2s" },
  output: { background: "rgba(5, 13, 26, 0.6)", border: "1px solid rgba(26, 48, 80, 0.5)", borderRadius: "6px", padding: "0.85rem", color: "#81d4fa", fontSize: "0.82rem", whiteSpace: "pre-wrap", lineHeight: "1.6", backdropFilter: "blur(4px)" },
  row: (conf) => ({ display: "flex", alignItems: "flex-start", gap: "0.7rem", padding: "0.65rem", borderBottom: "1px solid rgba(13, 30, 48, 0.5)", background: conf ? "rgba(180, 0, 30, 0.08)" : "transparent", borderRadius: conf ? "6px" : "0", transition: "all 0.2s" }),
  rowInfo: { flex: 1, minWidth: 0 },
  rowTop: { display: "flex", alignItems: "center", gap: "0.45rem" },
  dot: (st) => ({
    width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
    background: st === "ok" ? "#4caf50" : st === "error" ? "#ef5350" : st === "checking" ? "#ffd700" : "rgba(26, 48, 80, 0.5)",
    boxShadow: st === "ok" ? "0 0 8px rgba(76, 175, 80, 0.6)" : st === "error" ? "0 0 8px rgba(239, 83, 80, 0.6)" : "none",
    transition: "all 0.3s",
  }),
  rowName: { color: "#4fc3f7", fontSize: "0.88rem", textDecoration: "none", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0, textShadow: "0 0 8px rgba(79, 195, 247, 0.2)" },
  rowCode: { color: "#2a6a9a", fontSize: "0.68rem", flexShrink: 0 },
  rowMeta: { color: "#2a6a9a", fontSize: "0.7rem", marginTop: "1px", marginLeft: "12px" },
  rowDesc: { color: "#4fc3f7", fontSize: "0.78rem", marginTop: "3px", marginLeft: "12px", fontStyle: "italic", cursor: "pointer", opacity: 0.8, transition: "opacity 0.2s" },
  rowDescEmpty: { color: "#2a6a9a", fontSize: "0.78rem", marginTop: "3px", marginLeft: "12px", fontStyle: "italic", cursor: "pointer", opacity: 0.6 },
  actions: { display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" },
  confirmText: { fontSize: "0.7rem", color: "#ef5350", letterSpacing: "0.05rem", textShadow: "0 0 8px rgba(239, 83, 80, 0.2)" },
  emptyText: { color: "#2a6a9a", fontSize: "0.82rem", fontStyle: "italic", textAlign: "center", padding: "1rem 0" },
  nav: { marginTop: "2rem", color: "#2a4a6a", fontSize: "0.75rem", letterSpacing: "0.1rem" },
  navLink: { color: "#4fc3f7", textDecoration: "none", transition: "all 0.2s" },
};

export { S, METAL, METAL_SM, PILL };
