import { readData, writeData } from "../../lib/data.js";

// Simple JWT-like token generation
function generateToken(userId, email) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({ userId, email, iat: Date.now(), exp: Date.now() + 86400000 })).toString("base64");
  const signature = Buffer.from(`${header}.${payload}`).toString("base64");
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { action, email, password, name } = req.body;

    try {
      let users = {};
      try { users = await readData("users.json"); } catch {}

      // LOGIN
      if (action === "login") {
        if (!email || !password) {
          return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        const user = users[email];
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé" });
        }

        // Comparaison simple (en production: bcrypt)
        if (user.password !== Buffer.from(password).toString("base64")) {
          return res.status(401).json({ error: "Mot de passe incorrect" });
        }

        const token = generateToken(user.id, email);
        return res.status(200).json({
          ok: true,
          token,
          user: { id: user.id, email, name: user.name, role: user.role },
        });
      }

      // REGISTER
      if (action === "register") {
        if (!email || !password || !name) {
          return res.status(400).json({ error: "Email, mot de passe et nom requis" });
        }

        if (users[email]) {
          return res.status(400).json({ error: "Utilisateur déjà enregistré" });
        }

        const userId = `user-${Date.now()}`;
        users[email] = {
          id: userId,
          email,
          password: Buffer.from(password).toString("base64"),
          name,
          role: "user",
          createdAt: new Date().toISOString(),
        };

        await writeData("users.json", users);

        const token = generateToken(userId, email);
        return res.status(200).json({
          ok: true,
          token,
          user: { id: userId, email, name, role: "user" },
        });
      }

      // VERIFY TOKEN
      if (action === "verify") {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
          return res.status(401).json({ ok: false, error: "Token requis" });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
          return res.status(401).json({ ok: false, error: "Token invalide" });
        }

        return res.status(200).json({ ok: true, user: decoded });
      }

      return res.status(400).json({ error: "Action invalide" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
