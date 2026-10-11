import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { MDX } from "@/lib/mdx";
import { Todo } from "@/components/todo";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `About ${site.name}, a computer engineering student in Surat.`,
  path: "/about/",
});

export default async function AboutPage() {
  const source = await fs.readFile(path.join(process.cwd(), "content", "about.mdx"), "utf8");

  return (
    <div className="wrap pt-10 pb-24 sm:pt-16">
      <header className="max-w-[46rem]">
        <p className="label">About</p>
        <h1 className="mt-3 text-title leading-[1.04]">{site.name}</h1>
      </header>

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
        <div className="prose min-w-0">
          <MDX source={source} />
        </div>
        <aside aria-label="Quick facts" className="grid content-start gap-6">
          <Todo label="Photo">A good photo of you, roughly 4:5, saved in content/media/about/.</Todo>
          <dl className="grid gap-4 border-t border-rule pt-4">
            <div className="grid gap-1">
              <dt className="label">Based in</dt>
              <dd>{site.location}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="label">Studying</dt>
              <dd>Computer Engineering, SCET</dd>
            </div>
            <div className="grid gap-1">
              <dt className="label">Runs</dt>
              <dd>
                <Link href="/work/dicock/" className="link">
                  Dicock
                </Link>
                , a digital agency
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
