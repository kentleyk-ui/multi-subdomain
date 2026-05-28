import { readData, writeData } from "../../lib/data.js";

const ROLES = {
  admin: {
    permissions: ["view", "create", "edit", "delete", "manage-users", "manage-settings"],
    description: "Accès complet",
  },
  manager: {
    permissions: ["view", "create", "edit", "delete"],
    description: "Gestion des contenus",
  },
  editor: {
    permissions: ["view", "create", "edit"],
    description: "Édition des pages",
  },
  viewer: {
    permissions: ["view"],
    description: "Consultation seule",
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId, action } = req.query;

    if (!userId || !action) {
      return res.status(400).json({ error: "userId et action requis" });
    }

    try {
      let users = {};
      try { users = await readData("users.json"); } catch {}

      let user = null;
      for (const [email, userData] of Object.entries(users)) {
        if (userData.id === userId) {
          user = userData;
          break;
        }
      }

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const role = ROLES[user.role] || ROLES.viewer;
      const hasPermission = role.permissions.includes(action);

      return res.status(200).json({
        allowed: hasPermission,
        userId,
        role: user.role,
        action,
        permissions: role.permissions,
        message: hasPermission ? "Autorisation accordée" : "Autorisation refusée",
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ error: "userId et newRole requis" });
    }

    if (!ROLES[newRole]) {
      return res.status(400).json({
        error: `Rôle invalide. Valides: ${Object.keys(ROLES).join(", ")}`,
      });
    }

    try {
      let users = {};
      try { users = await readData("users.json"); } catch {}

      let foundUser = null;
      let foundEmail = null;

      for (const [email, userData] of Object.entries(users)) {
        if (userData.id === userId) {
          foundUser = userData;
          foundEmail = email;
          break;
        }
      }

      if (!foundUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const oldRole = foundUser.role;
      foundUser.role = newRole;
      foundUser.roleChangedAt = new Date().toISOString();

      users[foundEmail] = foundUser;
      await writeData("users.json", users);

      return res.status(200).json({
        ok: true,
        message: `Rôle changé de ${oldRole} à ${newRole}`,
        user: { id: userId, email: foundEmail, role: newRole },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /api/permissions?list=roles
  if (req.query.list === "roles") {
    return res.status(200).json({
      roles: Object.entries(ROLES).map(([key, val]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        description: val.description,
        permissions: val.permissions,
      })),
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
