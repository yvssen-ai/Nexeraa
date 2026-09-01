"use client";

import { useRef, useState } from "react";
import { registerGsap, gsap, useGSAP, SplitText } from "@/lib/gsap";
import { SERVICES, CONTACT_EMAIL, WHATSAPP } from "@/lib/content";
import Magnetic from "@/components/ui/Magnetic";
import Button from "@/components/ui/Button";
import { ArrowUpRight, WhatsAppIcon } from "@/components/ui/ArrowIcon";

registerGsap();

/**
 * Point this at any form backend (Formspree, Basin, a Next route handler…)
 * with NEXT_PUBLIC_FORM_ENDPOINT. With nothing configured the form still works
 * — it hands off to the visitor's mail client rather than silently failing.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "mail" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const h = root.current!.querySelector<HTMLElement>(".nx-contact-head")!;
        const split = SplitText.create(h, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          aria: "auto",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.05,
              ease: "nx",
              stagger: 0.09,
              scrollTrigger: { trigger: h, start: "top 84%", once: true },
            }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (name.length < 2) next.name = "Please tell us your name.";
    if (!EMAIL_RE.test(email)) next.email = "That email address doesn't look right.";
    if (message.length < 10) next.message = "A sentence or two about the project, please.";
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never fill a hidden field.
    if (String(data.get("company") ?? "")) return;

    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    if (!ENDPOINT) {
      const subject = `Project enquiry — ${data.get("service")}`;
      const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-black-2/70 px-4 py-3.5 text-[0.9375rem] text-ink " +
    "placeholder:text-ink-faint transition-colors duration-300 focus:border-violet/70 focus:outline-none " +
    "min-h-[3rem]";

  return (
    <section ref={root} id="contact" className="section-y relative scroll-mt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(139,92,246,0.14),transparent_70%)]"
      />

      <div className="container-nx grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow" data-anim="fade-up">
            [ 05 ] — Start here
          </p>
          <h2 className="nx-contact-head font-display mt-5 text-[clamp(2.25rem,8.5vw,4.75rem)] leading-[1.02] font-semibold tracking-tight">
            Tell us what you&rsquo;re building.
            <br />
            <span className="text-gradient">We&rsquo;ll tell you how.</span>
          </h2>
          <p
            className="text-ink-dim mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed"
            data-anim="fade-up"
          >
            Every enquiry gets a real reply from a real person within one business day — usually
            with a first opinion attached, free.
          </p>

          {/* A form is a commitment; WhatsApp is a message. Offer both. */}
          <a
            href={WHATSAPP.href}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="Chat"
            data-anim="fade-up"
            className="border-line-2 text-ink mt-8 inline-flex min-h-[3rem] w-full items-center justify-center gap-2.5 rounded-full border px-6 text-[0.9375rem] font-medium transition-colors duration-300 hover:border-[#25D366]/60 hover:bg-[#25D366]/[0.08] sm:w-auto"
          >
            <WhatsAppIcon className="size-[1.05rem] text-[#25D366]" />
            Chat on WhatsApp
          </a>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2" data-anim="fade-up">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-cursor="Copy"
                  className="text-ink decoration-line-2 hover:decoration-violet text-[0.9375rem] break-all underline underline-offset-4 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">WhatsApp</dt>
              <dd className="mt-2">
                <a
                  href={WHATSAPP.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="Chat"
                  className="text-ink decoration-line-2 hover:decoration-violet text-[0.9375rem] underline underline-offset-4 transition-colors"
                >
                  {WHATSAPP.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Response time</dt>
              <dd className="text-ink mt-2 text-[0.9375rem]">Within 24 hours</dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5"
          data-anim="fade-up"
        >
          {/* honeypot */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute size-0 opacity-0"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nx-name" className="eyebrow mb-2.5 block">
                Your name
              </label>
              <input
                id="nx-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jordan Ellis"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "nx-name-err" : undefined}
                className={field}
              />
              {errors.name && (
                <p id="nx-name-err" role="alert" className="mt-2 text-xs text-[#ff8b8b]">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="nx-email" className="eyebrow mb-2.5 block">
                Email
              </label>
              <input
                id="nx-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="jordan@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "nx-email-err" : undefined}
                className={field}
              />
              {errors.email && (
                <p id="nx-email-err" role="alert" className="mt-2 text-xs text-[#ff8b8b]">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="nx-service" className="eyebrow mb-2.5 block">
              What do you need?
            </label>
            <select
              id="nx-service"
              name="service"
              defaultValue={SERVICES[0].title}
              className={field}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title} className="bg-black-2">
                  {s.title}
                </option>
              ))}
              <option value="Not sure yet" className="bg-black-2">
                Not sure yet
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="nx-message" className="eyebrow mb-2.5 block">
              The project
            </label>
            <textarea
              id="nx-message"
              name="message"
              rows={5}
              placeholder="What you're building, where it is now, and what good looks like."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "nx-message-err" : undefined}
              className={`${field} resize-y`}
            />
            {errors.message && (
              <p id="nx-message-err" role="alert" className="mt-2 text-xs text-[#ff8b8b]">
                {errors.message}
              </p>
            )}
          </div>

          <div className="mt-1 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Magnetic className="w-full sm:w-auto" strength={0.25}>
              <Button
                type="submit"
                disabled={status === "sending"}
                data-cursor="Send"
                className="w-full disabled:opacity-60 sm:w-auto"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
                <ArrowUpRight />
              </Button>
            </Magnetic>

            <p role="status" aria-live="polite" className="text-sm">
              {status === "sent" && (
                <span className="text-[#7ee2a8]">Thanks — we&rsquo;ll be in touch.</span>
              )}
              {status === "error" && (
                <span className="text-[#ff8b8b]">
                  Something broke. Email us at {CONTACT_EMAIL}.
                </span>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
