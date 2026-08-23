import Marquee from "@/components/ui/Marquee";
import { SERVICES } from "@/lib/content";

/** The five pillars, on repeat — a spine between hero and manifesto. */
export default function Ticker() {
  return (
    <div className="border-line bg-black-2/60 relative border-y py-5 sm:py-7">
      <Marquee duration={26}>
        {SERVICES.map((s) => (
          <span key={s.id} className="flex items-center">
            <span className="font-display text-ink-dim px-6 text-2xl font-semibold tracking-tight whitespace-nowrap sm:px-9 sm:text-4xl">
              {s.title}
            </span>
            <span
              aria-hidden
              className="size-1.5 shrink-0 rotate-45"
              style={{ backgroundColor: s.accent }}
            />
          </span>
        ))}
      </Marquee>
      {/* fade the ends so the loop never shows a hard edge */}
      <div
        aria-hidden
        className="from-void pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r to-transparent sm:w-32"
      />
      <div
        aria-hidden
        className="from-void pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l to-transparent sm:w-32"
      />
    </div>
  );
}
