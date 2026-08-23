"use client";

import { useRef, type ReactNode } from "react";
import { registerGsap, gsap, useGSAP } from "@/lib/gsap";

registerGsap();

/**
 * Pulls its child toward the pointer. Pointer devices only — on touch it
 * renders the child untouched with zero listeners attached.
 *
 * The bounding rect is cached on enter (and invalidated on resize/scroll-end)
 * so pointermove never forces a layout read.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const holder = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const host = holder.current!;
      const el = host.firstElementChild as HTMLElement | null;
      if (!el) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

      let rect: DOMRect | null = null;

      const onEnter = () => {
        rect = el.getBoundingClientRect();
      };
      const onMove = (e: PointerEvent) => {
        if (!rect) rect = el.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        rect = null;
        xTo(0);
        yTo(0);
      };

      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);

      return () => {
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: holder },
  );

  return (
    <span ref={holder} className={className ? `inline-flex ${className}` : "inline-flex"}>
      {children}
    </span>
  );
}
