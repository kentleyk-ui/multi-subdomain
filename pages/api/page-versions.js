import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Lister l'historique
    const { subdomain, pageTitle } = req.query;
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
      const page = pages[subdomain][pageKey];

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      return res.status(200).json({ versions: page.versions || [] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    // Restaurer une version
    const { subdomain, pageTitle, versionIndex } = req.body;
    if (!subdomain || !pageTitle || versionIndex === undefined) {
      return res.status(400).json({ error: "subdomain, pageTitle, et versionIndex requis" });
    }

    try {
      let pages = {};
      try { pages = await readData("pages.json"); } catch {}

      if (!pages[subdomain]) {
        return res.status(404).json({ error: "Subdomain not found" });
      }

      const pageKey = pageTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const page = pages[subdomain][pageKey];

      if (!page || !page.versions || !page.versions[versionIndex]) {
        return res.status(404).json({ error: "Version not found" });
      }

      const oldContent = page.content;
      const versionToRestore = page.versions[versionIndex];

      page.content = versionToRestore.content;
      page.modified = new Date().toISOString();

      // Ajouter l'ancienne version à l'historique
      if (!page.versions) page.versions = [];
      page.versions.unshift({
        content: oldContent,
        modifiedAt: new Date().toISOString(),
        action: "restored_from_version",
      });

      // Limiter à 20 versions
      if (page.versions.length > 20) page.versions = page.versions.slice(0, 20);

      await writeData("pages.json", pages);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
