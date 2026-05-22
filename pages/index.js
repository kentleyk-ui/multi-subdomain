import { useState } from "react";

export default function Home() {
  const [domain, setDomain] = useState("milele4ever.com");
  const [subs, setSubs] = useState([""]);
  const [log, setLog] = useState("");

  function addField() {
    if (subs.length >= 5) return;
    setSubs([...subs, ""]);
  }

  function updateField(i, value) {
    const copy = [...subs];
    copy[i] = value;
    setSubs(copy);
  }

  async function launch() {
    setLog("⏳ Lancement…");

    const res = await fetch("/api/create-multi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, subs }),
    });

    const data = await res.json();
    setLog(data.message);
  }

  return (
    <div style={{
      background: "#000",
      color: "white",
      minHeight: "100vh",
      padding: "3rem",
      fontFamily: "Arial"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>
        Création Multi Sous‑Domaines
      </h1>

      <label style={{ fontSize: "1.5rem" }}>Choisir le domaine :</label>
      <select
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        style={{
          padding: "1rem",
          fontSize: "1.2rem",
          marginBottom: "2rem",
          display: "block"
        }}
      >
        <option value="milele4ever.com">milele4ever.com</option>
        <option value="chezmiss.ca">chezmiss.ca</option>
      </select>

      <h2>Liste des sous‑domaines (max 5)</h2>

      {subs.map((s, i) => (
        <input
          key={i}
          value={s}
          onChange={(e) => updateField(i, e.target.value)}
          placeholder={`Sous‑domaine #${i + 1}`}
          style={{
            padding: "1rem",
            fontSize: "1.2rem",
            marginBottom: "1rem",
            width: "300px",
            display: "block"
          }}
        />
      ))}

      {subs.length < 5 && (
        <button
          onClick={addField}
          style={{
            padding: "0.5rem 1rem",
            background: "gray",
            border: "none",
            borderRadius: "6px",
            color: "white",
            marginBottom: "2rem",
            cursor: "pointer"
          }}
        >
          ➕ Ajouter un sous‑domaine
        </button>
      )}

      <button
        onClick={launch}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          background: "gold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        LANCER
      </button>

      <pre style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
        {log}
      </pre>
    </div>
  );
}
