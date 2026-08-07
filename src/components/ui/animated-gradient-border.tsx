import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

/**
 * Ported from a copy-paste component drop (BorderRotate / "animated gradient
 * border"), adapted to this project's conventions rather than pasted
 * verbatim: default export removed for a named one (matches every other
 * component here), and — the part the original snippet didn't actually
 * include — the CSS that makes the three `animationMode` values do anything.
 * The source only shipped the `@keyframes gradient-rotate` rule; the
 * `.gradient-border-auto/-hover/-stop-hover` classes that apply that
 * animation, and the `@property` registration that lets a browser
 * interpolate `--gradient-angle` smoothly inside the conic-gradient at all
 * (an unregistered custom property won't animate in most engines), are added
 * in src/styles/globals.css. Without both, this renders as a static gradient
 * ring that never rotates.
 *
 * Colours default to this site's actual brand tokens (--color-accent and
 * friends) rather than the drop's hardcoded hex values, so the border stays
 * correct if the palette ever moves. Radius defaults to --radius-sm (2px)
 * to match this site's "hard-edged by default" system (see globals.css) —
 * the original component's 20px default would have been the only rounded
 * corner on the entire page.
 */

type AnimationMode = "auto-rotate" | "rotate-on-hover" | "stop-rotate-on-hover";

interface BorderRotateProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  children: ReactNode;
  className?: string;

  animationMode?: AnimationMode;
  /** Full-rotation duration, in seconds. */
  animationSpeed?: number;

  gradientColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  backgroundColor?: string;

  borderWidth?: number;
  borderRadius?: number;

  style?: CSSProperties;
}

const defaultGradientColors = {
  primary: "var(--color-accent-press)",
  secondary: "var(--color-accent)",
  accent: "var(--color-paper)",
};

function animationClass(mode: AnimationMode) {
  switch (mode) {
    case "auto-rotate":
      return "gradient-border-auto";
    case "rotate-on-hover":
      return "gradient-border-hover";
    case "stop-rotate-on-hover":
      return "gradient-border-stop-hover";
  }
}

export function BorderRotate({
  children,
  className = "",
  animationMode = "auto-rotate",
  animationSpeed = 5,
  gradientColors = defaultGradientColors,
  backgroundColor = "var(--color-canvas-ink)",
  borderWidth = 2,
  borderRadius = 2,
  style,
  ...props
}: BorderRotateProps) {
  const combinedStyle = {
    "--animation-duration": `${animationSpeed}s`,
    border: `${borderWidth}px solid transparent`,
    borderRadius: `${borderRadius}px`,
    backgroundImage: `
      linear-gradient(${backgroundColor}, ${backgroundColor}),
      conic-gradient(
        from var(--gradient-angle, 0deg),
        ${gradientColors.primary} 0%,
        ${gradientColors.secondary} 37%,
        ${gradientColors.accent} 30%,
        ${gradientColors.secondary} 33%,
        ${gradientColors.primary} 40%,
        ${gradientColors.primary} 50%,
        ${gradientColors.secondary} 77%,
        ${gradientColors.accent} 80%,
        ${gradientColors.secondary} 83%,
        ${gradientColors.primary} 90%
      )
    `,
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`gradient-border-component ${animationClass(animationMode)} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}
