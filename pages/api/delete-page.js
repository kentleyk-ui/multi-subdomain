import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subdomain, title } = req.body;

  if (!subdomain || !title) {
    return res.status(400).json({ error: "subdomain et title requis" });
  }

  try {
    let pages = {};
    try { pages = await readData("pages.json"); } catch {}

    if (!pages[subdomain]) {
      return res.status(404).json({ error: "Subdomain not found" });
    }

    const pageKey = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    delete pages[subdomain][pageKey];

    if (Object.keys(pages[subdomain]).length === 0) {
      delete pages[subdomain];
    }

    await writeData("pages.json", pages);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
