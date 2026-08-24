"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./circular-gallery.css";

/**
 * Ported in spirit from the reactbits-family "circular gallery" pattern
 * (21st.dev/@ravikatiyar162/components/circular-gallery) rather than
 * copied: that build couldn't be fetched as source (the page renders the
 * code panel client-side, and the one attempt to extract it verbatim hit
 * the fetch tool's own fair-use refusal) — no registry JSON either, unlike
 * the reactbits components ported elsewhere in this codebase. So this is a
 * from-scratch build matching the reference's actual behaviour (images on
 * a rotating 3D cylinder, drag/buttons/keyboard to spin it) rather than a
 * line-for-line port, in this project's own conventions: CSS transforms
 * plus a couple of refs, no WebGL/OGL dependency, styled to match the
 * Reviews section's hard-edged bordered-card language instead of the
 * reference's own look.
 *
 * Radius is measured, not assumed. `angleStep = 360 / items.length`
 * evenly spaces every item around a full circle with no gaps, so the
 * spin loops smoothly forever in either direction — but that only frames
 * items correctly if `radius` (the translateZ distance) actually matches
 * the rendered card width. Tried a fixed px radius first and it drifted
 * out of sync the moment the item's CSS width changed at the sm:
 * breakpoint (circular-gallery.css). Measuring the first card's own
 * offsetWidth via ResizeObserver — same technique as masked-heading.tsx's
 * sync() used earlier in this codebase — keeps it correct at every width
 * without hardcoding a breakpoint table here that would drift from the
 * CSS file's own breakpoint if either one changed later.
 *
 * Drag skips the CSS transition (instant, 1:1 with the pointer delta) so
 * the spin feels directly grabbed rather than laggy; releasing it snaps to
 * the nearest item with the transition back on. The Previous/Next buttons
 * and arrow keys are the same snap, triggered without a drag ever starting
 * — they exist because dragging isn't keyboard-operable, and this is real
 * content (a client's actual result), not decoration, so it needs a
 * non-pointer path.
 *
 * Deliberately no wheel/scroll handler: an earlier version spun the
 * carousel on wheel/trackpad input, which fought the page's own scroll the
 * moment the cursor was over the gallery. Drag and the buttons/arrow keys
 * are the only ways to move it now — wheel input just scrolls the page,
 * like everywhere else on the site.
 *
 * No prefers-reduced-motion branch needed in this file: every animated
 * transform here is `transition`-driven CSS, not a JS-timed animation, and
 * the sitewide blanket rule in globals.css ("Motion preferences") already
 * forces transition-duration to ~0 for every element when that's set —
 * snapping becomes instant automatically, same free ride pillar-drift and
 * the hero shine sweep get.
 */

export type CircularGalleryItem = {
  src: string;
  alt: string;
};

type CircularGalleryProps = {
  items: CircularGalleryItem[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  className?: string;
};

function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

/**
 * Compresses how far each item actually rotates on screen relative to the
 * "data" angle used for snapping (itemAngle, rotation — both plain
 * 360/count steps). Only the rendered rotateY() reads through this; the
 * offset used for opacity/scale below deliberately doesn't, since that's
 * just a 0-180 fraction and stays meaningful either way. 1 = items rotate
 * their full data angle (edge-on neighbours with few items, see the note
 * above measure()); smaller compresses the arc so neighbours stay tilted
 * toward the viewer instead of disappearing. 0.55 was picked by looking at
 * it, not derived — the only real constraint is staying well short of 1.
 */
const VISUAL_SPREAD = 0.55;

export function CircularGallery({
  items,
  label,
  prevLabel,
  nextLabel,
  className = "",
}: CircularGalleryProps) {
  const firstItemRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [snapping, setSnapping] = useState(true);

  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, rotation: 0 });

  const angleStep = 360 / items.length;

  useEffect(() => {
    const el = firstItemRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.offsetWidth;
      // Distance from the circle's centre so items VISUAL_STEP apart just
      // meet edge-to-edge, per-item width halved over tan(half the angle
      // between neighbours) — the standard regular-polygon circumradius
      // formula. Built on VISUAL_STEP (see below), not the full angleStep
      // — first pass used angleStep directly and with only 4 items that's
      // 90° apart, which puts every neighbour at a dead-on 90° rotation:
      // rotateY(90deg) is edge-on to the viewer, zero width in projection,
      // so the whole gallery rendered as a single photo with two arrow
      // buttons next to it and nothing hinting there was more to see.
      const visualStepRad = ((angleStep * VISUAL_SPREAD) * Math.PI) / 180;
      setRadius(width / 2 / Math.tan(visualStepRad / 2));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length, angleStep]);

  const snapToNearest = useCallback(
    (extraSteps = 0) => {
      setSnapping(true);
      setRotation(
        (r) => Math.round(r / angleStep) * angleStep + extraSteps * angleStep,
      );
    },
    [angleStep],
  );

  function onPointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    setSnapping(false);
    dragStartRef.current = { x: e.clientX, rotation };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    setRotation(dragStartRef.current.rotation - dx * 0.4);
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    snapToNearest();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      snapToNearest(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      snapToNearest(1);
    }
  }

  return (
    <div className={className}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className="circular-gallery__stage"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <div
          className="circular-gallery__track"
          style={{ transform: `translateZ(${-radius}px)` }}
        >
          {items.map((item, i) => {
            const itemAngle = i * angleStep;
            // Signed, not just abs — each item needs its own position
            // relative to "front" (positive one side, negative the
            // other) so VISUAL_SPREAD compresses symmetrically. An
            // earlier version scaled the raw itemAngle (0/90/180/270 by
            // index) instead of this: rotateY is periodic but not
            // symmetric around an arbitrary rotation, so that put three
            // of the four items at wildly wrong angles the moment
            // `rotation` moved off 0 — only ever one neighbour rendered
            // visibly instead of both.
            const signedOffset = normalizeAngle(itemAngle - rotation);
            const offset = Math.abs(signedOffset);
            const scale = Math.max(0.72, 1 - (offset / 180) * 0.4);
            const opacity = Math.max(0.3, 1 - (offset / 180) * 0.85);

            return (
              <div
                key={item.src}
                ref={i === 0 ? firstItemRef : undefined}
                className="circular-gallery__item"
                aria-hidden={offset > angleStep / 2 + 1}
                style={{
                  transform: `rotateY(${signedOffset * VISUAL_SPREAD}deg) translateZ(${radius}px) scale(${scale})`,
                  opacity,
                  transition: snapping
                    ? "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease"
                    : "none",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 380px, 300px"
                  className="pointer-events-none object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => snapToNearest(-1)}
          className="grid size-10 place-items-center border border-border-paper text-on-paper transition-colors hover:border-on-paper/50"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => snapToNearest(1)}
          className="grid size-10 place-items-center border border-border-paper text-on-paper transition-colors hover:border-on-paper/50"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
