import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { user, role } = req.body;

  if (!user || !role) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    const roles = await readData("roles.json");
    const allowed = roles[role]?.includes(user);
    return res.status(200).json({ user, role, allowed: !!allowed });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
