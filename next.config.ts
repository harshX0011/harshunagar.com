import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML in `out/`, so the site can live on Hostinger, Vercel or any file host.
  output: "export",
  // `/work/` is served from `/work/index.html`, which plain file hosts handle without rewrites.
  trailingSlash: true,
  // Images are resized at build time by scripts/optimize-images.mjs instead.
  images: { unoptimized: true },
  // The whole stylesheet is small (Tailwind), so inlining it removes a render-blocking request.
  experimental: { inlineCss: true },
};

export default nextConfig;
