export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subdomains } = req.body;

  if (!Array.isArray(subdomains) || subdomains.length === 0) {
    return res.status(400).json({ error: "subdomains array requis" });
  }

  const results = await Promise.allSettled(
    subdomains.map(async (name) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const r = await fetch(`https://${name}`, {
          method: "HEAD",
          signal: controller.signal,
          redirect: "follow",
        });
        return { name, ok: r.ok, code: r.status };
      } catch {
        return { name, ok: false, code: 0 };
      } finally {
        clearTimeout(timer);
      }
    })
  );

  const statuses = {};
  for (const r of results) {
    if (r.status === "fulfilled") {
      statuses[r.value.name] = { ok: r.value.ok, code: r.value.code };
    }
  }

  return res.status(200).json({ statuses });
}
