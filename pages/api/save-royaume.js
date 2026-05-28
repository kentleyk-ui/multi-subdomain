import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { subdomain } = req.body;

  if (!subdomain) {
    return res.status(400).json({ error: "subdomain manquant" });
  }

  try {
    const royaumes = await readData("royaumes.json");
    royaumes.push({ subdomain, createdAt: new Date().toISOString() });
    await writeData("royaumes.json", royaumes);
    return res.status(200).json({ message: "Royaume enregistré", subdomain });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
