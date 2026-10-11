/**
 * Shared orrery maths, used by the server-rendered drawing, the live scroll
 * version and the project plates, so all three agree on where things sit.
 */

export const TAU = Math.PI * 2;
/** Orbit sizes relative to the outer orbit: inner, middle, outer. */
export const REL = [0.38, 0.69, 1] as const;
/** Vertical squash of each orbit (ry / rx), which reads as a tilted plane. */
export const TILT = 0.42;
/** Where an orbit is cut open when it uncoils: the top of the ellipse. */
export const SEAM = -Math.PI / 2;
/** Outer orbit takes this long per revolution; inner ones follow Kepler's third law. */
export const OUTER_PERIOD_S = 140;

export const periodFor = (i: number) => OUTER_PERIOD_S * Math.pow(REL[i], 1.5);
/** Starting rotation per orbit, fixed so the server and the browser draw the same frame. */
export const initialPhase = (i: number) => i * 1.7 + 0.4;

export function point(cx: number, cy: number, rx: number, ry: number, angle: number): [number, number] {
  return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
}

/** Angle of the k-th of n bodies on an orbit, before rotation. */
export const bodyAngle = (k: number, n: number) => SEAM + (TAU * (k + 0.5)) / n;

export function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M${(cx - rx).toFixed(1)} ${cy.toFixed(1)}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-2 * rx).toFixed(1)} 0`;
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Wraps an angle into (-PI, PI] so unwinding a rotation takes the short way round. */
export function wrapAngle(a: number) {
  let p = a % TAU;
  if (p > Math.PI) p -= TAU;
  if (p < -Math.PI) p += TAU;
  return p;
}
