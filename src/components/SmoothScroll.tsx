"use client";

import { useRef } from "react";
import { registerGsap, useGSAP, ScrollSmoother, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/env";

registerGsap();

/**
 * ScrollSmoother owns the page scroll on pointer devices. On touch it is
 * created with `smoothTouch: 0`, which makes it hand scrolling straight back
 * to the browser — native momentum, zero added latency, no rubber-banding.
 * That is deliberate: smoothed touch scrolling is the single biggest source
 * of "laggy" feel on phones.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapper.current!,
      content: content.current!,
      smooth: 1.1,
      smoothTouch: 0,
      effects: true, // enables data-speed / data-lag parallax
      normalizeScroll: false,
      ignoreMobileResize: true,
    });

    /**
     * Web fonts land after first paint and reflow every heading, so trigger
     * positions measured before that are wrong by a few dozen pixels.
     *
     * But a full refresh reverts and re-measures every pin, and on a throttled
     * phone one pass costs tens of milliseconds. Firing it from several places
     * (create, `load`, fonts-ready, intro-finished) stacked into a single
     * second-long blocking task. So: coalesce to exactly one, on the frame
     * after fonts settle, and skip it if the scroll position has not been
     * disturbed and nothing is pending.
     */
    let alive = true;
    let queued = 0;
    const refreshOnce = () => {
      if (!alive || queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        if (alive) ScrollTrigger.refresh();
      });
    };
    document.fonts?.ready.then(refreshOnce);

    return () => {
      alive = false;
      if (queued) cancelAnimationFrame(queued);
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
