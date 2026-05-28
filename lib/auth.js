import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { readData, writeData } from "./data.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";
const JWT_EXPIRES = "24h";

export async function generateToken(userId, email) {
  return jwt.sign(
    { userId, email, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(email, password) {
  try {
    let users = {};
    try { users = await readData("users.json"); } catch {}

    const user = users[email];
    if (!user) {
      return { ok: false, error: "Utilisateur non trouvé" };
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return { ok: false, error: "Mot de passe incorrect" };
    }

    const token = await generateToken(user.id, email);
    return {
      ok: true,
      token,
      user: { id: user.id, email, name: user.name, role: user.role },
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function registerUser(email, password, name) {
  try {
    let users = {};
    try { users = await readData("users.json"); } catch {}

    if (users[email]) {
      return { ok: false, error: "Utilisateur déjà enregistré" };
    }

    const hashedPassword = await hashPassword(password);
    const userId = `user-${Date.now()}`;

    users[email] = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    await writeData("users.json", users);

    const token = await generateToken(userId, email);
    return {
      ok: true,
      token,
      user: { id: userId, email, name, role: "user" },
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token requis" });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    req.user = decoded;
    return handler(req, res);
  };
}
