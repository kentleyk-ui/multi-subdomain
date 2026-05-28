import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subdomain } = req.query;

  if (!subdomain) {
    return res.status(400).json({ error: "subdomain requis" });
  }

  try {
    let pages = {};
    try { pages = await readData("pages.json"); } catch {}

    const subPages = pages[subdomain] || {};
    const pagesList = Object.entries(subPages).map(([key, page]) => ({
      key,
      title: page.title,
      content: page.content,
      created: page.created,
      modified: page.modified,
    }));

    return res.status(200).json({ pages: pagesList });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
