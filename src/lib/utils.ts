import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. This project defines its
 * own `--text-*` tokens (display-lg, body-sm, caption…), and without being
 * told, tailwind-merge cannot tell a custom FONT SIZE from a custom TEXT
 * COLOUR — both are `text-*`. It then treats them as one conflicting group and
 * keeps only the last.
 *
 * That produced a live accessibility failure: the primary button declares
 * `text-ink` (colour) and `text-body-sm` (size), the colour was silently
 * dropped, and the button rendered paper-on-vermillion at 2.95:1 against a
 * required 4.5:1. Lighthouse caught it; static review did not.
 *
 * Declaring the font-size names here lets everything else fall through to
 * text-color, so the two stop colliding.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-2xl",
            "display-xl",
            "display-lg",
            "display-md",
            "body-lg",
            "body",
            "body-sm",
            "caption",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
