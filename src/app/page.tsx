import Link from "next/link";
import { Orrery, type OrreryGroup } from "@/components/orrery/orrery";
import { Plate } from "@/components/plate";
import { RevealTitle } from "@/components/reveal-title";
import { ContactList } from "@/components/contact-list";
import { getProjects, getProjectsByKind } from "@/lib/projects";
import { KINDS, kinds, site } from "@/lib/site";

export default async function Home() {
  const byKind = await getProjectsByKind();
  const featured = (await getProjects()).filter((p) => p.featured);

  const groups: OrreryGroup[] = KINDS.map((kind) => ({
    kind,
    ...kinds[kind],
    items: byKind[kind].map((p) => ({ slug: p.slug, title: p.title })),
  }));

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    description: site.description,
    homeLocation: { "@type": "Place", name: site.location },
    sameAs: Object.values(site.contact).filter((v): v is string => !!v && v.startsWith("http")),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />

      <Orrery groups={groups}>
        <p className="label">
          {site.location} · {site.coordinates}
        </p>
        <h1 className="caps mt-3 text-hero leading-[1.05]">{site.name}</h1>
        <p className="mt-4 max-w-[44ch] text-lead leading-snug">{site.line}</p>
      </Orrery>

      <section className="wrap py-20 sm:py-28" aria-labelledby="featured-title">
        <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-4">
          <h2 id="featured-title" className="label">
            Selected work
          </h2>
          <Link href="/work/" className="link text-[0.9375rem]">
            All work
          </Link>
        </div>
        <ul className="mt-12 grid gap-20 sm:gap-28">
          {featured.map((p) => (
            <li key={p.slug} className="group relative grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
              <Plate
                project={p}
                siblings={byKind[p.kind].length}
                className="transition-transform duration-500 ease-out group-hover:-translate-y-1 md:col-span-7"
              />
              <div className="md:col-span-5">
                <p className="label">
                  {kinds[p.kind].orbit} · {kinds[p.kind].label}
                </p>
                <h3 className="mt-3 text-title leading-[1.04]">
                  <RevealTitle>{p.title}</RevealTitle>
                </h3>
                <p className="mt-4 max-w-[40ch] text-muted">{p.summary}</p>
                <Link
                  href={`/work/${p.slug}/`}
                  className="link mt-6 inline-block after:absolute after:inset-0 after:content-['']"
                >
                  Read the case study<span className="sr-only">: {p.title}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-rule" aria-labelledby="contact-title">
        <div className="wrap grid gap-10 py-20 sm:py-24 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 id="contact-title" className="label">
              Contact
            </h2>
            <p className="mt-4 max-w-[22ch] text-section leading-tight">
              Working on a store, a brand or a tool? Get in touch.
            </p>
          </div>
          <ContactList className="md:col-span-7" />
        </div>
      </section>
    </>
  );
}
