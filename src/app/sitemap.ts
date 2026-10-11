import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const pages = ["/", "/work/", "/about/", "/contact/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
