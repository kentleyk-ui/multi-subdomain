import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Export
    const { subdomain } = req.query;
    if (!subdomain) {
      return res.status(400).json({ error: "subdomain requis" });
    }

    try {
      let pages = {};
      try { pages = await readData("pages.json"); } catch {}
      const subPages = pages[subdomain] || {};
      return res.status(200).json({ subdomain, pages: subPages, exportDate: new Date().toISOString() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    // Import
    const { subdomain, pages: importedPages } = req.body;
    if (!subdomain || !importedPages) {
      return res.status(400).json({ error: "subdomain et pages requis" });
    }

    try {
      let pages = {};
      try { pages = await readData("pages.json"); } catch {}

      if (!pages[subdomain]) pages[subdomain] = {};

      const mergedPages = { ...pages[subdomain], ...importedPages };
      pages[subdomain] = mergedPages;

      await writeData("pages.json", pages);
      return res.status(200).json({ ok: true, imported: Object.keys(importedPages).length });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
