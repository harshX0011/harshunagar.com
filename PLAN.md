# Page plans

Five lines per page: the plan the first version follows. Change any line and the page changes with it.

## Home
1. Opens on name, location and one honest line, over a drawn orrery: Harsh at the centre, three orbits for software, websites and brand.
2. Scrolling uncoils the orbits one by one into three rails. The rails become the work index, with every project a real link.
3. Selected work: three featured projects (one per orbit) as large rows, each opening its case study.
4. Contact block with every channel, and visible gaps where details are still missing.
5. Reduced motion, short screens and no-JS visitors get the static orrery and the plain index.

## Work
1. Title, one line on the three orbits, then a filter: All, Software, Websites, Brand, each with a count.
2. The filter lives in the URL (`/work/?kind=websites`), so the orbit names on the home page link straight into it.
3. One row per project: an orrery plate showing where it sits on its orbit, then title, orbit and summary.
4. Rows animate with Motion when the filter changes, and a live region announces the new count.
5. "Smaller builds" table at the bottom for the learning projects: APIs, Hermes, Obsidian, local LLMs.

## Case study
1. Breadcrumb, orbit label, title, one-line summary.
2. Cover: the real screenshot once it exists, an orrery plate until then.
3. A margin of facts beside the text, like an observing log: role, year, client, team, stack, links.
4. The body comes from the project's MDX file: problem, what I did, screenshots, what I learned.
5. Ends with previous and next on the same orbit. Every project has its own share image.

## About
1. Name as the title, then the story from `content/about.mdx`.
2. A "Now" line for what you are working on this month.
3. Side column of quick facts: based in, studying, runs.
4. Space for a photo once you send one.
5. No skills grid and no logo wall.

## Contact
1. "Get in touch" and one line on what to write about.
2. Email, WhatsApp, LinkedIn, GitHub and Instagram, in large type, each a real link.
3. Missing details show as "To add" until they are filled in `src/lib/site.ts`.
4. Location and coordinates underneath.
5. No contact form: static hosting has nowhere to send it, and a direct email or WhatsApp is faster anyway.
