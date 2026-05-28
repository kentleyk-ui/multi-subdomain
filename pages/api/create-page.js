import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subdomain, title, content } = req.body;

  if (!subdomain || !title) {
    return res.status(400).json({ error: "subdomain et title requis" });
  }

  try {
    let pages = {};
    try { pages = await readData("pages.json"); } catch {}

    if (!pages[subdomain]) pages[subdomain] = {};

    const pageKey = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const now = new Date().toISOString();

    const existingPage = pages[subdomain][pageKey];
    let versions = existingPage?.versions || [];

    // Sauvegarder l'ancienne version si elle existe et que le contenu change
    if (existingPage && existingPage.content !== (content || "")) {
      versions.unshift({
        content: existingPage.content,
        modifiedAt: existingPage.modified,
        action: "modified",
      });
      // Limiter à 20 versions
      if (versions.length > 20) versions = versions.slice(0, 20);
    }

    pages[subdomain][pageKey] = {
      title,
      content: content || "",
      created: existingPage?.created || now,
      modified: now,
      versions,
    };

    await writeData("pages.json", pages);
    return res.status(200).json({ ok: true, key: pageKey });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
