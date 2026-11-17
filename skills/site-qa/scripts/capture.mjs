#!/usr/bin/env node
// Passive page capture for website reviews.
//
// Loads each URL at each viewport in Chromium (Playwright) and writes, per run:
//   <out>/<slug>@<width>.png    full-page screenshot
//   <out>/<slug>@<width>.json   console messages, page errors, failed and >=400
//                               requests, main-document headers, cookies,
//                               request hosts, horizontal overflow
//
// Requests to the target host are throttled (default: one request start per
// 1000 ms across the whole run). Third-party requests are recorded, not throttled.
// Router prefetches (Next.js) are skipped so they don't flood the throttle queue.
// HTTPS_PROXY from the environment is passed to Chromium.
// The script only navigates and reads. It never clicks, types, or submits.
//
// Usage:
//   node capture.mjs --urls https://example.com/,https://example.com/pricing \
//     [--viewports 360,768,1280,1920] [--out ./capture] [--interval 1000] \
//     [--wait 2000] [--no-screenshot]
//   node capture.mjs --urls-file urls.txt ...
//
// Needs Node 18+ and Playwright (npm i playwright; npx playwright install chromium).

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright not found. Install it with: npm i playwright && npx playwright install chromium");
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

if (flag("help") || (!opt("urls") && !opt("urls-file"))) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 21).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

const urls = (opt("urls") ? opt("urls").split(",") : readFileSync(opt("urls-file"), "utf8").split(/\r?\n/))
  .map((u) => u.trim())
  .filter((u) => u && !u.startsWith("#"));
const viewports = opt("viewports", "360,768,1280,1920").split(",").map(Number);
const out = opt("out", "./capture");
const interval = Number(opt("interval", "1000"));
const settle = Number(opt("wait", "2000"));
const screenshots = !flag("no-screenshot");
const targetHost = new URL(urls[0]).hostname.replace(/^www\./, "");
const isTarget = (host) => host === targetHost || host.endsWith(`.${targetHost}`);

mkdirSync(out, { recursive: true });

// Global throttle: request starts to the target host are spaced by `interval` ms.
let nextSlot = 0;
const throttle = async () => {
  const now = Date.now();
  const wait = Math.max(0, nextSlot - now);
  nextSlot = Math.max(now, nextSlot) + interval;
  if (wait) await new Promise((r) => setTimeout(r, wait));
};

const slug = (u) => {
  const { host, pathname, search } = new URL(u);
  const s = `${host}${pathname}${search}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return s.slice(0, 120) || "root";
};

// Honor an HTTPS proxy from the environment (Chromium ignores it otherwise).
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch(proxyUrl ? { proxy: { server: proxyUrl } } : {});
const summary = [];

for (const width of viewports) {
  // One context per viewport keeps the HTTP cache within that viewport's run.
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 800 : 1000 },
    locale: "de-DE",
    deviceScaleFactor: 1,
  });
  await context.route("**/*", async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    // Framework prefetches of other routes (Next.js sends Next-Router-Prefetch) are not
    // needed for the check and would flood the throttle queue. Skip them.
    if (req.headers()["next-router-prefetch"] || req.headers()["purpose"] === "prefetch") {
      await route.abort().catch(() => {});
      return;
    }
    if (isTarget(u.hostname)) await throttle();
    await route.continue().catch(() => {}); // page may have closed while queued
  });

  for (const url of urls) {
    const page = await context.newPage();
    const record = { url, width, startedAt: new Date().toISOString(), console: [], pageErrors: [], failed: [], httpErrors: [], hosts: {}, document: null };

    page.on("console", (m) => record.console.push({ type: m.type(), text: m.text(), location: m.location() }));
    page.on("pageerror", (e) => record.pageErrors.push(String(e && e.stack ? e.stack : e)));
    page.on("requestfailed", (r) => record.failed.push({ url: r.url(), method: r.method(), error: r.failure()?.errorText }));
    page.on("request", (r) => {
      const h = new URL(r.url()).hostname;
      record.hosts[h] = (record.hosts[h] || 0) + 1;
    });
    page.on("response", (r) => {
      if (r.status() >= 400) record.httpErrors.push({ url: r.url(), status: r.status() });
    });

    console.log(new Date().toISOString().slice(11, 19), "load", url, `@${width}`);
    try {
      const res = await page.goto(url, { waitUntil: "load", timeout: 90000 });
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(settle);
      record.document = res ? { status: res.status(), finalUrl: page.url(), headers: await res.allHeaders() } : null;
      record.title = await page.title();
      record.overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const vw = doc.clientWidth;
        const offenders = [...document.querySelectorAll("body *")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > vw + 1 || r.left < -1);
          })
          .slice(0, 15)
          .map((el) => {
            const r = el.getBoundingClientRect();
            const id = el.id ? `#${el.id}` : "";
            const cls = typeof el.className === "string" && el.className ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}` : "";
            return { selector: `${el.tagName.toLowerCase()}${id}${cls}`, left: Math.round(r.left), right: Math.round(r.right) };
          });
        return { scrollWidth: doc.scrollWidth, clientWidth: vw, hasHorizontalScroll: doc.scrollWidth > vw + 1, offenders };
      });
      if (screenshots) await page.screenshot({ path: join(out, `${slug(url)}@${width}.png`), fullPage: true });
    } catch (e) {
      record.navigationError = String(e.message || e);
    }
    record.cookies = await context.cookies();
    record.finishedAt = new Date().toISOString();
    writeFileSync(join(out, `${slug(url)}@${width}.json`), JSON.stringify(record, null, 2));
    summary.push({
      url,
      width,
      status: record.document?.status ?? "ERR",
      consoleErrors: record.console.filter((c) => c.type === "error").length + record.pageErrors.length,
      failedRequests: record.failed.length + record.httpErrors.length,
      horizontalScroll: record.overflow?.hasHorizontalScroll ?? null,
      thirdPartyHosts: Object.keys(record.hosts).filter((h) => !isTarget(h)).length,
    });
    await page.close();
  }
  await context.close();
}

await browser.close();
writeFileSync(join(out, "summary.json"), JSON.stringify(summary, null, 2));
console.table(summary);
