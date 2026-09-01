import { chromium, devices } from "playwright";
const URL = process.env.NEXERA_URL ?? "http://127.0.0.1:3000/";
const EXE = process.env.CHROMIUM_PATH || undefined;
const pass = [],
  fail = [];
const check = (ok, name, extra = "") =>
  (ok ? pass : fail).push(`${name}${extra ? " — " + extra : ""}`);

const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });

/** ScrollSmoother glides for ~1s after any scroll; clicking mid-glide lands
 *  wherever the element has drifted to. Wait for a stable box first. */
async function settled(page, selector) {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const top = Math.round(el.getBoundingClientRect().top);
      const w = window;
      const prev = w.__lastTop;
      w.__stableCount = prev === top ? (w.__stableCount ?? 0) + 1 : 0;
      w.__lastTop = top;
      return (w.__stableCount ?? 0) >= 3;
    },
    selector,
    { timeout: 15000, polling: 120 },
  );
}

/* ---------------- 1. mobile drawer ---------------- */
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(3600);

  const toggle = page.locator('button[aria-controls="nx-menu"]');
  check(await toggle.isVisible(), "drawer: toggle visible on phone");
  check(
    (await toggle.getAttribute("aria-expanded")) === "false",
    "drawer: aria-expanded starts false",
  );

  const box = await toggle.boundingBox();
  check(
    box.width >= 44 && box.height >= 44,
    "drawer: toggle meets 44px touch target",
    `${Math.round(box.width)}x${Math.round(box.height)}`,
  );

  await toggle.tap();
  await page.waitForTimeout(900);
  check(
    (await toggle.getAttribute("aria-expanded")) === "true",
    "drawer: aria-expanded true when open",
  );
  const panelVisible = await page.locator("#nx-menu").isVisible();
  check(panelVisible, "drawer: panel visible when open");

  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => window.scrollY);
  check(
    Math.abs(after - before) < 8,
    "drawer: page scroll locked while open",
    `moved ${after - before}px`,
  );

  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  check((await toggle.getAttribute("aria-expanded")) === "false", "drawer: Escape closes");

  // link click navigates and closes
  await toggle.tap();
  await page.waitForTimeout(800);
  await page.locator('#nx-menu a[href="#work"]').tap();
  await page.waitForTimeout(2200);
  const atWork = await page.evaluate(() => {
    const r = document.getElementById("work").getBoundingClientRect();
    return Math.round(r.top);
  });
  check(
    Math.abs(atWork - 86) < 120,
    "drawer: anchor scrolls to #work under the header",
    `top=${atWork}`,
  );
  check(
    (await toggle.getAttribute("aria-expanded")) === "false",
    "drawer: closes after link tap",
  );
  check(errs.length === 0, "drawer: no page errors", errs.join("|"));
  await ctx.close();
}

/* ---------------- 2. reduced motion ---------------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const wm =
      document.querySelector("h1 svg .nx-hero-letter") || document.querySelector("h1 svg path");
    const cs = wm ? getComputedStyle(wm) : null;
    const hidden = [...document.querySelectorAll("[data-anim]")].filter(
      (e) => parseFloat(getComputedStyle(e).opacity) < 0.9,
    );
    return {
      preloader: !!document.querySelector(".nx-preloader"),
      letterTransform: cs?.transform,
      hiddenAnimCount: hidden.length,
      smootherWrapperPos: getComputedStyle(document.getElementById("smooth-wrapper")).position,
      scrollable: document.documentElement.scrollHeight > innerHeight + 100,
    };
  });
  check(!r.preloader, "reduced-motion: preloader removed");
  const dimWords = await page.$$eval(".nx-manifesto-copy > *", (els) =>
    els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9).length);
  check(dimWords === 0, "reduced-motion: manifesto words are not left dimmed", `${dimWords} dim`);
  check(
    r.hiddenAnimCount === 0,
    "reduced-motion: no content left hidden",
    `${r.hiddenAnimCount} hidden`,
  );
  check(
    r.smootherWrapperPos !== "fixed",
    "reduced-motion: smoother not created (native scroll)",
    r.smootherWrapperPos,
  );
  check(r.scrollable, "reduced-motion: page still scrolls");
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(500);
  check(
    (await page.evaluate(() => window.scrollY)) > 3000,
    "reduced-motion: scrolling actually moves",
  );
  await ctx.close();
}

/* ---------------- 3. no JavaScript ---------------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const hidden = await page.$$eval(
    "[data-anim]",
    (els) => els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9).length,
  );
  const text = (await page.locator("body").innerText()).length;
  check(hidden === 0, "no-JS: nothing trapped invisible", `${hidden} hidden`);
  check(text > 2000, "no-JS: full copy present for crawlers", `${text} chars`);
  await ctx.close();
}

/* ---------------- 4. form validation ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(3600);
  await page.evaluate(() => document.getElementById("contact").scrollIntoView());
  await settled(page, 'button[type="submit"]');
  // DOM .click() rather than a mouse click: Playwright's own
  // scroll-into-view fights the smoother's easing and can land the pointer
  // on a stale coordinate. The handler under test is the same either way,
  // and the real mouse click is exercised in the second case below.
  await page.locator('button[type="submit"]').evaluate((el) => el.click());
  await page.waitForTimeout(400);
  const alerts = await page.$$eval('p[role="alert"]', (e) => e.map((x) => x.textContent));
  check(alerts.length === 3, "form: all three fields report errors", alerts.join(" / "));
  await page.fill("#nx-name", "Jordan Ellis");
  await page.fill("#nx-email", "not-an-email");
  await page.fill("#nx-message", "We need a new storefront and some automation.");
  await settled(page, 'button[type="submit"]');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(400);
  const alerts2 = await page.$$eval('p[role="alert"]', (e) => e.map((x) => x.textContent));
  check(
    alerts2.length === 1 && /email/i.test(alerts2[0]),
    "form: only the bad email is flagged",
    alerts2.join("/"),
  );
  const focused = await page.evaluate(() => document.activeElement?.id);
  check(focused === "nx-email", "form: focus moves to the first invalid field", focused);
  await ctx.close();
}

/* ---------------- 5. keyboard ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(3600);
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() =>
    document.activeElement?.textContent?.trim().slice(0, 40),
  );
  check(/skip to content/i.test(first ?? ""), "keyboard: skip link is the first stop", first);
  const ring = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { w: cs.outlineWidth, style: cs.outlineStyle };
  });
  check(
    ring.style !== "none" && parseFloat(ring.w) > 0,
    "keyboard: focus ring is visible",
    JSON.stringify(ring),
  );
  await ctx.close();
}

/* ---------------- 6. manifesto word sweep ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(3600);

  const geom = await page.evaluate(() => {
    const c = document.querySelector(".nx-manifesto-copy");
    const r = c.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height), vh: innerHeight };
  });
  const start = geom.top - 0.88 * geom.vh;
  const end = geom.top + geom.h - 0.48 * geom.vh;
  const litAt = async (p) => {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(start + (end - start) * p));
    await page.waitForTimeout(1300);
    return page.$$eval(".nx-manifesto-copy > *", (els) =>
      els.filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.95).length);
  };
  const total = await page.$$eval(".nx-manifesto-copy > *", (e) => e.length);
  const at0 = await litAt(0);
  const mid = await litAt(0.5);
  const at1 = await litAt(1);
  // A staggered fromTo used to leave all-but-one word already lit at p=0.
  check(at0 === 0, "manifesto: every word starts dimmed", `${at0}/${total} lit at progress 0`);
  check(mid > at0 && mid < total, "manifesto: sweep is partway at the midpoint", `${mid}/${total}`);
  check(at1 === total, "manifesto: every word is lit by the end", `${at1}/${total}`);
  await ctx.close();
}

console.log("\nPASS (" + pass.length + ")");
pass.forEach((p) => console.log("  ✓ " + p));
console.log("\nFAIL (" + fail.length + ")");
fail.forEach((f) => console.log("  ✗ " + f));
await browser.close();
process.exit(fail.length ? 1 : 0);
