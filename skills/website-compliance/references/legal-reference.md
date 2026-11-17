# Legal Reference for Website Compliance Reviews (Germany / EU)

Sources and checklists behind the website-compliance skill. Laws change; check the current wording before citing a section in a report. This is orientation for a technical review, not legal advice.

## Contents

- Laws and guidance
- Third-party classification
- Impressum checklist
- Privacy policy cross-check
- BFSG scope decision
- Wording for findings

## Laws and guidance

| Topic | Source | Note |
|---|---|---|
| Legal notice | § 5 DDG (Digitale-Dienste-Gesetz) | In force since 14 May 2024; replaced § 5 TMG |
| Editorial content | § 18 (2) MStV (Medienstaatsvertrag) | Responsible person for journalistic-editorial content |
| Device storage and access (cookies, localStorage, fingerprinting) | § 25 TDDDG | Renamed from TTDSG in May 2024; content unchanged |
| Information duties | Art. 13 DSGVO | |
| Lawfulness, consent | Art. 6, Art. 7 DSGVO | Withdrawal as easy as giving consent (Art. 7(3)) |
| Third-country transfers | Art. 44 ff. DSGVO | EU-US Data Privacy Framework since July 2023 for certified US recipients |
| Pre-ticked consent | CJEU C-673/17 (Planet49), 1 Oct 2019 | Pre-ticked boxes are not valid consent |
| Google Fonts from Google servers | LG München I, 20 Jan 2022, 3 O 17493/20 | Transfer of IP address without consent; damages awarded |
| Consent design | DSK Orientierungshilfe für Anbieter digitaler Dienste | Reject option on first layer, equal design |
| Accessibility for B2C services | BFSG (Barrierefreiheitsstärkungsgesetz), BFSGV | Applies since 28 Jun 2025; Annex 3 information duty |
| Accessibility for public bodies | BITV 2.0 | Separate statement duty |
| Button label for paid contracts | § 312j (3) BGB | "zahlungspflichtig bestellen" or equivalent |

## Third-party classification

Usually **not** strictly necessary (need consent before loading if they access the device or transfer personal data):

- Analytics and tag managers loading analytics (Google Analytics, GTM with analytics tags, Matomo Cloud with cookies, Hotjar, Microsoft Clarity)
- Advertising and conversion pixels (Google Ads, Meta, LinkedIn Insight, TikTok)
- Fonts, icons, or scripts from third-party CDNs when self-hosting is possible (Google Fonts, Font Awesome CDN)
- Embedded maps and videos (Google Maps, YouTube without privacy mode and click-to-load, Vimeo)
- Chat and support widgets that load before the user opens them
- A/B testing and personalization tools
- Session replay tools

Often **strictly necessary** (consent not required, but must still appear in the privacy policy):

- The site's own hosting and CDN
- The consent tool itself (storing the consent choice)
- Security and bot protection directly tied to a requested service (assess case by case)
- Payment provider scripts on the checkout page when the user starts payment

When classification is unclear, report the request with "assessment needed" rather than a verdict.

## Impressum checklist

- [ ] Name and legal form
- [ ] Authorized representatives (for GmbH: Geschäftsführer)
- [ ] Postal address
- [ ] Email address
- [ ] Second fast contact channel (phone or form)
- [ ] Register court and number
- [ ] VAT ID if available
- [ ] Supervisory authority (if licensed activity)
- [ ] Responsible person under § 18 (2) MStV (if editorial content)
- [ ] Reachable from every page, at most two clicks
- [ ] Not an image only (text must be machine-readable and accessible)

## Privacy policy cross-check

Build a table from the network log and compare:

| Host | Vendor | Purpose | Before consent | Named in policy | Third country |
|---|---|---|---|---|---|
| fonts.googleapis.com | Google | Fonts | yes | no | USA |

Every row with "Named in policy: no" is a finding.

## BFSG scope decision

1. Does the site let consumers conclude a contract online (signup, purchase, subscription, booking)? If no → likely out of scope.
2. Is the offer exclusively for businesses, with technical measures preventing consumer contracts? If yes → likely out of scope. A B2B claim alone without such measures is weaker.
3. Is the provider a micro-enterprise (< 10 employees and ≤ €2 million annual turnover or balance sheet)? If yes → exempt for services.
4. Otherwise → likely in scope: accessible service (EN 301 549, which maps to WCAG 2.1 AA) and Annex 3 information required.

State your answers to these questions as assumptions in the report.

## Wording for findings

- "The site loads X before the user has decided on consent. This creates a risk under § 25 TDDDG and Art. 6 DSGVO."
- "The privacy policy does not mention X, which the site loads on every page."
- "The Impressum lacks the register number. § 5 (1) No. 4 DDG requires it for registered companies."
- "We recommend that the data protection officer or a lawyer assess this point."

Avoid: "illegal," "violates the law," "will be fined." State the observation and the risk.
