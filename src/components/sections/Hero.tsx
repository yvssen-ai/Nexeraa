"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP } from "@/lib/gsap";
import { onReady } from "@/lib/bus";
import { Wordmark } from "@/components/brand/Logo";
import SignalField from "@/components/SignalField";
import Magnetic from "@/components/ui/Magnetic";
import Button from "@/components/ui/Button";
import { ArrowUpRight, ArrowDown } from "@/components/ui/ArrowIcon";

registerGsap();

const PILLARS = ["Web Development", "E-Commerce", "AI Automation", "Marketing", "Branding"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        // Resolve targets from the section itself rather than bare selector
        // strings: the intro is kicked off from a callback that runs outside
        // this context, where a selector string would resolve globally.
        const pick = <T extends Element = HTMLElement>(sel: string) =>
          Array.from(el.querySelectorAll<T>(sel));

        const letters = pick<SVGPathElement>(".nx-hero-letter");
        const chev = pick<SVGPathElement>(".nx-hero-chev");
        const shard = pick<SVGPathElement>(".nx-hero-shard");
        const eyebrow = pick(".nx-hero-eyebrow");
        const sub = pick(".nx-hero-sub");
        const cta = pick(".nx-hero-cta");
        const cue = pick(".nx-hero-cue");
        const pillars = pick(".nx-hero-pillar");

        /* ---------- entrance, held until the preloader hands over ---------- */
        gsap.set(letters, { yPercent: 118 });
        gsap.set(shard, { opacity: 0 });
        gsap.set([...eyebrow, ...sub, ...cta, ...cue], { y: 26, opacity: 0 });
        gsap.set(pillars, { y: 14, opacity: 0 });

        let intro: gsap.core.Timeline | null = null;
        const play = () => {
          if (intro) return;
          intro = gsap
            .timeline({ defaults: { ease: "nx" } })
            .to(eyebrow, { y: 0, opacity: 1, duration: 0.8 }, 0)
            .to(letters, { yPercent: 0, duration: 1.15, stagger: 0.06 }, 0.08)
            .from(chev, { drawSVG: 0, duration: 1.2 }, 0.4)
            .to(shard, { opacity: 1, duration: 0.7 }, 0.95)
            .to(sub, { y: 0, opacity: 1, duration: 0.9 }, 0.72)
            .to(pillars, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, 0.82)
            .to(cta, { y: 0, opacity: 1, duration: 0.9 }, 0.95)
            .to(cue, { y: 0, opacity: 1, duration: 0.8 }, 1.1);
        };

        const off = onReady(play);
        // Failsafe: if the hand-off never arrives the hero must not stay blank.
        const guard = window.setTimeout(play, 6000);

        /* ---------- exit: the hero recedes as the page moves on ---------- */
        const out = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
        out
          .to(".nx-hero-stage", { yPercent: -14, scale: 0.94, ease: "none" }, 0)
          .to(".nx-hero-stage", { opacity: 0, ease: "power1.in" }, 0.35)
          .to(".nx-hero-cue", { opacity: 0, ease: "none" }, 0);

        return () => {
          off();
          window.clearTimeout(guard);
          intro?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-36 sm:pb-32"
    >
      {/* --- ambient background: gradients are painted once, canvas ticks --- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#101a2b_0%,#08090d_45%,#06070a_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(126,150,235,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(126,150,235,0.055) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(78% 62% at 50% 42%, #000 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(78% 62% at 50% 42%, #000 20%, transparent 100%)",
          }}
        />
        <SignalField className="absolute inset-0 size-full" />
        <div className="absolute top-[6%] -left-[18%] size-[46rem] max-w-[130vw] rounded-full bg-[radial-gradient(circle,rgba(78,125,232,0.16),transparent_62%)] motion-safe:animate-[pulse-glow_9s_var(--ease-in-out-quart)_infinite]" />
        <div className="absolute -right-[16%] bottom-[-14%] size-[42rem] max-w-[130vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.16),transparent_62%)] motion-safe:animate-[pulse-glow_11s_var(--ease-in-out-quart)_infinite_reverse]" />
        <div className="to-void absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent" />
      </div>

      <div className="nx-hero-stage container-nx relative flex flex-col items-center text-center">
        <p className="nx-hero-eyebrow eyebrow flex items-center gap-2.5">
          <span className="relative flex size-1.5">
            <span className="bg-violet absolute inline-flex size-full animate-ping rounded-full opacity-70 motion-reduce:hidden" />
            <span className="bg-violet relative inline-flex size-1.5 rounded-full" />
          </span>
          Modern digital agency
        </p>

        <h1 className="mt-6 w-full sm:mt-8">
          <span className="sr-only">NEXERA — modern digital agency</span>
          <Wordmark className="text-ink w-full" hooks="nx-hero" decorative />
        </h1>

        <p className="nx-hero-sub text-ink-dim mt-4 max-w-[46ch] text-base text-balance sm:mt-6 sm:text-lg">
          We design, build and automate the systems that grow modern brands — from the first
          pixel to the last conversion.
        </p>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:mt-9 sm:gap-x-3">
          {PILLARS.map((p) => (
            <li
              key={p}
              className="nx-hero-pillar border-line text-ink-dim rounded-full border px-3.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase sm:text-[0.6875rem]"
            >
              {p}
            </li>
          ))}
        </ul>

        <div className="nx-hero-cta mt-9 flex w-full flex-col items-center justify-center gap-3 sm:mt-11 sm:w-auto sm:flex-row sm:gap-4">
          <Magnetic className="w-full sm:w-auto">
            <Button
              as="a"
              href="#contact"
              data-cursor="Let's talk"
              className="w-full sm:w-auto"
            >
              Start a project
              <ArrowUpRight />
            </Button>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto" strength={0.22}>
            <Button
              as="a"
              href="#work"
              variant="ghost"
              data-cursor="View"
              className="w-full sm:w-auto"
            >
              See the work
            </Button>
          </Magnetic>
        </div>
      </div>

      <a
        href="#services"
        className="nx-hero-cue text-ink-mute hover:text-ink absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] mx-auto flex w-fit flex-col items-center gap-1.5 transition-colors sm:bottom-8 sm:gap-2"
      >
        <span className="font-mono text-[0.625rem] tracking-[0.2em] uppercase">Scroll</span>
        <span className="bg-line-2 relative flex h-7 w-px overflow-hidden sm:h-9">
          <span className="to-violet absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-transparent motion-safe:animate-[scan_2.4s_ease-in-out_infinite]" />
        </span>
        <ArrowDown className="size-3.5" />
      </a>
    </section>
  );
}
