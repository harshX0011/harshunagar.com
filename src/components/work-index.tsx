"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domMax } from "motion/react";
import * as m from "motion/react-m";
import { KINDS, type Kind } from "@/lib/site";

export type WorkItem = {
  slug: string;
  title: string;
  kind: Kind;
  kindLabel: string;
  orbit: string;
  summary: string;
  year?: string;
};

type Filter = Kind | "all";

// The filter lives in the URL (?kind=websites) so it can be linked to and survives reloads.
const KIND_EVENT = "work-kind-change";
function subscribeKind(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(KIND_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(KIND_EVENT, onChange);
  };
}
function readKind(): Filter {
  const k = new URLSearchParams(window.location.search).get("kind");
  return (KINDS as readonly string[]).includes(k ?? "") ? (k as Kind) : "all";
}
const serverKind = (): Filter => "all";

export function WorkIndex({
  items,
  filters,
  plates,
}: {
  items: WorkItem[];
  filters: { key: Kind; label: string }[];
  plates: Record<string, ReactNode>;
}) {
  const filter = useSyncExternalStore(subscribeKind, readKind, serverKind);

  function choose(next: Filter) {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("kind");
    else url.searchParams.set("kind", next);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(KIND_EVENT));
  }

  const shown = items.filter((i) => filter === "all" || i.kind === filter);
  const options: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: items.length },
    ...filters.map((f) => ({ ...f, count: items.filter((i) => i.kind === f.key).length })),
  ];

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 38 }}>
        <div role="group" aria-label="Filter work by kind" className="flex flex-wrap gap-2">
          {options.map((o) => {
            const on = filter === o.key;
            return (
              <button
                key={o.key}
                type="button"
                aria-pressed={on}
                onClick={() => choose(o.key)}
                className={`relative isolate rounded-full border px-4 py-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors ${
                  on ? "border-ink text-bg" : "border-rule text-ink hover:border-ink"
                }`}
              >
                {on ? (
                  <m.span layoutId="work-filter-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" aria-hidden="true" />
                ) : null}
                <span className="relative">
                  {o.label} <span className={on ? "opacity-70" : "text-muted"}>{o.count}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
        </p>

        <ul className="mt-10 border-t border-rule">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((item) => (
              <m.li
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-rule py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8 sm:py-6"
              >
                <div className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                  {plates[item.slug]}
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="label">
                    {item.orbit} · {item.kindLabel}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                  <h2 className="mt-1.5 text-[1.25rem] leading-tight sm:mt-2 sm:text-[1.625rem]">
                    <Link
                      href={`/work/${item.slug}/`}
                      className="text-ink no-underline transition-colors group-hover:text-cobalt after:absolute after:inset-0 after:content-['']"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-1.5 max-w-[56ch] text-[0.9375rem] text-muted sm:mt-2 sm:text-base">{item.summary}</p>
                </div>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </MotionConfig>
    </LazyMotion>
  );
}
