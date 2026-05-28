import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  try {
    const royaumes = await readData("royaumes.json");
    return res.status(200).json(royaumes);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
