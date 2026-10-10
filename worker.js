// The site editor's API. Everything else is static assets: wrangler.jsonc runs this Worker
// first for /api/* only. Editors log in with a name and password held in the EDITORS KV
// namespace (add one with scripts/add-editor.js); a save commits data/directory.js to GitHub,
// and an uploaded image goes to img/directory/; each push to main redeploys the site.
//
// Secret: GITHUB_TOKEN, a fine-grained token with Contents read and write on this repo only.
import { problem, serialize, verifyPassword } from "./editor-lib.js";

const REPO = "https://api.github.com/repos/antunderwood/allhs-bbu/contents/";
const SESSION_HOURS = 8;
const json = (body, status = 200, headers = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
const cookie = (token, age) => `session=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
const tokenOf = (req) => req.headers.get("Cookie")?.match(/(?:^|;\s*)session=([\w-]+)/)?.[1];

const github = (env, path, init = {}) => fetch(REPO + path + (init.method ? "" : "?ref=main"), {
  ...init,
  headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "allhs-bbu-editor" }
});
const decode = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), (c) => c.charCodeAt(0)));
function encode(text) {
  let s = "";
  for (const b of new TextEncoder().encode(text)) s += String.fromCharCode(b);
  return btoa(s);
}
async function current(env) {
  const res = await github(env, "data/directory.js");
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const f = await res.json();
  return { sha: f.sha, text: decode(f.content) };
}

async function login(req, env) {
  const { user = "", password = "" } = await req.json().catch(() => ({}));
  const name = String(user).trim().toLowerCase();
  // Slows guessing: 5 tries a minute per name (per Cloudflare location)
  if (!(await env.LOGIN_LIMIT.limit({ key: name })).success) return json({ error: "Too many attempts. Wait a minute and try again." }, 429);
  const rec = name && await env.EDITORS.get("user:" + name, "json");
  if (!rec || !(await verifyPassword(String(password), rec))) return json({ error: "That name and password don't match." }, 401);
  const token = crypto.randomUUID();
  await env.EDITORS.put("session:" + token, name, { expirationTtl: SESSION_HOURS * 3600 });
  return json({ user: name }, 200, { "Set-Cookie": cookie(token, SESSION_HOURS * 3600) });
}

async function save(req, env, user) {
  const { sha, entries, message } = await req.json();
  const { text } = await current(env);
  const why = problem(entries, text);
  if (why) return json({ error: why }, 400);
  // GitHub refuses the write if the file has changed since `sha`, the version the editor loaded
  const res = await github(env, "data/directory.js", {
    method: "PUT",
    body: JSON.stringify({
      branch: "main", sha, content: encode(serialize(entries, text)),
      message: `${String(message || "Edit the directory").slice(0, 120)}\n\nSaved by ${user} in the site editor.`
    })
  });
  if (res.status === 409) return json({ error: "Someone else has saved since you opened the editor. Reload to get their changes, then make yours again." }, 409);
  if (!res.ok) return json({ error: `GitHub write failed (${res.status})` }, 502);
  return json({ sha: (await res.json()).content.sha });
}

// Commits a JPEG (already resized by the editor) under a new name, so no published image is ever replaced
async function upload(req, env, user) {
  const { stem, data } = await req.json();
  if (!/^[a-z0-9-]{1,60}$/.test(stem || "")) return json({ error: "Bad image name." }, 400);
  const bytes = atob(data || "");
  if (!bytes.startsWith("\xFF\xD8\xFF") || bytes.length > 3e6) return json({ error: "Images must be JPEGs under 3 MB." }, 400);
  const path = `img/directory/${stem}-${Date.now().toString(36)}.jpg`;
  const res = await github(env, path, {
    method: "PUT",
    body: JSON.stringify({ branch: "main", content: data, message: `Add image ${path}\n\nUploaded by ${user} in the site editor.` })
  });
  if (!res.ok) return json({ error: `GitHub write failed (${res.status})` }, 502);
  return json({ src: path });
}

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);
    // Requests for files that aren't published (worker.js itself, a mistyped page) also land here
    if (!pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
    const route = req.method + " " + pathname;
    try {
      if (route === "POST /api/login") return await login(req, env);
      const token = tokenOf(req);
      const user = token && await env.EDITORS.get("session:" + token);
      if (route === "POST /api/logout") {
        if (user) await env.EDITORS.delete("session:" + token);
        return json({}, 200, { "Set-Cookie": cookie("", 0) });
      }
      if (!user) return json({ error: "Please log in." }, 401);
      if (route === "GET /api/data") return json({ user, ...(await current(env)) });
      if (route === "POST /api/save") return await save(req, env, user);
      if (route === "POST /api/upload") return await upload(req, env, user);
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};
