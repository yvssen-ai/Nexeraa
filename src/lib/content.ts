/**
 * Single source of truth for site copy. Swap the placeholder projects,
 * numbers and quotes here — nothing else needs to change.
 */

export type Service = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  body: string;
  /** Lower-case-safe label for inline sentences ("Discuss AI automation"). */
  short: string;
  deliverables: string[];
  /** Position on the brand's blue → violet ramp. */
  accent: string;
};

export const SERVICES: Service[] = [
  {
    id: "web",
    index: "01",
    title: "Web Development",
    tagline: "Sites that load fast and convert faster.",
    body: "Hand-built front ends on Next.js and headless CMS, shipped against a real performance budget. Every interaction is designed, measured and tuned — not bolted on.",
    short: "web development",
    deliverables: [
      "Next.js / React builds",
      "Headless CMS",
      "Core Web Vitals budget",
      "Motion systems",
      "Accessibility (WCAG 2.2 AA)",
    ],
    accent: "#4E7DE8",
  },
  {
    id: "ecom",
    index: "02",
    title: "E-Commerce",
    tagline: "Storefronts engineered to sell.",
    body: "Shopify and headless commerce built around the checkout, not around the theme. We instrument the funnel, remove the friction, and keep testing after launch.",
    short: "e-commerce",
    deliverables: [
      "Shopify & headless",
      "Checkout optimisation",
      "Product page CRO",
      "Subscriptions",
      "Analytics & attribution",
    ],
    accent: "#6478EE",
  },
  {
    id: "ai",
    index: "03",
    title: "AI Automation",
    tagline: "Put the busywork on autopilot.",
    body: "Agents and workflows wired into the tools you already use. Support triage, lead qualification, content ops, internal search — scoped tightly, measured honestly.",
    short: "AI automation",
    deliverables: [
      "Workflow automation",
      "Custom AI agents",
      "RAG & knowledge bases",
      "CRM / ops integrations",
      "Human-in-the-loop guardrails",
    ],
    accent: "#7B6BF4",
  },
  {
    id: "marketing",
    index: "04",
    title: "Marketing",
    tagline: "Demand, on demand.",
    body: "Paid, organic and lifecycle run as one system with one dashboard. We start from the numbers that matter and work backwards to the creative.",
    short: "marketing",
    deliverables: [
      "Paid social & search",
      "Technical SEO",
      "Content engine",
      "Email & lifecycle",
      "Reporting dashboards",
    ],
    accent: "#8B5CF6",
  },
  {
    id: "brand",
    index: "05",
    title: "Branding",
    tagline: "Identity with a signal.",
    body: "Positioning, naming, identity and the design system that keeps it consistent everywhere. Built to survive contact with real products and real teams.",
    short: "branding",
    deliverables: [
      "Positioning & narrative",
      "Logo & identity",
      "Design systems",
      "Brand guidelines",
      "Launch assets",
    ],
    accent: "#A855F7",
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Discover",
    body: "A short, intense audit of your product, market and numbers. We leave with a written brief and a scope you can actually hold us to.",
  },
  {
    step: "02",
    title: "Design",
    body: "Direction, then detail. You see real screens in the browser early — not a deck of pictures — so decisions are made against the real thing.",
  },
  {
    step: "03",
    title: "Build",
    body: "Weekly shipping against a staging URL. Performance, accessibility and analytics are part of the build, not a phase at the end.",
  },
  {
    step: "04",
    title: "Scale",
    body: "Launch is the midpoint. We keep testing, keep automating, and keep reporting on the metric we agreed in week one.",
  },
];

export type Project = {
  id: string;
  name: string;
  kind: string;
  /** What the project actually is. Always true, always shown. */
  summary: string;
  /** The stack it was really built on. */
  stack: string;
  year: string;
  /**
   * A measured outcome, once there is one to quote — "+38% checkout
   * completion", "0.9s LCP". Rendered in the project's accent colour above
   * the summary. Left off until the number is real.
   */
  result?: string;
  /** Live site — where the card links. */
  href: string;
  /** Source, kept as provenance for the copy above. */
  repo: string;
  /** 960×600 (16:10) WebP in /public/work. */
  thumb: string;
};

export const WORK: Project[] = [
  {
    id: "sushirito",
    name: "Sushirito",
    kind: "Restaurant · Web",
    summary:
      "Japanese × Mexican fusion brand as a scroll-driven one-pager — no framework, no build step, GSAP and the webfonts vendored so it renders identically offline.",
    stack: "Vanilla JS · GSAP · ScrollTrigger",
    year: "2026",
    href: "https://sushirito.vercel.app",
    repo: "https://github.com/yvssen-ai/sushirito",
    thumb: "/work/sushirito.webp",
  },
  {
    id: "gorilla",
    name: "Gorilla Pizza",
    kind: "Restaurant · Interactive",
    summary:
      "Marketing site built around a six-step pizza builder — size to toppings, with a live animated preview and a running price total.",
    stack: "React · Vite · GSAP",
    year: "2026",
    href: "https://gorilla.vercel.app",
    repo: "https://github.com/yvssen-ai/Gorilla",
    thumb: "/work/gorilla.webp",
  },
  {
    id: "solis",
    name: "Solis",
    kind: "Café & Bakery · Web",
    summary:
      "Animation-led brand site on a Supabase back end: live menu, cart and guest ordering, with order history readable without an account.",
    stack: "React · Vite · GSAP · Supabase",
    year: "2026",
    href: "https://solis.vercel.app",
    repo: "https://github.com/yvssen-ai/Solis",
    thumb: "/work/solis.webp",
  },
  {
    id: "sooki",
    name: "Sooki",
    kind: "E-Commerce",
    summary:
      "Cinematic black-and-gold storefront for a luxury Egyptian accessories label. Custom cursor, magnetic buttons, mobile-first throughout.",
    stack: "Next.js · Tailwind · Framer Motion",
    year: "2026",
    href: "https://sooki.vercel.app",
    repo: "https://github.com/yvssen-ai/Sooki",
    thumb: "/work/sooki.webp",
  },
  {
    id: "lane9",
    name: "LANE9",
    kind: "Entertainment · Web",
    summary:
      "One page for a venue running bowling, arcade, mini golf, billiards and PlayStation rooms. Fonts self-hosted, photography lazy-loaded.",
    stack: "Static · GSAP · SplitText",
    year: "2026",
    href: "https://lane9.vercel.app",
    repo: "https://github.com/yvssen-ai/lane9",
    thumb: "/work/lane9.webp",
  },
];

export const STATS = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 38, suffix: "%", label: "Average conversion lift" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 24, suffix: "h", label: "Response time" },
];

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export const CONTACT_EMAIL = "nexeraastudios@gmail.com";

/** wa.me needs the number bare — no +, spaces or dashes. */
export const WHATSAPP = {
  display: "+20 122 850 7157",
  href: "https://wa.me/201228507157",
};
