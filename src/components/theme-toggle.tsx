"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

// The theme lives on <html data-theme>, set before paint by ThemeScript. Read it from there.
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
const getServerTheme = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  // Follow the system setting until the visitor makes a choice of their own.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!readStored()) document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme ? label : "Toggle colour theme"}
      title={theme ? label : undefined}
      className="group grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-rule"
    >
      {/* A half-lit planet. It turns over when the theme changes. */}
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        className={`transition-transform duration-500 ease-out ${theme === "dark" ? "rotate-180" : ""}`}
      >
        <circle cx="12" cy="12" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 4.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
