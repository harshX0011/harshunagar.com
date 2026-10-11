"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lines of a heading rise into place once, the first time it scrolls into view.
 * Used only on featured project titles. GSAP and SplitText load only when a title
 * gets close to the viewport. Plain text for reduced motion and no-JS.
 */
export function RevealTitle({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/SplitText"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger, SplitText);
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          // Lines only wrap whole words, so the text reads normally to screen readers.
          aria: "none",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            }),
        });
        revert = () => split.revert();
      },
      { rootMargin: "0px 0px 300px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      revert?.();
    };
  }, []);

  return (
    <span ref={ref} className="block">
      {children}
    </span>
  );
}
