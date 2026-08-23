"use client";

import { useRef, type ReactNode } from "react";
import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

registerGsap();

/**
 * Seamless marquee whose speed — and direction — react to scroll velocity.
 * The content is rendered twice and the track travels exactly -50%, so the
 * loop is invisible regardless of content width.
 */
export default function Marquee({
  children,
  duration = 30,
  reverse = false,
  className = "",
  reactive = true,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  reactive?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const t = track.current!;
      const base = reverse ? -1 : 1;

      gsap.set(t, { xPercent: reverse ? -50 : 0 });
      const loop = gsap.to(t, {
        xPercent: reverse ? 0 : -50,
        duration,
        ease: "none",
        repeat: -1,
      });

      if (!reactive) return () => loop.kill();

      const state = { boost: 1, dir: 1 };
      let ticking = false;

      const tick = () => {
        // ease the boost back to rest instead of snapping
        state.boost += (1 - state.boost) * 0.045;
        loop.timeScale(base * state.dir * state.boost);
      };
      const start = () => {
        if (ticking) return;
        ticking = true;
        gsap.ticker.add(tick);
      };
      const stop = () => {
        if (!ticking) return;
        ticking = false;
        gsap.ticker.remove(tick);
        loop.timeScale(base);
      };

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? start() : stop()),
        onUpdate: (self) => {
          state.dir = self.direction === 1 ? 1 : -1;
          state.boost = Math.max(
            state.boost,
            gsap.utils.clamp(1, 5.5, 1 + Math.abs(self.getVelocity()) / 700),
          );
        },
      });

      return () => {
        stop();
        st.kill();
        loop.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
