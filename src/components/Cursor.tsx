"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP } from "@/lib/gsap";

registerGsap();

/**
 * Pointer-device-only cursor: a precise dot plus a lagging ring that swells
 * over anything marked `data-cursor`. Positions are pushed with quickTo (a
 * single reused tween per axis) rather than a new tween per mousemove.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;

    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power2.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power2.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const onLeave = () => {
      shown = false;
      gsap.to([d, r], { opacity: 0, duration: 0.2 });
    };

    // Delegated so cards added or re-rendered later still work, and so we
    // don't attach two listeners per interactive element.
    const onOver = (e: Event) => {
      const t = (e.target as Element | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!t) return;
      const text = t.dataset.cursor ?? "";
      l.textContent = text;
      gsap.to(r, {
        scale: text ? 2.6 : 2,
        borderColor: "rgba(139,92,246,0.9)",
        backgroundColor: "rgba(139,92,246,0.10)",
        duration: 0.35,
        ease: "nx",
      });
      gsap.to(d, { scale: 0, duration: 0.25 });
      gsap.to(l, { opacity: 1, duration: 0.25 });
    };

    const onOut = (e: Event) => {
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      if (!t) return;
      // Moving between two children of the same target is not a real exit —
      // without this the ring collapses and re-expands on every inner hop.
      const to = (e as PointerEvent).relatedTarget as Node | null;
      if (to && t.contains(to)) return;
      gsap.to(r, {
        scale: 1,
        borderColor: "rgba(245,245,247,0.35)",
        backgroundColor: "rgba(245,245,247,0)",
        duration: 0.35,
        ease: "nx",
      });
      gsap.to(d, { scale: 1, duration: 0.25 });
      gsap.to(l, { opacity: 0, duration: 0.15 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
    };
  }, []);

  return (
    <div className="nx-cursor pointer-events-none fixed inset-0 z-[110] hidden pointer-fine:block">
      <div
        ref={ring}
        className="absolute top-0 left-0 flex size-9 items-center justify-center rounded-full border border-[rgba(245,245,247,0.35)] opacity-0"
      >
        <span
          ref={label}
          className="text-ink pointer-events-none font-mono text-[4px] tracking-[0.18em] uppercase opacity-0 select-none"
        />
      </div>
      <div ref={dot} className="bg-ink absolute top-0 left-0 size-1.5 rounded-full opacity-0" />
    </div>
  );
}
