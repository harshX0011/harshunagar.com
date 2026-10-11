import { contactLinks } from "@/lib/site";
import { Missing } from "./todo";

export function ContactList({ size = "md", className = "" }: { size?: "md" | "lg"; className?: string }) {
  const links = contactLinks();
  return (
    <dl className={`grid border-t border-rule ${className}`}>
      {links.map((l) => (
        <div
          key={l.key}
          className={`grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-rule ${size === "lg" ? "py-5" : "py-3.5"}`}
        >
          <dt className="label">{l.label}</dt>
          <dd className={`min-w-0 break-words ${size === "lg" ? "text-lead" : ""}`}>
            {l.href ? (
              <a
                href={l.href}
                className="link"
                {...(l.key === "email" ? {} : { target: "_blank", rel: "me noopener noreferrer" })}
              >
                {l.value}
              </a>
            ) : (
              <Missing>To add</Missing>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
