// Shared by worker.js (the site editor's API), scripts/add-editor.js and scripts/check-editor.js:
// editor password hashing, and writing the DIRECTORY array of data/directory.js back out as source.

// --- Passwords: KV holds user:<name> -> {salt, iterations, hash}, PBKDF2-SHA256 ---
// ponytail: 20000 rounds (about 2 ms) fits the free plan's 10 ms CPU per request; 100000 (the Workers maximum)
// takes about 11 ms. Raise it on a paid plan: the count is stored per user, so existing logins keep working.
const ITERATIONS = 20000;
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return b64(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: b64(salt), iterations: ITERATIONS, hash: await pbkdf2(password, salt, ITERATIONS) };
}
export async function verifyPassword(password, rec) {
  const salt = Uint8Array.from(atob(rec.salt), (c) => c.charCodeAt(0));
  return (await pbkdf2(password, salt, rec.iterations)) === rec.hash;
}

// --- The directory: everything above DIRECTORY is kept as written; the entries are regenerated ---
export const START = "const DIRECTORY = [";
const headOf = (old) => old.slice(0, old.indexOf("\n" + START) + 1); // at a line start, not in a comment
const IMG = "img/directory/";
const ADVERT = "Advert from a St Lawrence Church magazine";
const str = JSON.stringify;
const img = (p) => p.startsWith(IMG) ? `IMG + ${str(p.slice(IMG.length))}` : str(p);
// Photos and extras go back to the file's pair() and advert() shorthands where they fit
function photos(p) {
  const k = p.length === 2 && p[0].startsWith(IMG) && p[0].endsWith("-then.jpg") && p[0].slice(IMG.length, -9);
  return k && p[1] === IMG + k + "-now.jpg" ? `pair(${str(k)})` : `[${p.map(img).join(", ")}]`;
}
function extra([src, cap]) {
  if (!src.startsWith(IMG) || !src.endsWith(".jpg")) return `[${str(src)}, ${str(cap)}]`;
  const k = str(src.slice(IMG.length, -4));
  return cap === ADVERT ? `advert(${k})` : `advert(${k}, ${str(cap)})`;
}
function entry(e) {
  const f = [`group: ${str(e.group)}`, `no: ${str(e.no || "")}`];
  if (e.pin) f.push(`pin: ${str(e.pin)}`);
  f.push(`name: ${str(e.name)}`);
  if (e.featured) f.push("featured: true");
  if (e.summary) f.push(`summary: ${str(e.summary)}`);
  if (e.description) f.push(`description: ${str(e.description)}`);
  if (e.photos?.length) f.push(`photos: ${photos(e.photos)}`);
  if (e.extras?.length) f.push(`extras: [${e.extras.map(extra).join(", ")}]`);
  if (e.osm) f.push(`osm: ${str(e.osm)}`);
  if (e.lat != null) f.push(`lat: ${e.lat.toFixed(6)}`, `lng: ${e.lng.toFixed(6)}`);
  const lines = e.lines.length ? `[\n${e.lines.map((l) => "    " + str(l)).join(",\n")}]` : "[]";
  return `  { ${f.join(", ")}, lines: ${lines} }`;
}

// Why a list of entries can't be saved, or "" if it can. Text goes into the page as HTML,
// so <, > and straight double quotes are refused (the directory uses curly quotes anyway).
export function problem(entries, old) {
  if (!Array.isArray(entries) || !entries.length) return "No entries were sent.";
  const head = headOf(old);
  for (const e of entries) {
    const what = `${e?.no || ""} ${e?.name || "(no name)"}`.trim();
    if (typeof e?.name !== "string" || !e.name.trim()) return "Every entry needs a name.";
    if (!head.includes(`${str(e.group)}: {`)) return `${what}: unknown section.`;
    if (!Array.isArray(e.lines) || e.lines.some((l) => typeof l !== "string")) return `${what}: bad history lines.`;
    if ((e.lat == null) !== (e.lng == null) || (e.lat != null && !(Number.isFinite(e.lat) && Number.isFinite(e.lng)))) return `${what}: bad map position.`;
    if (/[<>]|\\"/.test(str(e))) return `${what}: use curly quotes “ ” rather than ", and no < or >.`;
  }
  if (entries.filter((e) => e.featured).length > 10) return "At most 10 entries can be featured on the front page.";
  return "";
}

// The new file: old's header, then the entries, keeping each section's divider comment
export function serialize(entries, old) {
  const notes = Object.fromEntries([...old.matchAll(/^ {2}(\/\/ ---- .* ----)\n {2}\{ group: "([^"]+)"/gm)].map((m) => [m[2], m[1]]));
  const parts = entries.map((e, i) => {
    const prev = entries[i - 1]?.group;
    const divider = e.group === prev ? "" : (i ? "\n" : "") + "  " + (notes[e.group] || `// ---- ${e.group} ----`) + "\n";
    return divider + entry(e);
  });
  return headOf(old) + START + "\n" + parts.join(",\n") + "\n];\n";
}
