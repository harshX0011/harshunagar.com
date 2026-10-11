// Resizes everything in content/media into AVIF and WebP at a few widths,
// writes the files to public/media and a manifest to src/generated/media.json.
// Runs before `dev` and `build`. Skips images that are already up to date.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "content", "media");
const OUT = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "generated", "media.json");
const WIDTHS = [480, 960, 1600];
const EXT = /\.(png|jpe?g|webp|avif)$/i;

async function walk(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat().filter((f) => EXT.test(f));
}

async function isFresh(input, output) {
  try {
    const [a, b] = await Promise.all([fs.stat(input), fs.stat(output)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

const files = await walk(SRC);
const manifest = {};
const produced = new Set();

for (const file of files) {
  const key = path.relative(SRC, file).split(path.sep).join("/");
  const base = key.replace(EXT, "");
  const meta = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w < meta.width).concat(meta.width > 1600 ? [] : [meta.width]);
  const height = (w) => Math.round((meta.height / meta.width) * w);
  const variants = { avif: [], webp: [] };

  for (const w of widths) {
    for (const format of ["avif", "webp"]) {
      const rel = `${base}-${w}.${format}`;
      const target = path.join(OUT, rel);
      if (!(await isFresh(file, target))) {
        await fs.mkdir(path.dirname(target), { recursive: true });
        const img = sharp(file).resize({ width: w, withoutEnlargement: true });
        await (format === "avif" ? img.avif({ quality: 55, effort: 4 }) : img.webp({ quality: 78 })).toFile(target);
      }
      produced.add(target);
      variants[format].push(`/media/${rel} ${w}w`);
    }
  }

  const largest = widths[widths.length - 1];
  manifest[key] = {
    width: largest,
    height: height(largest),
    avif: variants.avif.join(", "),
    webp: variants.webp.join(", "),
    fallback: `/media/${base}-${largest}.webp`,
  };
}

// Remove outputs whose source image was deleted or renamed, so they never ship.
for (const stale of (await walk(OUT)).filter((f) => !produced.has(f))) await fs.rm(stale);

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${files.length} source file(s) in content/media`);
