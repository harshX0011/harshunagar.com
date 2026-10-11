import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";
import { KINDS, type Kind } from "./site";

const WORK_DIR = path.join(process.cwd(), "content", "work");

const frontmatter = z.object({
  title: z.string(),
  kind: z.enum(KINDS),
  summary: z.string(),
  // Position on its orbit, inner first. Also the order in lists.
  order: z.number().int(),
  featured: z.boolean().default(false),
  year: z.union([z.number().int(), z.string()]).optional(),
  role: z.string().optional(),
  client: z.string().optional(),
  stack: z.array(z.string()).default([]),
  team: z.array(z.object({ name: z.string(), role: z.string().optional() })).default([]),
  links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  cover: z.object({ src: z.string(), alt: z.string() }).optional(),
});

export type ProjectMeta = z.infer<typeof frontmatter> & { slug: string };
export type Project = { meta: ProjectMeta; body: string };

const loadAll = cache(async (): Promise<Project[]> => {
  const files = (await fs.readdir(WORK_DIR)).filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(WORK_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = frontmatter.safeParse(data);
      if (!parsed.success) {
        throw new Error(`content/work/${file}: ${z.prettifyError(parsed.error)}`);
      }
      return { meta: { ...parsed.data, slug: file.replace(/\.mdx$/, "") }, body: content };
    }),
  );
  return projects.sort(
    (a, b) => KINDS.indexOf(a.meta.kind) - KINDS.indexOf(b.meta.kind) || a.meta.order - b.meta.order,
  );
});

export async function getProjects(): Promise<ProjectMeta[]> {
  return (await loadAll()).map((p) => p.meta);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await loadAll()).find((p) => p.meta.slug === slug);
}

export async function getProjectsByKind(): Promise<Record<Kind, ProjectMeta[]>> {
  const all = await getProjects();
  return {
    software: all.filter((p) => p.kind === "software"),
    websites: all.filter((p) => p.kind === "websites"),
    brand: all.filter((p) => p.kind === "brand"),
  };
}

/** Neighbours on the same orbit, wrapping around, for "next on this orbit" links. */
export async function getOrbitNeighbours(slug: string) {
  const all = await getProjects();
  const me = all.find((p) => p.slug === slug);
  if (!me) return { prev: undefined, next: undefined };
  const ring = all.filter((p) => p.kind === me.kind);
  if (ring.length < 2) return { prev: undefined, next: undefined };
  const i = ring.findIndex((p) => p.slug === slug);
  return { prev: ring[(i - 1 + ring.length) % ring.length], next: ring[(i + 1) % ring.length] };
}
