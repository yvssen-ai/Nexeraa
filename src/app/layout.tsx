import type { Metadata, Viewport } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const SITE = "https://nexera.agency";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "NEXERA — Modern Digital Agency",
    template: "%s · NEXERA",
  },
  description:
    "NEXERA is a modern digital agency building web experiences, e-commerce stores, AI automation, marketing engines and brand identities. Innovation and premium quality.",
  keywords: [
    "digital agency",
    "web development",
    "e-commerce",
    "AI automation",
    "digital marketing",
    "branding",
    "NEXERA",
  ],
  authors: [{ name: "NEXERA" }],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "NEXERA",
    title: "NEXERA — Modern Digital Agency",
    description:
      "Web development, e-commerce, AI automation, marketing and branding. Built to move.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXERA — Modern Digital Agency",
    description:
      "Web development, e-commerce, AI automation, marketing and branding. Built to move.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom (a11y), but cover the notch for edge-to-edge design
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before first paint so nothing ever flashes:
          - `nx-js` gates every pre-animation state, so a JS-less or
            failed-hydration visit renders fully visible content.
          - `nx-skip-intro` hides the preloader instantly on repeat visits
            within the session, and whenever motion is reduced.
          - manual scroll restoration keeps reloads from landing mid-page
            while pinned sections are still being measured.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement," +
              "m=matchMedia('(prefers-reduced-motion: reduce)').matches," +
              "seen=sessionStorage.getItem('nx-seen');" +
              "if(!m)d.classList.add('nx-js');" +
              "if(m||seen)d.classList.add('nx-skip-intro');" +
              "sessionStorage.setItem('nx-seen','1');" +
              "if('scrollRestoration' in history)history.scrollRestoration='manual';" +
              "}catch(e){}",
          }}
        />
      </head>
      <body className="grain antialiased">
        <a
          href="#main"
          className="sr-only-focusable bg-violet fixed top-4 left-4 z-[200] rounded-full px-5 py-2.5 text-sm font-medium text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
