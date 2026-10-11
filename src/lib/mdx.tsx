import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import type { ComponentPropsWithoutRef } from "react";
import { Todo } from "@/components/todo";
import { Gallery, Screenshot } from "@/components/screenshot";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

const components: MDXComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 id={slugify(textOf(props.children))} {...props} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) =>
    /^https?:\/\//.test(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
  Todo,
  Screenshot,
  Gallery,
};

/** Compiles MDX at build time (static export), so no MDX runtime ships to the browser. */
export async function MDX({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
  });
  return <Content components={components} />;
}
