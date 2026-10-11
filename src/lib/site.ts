/**
 * Everything about Harsh that is not a project lives here.
 * Edit this file to change the hero line, contact details or the orbit sentences.
 * `null` means "not given yet": the site shows a visible placeholder instead of guessing.
 */

export const site = {
  name: "Harsh Unagar",
  url: "https://harshunagar.com",
  // DRAFT built only from facts in the brief. Harsh to confirm or rewrite.
  line: "Computer engineering student at SCET, Surat. I write my own software, build Shopify stores for clients through my agency, and run social media for jewellery brands.",
  description:
    "Harsh Unagar is a computer engineering student in Surat who builds his own software, client websites through his agency Dicock, and social media for D2C and jewellery brands.",
  location: "Surat, Gujarat",
  coordinates: "21.17° N, 72.83° E",
  contact: {
    email: null as string | null,
    // Digits only with country code, e.g. "919876543210". Shown as a wa.me link.
    whatsapp: null as string | null,
    linkedin: null as string | null,
    // Confirm: this is the GitHub account named Harsh Unagar.
    github: "https://github.com/harshX0011" as string | null,
    instagram: null as string | null,
  },
} as const;

/**
 * Preview builds (a temporary Hostinger domain) set SITE_PREVIEW=1 at build time.
 * They are kept out of search results; the real build at harshunagar.com is not affected.
 */
export const isPreview = process.env.SITE_PREVIEW === "1";

export const KINDS = ["software", "websites", "brand"] as const;
export type Kind = (typeof KINDS)[number];

/** The three orbits, inner to outer. Sentences are DRAFTS from the brief. */
export const kinds: Record<Kind, { label: string; orbit: string; sentence: string }> = {
  software: {
    label: "Software",
    orbit: "Orbit I",
    sentence: "Tools I build for myself, from data extractors to Orrery Space.",
  },
  websites: {
    label: "Websites",
    orbit: "Orbit II",
    sentence: "Client sites, mostly Shopify stores, built through my agency Dicock.",
  },
  brand: {
    label: "Brand",
    orbit: "Orbit III",
    sentence: "Social media for D2C and jewellery brands.",
  },
};

export const nav = [
  { href: "/work/", label: "Work" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

export type ContactKey = keyof typeof site.contact;

export function contactLinks() {
  const c = site.contact;
  return [
    { key: "email", label: "Email", value: c.email, href: c.email ? `mailto:${c.email}` : null },
    {
      key: "whatsapp",
      label: "WhatsApp",
      value: c.whatsapp ? `+${c.whatsapp}` : null,
      href: c.whatsapp ? `https://wa.me/${c.whatsapp}` : null,
    },
    { key: "linkedin", label: "LinkedIn", value: c.linkedin && shortUrl(c.linkedin), href: c.linkedin },
    { key: "github", label: "GitHub", value: c.github && shortUrl(c.github), href: c.github },
    { key: "instagram", label: "Instagram", value: c.instagram && shortUrl(c.instagram), href: c.instagram },
  ] as const;
}

function shortUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
