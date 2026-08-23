"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { SERVICES } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/ArrowIcon";

registerGsap();

function Card({
  s,
  i,
  variant,
}: {
  s: (typeof SERVICES)[number];
  i: number;
  variant: "rail" | "stack";
}) {
  const rail = variant === "rail";
  return (
    <article
      className={
        // Opaque, not translucent: stacked cards must fully hide the one
        // beneath. It also drops a backdrop-filter from the paint path.
        "nx-svc-card group border-line bg-surface relative flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border " +
        (rail
          ? "h-[clamp(26rem,62vh,34rem)] w-[min(78vw,27rem)] p-7 sm:p-9"
          : "w-full p-6 sm:p-8")
      }
      style={{ ["--accent" as string]: s.accent }}
    >
      {/* accent wash + hairline, both pure paint, no filters */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 78% at 8% 0%, ${s.accent}22 0%, transparent 58%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }}
      />
      <span
        aria-hidden
        className="nx-svc-ghost font-display text-ink/[0.035] pointer-events-none absolute -top-8 -right-4 text-[8rem] leading-none font-bold tracking-tighter select-none sm:text-[11rem]"
      >
        {s.index}
      </span>

      <header className="relative">
        <p className="text-ink-mute flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
          <span
            aria-hidden
            className="size-1.5 rotate-45"
            style={{ backgroundColor: s.accent }}
          />
          {s.index} / 05
        </p>
        <h3 className="font-display text-ink mt-4 text-[clamp(1.5rem,6vw,2.25rem)] font-semibold tracking-tight sm:mt-5">
          {s.title}
        </h3>
        <p
          className="mt-1.5 text-sm font-medium sm:mt-2 sm:text-[0.9375rem]"
          style={{ color: s.accent }}
        >
          {s.tagline}
        </p>
        <p className="text-ink-dim mt-3 max-w-[44ch] text-sm leading-relaxed sm:mt-4 sm:text-[0.9375rem]">
          {s.body}
        </p>
      </header>

      <ul className="relative mt-5 flex flex-wrap gap-1.5 sm:mt-7">
        {s.deliverables.map((d) => (
          <li
            key={d}
            className="border-line text-ink-mute group-hover:border-line-2 group-hover:text-ink-dim rounded-full border px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.06em] uppercase transition-colors duration-500 sm:px-3 sm:py-1.5 sm:text-[0.625rem] sm:tracking-[0.12em]"
          >
            {d}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        data-cursor="Enquire"
        className="text-ink relative mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium sm:mt-7"
      >
        <span className="relative">
          Discuss {s.short}
          <span
            className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100"
            style={{ backgroundColor: s.accent }}
          />
        </span>
        <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>

      <span className="sr-only">
        Service {i + 1} of {SERVICES.length}
      </span>
    </article>
  );
}

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      /* ---------- desktop: pin the rail, scrub it sideways ---------- */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const wrap = root.current!.querySelector<HTMLElement>(".nx-svc-viewport")!;
        const track = root.current!.querySelector<HTMLElement>(".nx-svc-track")!;
        const bar = root.current!.querySelector<HTMLElement>(".nx-svc-bar")!;

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
          },
        });

        tl.to(track, { x: () => -distance(), ease: "none", duration: 1 }, 0)
          // the oversized index numerals drift against the rail
          .fromTo(
            ".nx-svc-rail .nx-svc-ghost",
            { xPercent: 14 },
            { xPercent: -14, ease: "none", duration: 1 },
            0,
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      /* ---------- narrow viewports: cards stack and deepen ----------
         Pinned with ScrollTrigger rather than `position: sticky`. Sticky is
         inert whenever ScrollSmoother is active, because the smoother puts the
         page inside a fixed, overflow:hidden wrapper that never scrolls — so a
         CSS stack silently degrades on any desktop window under 1024px. A pin
         behaves identically in both scroll modes. */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const stack = root.current!.querySelector<HTMLElement>(".nx-svc-stack")!;
        const cards = gsap.utils.toArray<HTMLElement>(".nx-svc-card", stack);

        const pins = cards.map((card, i) =>
          ScrollTrigger.create({
            trigger: card,
            start: () => `top ${88 + i * 12}`,
            endTrigger: stack,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          }),
        );

        const tweens = cards.slice(0, -1).map((card, i) =>
          // Recede by scale only. Fading a covered card makes the card two
          // places down read through it, and the stack turns to mush in the
          // transition zone — the cards are opaque for the same reason.
          gsap.to(card, {
            scale: 0.93,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 92%",
              end: "top 22%",
              scrub: 0.4,
            },
          }),
        );

        return () => {
          pins.forEach((t) => t.kill());
          tweens.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="relative scroll-mt-24 pt-24 sm:pt-32">
      <div className="container-nx">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow" data-anim="fade-up">
              [ 02 ] — What we do
            </p>
            <h2
              className="font-display mt-5 max-w-[16ch] text-[clamp(2.25rem,8vw,4.5rem)] font-semibold tracking-tight"
              data-anim="fade-up"
            >
              Five disciplines,
              <br />
              <span className="text-gradient">one operating system.</span>
            </h2>
          </div>
          <p
            className="text-ink-dim max-w-[34ch] text-[0.9375rem] md:text-right"
            data-anim="fade-up"
          >
            Hire one of them or all five. They are built to compound — the brand feeds the site,
            the site feeds the store, the automations feed everything.
          </p>
        </div>
      </div>

      {/* ---------- desktop rail ---------- */}
      <div className="nx-svc-rail mt-16 hidden lg:block">
        <div className="nx-svc-viewport relative flex h-svh items-center overflow-hidden">
          <div className="nx-svc-track flex gap-6 pr-[18vw] pl-[max(3rem,calc((100vw-84rem)/2+3rem))]">
            {SERVICES.map((s, i) => (
              <Card key={s.id} s={s} i={i} variant="rail" />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto w-[min(84rem,100%-6rem)]">
            <div className="flex items-center gap-4">
              <span className="text-ink-mute font-mono text-[0.625rem] tracking-[0.2em] uppercase">
                Drag-free · scroll to explore
              </span>
              <span className="bg-line relative h-px flex-1 overflow-hidden">
                <span className="nx-svc-bar from-blue to-violet-hi absolute inset-0 origin-left scale-x-0 bg-linear-to-r" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- mobile stack ---------- */}
      <div className="nx-svc-stack container-nx mt-12 pb-20 lg:hidden">
        {SERVICES.map((s, i) => (
          <div key={s.id} className="mb-6 last:mb-0">
            <Card s={s} i={i} variant="stack" />
          </div>
        ))}
      </div>
    </section>
  );
}
