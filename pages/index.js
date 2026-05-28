import { useState, useEffect, useCallback, useMemo } from "react";

const METAL = (loading = false, danger = false) => ({
  background: loading
    ? "rgba(13, 21, 37, 0.6)"
    : danger
    ? "linear-gradient(145deg, rgba(224, 64, 96, 0.9) 0%, rgba(176, 32, 64, 0.85) 20%, rgba(128, 16, 48, 0.8) 50%, rgba(176, 32, 64, 0.85) 75%, rgba(224, 64, 96, 0.9) 100%)"
    : "linear-gradient(145deg, rgba(208, 220, 232, 0.8) 0%, rgba(160, 180, 200, 0.75) 18%, rgba(104, 128, 160, 0.7) 42%, rgba(80, 112, 144, 0.75) 55%, rgba(128, 144, 168, 0.8) 72%, rgba(200, 216, 232, 0.85) 90%, rgba(232, 240, 248, 0.9) 100%)",
  color: loading ? "#334455" : "#050d1a",
  fontWeight: "bold",
  letterSpacing: "0.1rem",
  border: loading ? "1px solid rgba(26, 37, 53, 0.5)" : "1px solid rgba(200,230,255,0.6)",
  boxShadow: loading
    ? "0 2px 8px rgba(0, 0, 0, 0.3)"
    : danger
    ? "0 4px 16px rgba(180,0,30,0.5), inset 0 1px 0 rgba(255,180,180,0.6), inset 0 -1px 0 rgba(0,0,0,0.3)"
    : "0 8px 24px rgba(0,60,140,0.4), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.2)",
  textShadow: loading ? "none" : "0 1px 2px rgba(255,255,255,0.6)",
  cursor: loading ? "not-allowed" : "pointer",
  padding: "0.75rem 1.2rem",
  fontSize: "0.9rem",
  borderRadius: "8px",
  width: "100%",
  opacity: loading ? 0.5 : 1,
  transition: "all 0.3s ease",
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
});

const METAL_SM = (disabled = false, danger = false) => ({
  ...METAL(false, danger),
  padding: "5px 14px",
  fontSize: "0.78rem",
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

function fmt(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Home() {
  const [domain, setDomain] = useState("milele4ever.com");
  const [subsText, setSubsText] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createOutput, setCreateOutput] = useState("");

  const [subdomains, setSubdomains] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [search, setSearch] = useState("");

  const [deleting, setDeleting] = useState({});
  const [confirming, setConfirming] = useState({});

  const [editingDesc, setEditingDesc] = useState(null);
  const [descDraft, setDescDraft] = useState("");

  const [statuses, setStatuses] = useState({});
  const [checking, setChecking] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [managingPages, setManagingPages] = useState(null);
  const [subPages, setSubPages] = useState({});
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageContent, setNewPageContent] = useState("");
  const [editingPageKey, setEditingPageKey] = useState(null);

  const [searchPages, setSearchPages] = useState("");
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [cloneName, setCloneName] = useState("");
  const [htmlError, setHtmlError] = useState("");
  const [templates, setTemplates] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [pageVersions, setPageVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [sslStatus, setSslStatus] = useState({});
  const [showSSL, setShowSSL] = useState(false);
  const [sslSortBy, setSslSortBy] = useState("name"); // "name", "status", "days-left"
  const [backups, setBackups] = useState([]);
  const [showBackups, setShowBackups] = useState(false);

  const fetchList = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/list-subdomains");
      const data = await res.json();
      setSubdomains(data.subdomains || []);
    } catch {}
    setListLoading(false);
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);

  const displayed = useMemo(() => {
    let list = [...subdomains];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => new Date(b.created) - new Date(a.created));

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return { filtered: list, paginated: list.slice(start, end), totalPages: Math.ceil(list.length / pageSize) };
  }, [subdomains, sortBy, search, currentPage, pageSize]);

  async function handleCreate(e) {
    e.preventDefault();
    const subs = subsText.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!subs.length) return;
    setCreating(true);
    setCreateOutput("");
    try {
      const res = await fetch("/api/create-multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, subs }),
      });
      const data = await res.json();
      setCreateOutput(data.message || data.error || "Réponse vide");
      if (createDesc.trim()) {
        await Promise.all(subs.map((sub) =>
          fetch("/api/save-subdomain-desc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: `${sub}.${domain}`, description: createDesc.trim() }),
          })
        ));
      }
      setSubsText("");
      setCreateDesc("");
      fetchList();
    } catch (err) {
      setCreateOutput(`Erreur réseau : ${err.message}`);
    }
    setCreating(false);
  }

  async function handleDelete(name) {
    const dot = name.indexOf(".");
    setDeleting((d) => ({ ...d, [name]: true }));
    setConfirming((c) => ({ ...c, [name]: false }));
    try {
      await fetch("/api/delete-multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: name.slice(dot + 1), subs: [name.slice(0, dot)] }),
      });
      fetchList();
    } catch {}
    setDeleting((d) => ({ ...d, [name]: false }));
  }

  async function saveDesc(name) {
    try {
      await fetch("/api/save-subdomain-desc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: descDraft }),
      });
      setSubdomains((subs) => subs.map((s) => s.name === name ? { ...s, description: descDraft } : s));
    } catch {}
    setEditingDesc(null);
  }

  async function checkAllStatus() {
    setChecking(true);
    const names = subdomains.map((s) => s.name);
    setStatuses((st) => {
      const next = { ...st };
      names.forEach((n) => { next[n] = { ok: null, code: null }; });
      return next;
    });
    try {
      const res = await fetch("/api/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomains: names }),
      });
      const data = await res.json();
      setStatuses(data.statuses || {});
    } catch {}
    setChecking(false);
  }

  async function loadSubPages(subdomainName) {
    try {
      const res = await fetch(`/api/list-pages?subdomain=${encodeURIComponent(subdomainName)}`);
      const data = await res.json();
      setSubPages((sp) => ({ ...sp, [subdomainName]: data.pages || [] }));
      setManagingPages(subdomainName);
    } catch {}
  }

  async function createPage(subdomainName) {
    if (!newPageTitle.trim()) return;
    try {
      const res = await fetch("/api/create-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: subdomainName,
          title: newPageTitle,
          content: newPageContent,
        }),
      });
      if (res.ok) {
        setNewPageTitle("");
        setNewPageContent("");
        await loadSubPages(subdomainName);
      }
    } catch {}
  }

  async function deletePage(subdomainName, pageTitle) {
    try {
      await fetch("/api/delete-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: subdomainName,
          title: pageTitle,
        }),
      });
      await loadSubPages(subdomainName);
    } catch {}
  }

  async function updatePage(subdomainName, pageTitle, newContent) {
    if (!pageTitle.trim()) return;
    try {
      await fetch("/api/create-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: subdomainName,
          title: pageTitle,
          content: newContent,
        }),
      });
      setEditingPageKey(null);
      setNewPageTitle("");
      setNewPageContent("");
      await loadSubPages(subdomainName);
    } catch {}
  }

  async function duplicatePage(subdomainName, pageTitle) {
    try {
      await fetch("/api/duplicate-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: subdomainName, pageTitle }),
      });
      await loadSubPages(subdomainName);
    } catch {}
  }

  async function cloneSubdomain(sourceSub, newName) {
    if (!newName.trim()) return;
    try {
      const domain = sourceSub.split(".").slice(1).join(".");
      const res = await fetch("/api/clone-subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceSubdomain: sourceSub, newSubName: newName, domain }),
      });
      if (res.ok) {
        setCloneName("");
        fetchList();
      }
    } catch {}
  }

  async function exportPages(subdomainName) {
    try {
      const res = await fetch(`/api/export-import-pages?subdomain=${encodeURIComponent(subdomainName)}`);
      const data = await res.json();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pages-${subdomainName}.json`;
      a.click();
    } catch {}
  }

  async function loadStats() {
    try {
      const res = await fetch("/api/get-stats");
      const data = await res.json();
      setStats(data);
      setShowStats(true);
    } catch {}
  }

  function validateHTML(html) {
    const errors = [];
    const tags = html.match(/<\/?[a-z][a-z0-9]*[^>]*>/gi) || [];
    const stack = [];

    tags.forEach(tag => {
      const match = tag.match(/<\/?([a-z][a-z0-9]*)/i);
      if (!match) return;

      const tagName = match[1].toLowerCase();
      const selfClosing = ["br", "hr", "img", "input", "meta", "link"].includes(tagName);
      const isClosing = tag.startsWith("</");

      if (selfClosing || tag.endsWith("/>")) return;

      if (isClosing) {
        if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
          errors.push(`Tag fermé sans ouverture: ${tag}`);
        } else {
          stack.pop();
        }
      } else {
        stack.push(tagName);
      }
    });

    stack.forEach(tag => {
      errors.push(`Tag non fermé: <${tag}>`);
    });

    setHtmlError(errors.length > 0 ? errors.join(" | ") : "");
    return errors.length === 0;
  }

  async function loadTemplates() {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data);
      setShowTemplates(true);
    } catch {}
  }

  function applyTemplate(template) {
    setNewPageTitle(template.title);
    setNewPageContent(template.content);
    validateHTML(template.content);
    setShowTemplates(false);
  }

  async function loadPageVersions(subdomainName, pageTitle) {
    try {
      const res = await fetch(`/api/page-versions?subdomain=${encodeURIComponent(subdomainName)}&pageTitle=${encodeURIComponent(pageTitle)}`);
      const data = await res.json();
      setPageVersions(data.versions || []);
      setShowVersions(true);
    } catch {}
  }

  async function restoreVersion(subdomainName, pageTitle, versionIndex) {
    try {
      await fetch("/api/page-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: subdomainName, pageTitle, versionIndex }),
      });
      setShowVersions(false);
      await loadSubPages(subdomainName);
    } catch {}
  }

  async function loadActivityLogs() {
    try {
      const res = await fetch("/api/activity-logs");
      const data = await res.json();
      setActivityLogs(data.logs || []);
      setShowLogs(true);
    } catch {}
  }

  async function checkSSLStatus() {
    try {
      const names = subdomains.map((s) => s.name);
      const res = await fetch("/api/check-ssl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomains: names }),
      });
      const data = await res.json();
      setSslStatus(data.sslStatus || {});
      setShowSSL(true);
    } catch {}
  }

  async function loadBackups() {
    try {
      const res = await fetch("/api/auto-backup", { method: "POST" });
      const data = await res.json();
      if (data.backup) {
        setBackups([data.backup]);
      }
      setShowBackups(true);
    } catch {}
  }

  async function createBackup() {
    try {
      const res = await fetch("/api/auto-backup", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        // Recharger la liste
        loadBackups();
      }
    } catch {}
  }

  async function exportBackup() {
    try {
      const res = await fetch("/api/backup-export-import");
      const backup = await res.json();
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    } catch {}
  }

  async function importBackup(file) {
    if (!file) return;
    try {
      const content = await file.text();
      const backup = JSON.parse(content);

      if (!backup.data || !backup.data.pages || !backup.data.subdomains) {
        alert("Format de backup invalide");
        return;
      }

      const res = await fetch("/api/backup-export-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: backup.data }),
      });

      const result = await res.json();
      if (result.ok) {
        alert("✅ Backup restauré avec succès!");
        fetchList();
        loadBackups();
      } else {
        alert("❌ Erreur: " + result.error);
      }
    } catch (err) {
      alert("❌ Erreur lors de l'import: " + err.message);
    }
  }

  const singleSub = subsText.trim().split("\n").filter(Boolean).length === 1;

  return (
    <div style={S.page}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", marginBottom: "0.5rem" }}>
        <h1 style={S.title}>INTERFACE MULTI-SOUS-DOMAINES</h1>
        <button
          onClick={() => window.location.reload()}
          style={S.iconBtn}
          title="Rafraîchir la page"
        >
          🔄
        </button>
        <button
          onClick={loadStats}
          style={S.iconBtn}
          title="Voir les statistiques"
        >
          📊
        </button>
        <button
          onClick={loadActivityLogs}
          style={S.iconBtn}
          title="Voir les logs d'activité"
        >
          📋
        </button>
        <button
          onClick={checkSSLStatus}
          style={S.iconBtn}
          title="Vérifier les certificats SSL"
        >
          🔒
        </button>
        <button
          onClick={loadBackups}
          style={S.iconBtn}
          title="Gérer les backups"
        >
          💾
        </button>
      </div>
      <p style={S.subtitle}>MILELE4EVER.COM — GESTION DES SOUS-DOMAINES</p>

      {showStats && stats && (
        <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#4fc3f7", margin: 0 }}>📊 STATISTIQUES</h2>
            <button onClick={() => setShowStats(false)} style={S.iconBtn}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#0d1e30", padding: "1rem", borderRadius: "5px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", color: "#4fc3f7", fontWeight: "bold" }}>{stats.totalSubdomains}</div>
              <div style={{ fontSize: "0.75rem", color: "#1a4060" }}>Sous-domaines</div>
            </div>
            <div style={{ background: "#0d1e30", padding: "1rem", borderRadius: "5px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", color: "#4fc3f7", fontWeight: "bold" }}>{stats.totalPages}</div>
              <div style={{ fontSize: "0.75rem", color: "#1a4060" }}>Pages totales</div>
            </div>
            <div style={{ background: "#0d1e30", padding: "1rem", borderRadius: "5px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", color: "#4fc3f7", fontWeight: "bold" }}>{stats.subdomainsWithPages}</div>
              <div style={{ fontSize: "0.75rem", color: "#1a4060" }}>Domaines avec pages</div>
            </div>
            <div style={{ background: "#0d1e30", padding: "1rem", borderRadius: "5px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", color: "#4fc3f7", fontWeight: "bold" }}>{stats.totalDescriptions}</div>
              <div style={{ fontSize: "0.75rem", color: "#1a4060" }}>Descriptions</div>
            </div>
          </div>
        </div>
      )}

      <div style={S.layout}>
        {/* FORMULAIRE */}
        <div style={{ ...S.card, ...S.formCard }}>
          <p style={S.cardHead}>CRÉER DES SOUS-DOMAINES</p>
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div>
              <label style={S.label}>DOMAINE</label>
              <input value={domain} onChange={(e) => setDomain(e.target.value)} style={S.input} required />
            </div>
            <div>
              <label style={S.label}>SOUS-DOMAINES — un par ligne</label>
              <textarea value={subsText} onChange={(e) => setSubsText(e.target.value)} placeholder={"mwangaza\nmemoria\naurore"} style={S.textarea} />
            </div>
            <div>
              <label style={S.label}>
                DESCRIPTION{" "}
                <span style={{ color: "#1a3a5a", fontStyle: "italic" }}>
                  — optionnelle{!singleSub && subsText.trim() ? " (appliquée à tous)" : ""}
                </span>
              </label>
              <input value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} style={S.input} placeholder="Ex : Portail principal…" maxLength={120} />
            </div>
            <button type="submit" disabled={creating} style={METAL(creating)}>
              {creating ? "CRÉATION EN COURS…" : "CRÉER"}
            </button>
          </form>
          {createOutput && <pre style={S.output}>{createOutput}</pre>}
        </div>

        {/* LISTE */}
        <div style={{ ...S.card, ...S.listCard }}>
          <div style={S.cardHead}>
            <span>SOUS-DOMAINES ({displayed.filtered.length}/{subdomains.length}) — Page {currentPage}/{displayed.totalPages}</span>
            <span style={S.headRight}>
              <button style={PILL(sortBy === "date")} onClick={() => setSortBy("date")}>DATE ↓</button>
              <button style={PILL(sortBy === "name")} onClick={() => setSortBy("name")}>NOM A→Z</button>
              <button style={S.iconBtn} onClick={checkAllStatus} disabled={checking} title="Vérifier l'état de tous les sous-domaines">
                {checking ? "…" : "⚡"}
              </button>
              <button style={S.iconBtn} onClick={fetchList} disabled={listLoading} title="Actualiser">
                {listLoading ? "…" : "↺"}
              </button>
            </span>
          </div>

          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={S.searchInput}
            placeholder="Rechercher par nom ou description…"
          />

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
              {[5, 10, 15, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => { setPageSize(size); setCurrentPage(1); }}
                  style={PILL(pageSize === size)}
                  title={`${size} par page`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={METAL_SM(currentPage === 1)}
                title="Page précédente"
              >
                ← PREC
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(displayed.totalPages, currentPage + 1))}
                disabled={currentPage === displayed.totalPages}
                style={METAL_SM(currentPage === displayed.totalPages)}
                title="Page suivante"
              >
                SUIV →
              </button>
            </div>
          </div>

          {listLoading && subdomains.length === 0 && <p style={S.emptyText}>Chargement…</p>}
          {!listLoading && subdomains.length === 0 && <p style={S.emptyText}>Aucun sous-domaine.</p>}
          {!listLoading && subdomains.length > 0 && displayed.filtered.length === 0 && (
            <p style={S.emptyText}>Aucun résultat pour « {search} »</p>
          )}

          {displayed.paginated.map((s) => {
            const st = statuses[s.name];
            const dotState = st === undefined ? null : st === null ? "checking" : st.ok ? "ok" : "error";
            return (
              <div key={s.name} style={S.row(!!confirming[s.name])}>
                <div style={S.rowInfo}>
                  <div style={S.rowTop}>
                    <span style={S.dot(dotState)} title={
                      dotState === "ok" ? `HTTP ${st?.code}` :
                      dotState === "error" ? `Erreur (${st?.code || "timeout"})` :
                      dotState === "checking" ? "Vérification…" : "Non vérifié"
                    } />
                    <a href={`https://${s.name}`} target="_blank" rel="noopener noreferrer" style={S.rowName} title={s.name}>
                      {s.name}
                    </a>
                    {st && <span style={S.rowCode}>{st.ok ? `${st.code}` : st.code ? `${st.code}` : "—"}</span>}
                  </div>
                  <div style={S.rowMeta}>→ {s.target} &nbsp;·&nbsp; {fmt(s.created)}</div>
                  {editingDesc === s.name ? (
                    <input
                      autoFocus
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.target.value)}
                      onBlur={() => saveDesc(s.name)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveDesc(s.name); if (e.key === "Escape") setEditingDesc(null); }}
                      style={S.descInput}
                      placeholder="Description…"
                      maxLength={120}
                    />
                  ) : (
                    <div
                      onClick={() => { setEditingDesc(s.name); setDescDraft(s.description || ""); }}
                      style={s.description ? S.rowDesc : S.rowDescEmpty}
                      title="Cliquer pour modifier"
                    >
                      {s.description || "Ajouter une description…"}
                    </div>
                  )}
                </div>

                <div style={S.actions}>
                  {confirming[s.name] ? (
                    <>
                      <span style={S.confirmText}>SUPPRIMER ?</span>
                      <button style={METAL_SM(!!deleting[s.name], true)} disabled={!!deleting[s.name]} onClick={() => handleDelete(s.name)}>
                        {deleting[s.name] ? "…" : "✓ OUI"}
                      </button>
                      <button style={METAL_SM(false, false)} onClick={() => setConfirming((c) => ({ ...c, [s.name]: false }))}>
                        ✗ NON
                      </button>
                    </>
                  ) : (
                    <button style={METAL_SM(!!deleting[s.name])} disabled={!!deleting[s.name]} onClick={() => setConfirming((c) => ({ ...c, [s.name]: true }))} title="Supprimer">
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GESTION DES PAGES */}
      <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
        <div style={S.cardHead}>
          <span>GESTION DES PAGES & SOUS-DOMAINES</span>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div>
            <label style={S.label}>CHOISIR UN SOUS-DOMAINE</label>
            <select
              value={managingPages || ""}
              onChange={(e) => {
                const sub = e.target.value;
                if (sub) {
                  setManagingPages(sub);
                  loadSubPages(sub);
                  setNewPageTitle("");
                  setNewPageContent("");
                  setEditingPageKey(null);
                  setSearchPages("");
                  setHtmlError("");
                } else {
                  setManagingPages(null);
                }
              }}
              style={{ background: "#050d1a", color: "#81d4fa", border: "1px solid #1a3050", padding: "0.55rem 0.85rem", fontSize: "0.95rem", borderRadius: "5px", outline: "none", minWidth: "200px" }}
            >
              <option value="">-- Sélectionner --</option>
              {subdomains.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {managingPages && (
            <>
              <div>
                <label style={S.label}>CLONER CE SOUS-DOMAINE</label>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <input
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    placeholder="nouveau-nom"
                    style={{ ...S.input, flex: 1, minWidth: "120px", padding: "0.55rem 0.5rem" }}
                  />
                  <button
                    onClick={() => cloneSubdomain(managingPages, cloneName)}
                    style={METAL_SM(false)}
                    disabled={!cloneName.trim()}
                  >
                    📋 CLONE
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {managingPages && (
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", minHeight: "400px" }}>
            {/* FORMULAIRE & LISTE */}
            <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={S.label}>TITRE DE LA PAGE</label>
                <input
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  style={S.input}
                  placeholder="Ex: Accueil, À propos…"
                  disabled={!!editingPageKey}
                />
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label style={S.label}>CONTENU HTML</label>
                <textarea
                  value={newPageContent}
                  onChange={(e) => {
                    setNewPageContent(e.target.value);
                    validateHTML(e.target.value);
                  }}
                  style={{ ...S.textarea, flex: 1, minHeight: "200px", borderColor: htmlError ? "#ef5350" : "#1a3050" }}
                  placeholder="<h1>Titre</h1><p>Contenu...</p>"
                />
                {htmlError && (
                  <div style={{ color: "#ef5350", fontSize: "0.7rem", marginTop: "0.3rem" }}>
                    ⚠️ {htmlError}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => createPage(managingPages)}
                  style={METAL(false)}
                  disabled={!newPageTitle.trim() || !!editingPageKey}
                >
                  + CRÉER PAGE
                </button>
                <button
                  onClick={loadTemplates}
                  style={METAL_SM(false)}
                  title="Charger un template prédéfini"
                >
                  📋 TEMPLATES
                </button>
                {editingPageKey && (
                  <>
                    <button
                      onClick={() => updatePage(managingPages, newPageTitle, newPageContent)}
                      style={METAL_SM(false)}
                    >
                      💾 METTRE À JOUR
                    </button>
                    <button
                      onClick={() => {
                        setEditingPageKey(null);
                        setNewPageTitle("");
                        setNewPageContent("");
                        setHtmlError("");
                      }}
                      style={METAL_SM(false)}
                    >
                      ✕ ANNULER
                    </button>
                  </>
                )}
              </div>

              <div>
                <label style={S.label}>PAGES EXISTANTES ({(subPages[managingPages] || []).filter(p => !searchPages.trim() || p.title.toLowerCase().includes(searchPages.toLowerCase())).length})</label>
                <input
                  value={searchPages}
                  onChange={(e) => setSearchPages(e.target.value)}
                  style={S.searchInput}
                  placeholder="Rechercher dans les pages…"
                />
                <div style={{ background: "#050d1a", border: "1px solid #1a3050", borderRadius: "5px", padding: "0.75rem", maxHeight: "300px", overflowY: "auto", marginTop: "0.5rem" }}>
                  {(subPages[managingPages] || []).filter(p => !searchPages.trim() || p.title.toLowerCase().includes(searchPages.toLowerCase())).length === 0 ? (
                    <p style={S.emptyText}>Aucune page</p>
                  ) : (
                    (subPages[managingPages] || []).filter(p => !searchPages.trim() || p.title.toLowerCase().includes(searchPages.toLowerCase())).map((page) => (
                      <div
                        key={page.title}
                        style={{
                          padding: "0.65rem",
                          marginBottom: "0.5rem",
                          background: editingPageKey === page.title ? "rgba(79, 195, 247, 0.1)" : "#0d1e30",
                          border: `1px solid ${editingPageKey === page.title ? "#4fc3f7" : "#1a3050"}`,
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }} onClick={() => {
                            setEditingPageKey(page.title);
                            setNewPageTitle(page.title);
                            setNewPageContent(page.content);
                            validateHTML(page.content);
                          }}>
                            <div style={{ color: "#4fc3f7", fontSize: "0.85rem", fontWeight: "bold" }}>
                              {page.title}
                            </div>
                            <div style={{ color: "#1a4060", fontSize: "0.7rem", marginTop: "2px" }}>
                              {fmt(page.created)}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                loadPageVersions(managingPages, page.title);
                              }}
                              style={METAL_SM(false)}
                              title="Voir l'historique"
                            >
                              📁
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicatePage(managingPages, page.title);
                              }}
                              style={METAL_SM(false)}
                              title="Dupliquer"
                            >
                              📋
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePage(managingPages, page.title);
                              }}
                              style={METAL_SM(false, true)}
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* APERÇU */}
            <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={S.label}>APERÇU</label>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newPageContent);
                      alert("HTML copié !");
                    }}
                    style={S.iconBtn}
                    title="Copier le HTML"
                    disabled={!newPageContent.trim()}
                  >
                    📋 COPIER
                  </button>
                  <button
                    onClick={() => exportPages(managingPages)}
                    style={S.iconBtn}
                    title="Exporter les pages"
                  >
                    ⬇️ EXPORT
                  </button>
                </div>
              </div>
              <iframe
                srcDoc={newPageContent || "<p style='color: #1a4060; padding: 1rem;'>Aucun contenu à afficher</p>"}
                style={{
                  flex: 1,
                  border: "1px solid #1a3050",
                  borderRadius: "5px",
                  background: "white",
                  minHeight: "300px",
                }}
                title="Aperçu de la page"
              />
            </div>
          </div>
        )}

        {!managingPages && (
          <p style={S.emptyText}>Sélectionnez un sous-domaine pour gérer ses pages</p>
        )}
      </div>

      {showTemplates && (
        <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#4fc3f7", margin: 0 }}>📋 TEMPLATES PRÉDÉFINIS</h2>
            <button onClick={() => setShowTemplates(false)} style={S.iconBtn}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {Object.entries(templates).map(([key, template]) => (
              <div
                key={key}
                onClick={() => applyTemplate(template)}
                style={{
                  background: "#0d1e30",
                  border: "1px solid #1a3050",
                  borderRadius: "5px",
                  padding: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a2a3a";
                  e.currentTarget.style.borderColor = "#4fc3f7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0d1e30";
                  e.currentTarget.style.borderColor = "#1a3050";
                }}
              >
                <div style={{ color: "#4fc3f7", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {template.title}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    applyTemplate(template);
                  }}
                  style={METAL_SM(false)}
                >
                  ➜ UTILISER
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLogs && (
        <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#4fc3f7", margin: 0 }}>📋 LOGS D'ACTIVITÉ</h2>
            <button onClick={() => setShowLogs(false)} style={S.iconBtn}>✕</button>
          </div>
          {activityLogs.length === 0 ? (
            <p style={S.emptyText}>Aucun log d'activité</p>
          ) : (
            <div style={{ background: "#050d1a", border: "1px solid #1a3050", borderRadius: "5px", maxHeight: "400px", overflowY: "auto" }}>
              {activityLogs.map((log, idx) => (
                <div key={idx} style={{ padding: "0.75rem", borderBottom: "1px solid #0d1e30" }}>
                  <div style={{ color: "#4fc3f7", fontSize: "0.85rem", fontWeight: "bold" }}>
                    {log.action}
                  </div>
                  <div style={{ color: "#2a6a9a", fontSize: "0.75rem", marginTop: "2px" }}>
                    {fmt(log.timestamp)} — {log.subdomain} {log.page && `/ ${log.page}`}
                  </div>
                  {log.details && (
                    <div style={{ color: "#1a4060", fontSize: "0.7rem", marginTop: "2px", fontStyle: "italic" }}>
                      {log.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showSSL && (
        <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#4fc3f7", margin: 0 }}>🔒 CERTIFICATS SSL</h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button onClick={checkSSLStatus} style={S.iconBtn} title="Actualiser">🔄</button>
              <button onClick={() => setShowSSL(false)} style={S.iconBtn}>✕</button>
            </div>
          </div>

          {Object.keys(sslStatus).length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
              <button style={PILL(sslSortBy === "name")} onClick={() => setSslSortBy("name")}>
                NOM A→Z
              </button>
              <button style={PILL(sslSortBy === "status")} onClick={() => setSslSortBy("status")}>
                STATUT
              </button>
              <button style={PILL(sslSortBy === "days-left")} onClick={() => setSslSortBy("days-left")}>
                EXPIRATION
              </button>
            </div>
          )}

          {Object.keys(sslStatus).length === 0 ? (
            <p style={S.emptyText}>Aucune vérification</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {Object.entries(sslStatus)
                .sort(([nameA, certA], [nameB, certB]) => {
                  if (sslSortBy === "status") {
                    const statusOrder = { "valid": 0, "expired": 1, "error": 2, "no_cert": 3 };
                    return (statusOrder[certA.status] || 99) - (statusOrder[certB.status] || 99);
                  } else if (sslSortBy === "days-left") {
                    return (certA.daysLeft || 999) - (certB.daysLeft || 999);
                  }
                  return nameA.localeCompare(nameB);
                })
                .map(([domain, cert]) => (
                  <div
                    key={domain}
                    style={{
                      background: "rgba(13, 30, 48, 0.4)",
                      border: `1px solid ${cert.valid ? "rgba(76, 175, 80, 0.6)" : "rgba(239, 83, 80, 0.6)"}`,
                      borderRadius: "8px",
                      padding: "1.2rem",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.7rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>
                        {cert.valid ? "✅" : "❌"}
                      </span>
                      <div style={{ color: cert.valid ? "#4caf50" : "#ef5350", fontSize: "0.9rem", fontWeight: "bold", flex: 1 }}>
                        {domain}
                      </div>
                    </div>
                    <div style={{ color: "#2a6a9a", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                      🔐 {cert.status === "valid" ? "Valide" : cert.status === "expired" ? "Expiré" : "Erreur"}
                    </div>
                    {cert.subject && (
                      <div style={{ color: "#2a6a9a", fontSize: "0.7rem", marginBottom: "0.3rem" }}>
                        📋 {cert.subject}
                      </div>
                    )}
                    {cert.validUntil && (
                      <div style={{ color: cert.daysLeft < 7 ? "#ef5350" : cert.daysLeft < 30 ? "#ffd700" : "#4caf50", fontSize: "0.75rem", fontWeight: "600", marginTop: "0.5rem", padding: "0.4rem", background: "rgba(5, 13, 26, 0.3)", borderRadius: "4px" }}>
                        ⏰ {cert.daysLeft}j restants ({fmt(cert.validUntil)})
                      </div>
                    )}
                    {cert.message && (
                      <div style={{ color: "#ef5350", fontSize: "0.7rem", marginTop: "0.5rem" }}>
                        ⚠️ {cert.message}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {showVersions && (
        <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#4fc3f7", margin: 0 }}>📁 HISTORIQUE DES VERSIONS</h2>
            <button onClick={() => setShowVersions(false)} style={S.iconBtn}>✕</button>
          </div>
          {pageVersions.length === 0 ? (
            <p style={S.emptyText}>Aucune version</p>
          ) : (
            <div style={{ background: "#050d1a", border: "1px solid #1a3050", borderRadius: "5px", maxHeight: "400px", overflowY: "auto" }}>
              {pageVersions.map((version, idx) => (
                <div key={idx} style={{ padding: "0.75rem", borderBottom: "1px solid #0d1e30" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#4fc3f7", fontSize: "0.85rem", fontWeight: "bold" }}>
                        Version {pageVersions.length - idx}
                      </div>
                      <div style={{ color: "#2a6a9a", fontSize: "0.75rem", marginTop: "2px" }}>
                        {fmt(version.modified || version.created)}
                      </div>
                    </div>
                    <button
                      onClick={() => restoreVersion(managingPages, editingPageKey || "", idx)}
                      style={METAL_SM(false)}
                      title="Restaurer cette version"
                    >
                      ↶ RESTAURER
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showBackups && (
        <div style={{ ...S.card, width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#4fc3f7", margin: 0 }}>💾 BACKUPS</h2>
            <button onClick={() => setShowBackups(false)} style={S.iconBtn}>✕</button>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button onClick={createBackup} style={METAL_SM(false)} title="Créer un backup manuel">
              ➕ CRÉER BACKUP
            </button>
            <button onClick={exportBackup} style={METAL_SM(false)} title="Télécharger les données actuelles">
              ⬇️ EXPORTER
            </button>
            <label style={{ ...METAL_SM(false), padding: "5px 14px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
              <input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])}
                style={{ display: "none" }}
              />
              📤 IMPORTER
            </label>
          </div>

          {backups.length === 0 ? (
            <p style={S.emptyText}>Aucun backup</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {backups.map((backup, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(13, 30, 48, 0.4)",
                    border: "1px solid rgba(26, 80, 128, 0.5)",
                    borderRadius: "8px",
                    padding: "1.2rem",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ color: "#4fc3f7", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "0.7rem", textShadow: "0 0 8px rgba(79, 195, 247, 0.2)" }}>
                    📦 Backup {backups.length - idx}
                  </div>
                  <div style={{ color: "#2a6a9a", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                    🕐 {fmt(backup.timestamp)}
                  </div>
                  <div style={{ color: "#2a6a9a", fontSize: "0.75rem", marginBottom: "0.3rem" }}>
                    🌐 Sous-domaines: <span style={{ color: "#4fc3f7" }}>{backup.subdomainCount}</span>
                  </div>
                  <div style={{ color: "#2a6a9a", fontSize: "0.75rem", marginBottom: "0.8rem" }}>
                    📄 Pages: <span style={{ color: "#4fc3f7" }}>{backup.pagesCount}</span>
                  </div>
                  <div style={{ color: "#1a4060", fontSize: "0.65rem", fontFamily: "monospace", wordBreak: "break-all", padding: "0.5rem", background: "rgba(5, 13, 26, 0.3)", borderRadius: "4px" }}>
                    🔐 Hash: {backup.hash}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <nav style={S.nav}>
        <a href="/staff" style={S.navLink}>GESTION STAFF →</a>
      </nav>
    </div>
  );
}
