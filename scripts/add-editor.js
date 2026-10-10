// Adds an editor login, or resets one, with a new random password to pass on to them:
//   node scripts/add-editor.js <name>
// Remove one with: npx wrangler kv key delete --binding EDITORS --remote user:<name>
// (a removed editor's current session lasts up to 8 hours).
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../editor-lib.js";

const name = process.argv[2]?.trim().toLowerCase();
if (!name || !/^[a-z0-9._-]+$/.test(name)) {
  console.error("Usage: node scripts/add-editor.js <name> (letters, digits, . _ -)");
  process.exit(1);
}
const password = randomBytes(12).toString("base64url");
const rec = JSON.stringify(await hashPassword(password));
execFileSync("npx", ["wrangler", "kv", "key", "put", "--binding", "EDITORS", "--remote", "user:" + name, rec], { stdio: "inherit" });
console.log(`\nEditor "${name}" can log in at https://allhs-bbu.flying-ant.uk/editor.html with password: ${password}`);
