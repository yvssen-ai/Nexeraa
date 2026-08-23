"use client";

import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

registerGsap();

/**
 * One batched controller for every `[data-anim]` element on the page instead
 * of a ScrollTrigger per element. Elements that scroll into view within the
 * same frame animate together with a stagger, which is both cheaper and
 * looks intentional.
 *
 * The pre-animation state lives in CSS behind `html.nx-js`, so server HTML is
 * never left invisible if JS fails or motion is reduced.
 */
export default function Reveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const common = { start: "top 88%", once: true } as const;

      ScrollTrigger.batch("[data-anim='fade-up']", {
        ...common,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "nx",
            stagger: 0.08,
            overwrite: true,
          }),
      });

      ScrollTrigger.batch("[data-anim='fade']", {
        ...common,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            duration: 1.1,
            ease: "nx",
            stagger: 0.07,
            overwrite: true,
          }),
      });

      ScrollTrigger.batch("[data-anim='clip-up']", {
        ...common,
        onEnter: (batch) =>
          gsap.to(batch, {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration: 1.15,
            ease: "nx",
            stagger: 0.1,
            overwrite: true,
          }),
      });

      ScrollTrigger.batch("[data-anim='scale-in']", {
        ...common,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "nx",
            stagger: 0.08,
            overwrite: true,
          }),
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
