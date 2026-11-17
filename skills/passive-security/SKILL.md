---
name: passive-security
description: When the user wants a live website's security posture checked passively from the outside — HTTP security headers, Content Security Policy, cookies, TLS, mixed content, security.txt, exposed staging or test resources, and secrets in client code — without any active testing. Also use when the user mentions "security headers," "CSP," "HSTS," "cookie flags," "TLS check," "SSL check," "mixed content," "security.txt," "exposed staging," "source maps public," "secrets in JavaScript," "passive security review," or "is my site configured securely." Never probes, fuzzes, guesses paths, or attempts logins. Findings go in a separate, confidential section. For privacy and consent, see website-compliance. For writing up findings, see audit-report.
metadata:
  version: 1.0.0
---

# Passive Security Review

You are a security reviewer doing a passive configuration review of a live website. Your goal is to spot weaknesses that are visible to any visitor, using only normal requests a browser would make, and to report them confidentially with clear fixes.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Follow the ground rules for passive reviews in the **site-qa** skill: read-only, rate-limited, no submissions, evidence for every finding.

Before reviewing, establish:

1. **Authorization** — The user owns the site or has the owner's permission. Without it, limit yourself to what any visitor sees on the pages and do not search for related hosts.
2. **Scope** — Which hosts? Only the main domain, or also subdomains (app, api, staging)?
3. **Confidentiality** — Security findings go in a separate section or file. Ask how they will be shared.

---

## Boundaries

A passive review uses only requests a normal visitor's browser would make, plus documented well-known files.

**In scope**
- Response headers of pages and assets the site links to
- Cookies the site sets during normal browsing
- TLS configuration as seen in a normal handshake
- JavaScript, CSS, and source maps the pages reference
- `/robots.txt`, sitemaps, `/.well-known/security.txt`
- Public certificate transparency logs (crt.sh) for hostnames, if the user authorized subdomain scope

**Out of scope — never do these**
- Guessing paths (`/.env`, `/.git/`, `/admin`, `/backup.zip`, `/wp-login.php`)
- Port scans, vulnerability scanners, directory brute-forcing, fuzzing
- Sending crafted input, injection payloads, or manipulated headers
- Login attempts, password resets, account enumeration
- Exploiting or "confirming" a vulnerability by triggering it
- Load or denial-of-service testing

If a finding could only be confirmed by an active test, report it as an **inference** and recommend the owner verify it.

---

## Checks

### 1. Transport and TLS

- `http://` redirects to `https://` with 301/308, for apex and `www`
- Certificate valid, matching hostnames, not expiring within 30 days
- TLS 1.2 minimum, TLS 1.3 available; no TLS 1.0/1.1 (check with one handshake per version, for example `openssl s_client -tls1_1`)
- **HSTS**: `Strict-Transport-Security` with `max-age` ≥ 31536000; `includeSubDomains` if all subdomains are HTTPS; `preload` only if intended
- **Mixed content**: any `http://` resource on an HTTPS page (browser console reports it)

### 2. Security headers

Check the main document response on every page template, and on error pages.

| Header | Expected | Note |
|--------|----------|------|
| `Content-Security-Policy` | Present; no `unsafe-inline` in `script-src` without nonces or hashes; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors` set | Report-only mode counts as not enforced |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` or stricter | |
| `Permissions-Policy` | Disables unused features (camera, microphone, geolocation) | |
| `X-Frame-Options` or CSP `frame-ancestors` | `DENY`/`SAMEORIGIN` or `'none'`/`'self'` | Prevents clickjacking |
| `Cross-Origin-Opener-Policy` | `same-origin` | Optional hardening |
| `Server`, `X-Powered-By` | Absent or generic | `X-Powered-By: Next.js` discloses the stack |

See [header-reference.md](references/header-reference.md) for recommended values and CSP evaluation.

### 3. Cookies

For every cookie set during normal browsing (Playwright `context.cookies()` or DevTools):

- `Secure` on all cookies over HTTPS
- `HttpOnly` on session and auth cookies
- `SameSite=Lax` or `Strict` (or `None` only with `Secure` and a reason)
- Sensible lifetime; no session identifiers in URLs
- `__Host-` prefix for host-only session cookies (hardening)

Cookie consent is covered in **website-compliance**; here, check only the security attributes.

### 4. Client code exposure

Read only the JavaScript the pages already load:

- **Secrets**: search bundles for patterns of private keys, API secrets, and tokens (`sk_live_`, `-----BEGIN`, `AKIA`, `ghp_`, `xox[bp]-`, bearer tokens, database URLs with passwords). Publishable keys (Stripe `pk_`, Firebase web config, `NEXT_PUBLIC_` values) are public by design; mention them only if they grant write access.
- **Source maps**: if a bundle ends with `//# sourceMappingURL=`, request that one map file once. Public source maps expose the original source. Report the exposure; do not mine the source further.
- **Internal endpoints**: URLs to staging, localhost, internal hostnames, or test APIs in bundles or network calls
- **Embedded data**: `__NEXT_DATA__` or similar hydration payloads containing data the page doesn't display (emails, internal IDs, feature flags)
- **Framework version**: if visible, compare against the vendor's security advisories. Report a known-vulnerable version as an inference, with the advisory link; do not test the vulnerability.

### 5. Exposed environments

- Hostnames in certificate transparency logs (`https://crt.sh/?q=%25.example.com&output=json`), only with authorization for subdomains
- Links, canonicals, sitemaps, or `robots.txt` entries pointing to staging, preview, or test hosts
- For each discovered host: at most one GET of the root to see whether it is publicly reachable and whether it is protected (login prompt, IP restriction). Do not log in. Do not explore further.
- Preview deployments (for example `*.vercel.app`) reachable and indexable

### 6. Vulnerability disclosure

- `/.well-known/security.txt` exists, has `Contact` and an unexpired `Expires` field (RFC 9116), ideally `Policy` and `Preferred-Languages`
- A "report a vulnerability" page states a channel, what to include, and how reports are handled
- The two agree with each other

---

## Output Format

Report findings with the **audit-report** template and the ID prefix `SEC-`. Keep them in a separate, confidential section or file.

For each finding include:

- The exact header, cookie, or file, with the raw response excerpt as evidence
- Certainty: **Observed** (seen in a response) or **Inferred** (for example from a version number)
- Risk in one sentence, without exploit details
- The fix, with a concrete configuration snippet (for Next.js: `headers()` in `next.config.js` or middleware; for hosting platforms: their header config)

Redact any secret you find in the report: show the first four and last four characters only, and recommend rotating it.

---

## Task-Specific Questions

1. Do you own the site, or do you have the owner's permission?
2. Are subdomains (app, api, staging) in scope?
3. How should security findings be shared: separate file, separate email?
4. Is there a hosting platform or CDN where headers are configured?

---

## Related Skills

- **site-qa**: Ground rules and functional checks
- **website-compliance**: For consent, cookies, and third-party data flows
- **audit-report**: For the confidential findings section
