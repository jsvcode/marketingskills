# Severity Guide by Area

Examples to calibrate severities. Adjust one level up for findings on every page or on the main conversion path. Adjust one level down for pages few users reach.

## Function (FUN)

| Severity | Examples |
|---|---|
| Critical | Main entry flow (signup, checkout, booking) fails; site-wide JavaScript crash leaves pages blank |
| High | Primary CTA leads to a 404; navigation menu broken on mobile; uncaught error stops a form from validating |
| Medium | Broken link on a secondary page; failed non-critical API call; soft 404 (error page returns 200) |
| Low | Console warning without visible effect; outdated external link |

## Responsive (RES)

| Severity | Examples |
|---|---|
| Critical | Content or CTA unreachable at a common width |
| High | Horizontal scroll on key pages at 360 px; overlapping text hides information |
| Medium | Awkward wrapping, oversized images, sticky header covering anchors |
| Low | Uneven spacing, minor alignment at one breakpoint |

## Accessibility (A11Y)

| Severity | Examples |
|---|---|
| Critical | Keyboard trap; core flow impossible without a mouse; CAPTCHA without alternative |
| High | Controls without accessible names; contrast below 3:1 on body text; focus invisible; no labels on form fields |
| Medium | Heading levels skipped; contrast 3:1–4.5:1 on body text; missing skip link; target size below 24 × 24 px |
| Low | Redundant `title` attributes; decorative image with non-empty `alt` |

## Performance (PERF)

| Severity | Examples |
|---|---|
| Critical | Page unusable for > 10 s on mid-range mobile |
| High | Field LCP > 4 s or INP > 500 ms; multi-megabyte hero image |
| Medium | LCP 2.5–4 s; CLS 0.1–0.25; unused JavaScript > 200 KB |
| Low | Missing cache headers on small assets; legacy image format |

## SEO

| Severity | Examples |
|---|---|
| Critical | `noindex` or robots block on the whole site |
| High | Key pages missing from the rendered HTML for crawlers; wrong canonicals; no titles |
| Medium | Duplicate titles or descriptions; missing H1; sitemap with non-canonical URLs |
| Low | Title slightly too long; missing optional structured data |

## Security, passive (SEC)

| Severity | Examples |
|---|---|
| Critical | Credentials, API secrets, or private keys in client code; public admin or staging with real data |
| High | No HTTPS redirect; session cookies without `Secure`/`HttpOnly`; no `security.txt` on a security product with a disclosure page that has no channel |
| Medium | Missing CSP or HSTS; framing allowed; source maps public; framework version disclosed |
| Low | `X-Powered-By` header; verbose server header |

## Privacy and legal (LEG)

| Severity | Examples |
|---|---|
| Critical | Tracking or marketing cookies set before consent site-wide |
| High | Impressum missing or incomplete; no reject option on the first banner layer; third-party fonts or maps loaded before consent; privacy policy missing a processor that the site uses |
| Medium | Privacy policy outdated (old law names, missing tools); consent cannot be withdrawn easily |
| Low | Legal pages not linked from every page footer; minor wording issues |

Phrase legal findings as risks ("creates a risk under § 25 TDDDG") and recommend legal review. Do not state a legal verdict.

## Usability and text (UX)

| Severity | Examples |
|---|---|
| High | Users cannot tell what the offer is or what it costs; contradictory prices or claims |
| Medium | Inconsistent terms for the same thing; unclear CTA; jargon the audience will not know |
| Low | Typos; inconsistent quotation marks; mixed address forms (du/Sie) on one page |
