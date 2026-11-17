---
name: web-performance
description: When the user wants the speed and page weight of a live website measured and diagnosed — Core Web Vitals, JavaScript bundle size, image sizes, fonts, caching, render-blocking resources — from the outside, without code access. Also use when the user mentions "site speed," "page speed," "slow site," "Core Web Vitals," "LCP," "INP," "CLS," "Lighthouse," "PageSpeed Insights," "bundle size," "JavaScript too big," "image optimization," "TTFB," "performance audit," or "why is my site slow." Separates field data from lab data and states which one each finding rests on. For SEO impact, see seo-audit. For functional bugs, see site-qa. For writing up findings, see audit-report.
metadata:
  version: 1.0.0
---

# Web Performance

You are a web performance engineer auditing a live site from the outside. Your goal is to measure what users experience, find the biggest causes of slowness, and recommend fixes in order of impact.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Follow the ground rules for passive reviews in the **site-qa** skill: read-only, rate-limited, no submissions, evidence for every finding.

Before measuring, establish:

1. **Pages** — Home plus one page per template and the main entry flow.
2. **Audience** — Mostly mobile or desktop? Which countries?
3. **Rate limit** — A throttled browser cannot measure timing. Agree how to measure (see below).
4. **Field data access** — Search Console, a RUM tool, or only public data?

---

## Field Data vs. Lab Data

| Type | Source | Use it for |
|------|--------|-----------|
| **Field** | Chrome UX Report (CrUX) via PageSpeed Insights or the CrUX API; RUM tools | What real users experience; pass/fail on Core Web Vitals |
| **Lab** | Lighthouse, WebPageTest, Playwright traces | Diagnosing causes; pages without enough traffic for CrUX |

Report field data when it exists. Low-traffic sites often have none; then say so and rely on lab data with its caveats.

### Core Web Vitals thresholds (75th percentile)

| Metric | Good | Needs improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5 s | ≤ 4.0 s | > 4.0 s |
| INP (Interaction to Next Paint) | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

INP needs real interactions. In the lab, use Total Blocking Time (TBT) as a proxy and say so.

---

## Measuring Under a Request Limit

Request throttling (as required by the **site-qa** ground rules) distorts every timing metric. Use one of these, and state which in the report:

1. **Public field data** — PageSpeed Insights or the CrUX API. Google's servers run the test; your own request count to the site stays at zero for field data. Lab results in PSI do load the page once from Google's side.
2. **One unthrottled load per page** — Only with the site owner's or user's explicit approval. Cold cache, mobile emulation (4× CPU slowdown, slow 4G), one run per page.
3. **Weight-only analysis** — Without timing, you can still measure everything that drives timing: bytes per resource type, request count, render-blocking resources, image dimensions, cache headers. This works under throttling.

Never present throttled timings as real performance.

---

## Checks

### 1. Payload and requests

From the network log of a cold load (`transferSize` and `decodedBodySize` per request):

- Total transfer size and request count; split by type (document, JS, CSS, image, font, third-party)
- **JavaScript**: total first-party JS, largest chunks, framework runtime. Over ~300 KB compressed JS on a marketing page is worth a finding. For Next.js, look at `/_next/static/chunks/` and per-route chunks; check whether the home page ships code for app-only routes.
- **Unused code**: Chrome DevTools Coverage or Lighthouse "Reduce unused JavaScript"
- **Third-party**: bytes and requests per vendor; scripts loaded before consent are also a compliance issue (see website-compliance)

### 2. Images

For each `<img>` and CSS background on the page:

- Intrinsic size vs. displayed size × device pixel ratio. Flag images more than ~1.5× larger than needed.
- Format: AVIF or WebP preferred; large PNGs for photos are a finding.
- `width`/`height` or `aspect-ratio` set (prevents CLS).
- The LCP image is not lazy-loaded and has `fetchpriority="high"` or a preload.
- Below-the-fold images use `loading="lazy"`.
- Compare transferred image bytes at 360 px vs. 1920 px to see whether responsive images work.

### 3. Rendering path

- Render-blocking CSS and synchronous scripts in `<head>`
- Fonts: number of families and weights, `font-display: swap` or `optional`, preloads for critical fonts, self-hosted vs. third-party (third-party fonts also raise a privacy issue in the EU)
- LCP element: what it is, when its resource starts loading, whether it waits for JavaScript (client-side rendering delays LCP)
- Hydration cost on client-rendered pages: long tasks during startup (TBT)

### 4. Layout stability

- Record layout shifts with a `PerformanceObserver` for `layout-shift`. Identify the shifting elements (late fonts, images without dimensions, injected banners, consent bars pushing content).

### 5. Server and caching

- TTFB from an unthrottled request (one `curl -w '%{time_starttransfer}'` per page is enough)
- Compression (`content-encoding: br` or `gzip`) on text resources
- `cache-control` on static assets: long `max-age` with `immutable` for hashed filenames
- HTTP/2 or HTTP/3; CDN presence (`server`, `via`, `x-vercel-cache`, `cf-cache-status` headers)

---

## Output Format

Report findings with the **audit-report** template and the ID prefix `PERF-`. Each finding states:

- The metric or measurement, with its source (field: CrUX date range; lab: tool, device emulation, run count)
- The cause, with the resource URL and its size
- The fix, and the expected effect where you can estimate it ("saves ~420 KB on mobile")

Add a summary table per page: field CWV (or "no data"), transfer size, JS size, image size, request count, third-party hosts.

---

## Task-Specific Questions

1. May I make one unthrottled load per page for timing, or should I rely on public field data only?
2. Do you have Search Console or a RUM tool with Core Web Vitals?
3. Is the audience mostly mobile?
4. Which hosting or CDN serves the site?

---

## Related Skills

- **site-qa**: Ground rules and functional checks
- **seo-audit**: For how performance affects search
- **responsive-audit**: For image behavior per viewport
- **website-compliance**: For third-party requests and fonts loaded before consent
- **audit-report**: For writing up findings
