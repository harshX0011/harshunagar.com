import type { Metadata } from "next";
import { ContactList } from "@/components/contact-list";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: `How to reach ${site.name}: email, WhatsApp, LinkedIn, GitHub and Instagram.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <div className="wrap pt-10 pb-24 sm:pt-16">
      <header className="max-w-[46rem]">
        <p className="label">Contact</p>
        <h1 className="mt-3 text-title leading-[1.04]">Get in touch</h1>
        <p className="mt-4 max-w-[44ch] text-lead text-muted">
          For a website, a brand&rsquo;s social media, or something you want built.
        </p>
      </header>
      <ContactList size="lg" className="mt-12 max-w-[48rem]" />
      <p className="label mt-8">
        {site.location} · {site.coordinates}
      </p>
    </div>
  );
}
