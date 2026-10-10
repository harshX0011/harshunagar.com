# References

Research for harshunagar.com, done before any code. For each source: what is worth borrowing, why, and where it lives in the source. Patterns only. No design from any of these gets copied.

## How this was researched

- **Read from source:** the four GitHub repos in the brief, plus 17 portfolios from the developer-portfolios list whose source is public. Nothing was built or run.
- **Not browsed live:** this build environment cannot open most websites, including godly.website, awwwards.com and your own sites.
- **Awwwards:** covered through its own listings and Codrops case studies, found by web search.
- **Godly:** did not show up in search results at all, so nothing here comes from it. Worth a manual browse on your side.

---

## 1. bchiang7/v4 (Brittany Chiang, Gatsby, MIT)

**Layout, corrected.** The brief describes v4 as a sticky left column. It is actually one centred column with fixed social and email rails on the sides, and those rails hide under 768px. The split layout and the spotlight hover belong to her newer site, which is not in this repo.

**Borrow: motion only when the visitor allows it.**
- Every CSS transition sits inside `@media (prefers-reduced-motion: no-preference)`.
- The reduced-motion hook assumes "reduced" during server render, and scroll reveal only registers when motion is allowed (`src/hooks/usePrefersReducedMotion.js`, `src/components/sections/jobs.js`).
- **Why:** content is complete in the static HTML and animation is layered on top. This maps directly to `gsap.matchMedia()` and Motion's `useReducedMotion`.

**Borrow: the ARIA tabs pattern, fixed.**
- It uses roving `tabIndex`, `aria-selected`, `aria-controls` and `aria-labelledby` (`src/components/sections/jobs.js`).
- It has two bugs to fix if we use it:
  - Clicking a tab does not update the focus index.
  - Only Up and Down arrows work, even though the tab list turns horizontal on phones.
- **Why:** this is a good fit for a Software / Websites / Brand switcher if the chosen direction needs one.

**Borrow: one tab stop per project card, plus a separate archive.**
- The title link stretches over the whole card through `::before`, and secondary links sit above it (`src/components/sections/projects.js`).
- `/archive` is one table of Year, Title, Made at, Built with and Link (`src/pages/archive.js`).
- **Why:** keyboard users get one stop per card, and the small learning builds (APIs, Hermes, Obsidian, local LLMs) can live in an archive without cluttering the featured work.

**Avoid:**
- **A slow first screen.** A 3.5 second logo loader runs, then the hero waits another second before rendering, which hurts LCP.
- **The h1.** It reads "Hi, my name is" and the name is only an h2.
- **The mobile menu.** It uses a positive `tabIndex`, keeps links focusable while `aria-hidden`, and has no `aria-expanded`.
- **The traits everyone copies:** "01." numbered headings, the navy and mint palette, the vertical email rail.

**Licence:** MIT. Her README asks forks to credit her and not to pass the design off as their own. Patterns need no credit.

---

## 2. brunosimon/folio-2025 (Bruno Simon, Three.js/WebGPU, MIT)

Awwwards Site of the Day and Developer Award, March 2026.

**Borrow: load in stages.**
- Four small intro files load first and are preloaded in `index.html`.
- Physics and the rest load afterwards through a dynamic `import()` (`sources/Game/Game.js`), and one cached loader serves every asset (`ResourcesLoader.js`).
- **Why:** this is the template for any 3D moment on our site. Show a static poster, preload only the hero asset, and import the heavy parts once the section is on screen.

**Borrow: one quality level that every subsystem listens to.**
- `Quality.js` publishes a level and fires a change event. On low, shadows, bloom, depth of field and pixel ratio all step down.
- **Change for us:** his detection is a user-agent regex. Ours should use `navigator.deviceMemory`, `hardwareConcurrency` and a measured frame-time average, with pixel ratio capped near 1.5 on low.
- **Why:** this is how a cheap Android phone gets a working page instead of a stutter.

**Borrow: projects as plain data feeding both views.**
- `sources/data/projects.js` is a plain array. Each entry credits who he worked with and any awards.
- **Why:** our MDX frontmatter should feed the HTML list and any visual layer (orrery, filter, lens) from one source. Credits keep team work like Space Apps honest.

**Avoid:**
- **Projects only exist inside the canvas.** There is no HTML list and no `<noscript>`, so screen readers and search engines see nothing.
- **No accessibility basics.** There is no reduced-motion handling, no visible focus style, and icon buttons have no labels.
- **No fallback.** The only WebGL fallback is a status message.

**Licence:** code is MIT, keep the notice if any code is reused. Models, textures and the overall look carry no licence, so treat them as all rights reserved.

---

## 3. once-ui-system/magic-portfolio (Next.js + MDX, CC BY-NC 4.0)

**Licence first:** CC BY-NC 4.0 forbids commercial use. Your site promotes a paid agency, so none of its code goes in. The patterns below get rebuilt from the Next.js docs.

**Borrow: MDX read at build time, one file per project.**
- `fs` plus gray-matter read the files, and the slug is the filename (`src/utils/utils.ts`).
- `generateStaticParams` lives in `src/app/work/[slug]/page.tsx`.
- An MDX component map turns headings into anchor links, makes images responsive with `sizes`, and marks external links (`src/components/mdx.tsx`).
- **Improve on it:**
  - Validate frontmatter with zod.
  - Set `dynamicParams = false`.
  - Add fields this site needs: `kind` (software / websites / brand), `role`, `client`, `stack`, `links`, `coverAlt`, `featured`, `team`.

**Borrow: one typed config drives routes, nav, sitemap and metadata.**
- A `routes` map feeds both the nav and `app/sitemap.ts`. Per-page title and description live in one content file (`src/resources/once-ui.config.ts`, `src/resources/content.tsx`).
- **Why:** adding a page or project means editing data, not components.

**Borrow: dark and light mode with no flash.**
- A small blocking script in `<head>` resolves "system", reads the saved choice and sets `data-theme` before first paint (`src/app/layout.tsx`).
- **Why:** this is required for static export, where no server can set the theme.

**Avoid:**
- **The prerendered HTML is a spinner.** A client-side route guard wraps every page.
- **Every case study ships on the list page.** Project cards are client components that receive the full MDX body.
- **The password protection is fake.** The cookie is a fixed string anyone can set.
- **OG images do not work with `output: 'export'`.** They come from runtime API routes, and one of them is an open proxy.
  - **Our plan:** `opengraph-image.tsx` files with `generateStaticParams` and a local TTF font. If the host serves those badly, a prebuild script (satori + resvg) writes `public/og/<slug>.png`.

---

## 4. emmabostian/developer-portfolios (17 sampled from source)

All 17 below were read from source and none was built or run. Two more were seen through write-ups only.

| Portfolio | Stack | Borrow | Why |
|---|---|---|---|
| Bekah Hawrot Weigel (bekahhw.github.io) | Jekyll | A design system drawn from her ten years teaching English: ruled-paper background, a margin line, margin notes on wide screens, and a "see another draft of this headline" button (`_sass/_looseleaf.scss`). | The metaphor comes from her life and is built as tokens, not as a hero gimmick. |
| Puja Sridhar (pujasridhar.github.io) | React/Vite | A terminal view with a one-click "Standard View" over the same data. Her career is written as a dated log (`src/utils/terminalContent.js`). | The gimmick has an exit, and the log makes a timeline readable. |
| Bruno Simon (folio-2025) | Three.js | Per-project credits ("with", "at", awards) and a menu that skips the game (`sources/data/projects.js`). | Honest credits plus an escape hatch. |
| Brittany Chiang (v4) | Gatsby | A separate archive table for many small builds (`src/pages/archive.js`). | Keeps the featured work short. |
| Aneeth Kumaar (akwastaken.github.io) | Static + Node build | A masonry gallery that reads each image's real proportions at build time. Project pages open with the problem (`js/build_gallery.js`). | Visual work shown uncropped, next to software. |
| Remco Stoeten (remcostoeten.nl) | Next.js | "PeekFrame": a browser window of the live site lifts off the card on hover (`src/components/showcase/peek-frame.tsx`). | Shows client sites as real, live things. |
| Hasan Aydoğdu (resume-json-css) | Vanilla JS | One `resume.json` rendered through six swappable stylesheets. | Proves visual range while the content stays fixed. A possible pitch for brand work. |
| Gabriele Corti (borntofrappe.github.io) | SvelteKit | One signature shape reused on headings, quotes and a hidden 404 (`src/lib/styles/style.css`). | A small, consistent system reads as authored. |
| Ghom Krosmonaute (ghomkrosmonaute.github.io) | React | Public packages and starting prices from a data file (`src/data/tarifs.json`). | Lets agency leads qualify themselves. |
| Maytiya Monburinon (gigigimay.github.io) | React | The page descends from sky to sea floor, so each section is a place (`src/components/*Section.tsx`). | Moving between sections becomes moving between places. Relevant to an orbit idea. |
| Liz Lam (lizlam.github.io) | Plain HTML | An 890-byte home page written as a shell transcript that groups code, writing and social. | Several identities grouped with almost no code. |
| Vivek Patel (vivek9patel.github.io) | Next.js | The boot screen plays only on the first visit (`components/ubuntu.js`). | Intros should not repeat. |
| Donnie Yap (d2yap.github.io) | Vanilla | The last screen is a business card with an inline QR code. | Works in a client meeting held on a phone. |
| TJ Klint (tjklint.github.io) | React | A chat teaser that types real facts as code lines (`src/components/chat_bubble/`). | Real details as the hook. |
| Nacho Caiafa (rpg-cv) | SCSS | Lists his carpentry years honestly. Now shows a "THIS PORTFOLIO IS OUTDATED" banner. | Good honesty, and a warning about stale content. |
| Satyam Gupta (imlolman.github.io) | React | A facts panel beside the main content (`components/SearchResult.tsx`). | A quick-facts block works. The Google costume does not. |
| Arthur Rasera (raseraa0.github.io) | Next.js | The palette is sampled from one illustration (`tailwind.config.ts`). | Colour taken from an image looks chosen. |
| Adham Dannaway (search only) | n/a | The home page splits into a design half and a code half. | A direct model for a two-sided identity. |
| Keita Yamada, p5aholic (search only) | n/a | A WebGL designer site with a dedicated "copycats" page. | Even widely copied sites keep their own voice. |

**Patterns that fit software + client sites + brand work:**
1. **One credit format for all three kinds of work:** title, year, kind, role, for whom, with whom, links. One archive filters by kind.
2. **Each kind of work in its own shape:**
   - software as a demo or recording
   - stores in a browser frame with a live link
   - posts at 4:5 and stories at 9:16, uncropped, sized at build time
3. **One material system drawn from your own story,** used on dividers, focus rings and the loader, not only the hero.
4. **Every gimmick needs an exit:** a plain list view, keyboard access, and the intro only on the first visit.
5. **Agency practicalities as data:** a "currently working on" line, and WhatsApp on the contact screen for local clients.

---

## 5. Awwwards portfolio category, 2025 to 2026 (via listings and Codrops)

| Site | Signature | Takeaway |
|---|---|---|
| Corentin Bernadou (SOTD, Mar 2026) | Swiss grid in orange, white and black. Clicking a central cross shows 1px grid rulers. GSAP + Lenis, vanilla JS. | Precision drawing as the motif. Closest in spirit to direction A. |
| Gianluca Gradogna '25 | Design work and photography on one endless scroll, with a different typeface per discipline. | The best match found for a multi-disciplinary person. |
| Arnaud Rocca (Mar 2026) | The home page is a stories-style slider that you move by scroll, keys, bullets or drag. | One interaction, many inputs. |
| Stas Bondar '25 | Astro + GSAP, a home-page cube animation, a 404 made of letters. | A lightweight stack can still win. |
| Kim Seunghyuk (nominee) | "A single square unfolds into a galaxy of works", with scroll scrubbing. | The closest existing idea to an orrery. Ours has to stay a drawn diagram that becomes a list. |

**Overused right now (inference from the sample):**
- smooth scroll with split-text reveals on every heading
- hover-image project lists
- OS and desktop metaphors, now sold as Framer templates
- orbit carousels, now stock Framer components ("Orbit Projects", "Orbit Showcase")
- grain overlays
- bento grids with a local-time clock and a green "available" dot

**Anti-patterns seen again and again in the developer-portfolios sample:**
- near-black background with an indigo glow and a "Let's Talk" pill
- bios that stack adjectives
- logo and badge skill grids
- typewriter headlines cycling job titles
- templates left unchanged

---

## Licence summary

| Source | Licence | What we can take |
|---|---|---|
| bchiang7/v4 | MIT, with a credit request for forks | Patterns. Code with the MIT notice and a courtesy link. |
| brunosimon/folio-2025 | MIT for code. Assets not licensed. | Patterns. Code with the notice. No models or textures. |
| once-ui-system/magic-portfolio | CC BY-NC 4.0 | Patterns only. No code, since this site is commercial. |
| developer-portfolios entries | Each its own | Patterns only. |
