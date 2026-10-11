// Lists every placeholder that still needs real content: <Todo> blocks in MDX,
// DRAFT notes and null contact fields in src/lib/site.ts.
// `npm run todos` prints them; add `--strict` to fail (useful right before launch).
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const strict = process.argv.includes("--strict");
const found = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const out = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return out.flat();
}

for (const file of (await walk(path.join(ROOT, "content"))).filter((f) => f.endsWith(".mdx"))) {
  const text = await fs.readFile(file, "utf8");
  const count = (text.match(/<Todo[\s>]/g) || []).length;
  if (count) found.push(`${path.relative(ROOT, file)}: ${count} <Todo> block(s)`);
  if (file.includes(`${path.sep}work${path.sep}`)) {
    const front = text.split(/^---$/m)[1] ?? "";
    const missing = ["role", "year", "stack"].filter((k) => !new RegExp(`^${k}:`, "m").test(front));
    if (missing.length) found.push(`${path.relative(ROOT, file)}: no ${missing.join(", ")}`);
  }
}

const site = await fs.readFile(path.join(ROOT, "src", "lib", "site.ts"), "utf8");
for (const m of site.matchAll(/^\s*(\w+): null as string \| null/gm)) found.push(`src/lib/site.ts: contact.${m[1]} is not set`);
const drafts = (site.match(/DRAFT/g) || []).length;
if (drafts) found.push(`src/lib/site.ts: ${drafts} DRAFT note(s) to confirm`);

if (!found.length) {
  console.log("No placeholders left.");
} else {
  console.log(`${found.length} place(s) still need real content:\n`);
  for (const line of found) console.log(`  ${line}`);
  if (strict) process.exit(1);
}
