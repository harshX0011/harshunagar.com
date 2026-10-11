"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scroll for mouse wheels; touch scrolling stays native. Loaded when the
 * browser is idle so it never competes with the first render. Off for reduced motion.
 * ScrollTrigger keeps in sync through the native scroll events Lenis produces.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: Lenis | undefined;
    let cancelled = false;
    const start = () =>
      import("lenis").then(({ default: LenisCtor }) => {
        if (cancelled) return;
        lenis = new LenisCtor({ lerp: 0.12, autoRaf: true });
        window.__lenis = lenis;
      });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
