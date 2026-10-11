import { contactLinks, site } from "@/lib/site";

export function SiteFooter() {
  const links = contactLinks().filter((l) => l.href);
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="wrap grid gap-6 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <p className="caps text-[0.8125rem]">{site.name}</p>
          <p className="label">
            {site.location} · {site.coordinates}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
          {links.map((l) => (
            <li key={l.key}>
              <a href={l.href!} className="link" {...(l.key === "email" ? {} : { rel: "me noopener", target: "_blank" })}>
                {l.label}
              </a>
            </li>
          ))}
          <li className="label self-center">© {new Date().getFullYear()}</li>
        </ul>
      </div>
    </footer>
  );
}
