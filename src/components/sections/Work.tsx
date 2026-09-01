"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP } from "@/lib/gsap";
import { WORK } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/ArrowIcon";

registerGsap();

const HUES = ["#4E7DE8", "#6478EE", "#7B6BF4", "#8B5CF6", "#A855F7", "#5C8CF0"];

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      // Tilt is a pointer-device affordance only; on touch it would fight
      // with scrolling and never resolve.
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>(".nx-work-card", root.current);
          const cleanups = cards.map((card) => {
            const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3.out" });
            const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3.out" });
            let rect: DOMRect | null = null;

            const enter = () => {
              rect = card.getBoundingClientRect();
            };
            const move = (e: PointerEvent) => {
              if (!rect) rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5;
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              ry(px * 9);
              rx(-py * 9);
            };
            const leave = () => {
              rect = null;
              rx(0);
              ry(0);
            };

            card.addEventListener("pointerenter", enter);
            card.addEventListener("pointermove", move);
            card.addEventListener("pointerleave", leave);
            return () => {
              card.removeEventListener("pointerenter", enter);
              card.removeEventListener("pointermove", move);
              card.removeEventListener("pointerleave", leave);
            };
          });
          return () => cleanups.forEach((fn) => fn());
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="section-y bg-black-2/40 relative scroll-mt-24">
      <div className="container-nx">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow" data-anim="fade-up">
              [ 02 ] — Selected work
            </p>
            <h2
              className="font-display mt-5 max-w-[14ch] text-[clamp(2.25rem,8vw,4.5rem)] font-semibold tracking-tight"
              data-anim="fade-up"
            >
              Results, not <span className="text-gradient">screenshots.</span>
            </h2>
          </div>
          <a
            href="#contact"
            data-cursor="Enquire"
            data-anim="fade-up"
            className="group text-ink-dim hover:text-ink inline-flex w-fit items-center gap-2 text-sm font-medium transition-colors"
          >
            Ask for the full case studies
            <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {WORK.map((w, i) => {
            const accent = HUES[i % HUES.length];
            return (
              <li key={w.id} data-anim="fade-up" className="[perspective:1200px]">
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="Visit site"
                  className="nx-work-card group border-line bg-surface hover:border-line-2 relative flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-500 [transform-style:preserve-3d]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={w.thumb}
                      alt=""
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    {/* melt the shot into the card rather than ending on a hard edge */}
                    <span
                      aria-hidden
                      className="from-surface absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
                    />
                  </div>

                  <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(120% 80% at 50% 0%, ${accent}22, transparent 66%)`,
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <p className="text-ink-mute font-mono text-[0.625rem] tracking-[0.18em] uppercase">
                        {w.kind}
                      </p>
                      <p className="text-ink-faint font-mono text-[0.625rem] tracking-[0.18em]">
                        {w.year}
                      </p>
                    </div>

                    <div className="relative mt-4">
                      <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
                        {w.name}
                      </h3>
                      {w.result && (
                        <p className="mt-1.5 text-sm font-medium" style={{ color: accent }}>
                          {w.result}
                        </p>
                      )}
                      <p className="text-ink-dim mt-2.5 text-[0.8125rem] leading-relaxed">
                        {w.summary}
                      </p>
                    </div>

                    <div className="border-line relative mt-auto flex items-center justify-between gap-4 border-t pt-5">
                      <p className="text-ink-faint font-mono text-[0.625rem] tracking-[0.1em] uppercase">
                        {w.stack}
                      </p>
                      <span
                        aria-hidden
                        className="border-line text-ink-dim group-hover:bg-ink group-hover:text-void inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:border-transparent"
                      >
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>

                    <span className="sr-only">Visit the {w.name} site</span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
