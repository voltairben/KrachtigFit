"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { pressSpring } from "@/components/motion/tokens";

/**
 * Two things the prototype's buttons got wrong, fixed here:
 *
 *  1. Contrast. The gold accent is 6.38:1 against ink text, and that same
 *     pairing is legible on either canvas — so `primary` needs no per-canvas
 *     variant. But the gold against paper is only 2.54:1, so the accent may
 *     never be used as *text* on the light canvas. `secondary` sidesteps this
 *     by inheriting `currentColor` from the [data-canvas] ancestor, which
 *     means it is correct on both canvases without a prop.
 *
 *     `primary`'s accent/ink pairing is also constant across the light/dark
 *     theme toggle (globals.css) — both colours stay fixed there by design,
 *     unlike --color-accent-fg, which is what canvas-level readable text
 *     (eyebrows, the wordmark) uses instead specifically so it CAN move.
 *
 *  2. Press feedback. The prototype had a hover lift and no :active state, so
 *     taps registered nothing at all — and the hover lift itself latched on
 *     touch devices, since there was no (hover: hover) guard.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold uppercase tracking-[0.08em]",
    "rounded-sm transition-colors",
    "duration-[var(--duration-base)] ease-[var(--ease-out-quart)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-ink hover:bg-accent-press",
        secondary:
          "border border-current/25 text-current hover:border-current/60",
        ghost: "text-current underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-10 px-4 text-caption",
        md: "h-12 px-6 text-body-sm",
        lg: "h-14 px-8 text-body-sm",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element (e.g. a Link) instead of a <button>. */
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, asChild = false, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const Comp = asChild ? Slot : "button";

    // motion.create wraps whichever element we end up rendering, so `asChild`
    // links get the same press feedback as real buttons.
    const MotionComp = React.useMemo(() => motion.create(Comp), [Comp]);

    return (
      <MotionComp
        ref={ref}
        className={cn(buttonVariants({ variant, size, full }), className)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        transition={pressSpring}
        {...(props as React.ComponentProps<typeof MotionComp>)}
      />
    );
  },
);

Button.displayName = "Button";
export { buttonVariants };
