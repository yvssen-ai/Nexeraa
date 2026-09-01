"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP, SplitText } from "@/lib/gsap";
import { STATS } from "@/lib/content";

registerGsap();

/** Resting opacity of a word before the sweep reaches it. */
const DIM = 0.16;

const LINE =
  "We are a small senior team that builds the digital core of a business — the site, the store, the automations, the demand engine and the brand that ties them together. One partner, five disciplines, no hand-offs.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---- statement: words brighten as the section scrolls past ----
           The dim state is set separately, not via fromTo. A *staggered*
           fromTo only renders its "from" on the first target — the rest keep
           their natural opacity until their own start time comes round, then
           snap to dim and fade. That reads as flicker, and leaves the whole
           sentence lit before the reveal has begun. */
        const copy = root.current!.querySelector<HTMLElement>(".nx-manifesto-copy")!;
        const split = SplitText.create(copy, {
          type: "words",
          aria: "auto",
          onSplit: (self) => {
            gsap.set(self.words, { opacity: DIM });
            return gsap.to(self.words, {
              opacity: 1,
              ease: "none",
              duration: 0.6,
              // `amount` spreads every word's start across a fixed span, so the
              // sweep takes the same share of the scroll whatever the sentence
              // length — a bare `each` would stretch with the word count.
              stagger: { amount: 4 },
              scrollTrigger: {
                trigger: copy,
                start: "top 88%",
                end: "bottom 48%",
                scrub: 0.4,
              },
            });
          },
        });

        /* ---- counters ---- */
        const counters = gsap.utils.toArray<HTMLElement>("[data-count]", root.current);
        const tweens = counters.map((el) => {
          const target = Number(el.dataset.count);
          const obj = { v: 0 };
          return gsap.to(obj, {
            v: target,
            duration: 1.9,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        return () => {
          split.revert();
          tweens.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="section-y relative scroll-mt-24">
      <div className="container-nx">
        <p className="eyebrow" data-anim="fade-up">
          [ 01 ] — Who we are
        </p>

        <p className="nx-manifesto-copy font-display text-ink mt-7 max-w-[22ch] text-[clamp(1.75rem,6.2vw,4rem)] leading-[1.08] font-semibold tracking-tight sm:max-w-[18ch] md:max-w-[24ch]">
          {LINE}
        </p>

        <div className="border-line mt-14 grid grid-cols-2 gap-x-5 gap-y-9 border-t pt-10 sm:mt-20 lg:grid-cols-4 lg:gap-8">
          {STATS.map((s) => (
            <div key={s.label} data-anim="fade-up">
              <p className="font-display text-[clamp(2.25rem,7vw,3.5rem)] leading-none font-semibold tracking-tight">
                <span className="text-gradient tabular-nums" data-count={s.value}>
                  0
                </span>
                <span className="text-gradient">{s.suffix}</span>
              </p>
              <p className="text-ink-mute mt-2.5 text-sm sm:mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
