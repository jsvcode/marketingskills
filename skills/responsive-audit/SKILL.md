---
name: responsive-audit
description: When the user wants to check how a live website looks and works across screen sizes — phones, tablets, laptops, large monitors — in a real browser. Also use when the user mentions "responsive check," "mobile layout," "looks broken on mobile," "horizontal scroll," "breakpoints," "test at 360 px," "tablet view," "check different screen sizes," "mobile-friendly," "viewport issues," or "layout bug on small screens." Checks overflow, navigation, tap targets, images, sticky elements, and reflow at fixed viewports with screenshot evidence. For functional bugs, see site-qa. For WCAG reflow and target-size conformance, see web-accessibility. For writing up findings, see audit-report.
metadata:
  version: 1.0.0
---

# Responsive Audit

You are a front-end QA specialist. Your goal is to find layout and interaction defects that appear at specific screen sizes, and to prove each one with a screenshot at the exact viewport.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Follow the ground rules for passive reviews in the **site-qa** skill: read-only, rate-limited, no submissions, evidence for every finding.

Before testing, establish:

1. **Viewports** — Which widths? Default: 360, 768, 1280, 1920 px. Add 320 px for the WCAG reflow check.
2. **Pages** — Which templates matter (home, pricing, form pages, legal pages)?
3. **Browsers** — Chromium only, or also WebKit (Safari) and Firefox?

---

## Viewports

| Width | Height | Represents | Notes |
|-------|--------|-----------|-------|
| 320 | 640 | WCAG reflow minimum (1.4.10) | Equals 1280 px at 400 % zoom |
| 360 | 800 | Common Android phone | Primary mobile check |
| 768 | 1024 | Tablet portrait | Often hits the mobile/desktop menu switch |
| 1280 | 800 | Laptop | Primary desktop check |
| 1920 | 1080 | Large monitor | Max-width, stretched images, empty space |

Also test widths just below and above each breakpoint you discover (for example 767 and 769 px). Bugs cluster at the edges.

---

## Checks per Viewport

### 1. Horizontal overflow

- Compare `document.documentElement.scrollWidth` with `clientWidth`. Any difference means horizontal scroll.
- Find the offending elements: those whose bounding box extends past the viewport. Typical culprits are fixed-width containers, long words or URLs, tables, code blocks, `100vw` with a scrollbar, and negative margins.
- Screenshot the full page and the offending element.

### 2. Navigation

- The menu switches cleanly between desktop and mobile variants; no width shows both or neither.
- The mobile menu opens, closes, scrolls if long, and closes on Esc and on link click.
- Page content behind an open menu does not scroll (scroll lock) unless intended.
- Anchor links are not hidden under a sticky header (check `scroll-margin-top`).

### 3. Content and typography

- No clipped, overlapping, or truncated text. Check headings with long German compound words; recommend `hyphens: auto` with `lang="de"`.
- Body text at least 16 px on mobile; line length about 45–80 characters on desktop.
- Tables either reflow or scroll inside their own container.
- Content order makes sense when columns stack.

### 4. Touch and interaction

- Tap targets at least 24 × 24 CSS px (WCAG 2.5.8), ideally 44 × 44 px, with spacing.
- Hover-only content (tooltips, mega menus) has a tap or focus alternative.
- Form inputs are at least 16 px font size; smaller fonts make iOS Safari zoom on focus.
- The viewport meta tag does not block zoom (`user-scalable=no` or `maximum-scale=1` fail WCAG 1.4.4).

### 5. Media

- Images scale and keep their aspect ratio; no stretched or pixelated images at 1920 px.
- Responsive images (`srcset`/`sizes`, `next/image`) serve smaller files to small viewports. Compare the transferred file size at 360 vs. 1920 px.
- Videos and iframes (maps, embeds) fit their container.

### 6. Fixed and sticky elements

- Cookie banners, chat widgets, and sticky CTAs do not cover essential content or each other at 360 px.
- Combined fixed elements leave enough visible content area (rule of thumb: at least half the screen height).
- Modals fit the viewport and scroll internally.

### 7. Orientation and extremes

- Landscape phone (800 × 360): header and banner don't eat the whole screen.
- 1920 px: content has a sensible max-width; backgrounds and hero sections don't break.

---

## Method

1. Capture full-page screenshots for every page at every viewport. The **site-qa** skill's `scripts/capture.mjs` does this and records horizontal overflow and its offending elements.
2. Review screenshots side by side per page. Note differences that look unintended.
3. For each candidate, open the page at that viewport, inspect the element, and confirm the cause.
4. Verify in a fresh browser context. If WebKit is available, check mobile findings there as well; Safari differs most.

---

## Output Format

Report findings with the **audit-report** template and the ID prefix `RES-`. Each finding names the exact viewport(s) and includes a screenshot named after the ID (`RES-02_kosten_360.png`).

For an overview, add a matrix:

| Page | 360 | 768 | 1280 | 1920 |
|------|-----|-----|------|------|
| / | RES-01 | ok | ok | ok |
| /kosten | RES-02 | RES-02 | ok | RES-05 |

---

## Task-Specific Questions

1. Which viewports and browsers matter most for your audience?
2. Do you have analytics on device and screen-size share?
3. Are there known breakpoints in the CSS framework (for example Tailwind's 640/768/1024/1280)?

---

## Related Skills

- **site-qa**: Ground rules and functional checks
- **web-accessibility**: For reflow, zoom, and target size as WCAG criteria
- **web-performance**: For image weight per viewport
- **audit-report**: For writing up findings
