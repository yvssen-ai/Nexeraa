"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/brand/Logo";
import { NAV_LINKS, SERVICES, CONTACT_EMAIL } from "@/lib/content";

registerGsap();

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X", href: "https://x.com/" },
  { label: "Dribbble", href: "https://dribbble.com/" },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 92%",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });
        tl.fromTo(
          ".nx-foot-letter",
          { yPercent: 42, opacity: 0.25 },
          { yPercent: 0, opacity: 1, ease: "none", stagger: 0.06 },
          0,
        ).fromTo(".nx-foot-chev", { opacity: 0 }, { opacity: 1, ease: "none" }, 0.2);
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const year = 2026;

  return (
    <footer ref={root} className="border-line relative overflow-hidden border-t pt-20 sm:pt-28">
      <div className="container-nx">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div>
            <p className="font-display text-ink max-w-[26ch] text-xl font-medium tracking-tight sm:text-2xl">
              One partner for the whole digital core.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-ink-dim decoration-line-2 hover:text-ink hover:decoration-violet mt-5 inline-block text-[0.9375rem] underline underline-offset-4 transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Navigate</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-ink-dim hover:text-ink text-[0.9375rem] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Services</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="text-ink-dim hover:text-ink text-[0.9375rem] transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-line mt-16 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-mute font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
            © {year} NEXERA — All rights reserved
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink-mute hover:text-ink font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Oversized sign-off — clipped so the letters rise out of the edge */}
      {/* One opacity on the wrapper keeps letters, chevron and shard in the
          same key — per-part alpha made the glyph read as an outline. */}
      <div className="mt-14 overflow-hidden px-3 opacity-[0.11] sm:mt-20 sm:px-6">
        <Wordmark className="text-ink w-full" hooks="nx-foot" decorative />
      </div>
    </footer>
  );
}
