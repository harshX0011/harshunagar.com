"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import type { Kind } from "@/lib/site";
import {
  REL,
  SEAM,
  TAU,
  TILT,
  bodyAngle,
  clamp,
  easeInOutCubic,
  ellipsePath,
  initialPhase,
  lerp,
  periodFor,
  point,
  wrapAngle,
} from "./geometry";

export type OrreryGroup = {
  kind: Kind;
  label: string;
  orbit: string;
  sentence: string;
  items: { slug: string; title: string }[];
};

/** Static frame used for the server render, no-JS visitors and reduced motion. */
const VB = { W: 1000, H: 560 };
const STATIC = (() => {
  const cx = VB.W / 2;
  const cy = VB.H / 2;
  const maxRx = Math.min(VB.W / 2 - 24, (VB.H / 2 - 40) / TILT);
  return { cx, cy, maxRx, tilt: TILT };
})();

const SAMPLES = 96;
const BODY_R = 6;
const LIVE_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 560px)";

type Rail = { x: number; top: number; bottom: number; dots: number[] };
type Geom = { W: number; H: number; cx: number; cy: number; maxRx: number; tilt: number; rails: Rail[]; sun: [number, number] };

/** Piecewise-linear map from a position along the orbit (0..1) to a y on the rail, through every dot. */
function railY(rail: Rail, s: number) {
  const n = rail.dots.length;
  const us = [0, ...rail.dots.map((_, k) => (k + 0.5) / n), 1];
  const ys = [rail.top, ...rail.dots, rail.bottom];
  for (let j = 1; j < us.length; j++) {
    if (s <= us[j]) return lerp(ys[j - 1], ys[j], (s - us[j - 1]) / (us[j] - us[j - 1]));
  }
  return rail.bottom;
}

export function Orrery({ groups, children }: { groups: OrreryGroup[]; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const index = indexRef.current;
    const hint = hintRef.current;
    if (!section || !svg || !index || !hint) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-orbit]"));
    const labels = Array.from(svg.querySelectorAll<SVGTextElement>("[data-orbit-label]"));
    const sun = svg.querySelector<SVGCircleElement>("[data-sun]")!;
    const bodies = groups.map((_, i) => Array.from(svg.querySelectorAll<SVGCircleElement>(`[data-body^="${i}-"]`)));

    // Hovering or focusing a project in the index lights up its body.
    const highlight = (e: Event) => {
      const id = (e.target as HTMLElement).closest<HTMLElement>("[data-for]")?.dataset.for;
      if (!id) return;
      const on = e.type === "pointerover" || e.type === "focusin";
      svg.querySelector(`[data-body="${id}"]`)?.setAttribute("r", String(on ? BODY_R + 3 : BODY_R));
    };
    for (const type of ["pointerover", "pointerout", "focusin", "focusout"]) index.addEventListener(type, highlight);

    let mm: { revert: () => void } | undefined;
    let cancelled = false;
    // GSAP loads after the page is interactive. Until then the server-drawn orrery shows.
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    if (cancelled) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    mm = media;

    media.add(LIVE_QUERY, () => {
      const state = { t: 0, phases: groups.map((_, i) => initialPhase(i)), visible: true };
      let geom: Geom | null = null;

      const measure = () => {
        const r = svg.getBoundingClientRect();
        if (r.width < 10 || r.height < 10) return;
        const W = r.width;
        const H = r.height;
        const tilt = clamp((H / W) * 0.5, TILT, 0.8);
        const rails = groups.map((g, i) => {
          const ul = index.querySelector(`[data-rail="${i}"]`)!.getBoundingClientRect();
          const dots = g.items.map((_, k) => {
            const d = index.querySelector(`[data-dot="${i}-${k}"]`)!.getBoundingClientRect();
            return d.top + d.height / 2 - r.top;
          });
          return { x: ul.left - r.left, top: ul.top - r.top, bottom: ul.bottom - r.top, dots };
        });
        const s = index.querySelector("[data-sun-target]")!.getBoundingClientRect();
        geom = {
          W,
          H,
          cx: W / 2,
          cy: H / 2,
          maxRx: Math.max(60, Math.min(W / 2 - 24, (H / 2 - 40) / tilt, 600)),
          tilt,
          rails,
          sun: [s.left + s.width / 2 - r.left, s.top + s.height / 2 - r.top],
        };
        svg.setAttribute("viewBox", `0 0 ${W.toFixed(1)} ${H.toFixed(1)}`);
      };

      const draw = () => {
        if (!geom) return;
        const { cx, cy, maxRx, tilt, rails, sun: sunTo } = geom;
        const t = state.t;
        // Orbits uncoil one after another, inner first; the sun moves last.
        const es = easeInOutCubic(clamp((t - 0.55) / 0.45));

        sun.setAttribute("cx", lerp(cx, sunTo[0], es).toFixed(1));
        sun.setAttribute("cy", lerp(cy, sunTo[1], es).toFixed(1));
        sun.setAttribute("r", lerp(Math.max(9, maxRx * 0.03), 5, es).toFixed(1));

        groups.forEach((g, i) => {
          const e = easeInOutCubic(clamp((t - i * 0.14) / 0.72));
          const rx = maxRx * REL[i];
          const ry = rx * tilt;
          const rail = rails[i];
          // Rotation unwinds as the orbit uncoils, so bodies land in list order.
          const p = wrapAngle(state.phases[i]) * (1 - e);

          let d = "";
          for (let j = 0; j <= SAMPLES; j++) {
            const s = j / SAMPLES;
            const [ex, ey] = point(cx, cy, rx, ry, SEAM + TAU * s + p);
            const x = lerp(ex, rail.x, e);
            const y = lerp(ey, railY(rail, s), e);
            d += `${j ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          }
          paths[i].setAttribute("d", d);

          labels[i].setAttribute("x", cx.toFixed(1));
          labels[i].setAttribute("y", (cy - ry - 10).toFixed(1));
          labels[i].style.opacity = String(1 - clamp(e / 0.35));

          bodies[i].forEach((b, k) => {
            const [ex, ey] = point(cx, cy, rx, ry, bodyAngle(k, g.items.length) + p);
            b.setAttribute("cx", lerp(ex, rail.x, e).toFixed(1));
            b.setAttribute("cy", lerp(ey, rail.dots[k], e).toFixed(1));
          });
        });

        const reveal = clamp((t - 0.8) / 0.2);
        section.style.setProperty("--reveal", reveal.toFixed(3));
        section.toggleAttribute("data-revealed", reveal > 0.5);
      };

      measure();
      draw();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            draw();
          },
        },
      });
      tl.to(hint, { opacity: 0, duration: 0.08, ease: "none" }, 0);
      tl.to(state, { t: 1, duration: 0.68, ease: "none", onUpdate: draw }, 0.12);
      tl.to({}, { duration: 0.2 }, 0.8);

      // Orbits turn slowly while the orrery is whole and on screen.
      const spin = (_time: number, deltaMs: number) => {
        if (state.t > 0.0005 || !state.visible || document.hidden) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        state.phases = state.phases.map((ph, i) => ph + (TAU / periodFor(i)) * dt);
        draw();
      };
      gsap.ticker.add(spin);

      const io = new IntersectionObserver(([entry]) => {
        state.visible = entry.isIntersecting;
      });
      io.observe(section);
      const ro = new ResizeObserver(() => {
        measure();
        draw();
      });
      ro.observe(svg);

      // Keyboard users tab into the index: jump to the end so what they focus is visible.
      const reveal = () => {
        const st = tl.scrollTrigger;
        if (!st || st.progress > 0.9) return;
        if (window.__lenis) window.__lenis.scrollTo(st.end, { duration: 0.8 });
        else window.scrollTo({ top: st.end });
      };
      index.addEventListener("focusin", reveal);

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(spin);
        io.disconnect();
        ro.disconnect();
        index.removeEventListener("focusin", reveal);
        section.style.removeProperty("--reveal");
        section.removeAttribute("data-revealed");
        resetStatic();
      };
    });
    }).catch(() => {
      // If GSAP cannot load, show the index rather than leave it hidden.
      section.style.setProperty("--reveal", "1");
      section.setAttribute("data-revealed", "");
    });

    function resetStatic() {
      if (!svg) return;
      svg.setAttribute("viewBox", `0 0 ${VB.W} ${VB.H}`);
      const { cx, cy, maxRx } = STATIC;
      sun.setAttribute("cx", String(cx));
      sun.setAttribute("cy", String(cy));
      sun.setAttribute("r", "12");
      groups.forEach((g, i) => {
        const rx = maxRx * REL[i];
        paths[i].setAttribute("d", ellipsePath(cx, cy, rx, rx * TILT));
        labels[i].setAttribute("x", String(cx));
        labels[i].setAttribute("y", String(cy - rx * TILT - 10));
        labels[i].style.opacity = "1";
        bodies[i].forEach((b, k) => {
          const [x, y] = point(cx, cy, rx, rx * TILT, bodyAngle(k, g.items.length) + initialPhase(i));
          b.setAttribute("cx", x.toFixed(1));
          b.setAttribute("cy", y.toFixed(1));
        });
      });
    }

    return () => {
      for (const type of ["pointerover", "pointerout", "focusin", "focusout"]) index.removeEventListener(type, highlight);
      cancelled = true;
      mm?.revert();
    };
  }, [groups]);

  const { cx, cy, maxRx } = STATIC;

  return (
    <section ref={sectionRef} className="orrery" aria-labelledby="orrery-index-title">
      <div className="orrery-stage">
        <div className="orrery-hero wrap">{children}</div>
        <div className="orrery-field">
          <svg
            ref={svgRef}
            className="orrery-svg"
            viewBox={`0 0 ${VB.W} ${VB.H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            {groups.map((g, i) => {
              const rx = maxRx * REL[i];
              return <path key={g.kind} data-orbit={i} className="o-path" d={ellipsePath(cx, cy, rx, rx * TILT)} />;
            })}
            <circle data-sun className="o-sun" cx={cx} cy={cy} r={12} />
            {groups.map((g, i) => {
              const rx = maxRx * REL[i];
              return (
                <text key={g.kind} data-orbit-label className="o-label" x={cx} y={cy - rx * TILT - 10}>
                  {g.label}
                </text>
              );
            })}
            {groups.map((g, i) =>
              g.items.map((item, k) => {
                const rx = maxRx * REL[i];
                const [x, y] = point(cx, cy, rx, rx * TILT, bodyAngle(k, g.items.length) + initialPhase(i));
                return (
                  <circle
                    key={item.slug}
                    data-body={`${i}-${k}`}
                    className="o-body"
                    cx={x.toFixed(1)}
                    cy={y.toFixed(1)}
                    r={BODY_R}
                  />
                );
              }),
            )}
          </svg>

          <div ref={indexRef} className="orrery-index wrap">
            <h2 id="orrery-index-title" className="orrery-index-title label">
              <span data-sun-target className="orrery-sun-target" aria-hidden="true" />
              Work, by orbit
            </h2>
            <div className="orrery-cols">
              {groups.map((g, i) => (
                <div key={g.kind} className="orbit-col">
                  <h3 className="orbit-name">
                    <Link href={`/work/?kind=${g.kind}`}>{g.label}</Link>
                  </h3>
                  <p className="orbit-sentence">{g.sentence}</p>
                  <ul className="orbit-list" data-rail={i}>
                    {g.items.map((item, k) => (
                      <li key={item.slug} data-for={`${i}-${k}`}>
                        <span className="orbit-dot" data-dot={`${i}-${k}`} aria-hidden="true" />
                        <Link href={`/work/${item.slug}/`}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p ref={hintRef} className="orrery-hint label" aria-hidden="true">
          Scroll
        </p>
      </div>
    </section>
  );
}
