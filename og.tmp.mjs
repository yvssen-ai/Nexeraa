import { chromium } from "playwright";
const OUT = process.argv[2];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
// Exactly the Open Graph canvas, at 2x so the downscale stays crisp.
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await p.goto("http://127.0.0.1:3111/", { waitUntil: "networkidle" });
await p.waitForTimeout(4500);

// Compose the card out of the live hero: drop the chrome that makes no sense
// in a static preview, and retune the spacing for a 1.91:1 frame.
await p.addStyleTag({ content: `
  header, .nx-hero-cue, .nx-hero-cta, .nx-cursor, .nx-preloader { display: none !important; }
  body.grain::after { display: none !important; }
  #top { padding-top: 0 !important; padding-bottom: 0 !important; min-height: 630px !important; }
  #top h1 { margin-top: 1.5rem !important; }
  #top .container-nx { padding-inline: 5.5rem !important; }
  #top .nx-hero-stage > ul { margin-top: 1.75rem !important; }
  #top .nx-hero-stage { transform: none !important; opacity: 1 !important; }
` });
await p.waitForTimeout(900);
await p.screenshot({ path: `${OUT}/og-raw.png` });
console.log("captured");
await b.close();
