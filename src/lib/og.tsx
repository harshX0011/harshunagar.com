import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { REL, TILT, bodyAngle, ellipsePath, initialPhase, point } from "@/components/orrery/geometry";

export const ogSize = { width: 1200, height: 630 };

const C = { bg: "#f5f7fa", ink: "#111522", muted: "#586178", line: "#a6afc0", sun: "#f2a900", cobalt: "#2b50d8" };

async function font(file: string) {
  return fs.readFile(path.join(process.cwd(), "assets", "fonts", file));
}

/** The orrery drawn as an SVG string, with one orbit (and optionally one body) picked out. */
function orrerySvg(ring: number | null, body: { k: number; n: number } | null, counts: number[]) {
  const W = 520;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const maxRx = 250;
  let out = "";
  REL.forEach((rel, i) => {
    const rx = maxRx * rel;
    const active = ring === null || ring === i;
    out += `<path d="${ellipsePath(cx, cy, rx, rx * TILT)}" fill="none" stroke="${active ? C.ink : C.line}" stroke-width="${active ? 1.6 : 1.2}"/>`;
  });
  out += `<circle cx="${cx}" cy="${cy}" r="12" fill="${C.sun}" stroke="${C.ink}" stroke-width="1.2"/>`;
  REL.forEach((rel, i) => {
    const rx = maxRx * rel;
    for (let k = 0; k < counts[i]; k++) {
      const [x, y] = point(cx, cy, rx, rx * TILT, bodyAngle(k, counts[i]) + initialPhase(i));
      const me = body && ring === i && body.k === k;
      if (me) {
        out += `<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${C.cobalt}" stroke-width="1.4" opacity="0.6"/>`;
        out += `<circle cx="${x}" cy="${y}" r="9" fill="${C.cobalt}" stroke="${C.bg}" stroke-width="3"/>`;
      } else {
        const dim = ring !== null && ring !== i;
        out += `<circle cx="${x}" cy="${y}" r="5.5" fill="${dim ? C.bg : C.cobalt}" stroke="${dim ? C.line : C.bg}" stroke-width="${dim ? 1.4 : 2}"/>`;
      }
    }
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out}</svg>`;
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, W, H };
}

export async function renderOg({
  eyebrow,
  title,
  summary,
  ring = null,
  body = null,
  counts,
}: {
  eyebrow: string;
  title: string;
  summary?: string;
  ring?: number | null;
  body?: { k: number; n: number } | null;
  counts: number[];
}) {
  const [light, regular, medium, mono] = await Promise.all([
    font("jost-latin-300-normal.woff"),
    font("jost-latin-400-normal.woff"),
    font("jost-latin-500-normal.woff"),
    font("martian-mono-latin-400-normal.woff"),
  ]);
  const art = orrerySvg(ring, body, counts);
  const titleSize = title.length > 22 ? 64 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.bg,
          color: C.ink,
          fontFamily: "Jost",
          padding: "64px 56px 56px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Martian Mono", fontSize: 18, letterSpacing: 2.5, color: C.muted, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ fontSize: titleSize, fontWeight: 400, lineHeight: 1.05, marginTop: 28, letterSpacing: -0.5 }}>{title}</div>
            {summary ? (
              <div style={{ fontSize: 30, fontWeight: 300, lineHeight: 1.35, marginTop: 24, color: C.muted }}>{summary}</div>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: C.sun, border: `1px solid ${C.ink}`, marginRight: 14 }} />
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: 4.5, textTransform: "uppercase" }}>harshunagar.com</div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img */}
          <img src={art.src} width={art.W} height={art.H} alt="" />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Jost", data: light, weight: 300, style: "normal" },
        { name: "Jost", data: regular, weight: 400, style: "normal" },
        { name: "Jost", data: medium, weight: 500, style: "normal" },
        { name: "Martian Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
