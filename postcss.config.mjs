// Tailwind runs as a PostCSS plugin, so both Turbopack (dev) and webpack (build) can use it.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
