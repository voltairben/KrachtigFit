/**
 * Screenshot harness.
 *
 * Chrome's `--screenshot` CLI flag captures the whole window, so getting a
 * full page out of it means using an enormous --window-size — which breaks
 * exactly the things worth looking at: 100svh sections become viewport-tall
 * monsters and position:fixed headers get painted more than once. Every early
 * capture here was misleading for that reason.
 *
 * Puppeteer keeps a real viewport, scrolls the page properly, waits for
 * animations to settle, and stitches the full page itself.
 *
 * Usage: node scripts/shoot.mjs [outDir]
 */
import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.SHOOT_BASE ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "./screenshots";

const SHOTS = [
  { name: "desktop-home", url: "/", w: 1440, h: 900, full: true },
  { name: "desktop-hero", url: "/", w: 1440, h: 900, full: false },
  { name: "tablet-home", url: "/", w: 820, h: 1180, full: true },
  { name: "mobile-home", url: "/", w: 390, h: 844, full: true },
  { name: "mobile-hero", url: "/", w: 390, h: 844, full: false },
  { name: "wizard", url: "/kennismaking", w: 1440, h: 900, full: false },
  { name: "privacy", url: "/privacybeleid", w: 1440, h: 900, full: false },
  { name: "en-home", url: "/en", w: 1440, h: 900, full: false },
  { name: "nojs-home", url: "/", w: 1440, h: 900, full: true, js: false },
  {
    name: "reduced-motion",
    url: "/",
    w: 1440,
    h: 900,
    full: true,
    reducedMotion: true,
  },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

for (const s of SHOTS) {
  const page = await browser.newPage();

  if (s.js === false) await page.setJavaScriptEnabled(false);
  if (s.reducedMotion) {
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  }
  // Dutch first, so ask for Dutch — matching a local visitor rather than the
  // en-US default a headless browser sends.
  await page.setExtraHTTPHeaders({ "Accept-Language": "nl-NL,nl;q=0.9" });
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });

  await page.goto(BASE + s.url, { waitUntil: "networkidle0", timeout: 60000 });

  // Scrolling is driven by page.evaluate, which cannot run when scripting is
  // disabled — and there is nothing to trigger there anyway, since the
  // <noscript> override is what makes that variant visible.
  if (s.full && s.js !== false) {
    // Scroll the whole page so every scroll-triggered reveal actually fires,
    // then return to the top before capturing.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
  }

  // Let entrance animations finish before the shutter.
  await new Promise((r) => setTimeout(r, 2200));

  const file = path.join(OUT, `${s.name}.png`);
  await page.screenshot({ path: file, fullPage: !!s.full });
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`${s.name.padEnd(16)} ${s.w}x${s.h} ${String(kb).padStart(5)} KB`);

  await page.close();
}

await browser.close();
console.log("\nwrote to " + path.resolve(OUT));
