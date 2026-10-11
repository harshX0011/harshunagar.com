import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDX } from "@/lib/mdx";
import { Plate } from "@/components/plate";
import { Screenshot } from "@/components/screenshot";
import { Missing } from "@/components/todo";
import { getOrbitNeighbours, getProject, getProjects } from "@/lib/projects";
import { kinds } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const { title, summary } = project.meta;
  return pageMeta({ title, description: summary, path: `/work/${slug}/`, image: `/work/${slug}/og.png`, type: "article" });
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const { meta, body } = project;
  const kind = kinds[meta.kind];
  const siblings = (await getProjects()).filter((p) => p.kind === meta.kind).length;
  const { prev, next } = await getOrbitNeighbours(slug);

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Role", value: meta.role ?? <Missing /> },
    { label: "Year", value: meta.year ?? <Missing /> },
    ...(meta.client ? [{ label: "Client", value: meta.client }] : []),
    ...(meta.team.length
      ? [
          {
            label: "Team",
            value: (
              <ul className="grid gap-0.5">
                {meta.team.map((t) => (
                  <li key={t.name}>
                    {t.name}
                    {t.role ? <span className="text-muted">, {t.role}</span> : null}
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    {
      label: "Stack",
      value: meta.stack.length ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-0.5">
          {meta.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : (
        <Missing />
      ),
    },
    {
      label: "Links",
      value: meta.links.length ? (
        <ul className="grid gap-0.5">
          {meta.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <Missing>None yet</Missing>
      ),
    },
  ];

  return (
    <article className="wrap pt-8 pb-24 sm:pt-12">
      <nav aria-label="Breadcrumb" className="label">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/work/" className="hover:text-ink">
              Work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/work/?kind=${meta.kind}`} className="hover:text-ink">
              {kind.label}
            </Link>
          </li>
        </ol>
      </nav>

      <header className="mt-8 max-w-[52rem]">
        <p className="label">{kind.orbit}</p>
        <h1 className="mt-3 text-title leading-[1.04]">{meta.title}</h1>
        <p className="mt-5 max-w-[46ch] text-lead text-muted">{meta.summary}</p>
      </header>

      <div className="mt-10 sm:mt-14">
        {meta.cover ? (
          <Screenshot src={meta.cover.src} alt={meta.cover.alt} priority sizes="(min-width: 1216px) 72rem, 100vw" />
        ) : (
          <Plate project={meta} siblings={siblings} />
        )}
      </div>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-16">
        <aside aria-label="Project facts" className="md:sticky md:top-8 md:self-start">
          <dl className="grid grid-cols-2 gap-4 border-t border-rule pt-4 md:grid-cols-1">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1">
                <dt className="label">{f.label}</dt>
                <dd className="text-[0.9375rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="prose min-w-0">
          <MDX source={body} />
        </div>
      </div>

      {next && prev ? (
        <nav aria-label={`More on the ${kind.label.toLowerCase()} orbit`} className="mt-24 border-t border-rule pt-6">
          <p className="label">More on this orbit</p>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {prev.slug !== next.slug ? (
              <li>
                <Link href={`/work/${prev.slug}/`} className="group block no-underline">
                  <span className="label">Previous</span>
                  <span className="mt-1 block text-section leading-tight text-ink group-hover:text-cobalt">{prev.title}</span>
                </Link>
              </li>
            ) : null}
            <li className="sm:text-right">
              <Link href={`/work/${next.slug}/`} className="group block no-underline">
                <span className="label">Next</span>
                <span className="mt-1 block text-section leading-tight text-ink group-hover:text-cobalt">{next.title}</span>
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </article>
  );
}
