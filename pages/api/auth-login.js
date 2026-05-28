import { registerUser, authenticateUser } from "../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, name, action } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    if (action === "register") {
      if (!name) {
        return res.status(400).json({ error: "Nom requis pour l'enregistrement" });
      }
      const result = await registerUser(email, password, name);
      if (result.ok) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    }

    if (action === "login") {
      const result = await authenticateUser(email, password);
      if (result.ok) {
        res.setHeader("Set-Cookie", `auth_token=${result.token}; Path=/; HttpOnly; SameSite=Strict`);
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
    }

    return res.status(400).json({ error: "Action invalide (login ou register)" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
