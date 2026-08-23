import Marquee from "@/components/ui/Marquee";
import { TESTIMONIALS } from "@/lib/content";

function Quote({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="border-line bg-surface mx-2.5 flex w-[min(84vw,26rem)] shrink-0 flex-col justify-between rounded-2xl border p-6 sm:mx-3 sm:p-7">
      <blockquote className="text-ink-dim text-[0.9375rem] leading-relaxed">
        <span aria-hidden className="text-violet mr-1">
          &ldquo;
        </span>
        {t.quote}
      </blockquote>
      <figcaption className="border-line mt-6 flex items-center gap-3 border-t pt-5">
        <span
          aria-hidden
          className="from-blue to-violet grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-xs font-semibold text-white"
        >
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <span className="min-w-0">
          <span className="text-ink block truncate text-sm font-medium">{t.name}</span>
          <span className="text-ink-mute block truncate font-mono text-[0.625rem] tracking-[0.14em] uppercase">
            {t.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  // Each row renders the full set: one copy of the track must be wider than
  // the viewport or the seamless -50% loop shows a gap on wide screens.
  const rowB = [...TESTIMONIALS].reverse();
  return (
    <section className="section-y relative overflow-hidden">
      <div className="container-nx">
        <p className="eyebrow" data-anim="fade-up">
          [ 05 ] — In their words
        </p>
        <h2
          className="font-display mt-5 max-w-[16ch] text-[clamp(2.25rem,8vw,4.5rem)] font-semibold tracking-tight"
          data-anim="fade-up"
        >
          The part we <span className="text-gradient">can&rsquo;t write ourselves.</span>
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:mt-16">
        <Marquee duration={64}>
          {TESTIMONIALS.map((t) => (
            <Quote key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee duration={72} reverse>
          {rowB.map((t) => (
            <Quote key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
