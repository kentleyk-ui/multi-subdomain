export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { type, data } = req.body;

  try {
    let errors = [];

    // Validation de domaine
    if (type === "domain") {
      const domain = data?.trim();
      if (!domain) errors.push("Domaine requis");
      if (domain && domain.length < 3) errors.push("Domaine trop court");
      if (domain && !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/.test(domain)) {
        errors.push("Format de domaine invalide");
      }
    }

    // Validation de subdomain
    if (type === "subdomain") {
      const sub = data?.trim();
      if (!sub) errors.push("Sous-domaine requis");
      if (sub && sub.length < 2) errors.push("Sous-domaine trop court");
      if (sub && sub.length > 63) errors.push("Sous-domaine trop long");
      if (sub && !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(sub)) {
        errors.push("Format de sous-domaine invalide (lettres, chiffres, tirets)");
      }
    }

    // Validation de description
    if (type === "description") {
      const desc = data?.trim();
      if (desc && desc.length > 120) errors.push("Description trop longue (max 120 caractères)");
      if (desc && /<script|javascript:/i.test(desc)) errors.push("Contenu non sécurisé détecté");
    }

    // Validation HTML
    if (type === "html") {
      const html = data?.trim();
      if (!html) errors.push("Contenu HTML requis");
      if (html && html.length > 100000) errors.push("Contenu trop volumineux (max 100KB)");

      // Vérifier les tags dangereux
      const dangerous = ["<script", "<iframe", "onclick", "onerror", "onload"];
      if (dangerous.some(tag => html.toLowerCase().includes(tag))) {
        errors.push("Tags HTML dangereux détectés");
      }

      // Vérifier que les tags sont fermés
      const openTags = (html.match(/<[a-z][^>]*>/gi) || []).length;
      const closeTags = (html.match(/<\/[a-z][^>]*>/gi) || []).length;
      if (openTags !== closeTags) {
        errors.push("Tags HTML non fermés correctement");
      }
    }

    // Validation chemin
    if (type === "path") {
      const path = data?.trim();
      if (!path) errors.push("Chemin requis");
      if (path && !/^\/[a-zA-Z0-9\/_-]*$/.test(path)) {
        errors.push("Format de chemin invalide");
      }
    }

    // Validation email
    if (type === "email") {
      const email = data?.trim();
      if (!email) errors.push("Email requis");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Format d'email invalide");
      }
    }

    // Validation URL
    if (type === "url") {
      const url = data?.trim();
      if (!url) errors.push("URL requise");
      try {
        new URL(url);
      } catch {
        errors.push("Format d'URL invalide");
      }
    }

    return res.status(200).json({
      valid: errors.length === 0,
      errors: errors,
      type: type,
      warnings: errors.length > 0 ? errors : [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
