import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let pages = {};
    let projects = {};
    let subdomains = {};
    try { pages = await readData("pages.json"); } catch {}
    try { projects = await readData("projects.json"); } catch {}
    try { subdomains = await readData("subdomains.json"); } catch {}

    const stats = {
      totalSubdomains: Object.keys(projects).length,
      totalPages: Object.values(pages).reduce((sum, sp) => sum + Object.keys(sp).length, 0),
      subdomainsWithPages: Object.keys(pages).length,
      pagesBySubdomain: {},
      totalDescriptions: Object.keys(subdomains).length,
    };

    // Détail par sous-domaine
    Object.entries(pages).forEach(([subdomain, sp]) => {
      stats.pagesBySubdomain[subdomain] = {
        count: Object.keys(sp).length,
        pages: Object.entries(sp).map(([key, page]) => ({
          title: page.title,
          created: page.created,
          modified: page.modified,
        })),
      };
    });

    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
