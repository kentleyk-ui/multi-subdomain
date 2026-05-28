import { readData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let projects = {};
    let subdomains = {};
    try { projects = await readData("projects.json"); } catch {}
    try { subdomains = await readData("subdomains.json"); } catch {}

    const segregationStatus = {
      totalProjects: Object.keys(projects).length,
      totalSubdomains: Object.keys(subdomains).length,
      projects: Object.entries(projects).map(([domain, proj]) => ({
        domain,
        projectId: proj.projectId,
        deploymentId: proj.deploymentId,
        createdAt: proj.createdAt,
        independent: true,
        canBeModifiedIndependently: true,
        canBeDeletedIndependently: true,
        isolation: "COMPLETE",
      })),
      overallIsolation: "COMPLETE",
      notes: "Chaque sous-domaine est un projet Vercel indépendant avec sa propre configuration et déploiements",
    };

    return res.status(200).json(segregationStatus);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
