import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  try {
    const roles = await readData("roles.json");
    return res.status(200).json({
      monark: roles.monark || [],
      staff: roles.staff || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
