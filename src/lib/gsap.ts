"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/**
 * Register once, on the client only. Safe to call from any component body —
 * repeated calls are no-ops.
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
  );

  gsap.config({ nullTargetWarn: false, force3D: true });

  // Snap transform values to whole pixels where it doesn't hurt: fewer
  // sub-pixel repaints on low-DPI Android.
  gsap.defaults({ ease: "power3.out", duration: 0.9 });

  /**
   * The single most important mobile setting: without it, every show/hide of
   * the browser URL bar counts as a viewport resize and forces a full
   * ScrollTrigger.refresh() — which is what makes pinned sections jump and
   * stutter while scrolling on phones.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });

  CustomEase.create("nx", "0.16, 1, 0.3, 1");
  CustomEase.create("nxInOut", "0.76, 0, 0.24, 1");
}

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin };
