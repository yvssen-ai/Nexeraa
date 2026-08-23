import { chromium, devices } from "playwright";
const URL = process.env.NEXERA_URL ?? "http://127.0.0.1:3000/";
const EXE = process.env.CHROMIUM_PATH || undefined;

async function measure({ label, ctxOpts, cpu }) {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });

  await page.goto(URL, { waitUntil: "load" });

  // --- load metrics -------------------------------------------------
  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = { lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0 };
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) out.lcp = Math.round(e.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            out.longTasks++;
            out.longTaskMs += Math.round(e.duration);
          }
        }).observe({ type: "longtask", buffered: true });
        setTimeout(() => resolve(out), 6000);
      }),
  );

  // --- scroll the whole page, recording every frame -------------------
  const frames = await page.evaluate(async () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const deltas = [];
    let last = performance.now();
    let y = 0;
    const step = max / 420;
    await new Promise((resolve) => {
      const tick = () => {
        const now = performance.now();
        deltas.push(now - last);
        last = now;
        y += step;
        window.scrollTo(0, y);
        if (y < max) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    return deltas.slice(3); // ignore warm-up
  });

  frames.sort((a, b) => a - b);
  const q = (p) => frames[Math.min(frames.length - 1, Math.floor(frames.length * p))];
  const jank = frames.filter((d) => d > 50).length;
  const dropped = frames.filter((d) => d > 32).length;

  const mem = await page.evaluate(() =>
    performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null,
  );

  console.log(
    `${label.padEnd(22)} lcp=${String(vitals.lcp).padStart(5)}ms  cls=${vitals.cls.toFixed(4)}  ` +
      `longTasks=${vitals.longTasks}(${vitals.longTaskMs}ms)  frames=${frames.length}  ` +
      `p50=${q(0.5).toFixed(1)}ms p95=${q(0.95).toFixed(1)}ms max=${frames[frames.length - 1].toFixed(1)}ms  ` +
      `>32ms=${dropped} >50ms=${jank}  heap=${mem}MB`,
  );
  await browser.close();
  return { jank, dropped, cls: vitals.cls, p95: q(0.95) };
}

const r1 = await measure({
  label: "desktop 1440 (1x cpu)",
  ctxOpts: { viewport: { width: 1440, height: 900 } },
  cpu: 1,
});
const r2 = await measure({
  label: "phone (4x cpu slow)",
  ctxOpts: { ...devices["iPhone 13"] },
  cpu: 4,
});
const r3 = await measure({
  label: "phone (6x cpu v.slow)",
  ctxOpts: { ...devices["Pixel 5"] },
  cpu: 6,
});
