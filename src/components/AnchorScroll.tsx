"use client";

import { registerGsap, useGSAP, ScrollSmoother } from "@/lib/gsap";
import { onReady } from "@/lib/bus";

registerGsap();

/** Offset so anchored sections clear the fixed header. */
export const ANCHOR_OFFSET = 86;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(el, true, `top ${ANCHOR_OFFSET}px`);
    return;
  }
  // Reduced-motion / no-smoother path: instant, offset-corrected jump.
  const y = el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET;
  window.scrollTo({ top: y, behavior: "auto" });
}

/**
 * ScrollSmoother puts the page inside a transformed, fixed-position wrapper,
 * so the browser's native `#hash` jump lands in the wrong place (or nowhere).
 * One delegated listener routes every in-page anchor through the smoother.
 */
export default function AnchorScroll() {
  useGSAP(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const a = (e.target as Element | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;

      const id = a.getAttribute("href")!.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      scrollToId(id);
      // Keep the URL and the back button honest without triggering a jump.
      history.replaceState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);

    // Deep link support. The intro pins the page at the top and scroll
    // restoration is manual, so a `/#work` URL would otherwise be ignored.
    // Wait for the hand-off, then jump — no animation, the visitor asked to
    // start there.
    const off = onReady(() => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id || !document.getElementById(id)) return;
      const el = document.getElementById(id)!;
      const smoother = ScrollSmoother.get();
      const y = el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET;
      if (smoother) smoother.scrollTo(el, false, `top ${ANCHOR_OFFSET}px`);
      else window.scrollTo({ top: y, behavior: "auto" });
    });

    return () => {
      off();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
