import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let page = 1;
    const records = [];

    while (true) {
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE}/dns_records?type=CNAME&per_page=100&page=${page}`,
        { headers: { Authorization: `Bearer ${process.env.CF_KEY}` } }
      );
      const data = await cfRes.json();
      if (!data.success) {
        return res.status(500).json({ error: "Cloudflare error", details: data.errors });
      }
      records.push(...data.result);
      if (page >= data.result_info.total_pages) break;
      page++;
    }

    let descs = {};
    let projects = {};
    try { descs = await readData("subdomains.json"); } catch {}
    try { projects = await readData("projects.json"); } catch {}

    const subdomains = records
      .filter((r) => r.content === "cname.vercel-dns.com")
      .map((r) => {
        const projData = projects[r.name] || {};
        return {
          name: r.name,
          target: r.content,
          created: r.created_on,
          description: descs[r.name] || "",
          projectId: projData.projectId || r.name.split(".")[0],
          deploymentId: projData.deploymentId || null,
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    return res.status(200).json({ subdomains });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
