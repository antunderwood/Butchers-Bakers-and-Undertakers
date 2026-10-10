// Self-check for editor-lib.js: node scripts/check-editor.js
// Re-serialising data/directory.js must keep every entry as it was, change nothing on a second
// pass, and a password must verify against its own hash only.
import { readFileSync } from "node:fs";
import { deepStrictEqual, strictEqual, ok } from "node:assert";
import { serialize, problem, hashPassword, verifyPassword } from "../editor-lib.js";

const load = (text) => new Function(text + "\nreturn DIRECTORY;")();
const text = readFileSync(new URL("../data/directory.js", import.meta.url), "utf8");
const entries = load(text);
const out = serialize(entries, text);
deepStrictEqual(load(out), entries);
strictEqual(serialize(load(out), out), out);
strictEqual(problem(entries, text), "");
ok(problem([{ ...entries[0], name: 'Say "hi"' }], text));
ok(problem([{ ...entries[0], group: "nowhere" }], text));

const rec = await hashPassword("correct horse");
ok(await verifyPassword("correct horse", rec));
ok(!(await verifyPassword("wrong horse", rec)));
console.log("editor checks passed");
