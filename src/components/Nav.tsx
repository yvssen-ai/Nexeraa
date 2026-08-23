"use client";

import { useRef, useState } from "react";
import { registerGsap, gsap, useGSAP, ScrollTrigger, ScrollSmoother } from "@/lib/gsap";
import { Monogram } from "@/components/brand/Logo";
import { NAV_LINKS } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/ArrowIcon";

registerGsap();

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  /* ---- header: frost after the fold, retract when scrolling down ---- */
  useGSAP(
    () => {
      const el = bar.current!;
      let hidden = false;
      let frosted = false;

      const show = () => {
        if (!hidden) return;
        hidden = false;
        gsap.to(el, { yPercent: 0, duration: 0.45, ease: "nx", overwrite: true });
      };
      const hide = () => {
        if (hidden || openRef.current) return;
        hidden = true;
        gsap.to(el, { yPercent: -125, duration: 0.45, ease: "nx", overwrite: true });
      };

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          // Only write the attribute on a real transition — assigning it every
          // frame would invalidate styles on every scroll tick.
          const wantFrost = y > 24;
          if (wantFrost !== frosted) {
            frosted = wantFrost;
            el.dataset.frosted = String(wantFrost);
          }
          if (y < 260) return show();
          self.direction === 1 ? hide() : show();
        },
      });

      return () => st.kill();
    },
    { scope: root },
  );

  /* ---- mobile drawer ---- */
  useGSAP(
    () => {
      const p = panel.current!;
      const items = p.querySelectorAll<HTMLElement>("[data-menu-item]");

      if (open) {
        gsap.set(p, { display: "flex", pointerEvents: "auto" });
        gsap
          .timeline({ defaults: { ease: "nx" } })
          .fromTo(p, { yPercent: -102 }, { yPercent: 0, duration: 0.62 })
          .fromTo(
            items,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.05 },
            "-=0.32",
          );
        ScrollSmoother.get()?.paused(true);
      } else {
        gsap.to(p, {
          yPercent: -102,
          duration: 0.45,
          ease: "nxInOut",
          onComplete: () => gsap.set(p, { display: "none", pointerEvents: "none" }),
        });
        ScrollSmoother.get()?.paused(false);
      }
    },
    { dependencies: [open], scope: root },
  );

  /* ---- a resize past `lg` hides the drawer via CSS; sync state to match ---- */
  useGSAP(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches && openRef.current) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ---- keyboard: Escape closes, Tab stays inside the drawer ---- */
  useGSAP(
    () => {
      if (!open) return;
      const p = panel.current!;

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
        if (e.key !== "Tab") return;
        const f = p.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      document.addEventListener("keydown", onKey);
      const t = window.setTimeout(() => p.querySelector<HTMLElement>("a")?.focus(), 380);
      return () => {
        document.removeEventListener("keydown", onKey);
        window.clearTimeout(t);
      };
    },
    { dependencies: [open] },
  );

  return (
    <header ref={root}>
      <div
        ref={bar}
        data-frosted="false"
        className="group/bar data-[frosted=true]:border-line data-[frosted=true]:bg-void/70 fixed inset-x-0 top-0 z-[90] transition-[background-color,border-color,backdrop-filter] duration-500 data-[frosted=true]:border-b data-[frosted=true]:backdrop-blur-xl"
      >
        <nav
          aria-label="Primary"
          className="container-nx flex items-center justify-between py-3.5 sm:py-4"
        >
          <a
            href="#top"
            className="text-ink flex items-center gap-2.5"
            data-cursor=""
            aria-label="NEXERA — back to top"
          >
            <Monogram className="size-7 sm:size-8" hooks="nx-nav" />
            <span className="font-display text-[0.95rem] font-semibold tracking-[0.22em] sm:text-base">
              NEXERA
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor=""
                  className="group text-ink-dim hover:text-ink relative inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors duration-300"
                >
                  <span className="relative">
                    {l.label}
                    <span className="from-blue to-violet absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-linear-to-r transition-transform duration-[400ms] ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              data-cursor=""
              className="from-blue to-violet hidden items-center gap-2 rounded-full bg-linear-to-r px-5 py-2.5 text-sm font-medium text-white transition-shadow duration-300 hover:shadow-[0_8px_30px_-8px_rgba(139,92,246,0.6)] sm:inline-flex"
            >
              Start a project
              <ArrowUpRight className="size-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nx-menu"
              className="border-line-2 text-ink relative grid size-11 shrink-0 place-items-center rounded-full border lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-3 w-[18px]">
                <span
                  className="absolute left-0 block h-px w-full bg-current transition-transform duration-[400ms] ease-[var(--ease-in-out-quart)]"
                  style={{
                    transform: open ? "translateY(6px) rotate(45deg)" : "translateY(0)",
                  }}
                />
                <span
                  className="absolute bottom-0 left-0 block h-px w-full bg-current transition-transform duration-[400ms] ease-[var(--ease-in-out-quart)]"
                  style={{
                    transform: open ? "translateY(-6px) rotate(-45deg)" : "translateY(0)",
                  }}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Drawer sits outside the frosted bar so it can cover the whole screen */}
      <div
        id="nx-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{ display: "none" }}
        className="bg-void/98 fixed inset-0 z-[95] hidden touch-none flex-col justify-between overscroll-contain px-6 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-2xl lg:!hidden"
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} data-menu-item>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-line font-display text-ink flex items-baseline gap-4 border-b py-4 text-[2rem] font-semibold tracking-tight"
              >
                <span className="text-ink-mute font-mono text-[0.65rem] tracking-[0.2em]">
                  0{i + 1}
                </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div data-menu-item className="flex flex-col gap-4">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="from-blue to-violet inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-linear-to-r px-8 font-medium text-white"
          >
            Start a project
            <ArrowUpRight className="size-4" />
          </a>
          <p className="eyebrow text-center">Web · Commerce · AI · Marketing · Brand</p>
        </div>
      </div>
    </header>
  );
}
