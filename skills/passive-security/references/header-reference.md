# Security Header Reference

Recommended values, what to look for when evaluating existing headers, and configuration snippets for common stacks.

## Contents

- Baseline header set
- Evaluating a Content Security Policy
- Configuration snippets
- Reading headers passively

## Baseline header set

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Opener-Policy: same-origin
```

Adjust `connect-src`, `img-src`, and `script-src` to the third parties the site actually needs. A CSP that breaks the site will be switched off; a CSP that allows everything protects nothing.

## Evaluating a Content Security Policy

| Observation | Assessment |
|---|---|
| No CSP header | Missing defense against XSS and injection; Medium |
| Only `Content-Security-Policy-Report-Only` | Monitoring, not enforced; Medium |
| `script-src` contains `'unsafe-inline'` without nonce or hash | Inline script injection not blocked; Medium |
| `script-src` contains `'unsafe-eval'` | Weakens protection; Low–Medium (some frameworks need it in development only) |
| `script-src` contains `*`, `https:`, or broad CDN hosts | Allows attacker-hosted scripts via public CDNs; Medium |
| No `object-src 'none'` | Plugin-based bypass possible; Low |
| No `base-uri` | `<base>` injection possible; Low |
| No `frame-ancestors` and no `X-Frame-Options` | Clickjacking possible; Medium |
| CSP set via `<meta>` only | `frame-ancestors` and reporting not supported in meta; Low |

Next.js note: the App Router supports nonce-based CSP through middleware. Static exports cannot use nonces; use hashes or `'strict-dynamic'` with a hashed loader.

## Configuration snippets

**Next.js (`next.config.js`):**

```js
module.exports = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    }];
  },
};
```

**Vercel (`vercel.json`):** a `headers` array with `source` and `headers`, same keys.

**Nginx:** `add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;` — note `always` so the header is also sent on error responses.

**Cookies (Node/Express example):**

```js
res.cookie("__Host-session", id, { secure: true, httpOnly: true, sameSite: "lax", path: "/" });
```

## Reading headers passively

```bash
curl -sSI https://example.com/            # headers of the main document
curl -sSI http://example.com/             # redirect to HTTPS?
curl -sSI https://example.com/404-qa-check  # headers on error pages
```

One request each, spaced by the agreed interval. For pages rendered client-side, the document headers still come from the server and `curl -I` is reliable for them. Asset headers are best read from the browser's network log.

**security.txt (RFC 9116) minimum:**

```text
Contact: mailto:security@example.com
Expires: 2027-11-17T00:00:00.000Z
Preferred-Languages: de, en
Policy: https://example.com/sicherheitsluecke-melden
```
