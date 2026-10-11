import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

/**
 * Written by scripts/optimize-images.mjs. Keys are paths under content/media,
 * for example "orrery-space/home.png".
 */
export type MediaEntry = {
  width: number;
  height: number;
  avif: string; // srcset
  webp: string; // srcset
  fallback: string;
};

const MANIFEST = path.join(process.cwd(), "src", "generated", "media.json");

const loadManifest = cache(async (): Promise<Record<string, MediaEntry>> => {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {
    return {};
  }
});

export async function getMedia(key: string): Promise<MediaEntry | undefined> {
  return (await loadManifest())[key.replace(/^\/+/, "")];
}
