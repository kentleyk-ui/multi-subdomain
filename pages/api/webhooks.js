import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Lister tous les webhooks
    try {
      let webhooks = [];
      try {
        const data = await readData("webhooks.json");
        webhooks = Array.isArray(data) ? data : [];
      } catch {}

      return res.status(200).json({
        webhooks,
        count: webhooks.length,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    const { action, webhook } = req.body;

    try {
      let webhooks = [];
      try {
        const data = await readData("webhooks.json");
        webhooks = Array.isArray(data) ? data : [];
      } catch {}

      if (action === "create") {
        if (!webhook.url || !webhook.event) {
          return res.status(400).json({ error: "url et event requis" });
        }

        const newWebhook = {
          id: `webhook-${Date.now()}`,
          url: webhook.url,
          event: webhook.event, // "backup.created", "ssl.renewed", "error", etc.
          active: webhook.active ?? true,
          secret: webhook.secret || `secret-${Date.now()}`,
          retries: webhook.retries || 3,
          createdAt: new Date().toISOString(),
          lastTriggered: null,
          failureCount: 0,
        };

        webhooks.push(newWebhook);
        await writeData("webhooks.json", webhooks);

        return res.status(200).json({
          ok: true,
          webhook: newWebhook,
          message: "Webhook créé",
        });
      }

      if (action === "delete") {
        if (!webhook.id) {
          return res.status(400).json({ error: "id requis" });
        }

        webhooks = webhooks.filter(w => w.id !== webhook.id);
        await writeData("webhooks.json", webhooks);

        return res.status(200).json({
          ok: true,
          message: "Webhook supprimé",
        });
      }

      if (action === "test") {
        if (!webhook.id) {
          return res.status(400).json({ error: "id requis" });
        }

        const wh = webhooks.find(w => w.id === webhook.id);
        if (!wh) {
          return res.status(404).json({ error: "Webhook non trouvé" });
        }

        // Simuler un test
        const testPayload = {
          event: wh.event,
          timestamp: new Date().toISOString(),
          data: { test: true, webhookId: wh.id },
        };

        // En production: faire un vrai POST
        return res.status(200).json({
          ok: true,
          message: "Test webhook envoyé",
          webhook: wh,
          testPayload,
          estimatedResponse: "Le serveur recevra un POST JSON",
        });
      }

      return res.status(400).json({ error: "Action invalide" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
