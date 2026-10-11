import type { ProjectMeta } from "@/lib/projects";
import { KINDS, kinds } from "@/lib/site";
import { REL, TILT, bodyAngle, ellipsePath, initialPhase, point } from "./orrery/geometry";

/**
 * Stand-in visual for a project until real screenshots exist: a small orrery with
 * this project's orbit drawn in ink and its body marked. Every plate differs because
 * every project sits at a different place on its orbit.
 */
export function Plate({
  project,
  siblings,
  className = "",
  showNote = true,
  compact = false,
}: {
  project: ProjectMeta;
  siblings: number;
  className?: string;
  showNote?: boolean;
  /** Thumbnail use: no corner label, bigger marks so they read at small sizes. */
  compact?: boolean;
}) {
  const W = 800;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2 + 12;
  const maxRx = 330;
  const ring = KINDS.indexOf(project.kind);
  const k = project.order - 1;
  const kind = kinds[project.kind];
  const scale = compact ? 1.9 : 1;

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-rule bg-surface ${className}`}
      style={{ aspectRatio: "8 / 5" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {REL.map((rel, i) => {
          const rx = maxRx * rel;
          const active = i === ring;
          return (
            <path
              key={i}
              d={ellipsePath(cx, cy, rx, rx * TILT)}
              fill="none"
              stroke={active ? "var(--ink)" : "var(--line)"}
              strokeWidth={active ? 1.4 : 1}
              strokeDasharray={active ? undefined : "2 5"}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={11 * scale} fill="var(--sun)" stroke="var(--ink)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        {Array.from({ length: siblings }, (_, j) => {
          const rx = maxRx * REL[ring];
          const [x, y] = point(cx, cy, rx, rx * TILT, bodyAngle(j, siblings) + initialPhase(ring));
          const me = j === k;
          return me ? (
            <g key={j}>
              <circle cx={x} cy={y} r={17 * scale} fill="none" stroke="var(--cobalt)" strokeWidth={1} opacity={0.6} vectorEffect="non-scaling-stroke" />
              <circle cx={x} cy={y} r={8 * scale} fill="var(--cobalt)" stroke="var(--surface)" strokeWidth={2.5 * scale} />
            </g>
          ) : (
            <circle key={j} cx={x} cy={y} r={4.5 * scale} fill="var(--surface)" stroke="var(--muted)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
          );
        })}
      </svg>
      {compact ? null : (
        <span className="label absolute top-3 left-4">
          {kind.orbit} · {kind.label}
        </span>
      )}
      {showNote && !project.cover ? (
        <span className="label absolute right-4 bottom-3 normal-case tracking-normal">Screenshots to come</span>
      ) : null}
    </div>
  );
}
