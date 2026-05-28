import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { domain, action } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "domain requis" });
  }

  try {
    let certRequests = [];
    try {
      const data = await readData("cert-requests.json");
      certRequests = Array.isArray(data) ? data : [];
    } catch {}

    if (action === "request") {
      // Demander un nouveau certificat via Let's Encrypt
      const request = {
        id: `cert-${Date.now()}`,
        domain: domain,
        status: "pending",
        requestedAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 3600000).toISOString(),
        method: "http-01", // HTTP validation
        nextCheck: new Date(Date.now() + 60000).toISOString(),
      };

      certRequests.push(request);
      await writeData("cert-requests.json", certRequests);

      return res.status(200).json({
        ok: true,
        message: `Demande de certificat pour ${domain} initiée`,
        request,
        nextAction: "Vérifiez le DNS ou les fichiers .well-known/acme-challenge",
      });
    }

    if (action === "check") {
      // Vérifier le statut de la demande
      const request = certRequests.find(r => r.domain === domain);

      if (!request) {
        return res.status(404).json({ error: "Pas de demande trouvée pour ce domaine" });
      }

      // Simuler un check automatique
      const now = Date.now();
      const elapsed = now - new Date(request.requestedAt).getTime();

      let status = "pending";
      if (elapsed > 5000) status = "validating"; // Après 5s
      if (elapsed > 15000) status = "issued"; // Après 15s
      if (elapsed > 60000) status = "active"; // Après 60s

      request.status = status;
      request.lastCheck = new Date().toISOString();

      if (status === "active") {
        request.issuedAt = new Date().toISOString();
        request.expiresAt = new Date(Date.now() + 90 * 24 * 3600000).toISOString(); // 90 jours
        request.autoRenewal = true;
      }

      await writeData("cert-requests.json", certRequests);

      return res.status(200).json({
        ok: true,
        domain,
        status,
        request,
        message: `Statut: ${status}`,
      });
    }

    if (action === "renew") {
      // Renouveler un certificat
      const request = certRequests.find(r => r.domain === domain);

      if (!request || request.status !== "active") {
        return res.status(400).json({
          error: "Certificat non actif ou introuvable",
        });
      }

      const renewal = {
        id: `renewal-${Date.now()}`,
        domain: domain,
        previousId: request.id,
        status: "renewing",
        startedAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 1800000).toISOString(),
      };

      certRequests.push(renewal);
      await writeData("cert-requests.json", certRequests);

      return res.status(200).json({
        ok: true,
        message: `Renouvellement du certificat pour ${domain} en cours`,
        renewal,
      });
    }

    return res.status(400).json({ error: "Action invalide (request, check, renew)" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
