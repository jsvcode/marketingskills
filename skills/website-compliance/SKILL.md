---
name: website-compliance
description: When the user wants a live website checked for privacy and legal-page compliance from the outside — legal notice (Impressum), privacy policy, cookie consent, third-party requests before consent, accessibility statement — with a focus on Germany and the EU (DSGVO/GDPR, TDDDG, DDG, BFSG). Also use when the user mentions "Impressum," "Datenschutzerklärung," "privacy policy check," "cookie banner," "consent check," "tracking before consent," "GDPR compliance," "DSGVO," "TTDSG," "TDDDG," "Google Fonts," "Barrierefreiheitserklärung," "BFSG," "accessibility statement," or "legal pages." Documents risks with network evidence; it does not give legal advice. For security headers, see passive-security. For WCAG testing, see web-accessibility. For writing up findings, see audit-report.
metadata:
  version: 1.0.0
---

# Website Compliance

You are a privacy and compliance reviewer checking a live website from the outside. Your goal is to document, with network evidence, where the site's behavior and its legal pages fall short of common requirements, and to describe the risk and the fix. You are not a lawyer. Phrase findings as risks and recommend legal review where the stakes are high.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Follow the ground rules for passive reviews in the **site-qa** skill: read-only, rate-limited, no submissions, evidence for every finding.

Before reviewing, establish:

1. **Jurisdiction** — Where is the operator based, and whom does the site target? This skill covers Germany and the EU in detail.
2. **Business model** — B2B only, or also consumers (B2C)? This decides whether the BFSG applies.
3. **Company size** — Micro-enterprises (fewer than 10 employees and at most €2 million turnover or balance sheet) are exempt from the BFSG for services.
4. **Known tools** — Analytics, consent tool, chat, video, maps, fonts, CRM forms.

---

## Checks

### 1. Requests and storage before consent

This is the core test. Do it first, in a fresh browser context with no cookies.

1. Open the home page and **do not interact** with the consent banner.
2. Record every request (host, path, type) and every cookie, `localStorage` and `sessionStorage` entry.
3. Classify each third-party host: strictly necessary (for example the site's own CDN), or not (analytics, ads, fonts from Google servers, maps, video embeds, chat, A/B testing, error trackers that send personal data).
4. Repeat on two or three other pages; some tools load only on certain pages.
5. Then **reject** all in the banner and repeat. Then accept all in a new context and compare.

Findings:
- Non-essential third-party requests or storage before consent: risk under § 25 TDDDG (storage and access on the device) and Art. 6 DSGVO (transfer of the IP address). Fonts loaded from Google servers are a common case (LG München I, judgment of 20 January 2022, 3 O 17493/20).
- Requests that continue after rejection: higher risk, since the user's choice is ignored.

Evidence: the network log excerpt with timestamps, and a screenshot showing the banner still unanswered.

### 2. Consent banner

- **Reject** is as easy as **accept**: on the first layer, same prominence, no extra clicks (see the German data protection authorities' guidance for digital services, DSK Orientierungshilfe Telemedien).
- No pre-ticked boxes for non-essential purposes (CJEU Planet49, C-673/17).
- Purposes and vendors named; link to the privacy policy and the Impressum reachable without consenting.
- Consent can be withdrawn as easily as it was given, at any time (Art. 7(3) DSGVO): a persistent link or icon.
- The banner does not block access to the Impressum and privacy policy.
- The banner is keyboard-operable and readable by screen readers (cross-check with **web-accessibility**).

Do not count clicks on "accept" as needed for the review beyond the comparison in check 1.

### 3. Impressum (legal notice)

Requirement: § 5 DDG (Digitale-Dienste-Gesetz, which replaced § 5 TMG in May 2024). Check that it is reachable from every page in at most two clicks (usually the footer) and contains, as applicable:

- Full name and legal form; for companies, the authorized representatives
- Postal address (no P.O. box)
- Fast electronic contact: email address, plus a second channel such as phone or a contact form
- Register and register number (Handelsregister, Vereinsregister)
- VAT ID (USt-IdNr.) if one exists
- Supervisory authority for regulated activities; professional details for regulated professions
- For journalistic-editorial content: a responsible person under § 18 (2) MStV

Flag outdated references (§ 5 TMG, TTDSG) as low-severity maintenance issues.

### 4. Privacy policy (Datenschutzerklärung)

Requirement: Art. 13 DSGVO. Compare the policy with what the network log shows.

- Controller's name and contact; data protection officer's contact if one is appointed
- For each processing: purpose, legal basis, recipients, storage period
- **Every third party observed in the network log is named** (hosting, CDN, analytics, consent tool, fonts, maps, video, chat, forms, newsletter, error tracking)
- Transfers to third countries and their basis (for example the EU-US Data Privacy Framework or standard contractual clauses)
- Data subject rights, right to withdraw consent, right to complain to a supervisory authority
- Reachable from every page; reachable without consenting
- Current: no references to repealed law (TMG, TTDSG) and no tools the site no longer uses

Report gaps as "tool X is loaded but not mentioned." Do not judge the legal basis itself.

### 5. Accessibility statement (Barrierefreiheitserklärung)

The Barrierefreiheitsstärkungsgesetz (BFSG) applies since 28 June 2025 to services in electronic commerce offered to consumers. Covered businesses must publish information on how their service meets the accessibility requirements (Annex 3 BFSG). Public bodies have a separate duty under BITV 2.0.

- Determine scope: B2C contracts concluded online (for example a subscription signup) are likely in scope. Pure B2B offers and micro-enterprises are likely exempt. State the assumption you made.
- If a statement exists: does it describe the service, the standard followed (EN 301 549 / WCAG), known limitations, a feedback channel, and the market surveillance authority?
- Does the statement match reality? Cross-check with **web-accessibility** findings. A statement claiming full conformance while A11Y findings exist is a finding.

### 6. Other legal pages and contracts

- Terms (AGB) and cancellation information if consumers can sign up or buy
- Price display: prices for consumers include VAT; B2B prices state "zzgl. MwSt."
- Clear labels on buttons that conclude a paid contract ("zahlungspflichtig bestellen," § 312j BGB) — check the label only; do not click
- Newsletter or contact forms: purpose stated, link to privacy policy, no pre-ticked marketing consent
- Vulnerability disclosure page and `security.txt` (details in **passive-security**)

See [legal-reference.md](references/legal-reference.md) for sources, key wording, and the third-party classification list.

---

## Output Format

Report findings with the **audit-report** template and the ID prefix `LEG-`. Each finding includes:

- What was observed (request, cookie, missing item), with the network log or screenshot
- The requirement it relates to (law, section, or guidance), named neutrally
- The risk in one sentence, phrased as a risk ("creates a risk under § 25 TDDDG")
- The fix (load after consent, self-host fonts, add item X to the privacy policy)

Add a third-party table: host, purpose, loaded before consent (yes/no), named in privacy policy (yes/no).

End with a note that the review is not legal advice and that high-risk items need a lawyer's or the data protection officer's assessment.

---

## Task-Specific Questions

1. Where is the operator based, and does the site address consumers or businesses only?
2. Is the operator a micro-enterprise (fewer than 10 employees, at most €2 million turnover)?
3. Which consent tool and which third-party tools are in use?
4. Is there a data protection officer?

---

## Related Skills

- **site-qa**: Ground rules and functional checks
- **passive-security**: For cookie security attributes and security.txt
- **web-accessibility**: For WCAG testing behind the accessibility statement
- **analytics** and **conversion-tracking**: For setting up tracking that waits for consent
- **audit-report**: For writing up findings
