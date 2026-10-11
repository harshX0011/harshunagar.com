# harshunagar.com

Harsh Unagar's portfolio. Next.js (App Router), TypeScript, Tailwind, MDX, exported as a static site.

The design is direction A, "Orrery", from DIRECTIONS.md. The home page is a drawn orrery: Harsh at the centre, with software, websites and brand work as three orbits. Scrolling uncoils the orbits into the work index.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run preview    # serve out/ on http://localhost:3000
npm run todos      # list every placeholder that still needs real content
```

## Change the content

You never need to touch components to change content.

| What | Where |
|---|---|
| Hero line, orbit sentences, contact details | `src/lib/site.ts` |
| A project (case study) | `content/work/<slug>.mdx` |
| About page text | `content/about.mdx` |
| Smaller builds list on the Work page | `content/archive.json` |
| Screenshots and posts | `content/media/<slug>/` (see `content/media/README.md`) |

### Add a project

Create `content/work/my-project.mdx`:

```mdx
---
title: "My project"
kind: websites            # software | websites | brand
summary: "One plain sentence about it."
order: 4                  # position on its orbit, inner first
featured: false           # true shows it under Selected work on the home page
role: "Design and development"
year: 2026
client: "Client name"
stack: ["Shopify", "Liquid"]
team:
  - name: "Someone"
    role: "Design"
links:
  - label: "example.com"
    href: https://example.com
cover:                    # optional; otherwise an orrery plate is drawn
  src: "my-project/home.png"
  alt: "Home page on desktop"
---

## The problem

Plain sentences.

<Screenshot src="my-project/home.png" alt="Home page on desktop" />
```

The project appears on the orrery, the Work page and the sitemap, and gets its own share image, all automatically. Frontmatter is validated when the site builds, so a typo fails the build with a clear message instead of shipping a broken page.

MDX components available in project files:

- `<Todo>` marks a gap
- `<Screenshot src alt caption />` shows an image
- `<Gallery columns={3}>` lays out a group of images

## Deploy

`npm run build` writes a complete static site to `out/`.

- **Hostinger:** upload the contents of `out/` into `public_html`, using File Manager or FTP. URLs end in `/`, so no rewrite rules are needed. The included `.htaccess` serves the custom 404 page.
- **Vercel:** import the repository. It detects Next.js and serves the static export as-is.

Before launch, run `npm run todos -- --strict`. It exits with an error while any placeholder is left.

## How it is built

- **Orrery:** `src/components/orrery/`.
  - The server renders a static drawing, so the page works without JavaScript.
  - GSAP ScrollTrigger then scrubs the uncoil once the page is interactive.
  - `geometry.ts` holds the shared maths. Inner orbits turn faster, following Kepler's third law.
- **Reduced motion and short screens:** CSS decides the layout before first paint. These visitors get the static orrery and a plain index, with no scroll-jacking.
- **Motion:** Lenis smooth scroll loads when the browser is idle. GSAP and SplitText load only on the home page, only when needed. Motion (Framer Motion) animates the Work page filter.
- **Images:** `scripts/optimize-images.mjs` turns `content/media` into AVIF and WebP at three widths before every build. Nothing is resized at runtime.
- **Share images:** `src/app/og.png` and `src/app/work/[slug]/og.png` render real `.png` files at build time, so they work on any static host.
- **Theme:** an inline script sets `data-theme` before paint, so there is no flash. Colour tokens live in `src/app/globals.css`.
- **Fonts:** self-hosted, both under the SIL Open Font License (licence files sit next to the fonts).
  - Jost, a free revival of Futura, the face on the Apollo 11 plaque
  - Martian Mono

## Checks

```bash
npm run lint
npm run typecheck
```

Lighthouse (mobile) on the first version scored 99 for performance and 100 for accessibility, best practices and SEO, on every page type.

## References

Research behind the design is in REFERENCES.md. No code was copied from any reference.
