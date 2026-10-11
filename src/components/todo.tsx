import type { ReactNode } from "react";

/** A visible gap that Harsh still has to fill. Listed in TODO.md; `npm run todos` counts them. */
export function Todo({ children, label = "To be written" }: { children?: ReactNode; label?: string }) {
  return (
    <div className="todo" role="note">
      <span className="todo-tag">{label}</span>
      {children}
    </div>
  );
}

/** Inline version for short facts such as a role or a year. */
export function Missing({ children = "To confirm" }: { children?: ReactNode }) {
  return <span className="font-mono text-[0.75rem] tracking-wide text-[var(--todo)]">{children}</span>;
}
