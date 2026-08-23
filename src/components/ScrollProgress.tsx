"use client";

import { useRef } from "react";
import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

registerGsap();

/** Hairline scroll indicator pinned to the very top of the viewport. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = bar.current!;
    const set = gsap.quickSetter(el, "scaleX");

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => set(self.progress),
    });

    return () => st.kill();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5">
      <div
        ref={bar}
        className="from-blue via-iris to-violet-hi h-full origin-left scale-x-0 bg-linear-to-r"
      />
    </div>
  );
}
