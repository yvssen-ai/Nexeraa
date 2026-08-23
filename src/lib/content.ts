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

export const WORK = [
  {
    id: "w1",
    name: "Halo Commerce",
    kind: "E-Commerce",
    result: "+38% conversion rate",
    year: "2025",
  },
  {
    id: "w2",
    name: "Northwind AI",
    kind: "AI Automation",
    result: "9,400 hours saved / yr",
    year: "2025",
  },
  {
    id: "w3",
    name: "Studio Marrow",
    kind: "Branding",
    result: "Full identity system",
    year: "2024",
  },
  {
    id: "w4",
    name: "Beacon Health",
    kind: "Web Development",
    result: "0.9s LCP on mobile",
    year: "2025",
  },
  {
    id: "w5",
    name: "Ferro Athletics",
    kind: "Marketing",
    result: "4.2x return on ad spend",
    year: "2024",
  },
  {
    id: "w6",
    name: "Corvid Finance",
    kind: "Web + Brand",
    result: "2.6x demo requests",
    year: "2025",
  },
];

export const STATS = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 38, suffix: "%", label: "Average conversion lift" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 24, suffix: "h", label: "Response time" },
];

export const TESTIMONIALS = [
  {
    quote:
      "They rebuilt our storefront in six weeks and the checkout numbers moved in the first month. No theatre, just work that showed up in the dashboard.",
    name: "Amara Osei",
    role: "Head of Growth, Halo Commerce",
  },
  {
    quote:
      "The automation work paid for itself before the invoice cleared. Our support queue is a third of what it was and nothing feels robotic to customers.",
    name: "Daniel Reyes",
    role: "COO, Northwind",
  },
  {
    quote:
      "Best brand process I've been through. They asked harder questions than our board did and the identity has held up across every channel since.",
    name: "Lena Fischer",
    role: "Founder, Studio Marrow",
  },
  {
    quote:
      "Our site went from embarrassing to the fastest in the category. Mobile load time dropped below a second and organic traffic followed.",
    name: "Priya Raghavan",
    role: "CMO, Beacon Health",
  },
  {
    quote:
      "We came for a landing page and stayed for the whole stack. Two years in they still ship faster than our in-house team.",
    name: "Tomas Nowak",
    role: "VP Product, Corvid Finance",
  },
  {
    quote:
      "Four point two times return on ad spend, and the reporting finally makes sense to people outside marketing.",
    name: "Sofia Marchetti",
    role: "Director, Ferro Athletics",
  },
];

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export const CONTACT_EMAIL = "hello@nexera.agency";
