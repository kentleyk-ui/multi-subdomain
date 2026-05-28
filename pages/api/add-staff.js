import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.MONARK_SECRET}`) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const { requester, newStaff } = req.body;

  if (!requester || !newStaff) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    const roles = await readData("roles.json");

    if (!roles.monark.includes(requester)) {
      return res.status(403).json({ error: "Accès refusé : pas Monark" });
    }

    if (!roles.staff.includes(newStaff)) {
      roles.staff.push(newStaff);
      await writeData("roles.json", roles);
    }

    return res.status(200).json({ message: "Staff ajouté", newStaff });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
