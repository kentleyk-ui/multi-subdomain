import fs from "fs";
import path from "path";

const EC_ID = process.env.EDGE_CONFIG_ID;
const EC_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID;
const USE_EC = !!(EC_ID && EC_TOKEN && TEAM_ID);

const TMP_DIR = "/tmp/data";

const DEFAULTS = {
  "roles.json": { monark: ["kent"], staff: [], royaumes: [] },
  "royaumes.json": [],
  "subdomains.json": {},
  "projects.json": {},
  "pages.json": {},
  "activity-logs.json": [],
  "backups.json": [],
};

// File-based fallback (local dev / cold start without EC)
function ensureTmp(filename) {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
  const tmp = path.join(TMP_DIR, filename);
  if (!fs.existsSync(tmp)) {
    const src = path.join(process.cwd(), "data", filename);
    if (fs.existsSync(src)) fs.copyFileSync(src, tmp);
    else fs.writeFileSync(tmp, JSON.stringify(DEFAULTS[filename] ?? {}));
  }
  return tmp;
}

// Edge Config REST API
async function ecRead(filename) {
  const key = filename.replace(".json", "");
  try {
    const res = await fetch(
      `https://api.vercel.com/v1/edge-config/${EC_ID}/item/${key}?teamId=${TEAM_ID}`,
      { headers: { Authorization: `Bearer ${EC_TOKEN}` } }
    );
    if (!res.ok) return DEFAULTS[filename] ?? {};
    return await res.json();
  } catch {
    return DEFAULTS[filename] ?? {};
  }
}

async function ecWrite(filename, data) {
  const key = filename.replace(".json", "");
  await fetch(
    `https://api.vercel.com/v1/edge-config/${EC_ID}/items?teamId=${TEAM_ID}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${EC_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ operation: "upsert", key, value: data }],
      }),
    }
  );
}

export async function readData(filename) {
  if (USE_EC) return ecRead(filename);
  return JSON.parse(fs.readFileSync(ensureTmp(filename), "utf8"));
}

export async function writeData(filename, data) {
  if (USE_EC) return ecWrite(filename, data);
  fs.writeFileSync(ensureTmp(filename), JSON.stringify(data, null, 2));
}
