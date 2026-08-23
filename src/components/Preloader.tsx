"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP } from "@/lib/gsap";
import { markReady } from "@/lib/bus";
import { Wordmark } from "@/components/brand/Logo";

registerGsap();

const PANELS = 5;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const barFill = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;

      // `nx-skip-intro` is set before first paint by the inline head script
      // (reduced motion, or the intro already played this session).
      if (document.documentElement.classList.contains("nx-skip-intro")) {
        el.remove();
        markReady();
        return;
      }

      // Hold the page still while the intro plays. Non-passive listeners are
      // the only way to actually cancel a wheel/touch scroll, and this avoids
      // touching `overflow`, which would resize the document and force
      // ScrollTrigger to recompute every trigger the moment we released it.
      const block = (e: Event) => e.preventDefault();
      const blockKeys = (e: KeyboardEvent) => {
        if (
          [" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)
        ) {
          e.preventDefault();
        }
      };
      const opts = { passive: false } as const;
      window.scrollTo(0, 0);
      window.addEventListener("wheel", block, opts);
      window.addEventListener("touchmove", block, opts);
      window.addEventListener("keydown", blockKeys, opts);

      const release = () => {
        window.removeEventListener("wheel", block);
        window.removeEventListener("touchmove", block);
        window.removeEventListener("keydown", blockKeys);
      };

      // Idempotent hand-off: whatever happens — normal completion, a thrown
      // error, or the watchdog — the page is released exactly once and the
      // hero is told to start. The intro must never be able to trap the site.
      let handedOver = false;
      const finish = () => {
        if (handedOver) return;
        handedOver = true;
        window.clearTimeout(watchdog);
        release();
        // The overlay is position:fixed, so removing it changes no layout and
        // no ScrollTrigger.refresh() is warranted here. SmoothScroll owns the
        // single post-font refresh.
        el.remove();
        markReady();
      };
      const watchdog = window.setTimeout(finish, 6000);

      const progress = { v: 0 };
      const tl = gsap.timeline({ defaults: { ease: "nx" }, onComplete: finish });

      tl.from(".nx-pre-letter", {
        yPercent: 118,
        duration: 1,
        stagger: 0.055,
      })
        .from(".nx-pre-chev", { drawSVG: 0, duration: 1.1 }, 0.25)
        .from(".nx-pre-shard", { opacity: 0, duration: 0.6 }, 0.75)
        .to(
          progress,
          {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              const n = Math.round(progress.v);
              if (count.current) count.current.textContent = String(n).padStart(3, "0");
            },
          },
          0,
        )
        .to(barFill.current, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".nx-pre-fade", { opacity: 0, duration: 0.45, ease: "power2.in" }, "+=0.15")
        .to(
          ".nx-pre-panel",
          {
            yPercent: -100,
            duration: 0.95,
            ease: "nxInOut",
            stagger: { each: 0.07, from: "start" },
          },
          "<0.1",
        );

      return () => {
        window.clearTimeout(watchdog);
        release();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="nx-preloader fixed inset-0 z-[120] flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Panels form the backdrop and then lift away to reveal the hero */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }, (_, i) => (
          <span key={i} className="nx-pre-panel bg-void h-full flex-1" />
        ))}
      </div>

      <div className="nx-pre-fade relative flex w-full max-w-[min(78vw,42rem)] flex-col items-center gap-7 px-6">
        <Wordmark className="text-ink w-full" hooks="nx-pre" />

        <div className="flex w-full items-center gap-4">
          <span className="bg-line-2 relative h-px flex-1 overflow-hidden">
            <span
              ref={barFill}
              className="from-blue to-violet absolute inset-0 origin-left scale-x-0 bg-linear-to-r"
            />
          </span>
          <span
            ref={count}
            className="text-ink-mute font-mono text-xs tracking-[0.2em] tabular-nums"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
