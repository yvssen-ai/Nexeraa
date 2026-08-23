"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { perfTier, prefersReducedMotion } from "@/lib/env";

registerGsap();

type Node = { x: number; y: number; vx: number; vy: number; r: number };

const TIER = {
  low: { count: 24, link: 118, dpr: 1.5 },
  mid: { count: 44, link: 130, dpr: 1.75 },
  high: { count: 72, link: 150, dpr: 2 },
} as const;

/**
 * Drifting node field behind the hero.
 *
 * Perf contract:
 *  - one rAF, borrowed from gsap.ticker (never a second animation loop)
 *  - node count and device-pixel-ratio scale down on weak hardware
 *  - link lines are bucketed by opacity so a frame issues ~4 stroke calls
 *    instead of one per pair
 *  - the loop is detached entirely when the hero scrolls away or the tab is
 *    hidden, so it costs nothing for the rest of the page
 */
export default function SignalField({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const cv = canvas.current!;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const cfg = TIER[perfTier()];
    const dpr = Math.min(window.devicePixelRatio || 1, cfg.dpr);

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      // Keep density roughly constant instead of fixed count, so a tall
      // phone screen isn't sparse and a wide desktop isn't soup.
      const target = Math.round(gsap.utils.clamp(14, cfg.count, (w * h) / 26000));
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.19,
        vy: (Math.random() - 0.5) * 0.19,
        r: Math.random() * 1.5 + 0.7,
      }));
    };

    const resize = () => {
      const rect = cv.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();

    const LINK = cfg.link;
    const LINK2 = LINK * LINK;
    const BUCKETS = 4;
    const bucketAlpha = ["0.05", "0.09", "0.14", "0.2"];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }

      // Link lines, batched into a few opacity buckets
      const paths: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          const t = 1 - Math.sqrt(d2) / LINK;
          const bi = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
          const p = paths[bi];
          p.moveTo(a.x, a.y);
          p.lineTo(b.x, b.y);
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < BUCKETS; i++) {
        ctx.strokeStyle = `rgba(126,150,235,${bucketAlpha[i]})`;
        ctx.stroke(paths[i]);
      }

      // Nodes, tinted along the brand's blue → violet ramp by x position
      for (const n of nodes) {
        const mix = w ? n.x / w : 0;
        const r = Math.round(78 + mix * 61);
        const g = Math.round(125 - mix * 33);
        const bl = Math.round(232 + mix * 14);
        ctx.fillStyle = `rgba(${r},${g},${bl},0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pointer halo — a cheap radial wash, no per-node distance maths
      if (pointer.active) {
        const grd = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          170,
        );
        grd.addColorStop(0, "rgba(139,92,246,0.14)");
        grd.addColorStop(1, "rgba(139,92,246,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(pointer.x - 170, pointer.y - 170, 340, 340);
      }
    };

    /* ---- lifecycle: only tick while visible ---- */
    let ticking = false;
    const start = () => {
      if (ticking) return;
      ticking = true;
      gsap.ticker.add(draw);
    };
    const stop = () => {
      if (!ticking) return;
      ticking = false;
      gsap.ticker.remove(draw);
    };

    let inView = true;
    const sync = () => (inView && !document.hidden ? start() : stop());

    const st = ScrollTrigger.create({
      trigger: cv,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        sync();
      },
    });

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = cv.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active =
        pointer.x > -100 && pointer.x < w + 100 && pointer.y > -100 && pointer.y < h + 100;
    };
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (supportsHover) window.addEventListener("pointermove", onPointer, { passive: true });

    // ResizeObserver rather than window resize: it also catches the hero
    // changing height, and it does not fire for mobile URL-bar scrolls.
    let rt = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 160);
    });
    ro.observe(cv);

    sync();

    return () => {
      stop();
      st.kill();
      ro.disconnect();
      window.clearTimeout(rt);
      document.removeEventListener("visibilitychange", onVisibility);
      if (supportsHover) window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
