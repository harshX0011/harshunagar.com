import type { Metadata } from "next";
import archive from "../../../content/archive.json";
import { Plate } from "@/components/plate";
import { Missing } from "@/components/todo";
import { WorkIndex, type WorkItem } from "@/components/work-index";
import { getProjects } from "@/lib/projects";
import { KINDS, kinds } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Work",
  description: "Software I build, client websites through my agency Dicock, and social media for jewellery brands.",
  path: "/work/",
});

export default async function WorkPage() {
  const projects = await getProjects();
  const counts = Object.fromEntries(KINDS.map((k) => [k, projects.filter((p) => p.kind === k).length]));

  const items: WorkItem[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    kind: p.kind,
    kindLabel: kinds[p.kind].label,
    orbit: kinds[p.kind].orbit,
    summary: p.summary,
    year: p.year ? String(p.year) : undefined,
  }));

  const plates = Object.fromEntries(
    projects.map((p) => [p.slug, <Plate key={p.slug} project={p} siblings={counts[p.kind]} showNote={false} compact />]),
  );

  return (
    <div className="wrap pt-10 pb-24 sm:pt-16">
      <header className="max-w-[46rem]">
        <p className="label">Index</p>
        <h1 className="mt-3 text-title leading-[1.04]">Work</h1>
        <p className="mt-4 text-lead text-muted">
          Three orbits: software I build, websites for clients, and social media for brands.
        </p>
      </header>

      <div className="mt-12">
        <WorkIndex items={items} filters={KINDS.map((k) => ({ key: k, label: kinds[k].label }))} plates={plates} />
      </div>

      <section className="mt-24" aria-labelledby="archive-title">
        <h2 id="archive-title" className="label">
          Smaller builds
        </h2>
        <p className="mt-3 max-w-[52ch] text-muted">Learning builds and experiments.</p>
        <ul className="mt-6 border-t border-rule">
          {archive.map((a) => (
            <li
              key={a.title}
              className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-baseline gap-4 border-b border-rule py-3.5"
            >
              <span>{a.title}</span>
              <span className="text-muted">{a.note ?? <Missing>One line on what you built</Missing>}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
