/**
 * NEXERA brand marks, rebuilt as vector geometry from the brand board so they
 * stay razor sharp at any size and every part can be animated independently.
 *
 * Wordmark  — six letterforms (cap height 120) + the blue chevron bracket that
 *             wraps the X + the silver shard inside the X's upper counter.
 * Monogram  — the same X glyph with its upper-right arm lifted out and extended
 *             into the rising arrow.
 *
 * Pass `hooks="nx-hero"` to get `.nx-hero-letter` / `-chev` / `-shard` class
 * hooks, so two instances on one page can be animated independently.
 */

export const LETTERS: {
  id: string;
  x: number;
  w: number;
  d: string;
  rule?: "evenodd";
}[] = [
  {
    id: "n",
    x: 0,
    w: 104,
    d: "M0,120 L24,120 L24,36 L80,120 L104,120 L104,0 L80,0 L80,84 L24,0 L0,0 Z",
  },
  {
    id: "e1",
    x: 119,
    w: 96,
    d: "M0,120 L96,120 L96,96 L24,96 L24,70 L84,70 L84,48 L24,48 L24,24 L96,24 L96,0 L0,0 Z",
  },
  {
    id: "x",
    x: 230,
    w: 104,
    d: "M78,120 L104,120 L26,0 L0,0 Z M0,120 L26,120 L104,0 L78,0 Z",
  },
  {
    id: "e2",
    x: 349,
    w: 96,
    d: "M0,120 L96,120 L96,96 L24,96 L24,70 L84,70 L84,48 L24,48 L24,24 L96,24 L96,0 L0,0 Z",
  },
  {
    id: "r",
    x: 460,
    w: 100,
    rule: "evenodd",
    d: "M0,0 L58,0 A37,37 0 0 1 58,74 L56,74 L100,120 L72,120 L22,74 L22,120 L0,120 Z M22,22 L58,22 A15,15 0 0 1 58,52 L22,52 Z",
  },
  {
    id: "a",
    x: 575,
    w: 106,
    d: "M26,120 L53,28 L80,120 L106,120 L66,0 L40,0 L0,120 Z M29.96,98 L76.04,98 L69.59,76 L36.41,76 Z",
  },
];

const CHEV_TOP = "M224,60 L282.5,-30 L600,-30";
const CHEV_BOT = "M224,60 L282.5,150 L470,150";
const SHARD = "M29.5,3 L74.5,3 L52,36 Z";

export function Wordmark({
  className,
  hooks,
  title = "NEXERA",
  decorative = false,
}: {
  className?: string;
  hooks?: string;
  title?: string;
  /** Hide from the a11y tree when a real heading already carries the name. */
  decorative?: boolean;
}) {
  // Gradient/clip ids must be unique per instance or a second wordmark on the
  // page reuses the first one's defs. Callers pass a distinct `hooks` value;
  // an id counter would desync between server and client render.
  const uid = hooks ?? "wm";

  return (
    <svg
      viewBox="-6 -40 693 200"
      className={className}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${uid}-t`}
          x1="224"
          y1="0"
          x2="600"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6EA0FF" />
          <stop offset="0.3" stopColor="#4E7DE8" />
          <stop offset="1" stopColor="#4E7DE8" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-b`}
          x1="224"
          y1="0"
          x2="470"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6EA0FF" />
          <stop offset="0.3" stopColor="#4E7DE8" />
          <stop offset="1" stopColor="#4E7DE8" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-s`}
          x1="260"
          y1="0"
          x2="296"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DCE3EF" stopOpacity="0.62" />
          <stop offset="1" stopColor="#8FA0BE" stopOpacity="0.04" />
        </linearGradient>
        {LETTERS.map((l) => (
          // Clip lives in the root user space (no transform on the clipped
          // group) so a yPercent reveal on the glyph wipes cleanly.
          <clipPath key={l.id} id={`${uid}-c-${l.id}`}>
            <rect x={l.x - 8} y={-8} width={l.w + 16} height={136} />
          </clipPath>
        ))}
      </defs>

      <g strokeWidth="6" fill="none">
        <path className={hooks && `${hooks}-chev`} d={CHEV_TOP} stroke={`url(#${uid}-t)`} />
        <path className={hooks && `${hooks}-chev`} d={CHEV_BOT} stroke={`url(#${uid}-b)`} />
      </g>

      <g fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
        {LETTERS.map((l) => (
          <g key={l.id} clipPath={`url(#${uid}-c-${l.id})`}>
            <g transform={`translate(${l.x} 0)`}>
              <path className={hooks && `${hooks}-letter`} d={l.d} fillRule={l.rule} />
            </g>
          </g>
        ))}
      </g>

      <path
        className={hooks && `${hooks}-shard`}
        d={SHARD}
        transform="translate(230 0)"
        fill={`url(#${uid}-s)`}
      />
    </svg>
  );
}

const MONO = {
  viewBox: "-15.92 -47.21 154.21 154.21",
  x1: "M0,0 L26,0 L104,100 L78,100Z",
  x2: "M40.85,47.63 L53.85,64.3 L26,100 L0,100Z",
  shaft: "M98.91,-26.81 L115.07,-14.2 L67.77,46.45 L54.77,29.79Z",
  head: "M122.37,-40.21 L93.19,-31.26 L120.79,-9.74Z",
};

export function Monogram({ className, hooks }: { className?: string; hooks?: string }) {
  const uid = hooks ?? "mg";
  return (
    <svg
      viewBox={MONO.viewBox}
      className={className}
      role="img"
      aria-label="NEXERA"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${uid}-g`}
          x1="0"
          y1="107"
          x2="138"
          y2="-47"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4E7DE8" />
          <stop offset="1" stopColor="#9CC0FF" />
        </linearGradient>
      </defs>
      <g fill="currentColor">
        <path d={MONO.x1} />
        <path d={MONO.x2} />
      </g>
      <g fill={`url(#${uid}-g)`} className={hooks && `${hooks}-arrow`}>
        <path d={MONO.shaft} />
        <path d={MONO.head} />
      </g>
    </svg>
  );
}
