import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[60svh] content-center gap-5 py-24">
      <p className="label">404</p>
      <h1 className="text-title leading-[1.04]">This page is off the chart.</h1>
      <p className="max-w-[40ch] text-lead text-muted">The link may be old, or the page moved.</p>
      <p className="flex flex-wrap gap-5">
        <Link href="/" className="link">
          Home
        </Link>
        <Link href="/work/" className="link">
          All work
        </Link>
      </p>
    </div>
  );
}
