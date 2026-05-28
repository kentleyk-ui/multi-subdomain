import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { sourceSubdomain, newSubName, domain } = req.body;

  if (!sourceSubdomain || !newSubName || !domain) {
    return res.status(400).json({ error: "sourceSubdomain, newSubName, et domain requis" });
  }

  try {
    let pages = {};
    let subdomains = {};
    try { pages = await readData("pages.json"); } catch {}
    try { subdomains = await readData("subdomains.json"); } catch {}

    // Copier les pages du sous-domaine source
    const sourcePages = pages[sourceSubdomain] || {};
    const newFull = `${newSubName}.${domain}`;

    if (pages[newFull]) {
      return res.status(400).json({ error: "Le nouveau sous-domaine existe déjà" });
    }

    pages[newFull] = JSON.parse(JSON.stringify(sourcePages));

    // Copier la description
    const sourceDesc = subdomains[sourceSubdomain];
    if (sourceDesc) {
      subdomains[newFull] = `${sourceDesc} (copie)`;
    }

    await writeData("pages.json", pages);
    await writeData("subdomains.json", subdomains);

    return res.status(200).json({ ok: true, newSubdomain: newFull, pagesCopied: Object.keys(sourcePages).length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
