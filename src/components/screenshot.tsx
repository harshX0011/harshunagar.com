import { getMedia } from "@/lib/media";
import { Todo } from "./todo";

type Props = {
  /** Path under content/media, e.g. "aarogya-matrix/home.png". */
  src: string;
  alt: string;
  caption?: string;
  /** Layout hint so phones get a smaller file. */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export async function Screenshot({
  src,
  alt,
  caption,
  sizes = "(min-width: 1024px) 60rem, 100vw",
  priority = false,
  className = "",
}: Props) {
  const media = await getMedia(src);
  if (!media) {
    return (
      <Todo label="Image missing">
        Add <code>content/media/{src}</code> and run <code>npm run images</code>.
      </Todo>
    );
  }
  return (
    <figure className={className}>
      <picture>
        <source type="image/avif" srcSet={media.avif} sizes={sizes} />
        <source type="image/webp" srcSet={media.webp} sizes={sizes} />
        {/* Plain <img>: the static export pre-sizes images at build time, so next/image adds nothing. */}
        <img
          src={media.fallback}
          width={media.width}
          height={media.height}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="block h-auto w-full rounded-md border border-rule bg-surface"
        />
      </picture>
      {caption ? <figcaption className="label mt-2 normal-case tracking-normal">{caption}</figcaption> : null}
    </figure>
  );
}

/** Two-up grid for desktop and phone shots, or a run of social posts. */
export function Gallery({ children, columns = 2 }: { children: React.ReactNode; columns?: 2 | 3 }) {
  return (
    <div className={`not-prose grid gap-4 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>{children}</div>
  );
}
