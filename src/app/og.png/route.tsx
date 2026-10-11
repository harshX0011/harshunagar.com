import { getProjectsByKind } from "@/lib/projects";
import { renderOg } from "@/lib/og";
import { site } from "@/lib/site";

// Written to out/og.png at build time. A plain .png file works on any static host.
export const dynamic = "force-static";

export async function GET() {
  const byKind = await getProjectsByKind();
  return renderOg({
    eyebrow: `${site.location} · ${site.coordinates}`,
    title: site.name,
    summary: "Software, client websites and brand work.",
    counts: [byKind.software.length, byKind.websites.length, byKind.brand.length],
  });
}
