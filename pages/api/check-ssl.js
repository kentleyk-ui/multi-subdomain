import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subdomains } = req.body;

  if (!Array.isArray(subdomains)) {
    return res.status(400).json({ error: "subdomains doit être un tableau" });
  }

  const results = {};

  for (const subdomain of subdomains) {
    try {
      results[subdomain] = await checkSSL(subdomain);
    } catch (err) {
      results[subdomain] = {
        valid: false,
        status: "error",
        message: err.message,
      };
    }
  }

  return res.status(200).json({ sslStatus: results });
}

function checkSSL(hostname) {
  return new Promise((resolve) => {
    const options = {
      hostname,
      port: 443,
      method: "HEAD",
      timeout: 5000,
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();

      if (!cert || Object.keys(cert).length === 0) {
        resolve({
          valid: false,
          status: "no_cert",
          message: "Pas de certificat trouvé",
        });
        return;
      }

      const now = new Date();
      const validFrom = new Date(cert.valid_from);
      const validUntil = new Date(cert.valid_to);

      resolve({
        valid: now >= validFrom && now <= validUntil,
        status: now > validUntil ? "expired" : now >= validFrom ? "valid" : "not_yet_valid",
        subject: cert.subject?.CN || "Unknown",
        issuer: cert.issuer?.CN || "Unknown",
        validFrom: cert.valid_from,
        validUntil: cert.valid_to,
        daysLeft: Math.ceil((validUntil - now) / (1000 * 60 * 60 * 24)),
      });
    });

    req.on("error", (err) => {
      resolve({
        valid: false,
        status: "error",
        message: err.message,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        valid: false,
        status: "timeout",
        message: "Timeout lors de la vérification SSL",
      });
    });

    req.end();
  });
}
