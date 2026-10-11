# Design directions

**Picked: A, Orrery**, kept visually separate from Dicock. The site is built on it; see README.md and PLAN.md.

The three directions as proposed:

You can try each direction's signature interaction on the comparison page: https://claude.ai/artifact/7MoEggZVa7akY6G11Z4c6u (private to your account).

Shared across all three, whichever you pick:
- Next.js App Router, TypeScript, Tailwind, MDX per project, `output: 'export'`
- self-hosted fonts
- dark and light mode
- reduced-motion fallbacks
- no WebGL on the home page

## Comparison

| | A. Orrery | B. Sentence | C. Loupe |
|---|---|---|---|
| Signature | Scroll uncoils an orrery into the work index | The hero line is the filter; the picked word goes wide | A lens over screenshots reveals the build layer |
| Leans toward | Software, Orrery Space | All three equally | Client sites, brand work |
| 3D | Not needed. Optional on the Orrery Space case study only | None | None |
| You prepare | One line per project | Your final hero line | Clean screenshots plus an annotated build layer per project |
| Build effort | Medium | Low | High |
| Main risk | Space themes get cheesy fast | Calm enough to read as a template | Tools without a UI have little to reveal |

## A. Orrery

- **Idea:** The home page is a drawn orrery. You sit at the centre, and the three kinds of work are three orbits. Orrery Space gives the motif a real reason to be there.
- **Layout:**
  - **Home:** a flat line drawing, with no starfield and no glow. Scrolling straightens the orbits into three rails, and the rails become the work index.
  - **Case studies:** a single column with a narrow mono margin for dates, stack and role, like an observing log.
- **Type:**
  - Jost for headings and text. It is a free revival of Futura, the face on the Apollo 11 plaque.
  - Martian Mono for labels and data.
- **Colour:** cool white and deep ink, a sun yellow for the centre, cobalt for projects. Dark mode is deep navy.
- **Signature, orbit to index:**
  - GSAP ScrollTrigger scrubs an SVG. Inner orbits move faster, as Kepler's third law says.
  - Every project dot is a real link in tab order.
  - With reduced motion, the drawing holds still and the index is plain HTML.
- **Watch out:**
  - Orbit carousels are now stock Framer components, so this must stay a precise drawing that becomes a list.
  - Each rail needs a plain sentence for clients who do not care about orbits.

## B. Sentence

- **Idea:** The one honest line is the interface. "Harsh builds software, websites and brands." Each noun is a button that filters the page. The line itself is a draft for you to rewrite.
- **Layout:** a type-led hero, then one large project per row. On the Work page the sentence stays pinned at the top as the filter.
- **Type:** Anybody (a variable face with width from 50 to 150) for display, Onest for body.
- **Colour:** near white and ink, plus one colour per kind of work, used site-wide: cobalt for software, green for websites, rose for brand.
- **Signature, width-morph filter:** the picked word goes wide and heavy and the others condense. It runs on CSS transitions on one font axis, with a FLIP animation for the list.
- **Watch out:** if the sentence sounds generic, the whole site does.

## C. Loupe

- **Idea:** Clients see the polished surface; you built what is underneath. A jeweller's loupe over each screenshot reveals the build layer: sections, components, spacing and notes.
- **Layout:** a cool studio-grey ground, one big screenshot per screen, case studies that alternate surface and redline views, and brand work as a contact sheet.
- **Type:**
  - Bodoni Moda for display
  - Instrument Sans for body
  - IBM Plex Mono for the redline labels
- **Colour:** studio grey, ink, white for screenshots. Redline red is used only for annotations.
- **Signature, the loupe:**
  - The pointer moves it on desktop and a tap places it on phones.
  - Arrow keys move it when it has focus.
  - A button reveals the whole layer.
- **Watch out:**
  - This is the most content work.
  - The extractor tools would show architecture diagrams under the lens.

## Recommendation

**A, Orrery.**
1. The motif comes from your own project, so nobody else can use it.
2. The signature interaction is also the navigation.
3. It is cheap to run: flat SVG plus GSAP, with no WebGL on the home page.

If most visitors will be potential agency clients, C sells client work better. If speed matters most, B.
