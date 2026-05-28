import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { type, recipient, subject, message, data } = req.body;

    if (!type || !recipient) {
      return res.status(400).json({ error: "type et recipient requis" });
    }

    try {
      let notifications = [];
      try {
        const data = await readData("notifications.json");
        notifications = Array.isArray(data) ? data : [];
      } catch {}

      const notification = {
        id: `notif-${Date.now()}`,
        type, // "email", "slack", "webhook"
        recipient,
        subject: subject || "Notification",
        message: message || "",
        data: data || {},
        status: "pending",
        createdAt: new Date().toISOString(),
        sentAt: null,
        deliveryTime: null,
      };

      notifications.push(notification);

      // Garder seulement les 1000 dernières notifications
      if (notifications.length > 1000) {
        notifications = notifications.slice(-1000);
      }

      await writeData("notifications.json", notifications);

      // En production: réellement envoyer l'email/message
      if (type === "email") {
        // Intégration nodemailer ou SendGrid
        console.log(`📧 Email envoyé à ${recipient}: ${subject}`);
      } else if (type === "slack") {
        // Intégration Slack Webhook
        console.log(`💬 Message Slack: ${message}`);
      }

      notification.status = "sent";
      notification.sentAt = new Date().toISOString();
      notification.deliveryTime = "0ms (simulated)";

      return res.status(200).json({
        ok: true,
        notification,
        message: `Notification ${type} envoyée à ${recipient}`,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    // Lister les notifications récentes
    try {
      let notifications = [];
      try {
        const data = await readData("notifications.json");
        notifications = Array.isArray(data) ? data : [];
      } catch {}

      return res.status(200).json({
        notifications: notifications.slice(-50), // Dernier 50
        total: notifications.length,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
