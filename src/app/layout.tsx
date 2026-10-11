import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { isPreview, site } from "@/lib/site";
import { ThemeScript } from "@/components/theme-script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

// Jost: a free revival of Futura. Martian Mono for labels and data. Both OFL, self-hosted.
const jost = localFont({
  src: "../fonts/jost-latin-wght.woff2",
  variable: "--font-jost",
  weight: "300 700",
  display: "swap",
});

const martian = localFont({
  src: "../fonts/martian-mono-latin-wght.woff2",
  variable: "--font-martian",
  weight: "100 800",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: software, client websites and brand work`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  alternates: { canonical: "/" },
  ...(isPreview ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${jost.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-svh flex-col antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded bg-ink px-3 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <SmoothScroll />
      </body>
    </html>
  );
}
