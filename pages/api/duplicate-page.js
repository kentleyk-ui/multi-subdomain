import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subdomain, pageTitle } = req.body;

  if (!subdomain || !pageTitle) {
    return res.status(400).json({ error: "subdomain et pageTitle requis" });
  }

  try {
    let pages = {};
    try { pages = await readData("pages.json"); } catch {}

    if (!pages[subdomain]) {
      return res.status(404).json({ error: "Subdomain not found" });
    }

    const pageKey = pageTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const sourcePage = pages[subdomain][pageKey];

    if (!sourcePage) {
      return res.status(404).json({ error: "Page not found" });
    }

    const newPageKey = `${pageKey}-copie-${Date.now()}`;
    const now = new Date().toISOString();

    pages[subdomain][newPageKey] = {
      title: `${sourcePage.title} (copie)`,
      content: sourcePage.content,
      created: now,
      modified: now,
    };

    await writeData("pages.json", pages);
    return res.status(200).json({ ok: true, newKey: newPageKey });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
