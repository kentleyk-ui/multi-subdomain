import { useState, useEffect } from "react";

const METAL = (loading = false, danger = false) => ({
  background: loading
    ? "#0d1525"
    : danger
    ? "linear-gradient(145deg, #e04060 0%, #b02040 20%, #801030 50%, #b02040 75%, #e04060 100%)"
    : "linear-gradient(145deg, #d0dce8 0%, #a0b4c8 18%, #6880a0 42%, #507090 55%, #8090a8 72%, #c8d8e8 90%, #e8f0f8 100%)",
  color: loading ? "#334455" : "#050d1a",
  fontWeight: "bold",
  letterSpacing: "0.1rem",
  border: loading
    ? "1px solid #1a2535"
    : "1px solid rgba(200,230,255,0.55)",
  boxShadow: loading
    ? "none"
    : danger
    ? "0 2px 10px rgba(180,0,30,0.45), inset 0 1px 0 rgba(255,180,180,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)"
    : "0 2px 14px rgba(0,60,140,0.5), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.18)",
  textShadow: loading ? "none" : "0 1px 1px rgba(255,255,255,0.55)",
  cursor: loading ? "not-allowed" : "pointer",
  padding: "0.8rem 1.2rem",
  fontSize: "0.9rem",
  borderRadius: "6px",
  width: "100%",
  opacity: loading ? 0.5 : 1,
  transition: "opacity 0.2s",
});

const S = {
  page: {
    background: "#070d1a",
    color: "#81d4fa",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1.5rem",
  },
  title: {
    fontSize: "1.9rem",
    letterSpacing: "0.2rem",
    marginBottom: "0.5rem",
    color: "#4fc3f7",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "0.75rem",
    letterSpacing: "0.18rem",
    color: "#2a4a6a",
    marginBottom: "2.5rem",
    textAlign: "center",
  },
  layout: {
    display: "flex",
    gap: "2rem",
    width: "100%",
    maxWidth: "900px",
    alignItems: "flex-start",
  },
  leftPanel: {
    background: "#0a1220",
    border: "1px solid #1a3050",
    borderRadius: "8px",
    padding: "1.2rem",
    minWidth: "200px",
    width: "200px",
    flexShrink: 0,
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  card: {
    background: "#0a1220",
    border: "1px solid #1a3050",
    borderRadius: "8px",
    padding: "1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cardTitle: {
    fontSize: "0.72rem",
    letterSpacing: "0.15rem",
    color: "#2a6a9a",
    marginBottom: "0.2rem",
    borderBottom: "1px solid #1a3050",
    paddingBottom: "0.6rem",
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.8rem",
  },
  sectionLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15rem",
    color: "#2a6a9a",
    marginBottom: "0.4rem",
  },
  badge: (type) => ({
    display: "inline-block",
    background: type === "monark" ? "#0a2540" : "#071520",
    color: type === "monark" ? "#4fc3f7" : "#81d4fa",
    border: `1px solid ${type === "monark" ? "#1a4a7a" : "#1a3050"}`,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "0.78rem",
    marginBottom: "4px",
    display: "block",
  }),
  refreshBtn: {
    background: "none",
    border: "1px solid #1a3a5a",
    color: "#4fc3f7",
    cursor: "pointer",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "1rem",
  },
  input: {
    background: "#050d1a",
    color: "#81d4fa",
    border: "1px solid #1a3050",
    padding: "0.55rem 0.9rem",
    fontSize: "0.95rem",
    borderRadius: "5px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  label: { display: "flex", flexDirection: "column", gap: "0.35rem" },
  result: (ok) => ({
    marginTop: "0.5rem",
    padding: "0.7rem 1rem",
    borderRadius: "5px",
    background: ok ? "#071a0f" : "#1a0707",
    border: `1px solid ${ok ? "#1a4a2a" : "#4a1a1a"}`,
    color: ok ? "#4caf50" : "#ef5350",
    fontSize: "0.85rem",
  }),
  emptyText: { color: "#1a3a5a", fontSize: "0.8rem", fontStyle: "italic" },
  homeLink: {
    marginTop: "2.5rem",
    color: "#2a6a9a",
    fontSize: "0.8rem",
    letterSpacing: "0.1rem",
    textDecoration: "none",
  },
};

export default function Staff() {
  const [roles, setRoles] = useState({ monark: [], staff: [] });
  const [listLoading, setListLoading] = useState(false);

  const [requester, setRequester] = useState("");
  const [secret, setSecret] = useState("");
  const [newStaff, setNewStaff] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addResult, setAddResult] = useState(null);

  const [checkUser, setCheckUser] = useState("");
  const [checkRole, setCheckRole] = useState("staff");
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  useEffect(() => { fetchRoles(); }, []);

  async function fetchRoles() {
    setListLoading(true);
    try {
      const res = await fetch("/api/list-staff");
      const data = await res.json();
      setRoles({ monark: data.monark || [], staff: data.staff || [] });
    } catch {}
    setListLoading(false);
  }

  async function handleAddStaff(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddResult(null);
    try {
      const res = await fetch("/api/add-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ requester, newStaff }),
      });
      const data = await res.json();
      setAddResult({ ok: res.ok, msg: data.message || data.error });
      if (res.ok) { setNewStaff(""); fetchRoles(); }
    } catch (err) {
      setAddResult({ ok: false, msg: err.message });
    }
    setAddLoading(false);
  }

  async function handleCheckPermission(e) {
    e.preventDefault();
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const res = await fetch("/api/check-permission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: checkUser, role: checkRole }),
      });
      const data = await res.json();
      setCheckResult({
        ok: data.allowed,
        msg: data.allowed
          ? `✓ ${checkUser} a le rôle "${checkRole}"`
          : `✗ ${checkUser} n'a pas le rôle "${checkRole}"`,
      });
    } catch (err) {
      setCheckResult({ ok: false, msg: err.message });
    }
    setCheckLoading(false);
  }

  return (
    <div style={S.page}>
      <h1 style={S.title}>INTERFACE STAFF</h1>
      <p style={S.subtitle}>MILELE4EVER — GESTION DES ACCÈS</p>

      <div style={S.layout}>
        {/* PANNEAU GAUCHE */}
        <div style={S.leftPanel}>
          <div style={S.panelHead}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.15rem", color: "#2a6a9a" }}>
              MEMBRES
            </span>
            <button style={S.refreshBtn} onClick={fetchRoles} disabled={listLoading} title="Actualiser">
              {listLoading ? "…" : "↺"}
            </button>
          </div>

          <p style={S.sectionLabel}>MONARK</p>
          {roles.monark.length === 0 ? (
            <p style={S.emptyText}>—</p>
          ) : (
            roles.monark.map((m) => <span key={m} style={S.badge("monark")}>{m}</span>)
          )}

          <p style={{ ...S.sectionLabel, marginTop: "1rem" }}>STAFF</p>
          {roles.staff.length === 0 ? (
            <p style={S.emptyText}>{listLoading ? "…" : "Aucun staff"}</p>
          ) : (
            roles.staff.map((s) => <span key={s} style={S.badge("staff")}>{s}</span>)
          )}
        </div>

        {/* PANNEAU DROIT */}
        <div style={S.rightPanel}>
          {/* AJOUTER UN STAFF */}
          <div style={S.card}>
            <p style={S.cardTitle}>AJOUTER UN MEMBRE STAFF</p>
            <form onSubmit={handleAddStaff} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <label style={S.label}>
                <span style={S.sectionLabel}>VOTRE NOM (Monark)</span>
                <input
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  placeholder="kent"
                  style={S.input}
                  required
                />
              </label>
              <label style={S.label}>
                <span style={S.sectionLabel}>CLÉ SECRÈTE</span>
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="••••••••"
                  style={S.input}
                  required
                />
              </label>
              <label style={S.label}>
                <span style={S.sectionLabel}>NOM DU NOUVEAU STAFF</span>
                <input
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  placeholder="prénom ou identifiant"
                  style={S.input}
                  required
                />
              </label>
              <button type="submit" disabled={addLoading} style={METAL(addLoading)}>
                {addLoading ? "EN COURS…" : "AJOUTER AU STAFF"}
              </button>
              {addResult && <p style={S.result(addResult.ok)}>{addResult.msg}</p>}
            </form>
          </div>

          {/* VÉRIFIER UNE PERMISSION */}
          <div style={S.card}>
            <p style={S.cardTitle}>VÉRIFIER UNE PERMISSION</p>
            <form onSubmit={handleCheckPermission} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <label style={S.label}>
                <span style={S.sectionLabel}>UTILISATEUR</span>
                <input
                  value={checkUser}
                  onChange={(e) => setCheckUser(e.target.value)}
                  placeholder="nom d'utilisateur"
                  style={S.input}
                  required
                />
              </label>
              <label style={S.label}>
                <span style={S.sectionLabel}>RÔLE</span>
                <select
                  value={checkRole}
                  onChange={(e) => setCheckRole(e.target.value)}
                  style={{ ...S.input, cursor: "pointer" }}
                >
                  <option value="staff">staff</option>
                  <option value="monark">monark</option>
                </select>
              </label>
              <button type="submit" disabled={checkLoading} style={METAL(checkLoading)}>
                {checkLoading ? "EN COURS…" : "VÉRIFIER LA PERMISSION"}
              </button>
              {checkResult && <p style={S.result(checkResult.ok)}>{checkResult.msg}</p>}
            </form>
          </div>
        </div>
      </div>

      <a href="/" style={S.homeLink}>← retour à l'interface principale</a>
    </div>
  );
}
