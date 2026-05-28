import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name requis" });
  }

  try {
    let descs = {};
    try { descs = await readData("subdomains.json"); } catch {}
    descs[name] = description || "";
    await writeData("subdomains.json", descs);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
