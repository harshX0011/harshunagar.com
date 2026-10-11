# TODO: real content needed from Harsh

Every placeholder that still needs real content. Nothing gets filled in by guessing.

- **On the site:** each gap shows as a dashed "To be written" box or an amber "To confirm" / "To add" label.
- **From the command line:** `npm run todos` counts them.

## Decided

- [x] Design direction: A, Orrery
- [x] Visually separate from Dicock (no violet-on-black)

## Drafts to confirm (written only from the brief, on the site now)

All of these live in `src/lib/site.ts` unless noted. Rewrite freely.

- [ ] **Hero line:** "Computer engineering student at SCET, Surat. I write my own software, build Shopify stores for clients through my agency, and run social media for jewellery brands."
- [ ] **Software orbit:** "Tools I build for myself, from data extractors to Orrery Space."
- [ ] **Websites orbit:** "Client sites, mostly Shopify stores, built through my agency Dicock."
- [ ] **Brand orbit:** "Social media for D2C and jewellery brands."
- [ ] **Featured projects:** Orrery Space, Aarogya Matrix and White Debeers, one per orbit. Change `featured: true` in the MDX files.
- [ ] **Project summaries:** the `summary:` line in each `content/work/*.mdx`.
- [ ] **About intro paragraph** (`content/about.mdx`).
- [ ] **Contact line:** "Working on a store, a brand or a tool? Get in touch." (`src/app/page.tsx`)
- [ ] **GitHub:** is `github.com/harshX0011` the account you want linked?

## Software

**Orrery Space** (`content/work/orrery-space.mdx`)
- [ ] What it does, in one or two sentences
- [ ] Which Space Apps year and challenge
- [ ] Solo or team, plus names and roles to credit (`team:`)
- [ ] Result or status, only if real
- [ ] Role, year, stack
- [ ] 2 to 4 screenshots, desktop and mobile
- [ ] What you learned
- [ ] Is the private repo `ORRERY` this project? If so, add it to a session so the stack can be read from the code.

**Web data extractor, Instagram backlink tracer, media extractor**, for each:
- [ ] The problem, how it works, and what you learned
- [ ] Role, year, stack
- [ ] Public or private repo (add a link if public)
- [ ] Screenshots or a short screen recording
- [ ] Are you comfortable showing the Instagram tool publicly? Scraping Instagram is against Meta's terms. It can be described without naming the site.

**Smaller builds** (`content/archive.json`)
- [ ] One line each for APIs, Hermes, Obsidian, Local LLMs (and what "Hermes" refers to)
- [ ] Should public repos like BG-REMOVER, Auto-listing-tool, Yt-downloder or Video-Download-Skill be listed?

## Websites

**Dicock** (`content/work/dicock.mdx`)
- [ ] When and why it started, solo or team, services
- [ ] Your role, year, stack
- [ ] Screenshots of dicock.in

**Aarogya Matrix** (`content/work/aarogya-matrix.mdx`)
- [ ] The brief and exactly what you built
- [ ] Role, year, stack
- [ ] Client permission to show it
- [ ] Screenshots

**Aurest** (`content/work/aurest.mdx`)
- [ ] The brief and what you built
- [ ] Role, year, stack
- [ ] Client permission to show it
- [ ] Screenshots
- [ ] Are the private repos `AUREST` and `AUREST-2` this site? Is this the brand behind the AUREST earbuds on Flipkart?

**More**
- [ ] Any other client sites: copy any project file and edit it

## Brand

For each of White Debeers, White Crown and Orlisse Jewellery (`content/work/*.mdx`):
- [ ] Who the brand sells to, and what the feed needed
- [ ] Your deliverables and what a normal month looks like
- [ ] Permission to show posts, then 6 to 9 posts at original size
- [ ] Instagram handle to link
- [ ] Exact spelling of the name

## About (`content/about.mdx`)

- [ ] Your story: how you started building, how Dicock started, how the jewellery brands came to you, what is next
- [ ] A "Now" line: what you are working on this month
- [ ] Photo, roughly 4:5 (optional)

## Contact (`src/lib/site.ts`)

- [ ] Email to show publicly
- [ ] WhatsApp number (digits with country code), and are you fine with it being public?
- [ ] LinkedIn URL
- [ ] Instagram URL: personal, Dicock, or both

## Numbers

- [ ] Any real metrics you can back up (orders, traffic, follower growth). If there are none, the site shows none.

## Before launch

- [ ] Hosting: Hostinger or Vercel (the static export works on both, see README.md)
- [ ] `npm run todos -- --strict` passes
- [ ] Point harshunagar.com at the host
