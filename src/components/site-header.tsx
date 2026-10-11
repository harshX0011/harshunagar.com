import Link from "next/link";
import { site } from "@/lib/site";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="wrap flex h-16 items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-sun ring-1 ring-ink/70" />
        <span className="caps text-[0.8125rem] font-normal">
          {site.name.split(" ")[0]}
          <span className="max-[439px]:sr-only"> {site.name.split(" ").slice(1).join(" ")}</span>
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <SiteNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
