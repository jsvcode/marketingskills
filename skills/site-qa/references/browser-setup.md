# Browser Setup for Passive Reviews

How to drive a real browser for a website review while staying read-only and within a request limit. Examples use Playwright for Node.js; Puppeteer and Chrome DevTools offer the same hooks.

## Contents

- Why a real browser
- Throttling requests
- Capturing console and network
- Screenshots that work as evidence
- Reading the rendered DOM
- Fresh contexts for the second pass
- Limits of headless testing

## Why a real browser

Client-side rendered sites (Next.js, React, Vue, Angular) send a thin HTML shell and build the page in JavaScript. An HTTP fetch or `curl` misses:

- Text, links, and headings rendered by JavaScript
- JSON-LD injected at runtime
- Console errors and failed API calls
- Cookies set by scripts, including consent tools
- Third-party requests fired after hydration

Use `curl -sI` only for response headers and redirects. Use the browser for everything else.

## Throttling requests

A single page load starts dozens of requests in parallel. A rate limit such as "one request per second" therefore needs request-level throttling, not a pause between page loads.

```js
let nextSlot = 0;
const interval = 1000; // ms between request starts to the target host
const throttle = async () => {
  const now = Date.now();
  const wait = Math.max(0, nextSlot - now);
  nextSlot = Math.max(now, nextSlot) + interval;
  if (wait) await new Promise((r) => setTimeout(r, wait));
};

await context.route("**/*", async (route) => {
  const host = new URL(route.request().url()).hostname;
  if (host.endsWith("example.com")) await throttle();
  await route.continue();
});
```

Consequences to plan for:

- A page with 40 first-party assets takes about 40 seconds to load. Raise navigation timeouts.
- Timing metrics (LCP, TTFB, load time) are meaningless under throttling. See the **web-performance** skill for how to measure speed without breaking the limit.
- Keep one browser context per viewport so the HTTP cache serves repeat assets. Repeat loads then cost only a few requests.

## Capturing console and network

```js
page.on("console", (m) => log.push({ type: m.type(), text: m.text(), location: m.location() }));
page.on("pageerror", (e) => log.push({ type: "pageerror", text: String(e.stack || e) }));
page.on("requestfailed", (r) => failed.push({ url: r.url(), error: r.failure()?.errorText }));
page.on("response", (r) => { if (r.status() >= 400) errors.push({ url: r.url(), status: r.status() }); });
```

Wait for `load`, then `networkidle` (with a timeout, since analytics beacons can keep the network busy), then a short settle time. Errors often fire after hydration.

Separate signal from noise:

- **Report**: uncaught exceptions, failed first-party requests, hydration errors, CSP violations, 404 assets
- **Mention briefly**: third-party script errors (note the vendor)
- **Ignore**: errors caused by your own throttling or ad blocking; verify by reloading without them before reporting

## Screenshots that work as evidence

- Name files after the finding ID: `FUN-03_kosten_360.png`
- Use full-page screenshots for layout issues and element screenshots (`locator.screenshot()`) for detail
- Mark the problem area: draw an outline with injected CSS before the screenshot (`el.style.outline = "3px solid red"`), and say so in the evidence note
- Record viewport, browser and version (`browser.version()`), and date with each screenshot
- Use `deviceScaleFactor: 2` for screenshots a person reads, `1` for checks only you use

## Reading the rendered DOM

```js
const links = await page.$$eval("a[href]", (as) => as.map((a) => ({ href: a.href, text: a.textContent.trim() })));
const headings = await page.$$eval("h1,h2,h3,h4,h5,h6", (hs) => hs.map((h) => `${h.tagName} ${h.textContent.trim()}`));
const jsonld = await page.$$eval('script[type="application/ld+json"]', (ss) => ss.map((s) => s.textContent));
const tree = await page.locator("body").ariaSnapshot(); // accessibility tree as YAML
```

## Fresh contexts for the second pass

Verify each finding in a new context with no cookies and no cache:

```js
const fresh = await browser.newContext({ viewport: { width: 360, height: 800 } });
```

If the finding depends on state (consent given, menu open), record that state in the steps to reproduce.

## Limits of headless testing

Say so in the report when a result might differ in a real browser:

- Headless Chromium only; Safari and Firefox rendering is not covered unless you run WebKit and Firefox too
- No real screen reader output; the accessibility tree is an approximation
- Bot protection may serve different content to automation; compare with a manual check if numbers look off
- Fonts and emoji may render differently from a desktop system
