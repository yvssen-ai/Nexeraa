"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { PROCESS } from "@/lib/content";

registerGsap();

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const list = root.current!.querySelector<HTMLElement>(".nx-proc-list")!;
        const line = root.current!.querySelector<HTMLElement>(".nx-proc-line")!;

        // scaleY on a 1px element — cheaper and far more predictable across
        // browsers than stroke-dash maths on a non-uniformly scaled SVG
        const draw = gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 62%",
              end: "bottom 78%",
              scrub: 0.35,
            },
          },
        );

        const steps = gsap.utils.toArray<HTMLElement>(".nx-proc-step", root.current).map((el) =>
          gsap.to(el.querySelector(".nx-proc-dot"), {
            scale: 1,
            backgroundColor: "#8B5CF6",
            borderColor: "#8B5CF6",
            duration: 0.5,
            ease: "nx",
            scrollTrigger: { trigger: el, start: "top 62%", once: true },
          }),
        );

        return () => {
          draw.kill();
          steps.forEach((t) => t.kill());
        };
      });

      /* Pin the heading column instead of `position: sticky` — sticky never
         engages while ScrollSmoother owns the scroll (fixed, overflow:hidden
         wrapper), so the CSS version simply scrolls away on desktop. */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const head = root.current!.querySelector<HTMLElement>(".nx-proc-head")!;
        const list = root.current!.querySelector<HTMLElement>(".nx-proc-list")!;
        const st = ScrollTrigger.create({
          trigger: head,
          start: "top 112px",
          endTrigger: list,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="section-y relative scroll-mt-24">
      <div className="container-nx grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        {/* The grid item keeps its stretched height; the inner block is what
            ScrollTrigger pins, so the column never collapses. */}
        <div>
          <div className="nx-proc-head">
            <p className="eyebrow" data-anim="fade-up">
              [ 03 ] — How we work
            </p>
            <h2
              className="font-display mt-5 max-w-[14ch] text-[clamp(2.25rem,8vw,4rem)] font-semibold tracking-tight"
              data-anim="fade-up"
            >
              A process you can <span className="text-gradient">hold us to.</span>
            </h2>
            <p
              className="text-ink-dim mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed"
              data-anim="fade-up"
            >
              Four stages, fixed scope at each one, and a written brief you keep whether or not
              you carry on with us.
            </p>
          </div>
        </div>

        <ol className="nx-proc-list relative pt-2 lg:pt-4">
          <span
            aria-hidden
            className="bg-line absolute top-2 left-[7px] h-[calc(100%-1.5rem)] w-px"
          />
          <span
            aria-hidden
            className="nx-proc-line from-blue via-iris to-violet-hi absolute top-2 left-[7px] h-[calc(100%-1.5rem)] w-px origin-top bg-linear-to-b"
          />

          {PROCESS.map((p) => (
            <li
              key={p.step}
              className="nx-proc-step relative grid grid-cols-[auto_1fr] gap-x-6 pb-12 last:pb-0 sm:gap-x-8 sm:pb-16 lg:pb-28"
            >
              <span
                aria-hidden
                className="nx-proc-dot border-line-2 bg-void relative z-10 mt-[7px] size-[15px] scale-75 rounded-full border-2"
              />
              <div data-anim="fade-up" className="relative">
                <span
                  aria-hidden
                  className="font-display text-ink/[0.035] pointer-events-none absolute -top-6 right-0 text-[5rem] leading-none font-bold tracking-tighter select-none sm:text-[7rem] lg:-top-10 lg:text-[9rem]"
                >
                  {p.step}
                </span>
                <p className="text-ink-mute relative font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
                  Step {p.step}
                </p>
                <h3 className="font-display relative mt-2 text-2xl font-semibold tracking-tight sm:text-[2rem] lg:mt-3 lg:text-[2.75rem]">
                  {p.title}
                </h3>
                <p className="text-ink-dim relative mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed lg:mt-5 lg:text-base">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
