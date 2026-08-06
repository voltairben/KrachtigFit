"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
} from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import "./masked-heading.css";

/**
 * Ported from React Bits (reactbits.dev/text-animations/masked-heading,
 * MaskedHeading-JS-CSS variant) rather than pulled in via the shadcn
 * registry CLI: this project has no components.json, so `npx shadcn add`
 * would have hit an interactive first-run setup wizard with no way to
 * answer it in this environment. Fetched the same registry JSON directly
 * instead (https://reactbits.dev/r/MaskedHeading-JS-CSS.json) and adapted
 * the file to this project's conventions — named export instead of
 * default, typed props instead of plain JSX, kebab-case filename to match
 * every other component here. The glyph-masking/GSAP reveal logic itself
 * is unchanged from the source.
 *
 * One real addition: prefers-reduced-motion handling, same reasoning as
 * light-pillar.tsx. The upstream component's word-reveal-in animation
 * already checks `prefers-reduced-motion` itself (settles instantly
 * instead of animating in) — that part needed no change, and is safe as
 * written because it only runs inside a post-mount effect, never during
 * render, so it can't cause the render-time hydration mismatch that
 * `motion/react`'s useReducedMotion() caused elsewhere in this codebase
 * (see use-reduced-motion.ts). What the upstream component does NOT
 * handle at all is the *ambient* motion: a requestAnimationFrame loop
 * that continuously drifts the masked media and eases it toward the
 * pointer position, running unconditionally for as long as the component
 * is mounted, plus the video source itself autoplaying and looping. Both
 * are gated behind the shared useReducedMotion() hook below — the drift
 * loop simply never starts, leaving the media statically centred, and the
 * video is rendered paused on its first frame instead of autoplaying.
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export type MaskedHeadingReveal = "rise" | "wipe" | "fade" | "none";
export type MaskedHeadingTrigger = "view" | "hover" | "immediate";
export type MaskedHeadingMediaType = "image" | "video";
export type MaskedHeadingAlign = "left" | "center" | "right";

export type MaskedHeadingProps = {
  text?: string;
  /** Which element the heading renders as — pass "h1" for a page's single H1. */
  tag?: ElementType;
  mediaType?: MaskedHeadingMediaType;
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: MaskedHeadingReveal;
  duration?: number;
  stagger?: number;
  trigger?: MaskedHeadingTrigger;
  align?: MaskedHeadingAlign;
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

type Settings = {
  fillScale: number;
  parallax: number;
  drift: number;
  brightness: number;
  saturation: number;
  grayscale: boolean;
  textScale: number;
};

export function MaskedHeading({
  text = "Designed in the details",
  tag = "h2",
  mediaType = "image",
  src = "",
  poster = "",
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = "rise",
  duration = 1.1,
  stagger = 0.09,
  trigger = "view",
  align = "center",
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = "",
  style,
  id,
}: MaskedHeadingProps) {
  const Tag = tag;

  const rootRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const baseRefs = useRef<Array<HTMLElement | null>>([]);
  const glyphRefs = useRef<Array<SVGTextElement | null>>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const shouldReduceMotion = useReducedMotion();

  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `mh-${rawId}`;
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const settingsRef = useRef<Settings>({
    fillScale,
    parallax,
    drift,
    brightness,
    saturation,
    grayscale,
    textScale,
  });
  settingsRef.current = {
    fillScale,
    parallax,
    drift,
    brightness,
    saturation,
    grayscale,
    textScale,
  };

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const s = settingsRef.current;
    const W = root.clientWidth;
    const H = root.clientHeight;
    const off = offsetRef.current;

    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);

    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`;
    media.style.filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? " grayscale(1)" : ""}`;
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const s = settingsRef.current;

    root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`;

    const cs = window.getComputedStyle(measure);
    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;
      glyph.setAttribute("x", `${box.offsetLeft}`);
      glyph.setAttribute("y", `${base.offsetTop}`);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.fontStyle = cs.fontStyle;
      glyph.style.letterSpacing = cs.letterSpacing;
    }
    place();
  }, [place]);

  // Layout: runs regardless of reduced motion — sizing/positioning the
  // glyph mask against the container is not the "motion" this project's
  // reduced-motion handling is about. Only the drift raf loop and the
  // pointer-parallax listener below are gated on shouldReduceMotion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});

    if (shouldReduceMotion) {
      return () => {
        ro.disconnect();
      };
    }

    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const s = settingsRef.current;
      const off = offsetRef.current;

      const dx = Math.sin(clock * 0.21) * s.drift;
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;

      const ease = 1 - Math.exp(-dt / 0.18);
      off.x += (off.tx + dx - off.x) * ease;
      off.y += (off.ty + dy - off.y) * ease;

      place();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const s = settingsRef.current;
      if (s.parallax <= 0) return;
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;
    };

    const onLeave = () => {
      offsetRef.current.tx = 0;
      offsetRef.current.ty = 0;
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, sync, shouldReduceMotion]);

  useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return;
    const glyphs = glyphRefs.current.filter((g): g is SVGTextElement => g !== null);
    if (!glyphs.length) return;

    const riseDistance = () =>
      (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;

    const settle = () => {
      gsap.set(glyphs, { y: 0 });
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
    };

    const rest = () => {
      if (reveal === "rise") {
        gsap.set(glyphs, { y: riseDistance() });
      } else if (reveal === "wipe") {
        gsap.set(layer, { clipPath: "inset(0% 100% 0% 0%)" });
      } else if (reveal === "fade") {
        gsap.set(layer, { opacity: 0, scale: 1.08 });
      }
    };

    // Effect-only, not render-time — reads the media query directly rather
    // than the shared hook because nothing here feeds into JSX output on
    // first render, so there is no server/client markup to disagree.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reveal === "none" || reduce) {
      settle();
      return;
    }

    const play = () => {
      tweenRef.current?.kill();
      if (reveal === "rise") {
        gsap.set(layer, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: "power4.out", overwrite: "auto" },
        );
      } else if (reveal === "wipe") {
        gsap.set(glyphs, { y: 0 });
        const state = { p: 100 };
        tweenRef.current = gsap.to(state, {
          p: 0,
          duration,
          ease: "power3.inOut",
          overwrite: "auto",
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
          },
        });
      } else {
        gsap.set(glyphs, { y: 0 });
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: "power3.out", overwrite: "auto" },
        );
      }
    };

    if (trigger === "hover") {
      settle();
      root.addEventListener("pointerenter", play);
      return () => {
        root.removeEventListener("pointerenter", play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === "view") {
      settle();
      rest();
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(root);
      return () => {
        io.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal, trigger, duration, stagger, words]);

  // Video motion is a second, independent source of ambient movement on
  // top of the drift loop above — paused on its first frame for reduced
  // motion instead of autoplaying+looping indefinitely.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldReduceMotion) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [shouldReduceMotion]);

  return (
    <Tag
      ref={rootRef}
      id={id}
      className={`masked-heading ${className}`.trim()}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style,
      }}
    >
      <span ref={measureRef} className="masked-heading__measure">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="masked-heading__word"
          >
            {word}
            <i
              ref={(el) => {
                baseRefs.current[i] = el;
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </span>

      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`${word}-${i}`}
                ref={(el) => {
                  glyphRefs.current[i] = el;
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="masked-heading__reveal">
        <span
          className="masked-heading__clip"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <span ref={mediaRef} className="masked-heading__media">
            {mediaType === "video" ? (
              <video
                ref={videoRef}
                className="masked-heading__source"
                src={src}
                poster={poster || undefined}
                autoPlay={!shouldReduceMotion}
                muted
                loop
                playsInline
              />
            ) : (
              <img
                className="masked-heading__source"
                src={src}
                alt=""
                draggable={false}
              />
            )}
          </span>
        </span>
      </span>
    </Tag>
  );
}
