import { getProject, getProjects, getProjectsByKind } from "@/lib/projects";
import { renderOg } from "@/lib/og";
import { KINDS, kinds } from "@/lib/site";

// Written to out/work/<slug>/og.png at build time, one share image per project.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: RouteContext<"/work/[slug]/og.png">) {
  const { slug } = await params;
  const byKind = await getProjectsByKind();
  const counts = [byKind.software.length, byKind.websites.length, byKind.brand.length];
  const project = await getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });
  const { meta } = project;
  const ring = KINDS.indexOf(meta.kind);
  return renderOg({
    eyebrow: `${kinds[meta.kind].orbit} · ${kinds[meta.kind].label}`,
    title: meta.title,
    summary: meta.summary,
    ring,
    body: { k: meta.order - 1, n: counts[ring] },
    counts,
  });
}
