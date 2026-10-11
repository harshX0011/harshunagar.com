"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-4 sm:gap-6">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative py-2 text-[0.9375rem] text-ink no-underline transition-colors hover:text-cobalt aria-[current=page]:text-cobalt"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
