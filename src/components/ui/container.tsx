import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Single horizontal rhythm for the whole site. The prototype used
 * `width: min(1120px, calc(100% - 2rem))` — a fixed 1rem gutter at every
 * viewport, so a 320px phone and a 1440px desktop got identical edge spacing.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[80rem] px-5 sm:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
