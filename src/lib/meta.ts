import type { Metadata } from "next";
import { site } from "./site";

/**
 * Per-page metadata. Next replaces (not merges) the layout's openGraph block when a
 * page sets one, so every page gets the full set here.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/og.png",
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_IN",
      title: `${title} · ${site.name}`,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description, images: [image] },
  };
}
