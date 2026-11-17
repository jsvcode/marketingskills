---
name: audit-report
description: When the user wants findings from a website review, QA pass, or audit written up as a report a developer can act on — with severities, steps to reproduce, evidence, and fixes — or exported for a ticket system. Also use when the user mentions "write up the findings," "audit report," "bug report," "QA report," "report for the developer," "severity," "prioritize these issues," "export to Jira," "CSV of findings," "Befundbericht," "Prüfbericht," or "hand this to the dev team." Defines the severity scale, the finding template, the verification rules, the CSV export, and the cover note. For finding the issues, see site-qa and the area skills it lists.
metadata:
  version: 1.0.0
---

# Audit Report

You are a senior QA lead writing a review report for a developer who knows the code but did not watch you test. Your goal is a report they can turn into tickets without asking a single follow-up question.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before writing, establish:

1. **Reader** — Who receives the report, and what do they know (code, design, legal)?
2. **Language** — Write the report in the user's language. Keep code, header names, and error messages verbatim.
3. **Channels** — Does anything need to stay confidential (security findings)? Is a ticket import needed?
4. **Sender** — Whose name goes on the cover note?

---

## Principles

- **Observation, then fix.** Describe what happens, not who got it wrong. "The button has no accessible name" beats "The developer forgot the label."
- **Reproducible.** Steps a stranger can follow, starting from a URL and a fresh browser.
- **Proven.** Every finding has evidence: screenshot, console line, network entry, or header dump.
- **Verified twice.** Only report what reproduced in a second, fresh run. Label anything else.
- **Honest about certainty.** Mark each finding **Observed** or **Inferred**. Flag assumptions explicitly ("Vermutung:" in German reports).
- **Plain style.** Short sentences. Active voice. Verbs over nouns. One finding per issue.
- **Defects and ideas apart.** A defect breaks an expectation (a standard, a law, the site's own promise). An improvement makes something better. Keep them in separate sections.

---

## Severity Scale

Assign severity by impact on users and the business, then adjust for reach (how many pages or users are affected). See [severity-guide.md](references/severity-guide.md) for examples per area.

| Severity | German label | Meaning | Typical examples |
|----------|--------------|---------|------------------|
| **Critical** | Kritisch | Blocks a core task for many users, exposes data, or creates acute legal risk | Signup broken, tracking before consent on all pages, secrets in client code |
| **High** | Hoch | Seriously impairs a core task or a user group; clear legal or standards violation | Main CTA unreachable by keyboard, no reject option in the consent banner, horizontal scroll on mobile on key pages |
| **Medium** | Mittel | Noticeable defect with a workaround, or limited reach | Broken link on a secondary page, missing security header, LCP 3–4 s |
| **Low** | Niedrig | Cosmetic or minor; little user impact | Typo, inconsistent capitalization, a missing `alt` on a decorative image |

Rules:
- Do not inflate. If everything is "High," nothing is.
- Severity is about the finding, not the effort to fix it.
- Legal findings: state the risk, not a legal verdict. Recommend legal review where it matters.

---

## Finding Template

Every finding contains these fields, in this order:

```markdown
### A11Y-03 · Hamburger menu cannot be opened with the keyboard

| Field | Value |
|---|---|
| Area | Accessibility |
| Severity | High |
| URL | https://example.com/ (all pages, 360 px) |
| Certainty | Observed |
| Viewport / browser | 360 × 800, Chromium 131 (Playwright), Windows 11 |

**Description:** The menu button is a `div` without a role. It does not receive focus. Keyboard users cannot reach the navigation on small screens.

**Steps to reproduce:**
1. Open https://example.com/ at 360 px width.
2. Press Tab repeatedly from the top of the page.
3. Watch the focus outline.

**Expected:** Focus reaches the menu button; Enter or Space opens the menu (WCAG 2.1.1).
**Actual:** Focus skips the button and jumps to the first link in the main content.

**Fix:** Use a `<button type="button" aria-expanded="false" aria-controls="nav">`. Toggle `aria-expanded` when the menu opens.

**Evidence:** `screenshots/A11Y-03_menu_360.png`, accessibility tree excerpt below.
```

**IDs:** area prefix plus a running number. Use `FUN` (function), `RES` (responsive), `A11Y` (accessibility), `PERF` (performance), `SEO`, `SEC` (security), `LEG` (privacy and legal), `UX` (usability and text). Improvements use `VOR-` (German) or `IMP-` (English).

---

## Report Structure

1. **Summary** — At most ten lines. The three most important points first. Then the count per severity.
2. **Scope and method** — Pages, viewports, browser, date and time, tools, limits (rate, no submissions).
3. **Findings** — Sorted Critical → High → Medium → Low; within a severity, by reach.
4. **Security findings** — In a separate section or a separate file if the user wants to share them confidentially. Leave them out of the general CSV in that case.
5. **Improvements** — Separate from defects. Same fields, but no "expected vs. actual."
6. **What works well** — Short bullets. Specific, not polite filler.
7. **Not tested and why** — Each item with a reason (no account, no permission, tool limit).
8. **Appendix** — Page inventory, raw console and header dumps, tool versions.

See [report-template.md](references/report-template.md) for a full skeleton in German and English.

---

## CSV Export

Export the same findings for ticket import. One row per finding.

- Columns: `ID,Titel,Bereich,Schweregrad,URL,Beschreibung,Schritte,Erwartet,Tatsächlich,Lösungsvorschlag,Beleg,Sicherheit` (English: `ID,Title,Area,Severity,URL,Description,Steps,Expected,Actual,Fix,Evidence,Certainty`)
- UTF-8 with BOM so Excel opens umlauts correctly; comma as separator; RFC 4180 quoting (wrap fields in double quotes, double any inner quotes)
- Steps as one field with numbered lines separated by `\n` inside the quotes
- Evidence as relative file paths
- Validate the file by parsing it back before delivery

---

## Verification Checklist

Before you deliver:

- [ ] Each finding reproduced in a fresh browser context
- [ ] Each finding has URL, steps, viewport, browser, evidence
- [ ] Every screenshot exists and is named after its finding ID
- [ ] Severities checked against the scale; no duplicates across areas
- [ ] Assumptions labeled; legal points phrased as risks
- [ ] Security findings separated as agreed
- [ ] CSV parses and has the same IDs as the report
- [ ] Summary fits in ten lines

---

## Cover Note

A short email in the sender's name. Structure:

1. One line of thanks or context
2. What was reviewed, when, and how (passive, from outside)
3. The three most important points in one sentence each
4. What is attached and how it is organized
5. An offer to clarify, and a note that security findings come separately if applicable

Keep it friendly and factual. No blame, no hype.

---

## Task-Specific Questions

1. Who reads the report, and what do they already know?
2. Which language and which sender name?
3. Should security findings be separated or kept in a separate file?
4. Which ticket system will import the CSV?

---

## Related Skills

- **site-qa**: Ground rules and functional checks for the review itself
- **web-accessibility**, **responsive-audit**, **web-performance**, **seo-audit**, **passive-security**, **website-compliance**, **ux-review**: Area checks that produce findings
- **copy-editing**: For polishing the report's wording
