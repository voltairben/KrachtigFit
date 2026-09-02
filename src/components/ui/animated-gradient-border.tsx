import type { HTMLAttributes, ReactNode } from "react";

/**
 * Ported from a copy-paste component drop (BorderRotate / "animated gradient
 * border"), adapted to this project's conventions rather than pasted
 * verbatim: default export removed for a named one (matches every other
 * component here), and — the part the original snippet didn't actually
 * include — the CSS that makes the rotation animate at all. The source only
 * shipped the `@keyframes gradient-rotate` rule; the `.gradient-border-auto`
 * class that applies it, and the `@property` registration that lets a
 * browser interpolate `--gradient-angle` smoothly inside the conic-gradient
 * at all (an unregistered custom property won't animate in most engines),
 * are added in src/styles/globals.css. Without both, this renders as a
 * static gradient ring that never rotates.
 *
 * Colours are this site's actual brand tokens (--color-accent and friends)
 * rather than the drop's hardcoded hex values, so the border stays correct
 * if the palette ever moves. Radius is --radius-sm (2px) to match this
 * site's "hard-edged by default" system (see globals.css) — the original
 * component's 20px default would have been the only rounded corner on the
 * entire page.
 *
 * Trimmed 2026-09: the original port carried the source snippet's full
 * config surface (animationMode with 3 variants, animationSpeed,
 * gradientColors, backgroundColor, borderWidth, borderRadius, style) —
 * seven props for a component with exactly one caller (about.tsx), which
 * used none of them (its one explicit prop, borderWidth={2}, matched the
 * default). Down to what's actually used: children and className. If a
 * second caller ever needs a real variant, that's the time to bring a prop
 * back — not before.
 */
export function BorderRotate({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">) {
  return (
    <div
      className={`gradient-border-component gradient-border-auto ${className}`.trim()}
      style={{
        border: "2px solid transparent",
        borderRadius: "2px",
        backgroundImage: `
          linear-gradient(var(--color-canvas-ink), var(--color-canvas-ink)),
          conic-gradient(
            from var(--gradient-angle, 0deg),
            var(--color-accent-press) 0%,
            var(--color-accent) 37%,
            var(--color-paper) 30%,
            var(--color-accent) 33%,
            var(--color-accent-press) 40%,
            var(--color-accent-press) 50%,
            var(--color-accent) 77%,
            var(--color-paper) 80%,
            var(--color-accent) 83%,
            var(--color-accent-press) 90%
          )
        `,
        backgroundClip: "padding-box, border-box",
        backgroundOrigin: "padding-box, border-box",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
