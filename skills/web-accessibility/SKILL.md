---
name: web-accessibility
description: When the user wants a live website checked for accessibility against WCAG 2.2 level AA — keyboard use, screen reader support, contrast, forms, focus, zoom, and reflow — with automated and manual checks in a real browser. Also use when the user mentions "accessibility audit," "a11y," "WCAG," "WCAG 2.2," "BITV," "EN 301 549," "BFSG," "Barrierefreiheit," "screen reader," "keyboard navigation," "color contrast," "alt text," "focus order," "accessible forms," or "is my site accessible." Reports each issue against its success criterion with steps and a code-level fix. For the legal accessibility statement, see website-compliance. For layout at screen sizes, see responsive-audit. For writing up findings, see audit-report.
metadata:
  version: 1.0.0
---

# Web Accessibility

You are an accessibility specialist auditing a live website against WCAG 2.2 level AA. Your goal is to find barriers, tie each to a success criterion, and give a fix a developer can implement directly.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Follow the ground rules for passive reviews in the **site-qa** skill: read-only, rate-limited, no submissions, evidence for every finding.

Before testing, establish:

1. **Target** — WCAG 2.2 AA unless the user names another level or standard (EN 301 549 references WCAG 2.1 AA; 2.2 AA covers it).
2. **Pages and flows** — Pick a representative sample: home, one page per template, every form, every legal page, the main entry flow.
3. **Assistive tech** — Can a real screen reader (NVDA, JAWS, VoiceOver) be used? If not, say that screen reader results are approximated from the accessibility tree.

---

## Method

Automated tools find about a third of WCAG issues. Run them first, then test manually.

### 1. Automated scan

- Inject **axe-core** into each rendered page and run it with the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` tags. With Playwright: `@axe-core/playwright`.
- Re-run after opening menus, modals, and accordions; closed content is not scanned.
- Treat "needs review" results as leads, not findings.
- Do not report a tool result without confirming it manually.

### 2. Keyboard

- Tab through every page from the top. Record the focus order.
- Every interactive element is reachable and operable (Enter, Space, arrow keys for composite widgets, Esc for dialogs).
- Focus is always visible (2.4.7) and not hidden behind sticky headers or banners (2.4.11).
- No keyboard traps (2.1.2). Modals trap focus while open and return it on close.
- A skip link or landmarks let users bypass repeated blocks (2.4.1).
- The consent banner is fully operable by keyboard and receives focus first.

### 3. Screen reader semantics

- Read the accessibility tree (`locator.ariaSnapshot()` in Playwright, or the Chrome DevTools Accessibility pane).
- Page has `lang="de"` (or the right language) on `<html>` (3.1.1); foreign phrases marked with `lang` (3.1.2).
- One `<h1>`; logical heading levels; landmarks (`header`, `nav`, `main`, `footer`).
- Every control has an accessible name that matches its visible label (4.1.2, 2.5.3).
- Icon-only buttons have names. Links make sense out of context, or have context (2.4.4).
- Images: informative images have meaningful `alt`; decorative images have `alt=""` (1.1.1).
- State changes are announced: `aria-expanded`, `aria-current`, live regions for status messages (4.1.3).

### 4. Visual

- Text contrast at least 4.5:1, large text (≥ 24 px, or ≥ 18.66 px bold) at least 3:1 (1.4.3).
- UI components and focus indicators at least 3:1 against adjacent colors (1.4.11).
- Information not conveyed by color alone (1.4.1).
- Zoom to 200 %: no loss of content or function (1.4.4).
- Reflow at 320 CSS px: no two-dimensional scrolling (1.4.10).
- Text spacing override (line height 1.5, letter spacing 0.12 em) breaks nothing (1.4.12).
- Animations respect `prefers-reduced-motion`; nothing flashes more than three times per second (2.3.1).

### 5. Forms

- Every field has a visible label tied to it (`for`/`id` or wrapping) (1.3.1, 3.3.2).
- Required fields are marked in text, not only with color or an asterisk without explanation.
- Errors are identified in text and tied to the field (`aria-describedby`, `aria-invalid`) (3.3.1, 3.3.3). Check by blurring empty required fields; do not submit.
- `autocomplete` attributes on personal data fields (1.3.5).
- No re-entry of data already given in the same process (3.3.7).
- Login and verification don't rely on a cognitive test without an alternative (3.3.8). Check only what is visible without logging in.

### 6. WCAG 2.2 additions

Check these explicitly; older checklists miss them:

| Criterion | Level | What to check |
|-----------|-------|---------------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Sticky headers, banners, and chat widgets don't fully cover the focused element |
| 2.5.7 Dragging Movements | AA | Sliders and drag-and-drop have a single-pointer alternative |
| 2.5.8 Target Size (Minimum) | AA | Targets at least 24 × 24 CSS px, or enough spacing |
| 3.2.6 Consistent Help | A | Help and contact links appear in the same place across pages |
| 3.3.7 Redundant Entry | A | Data entered earlier in a flow is prefilled or selectable |
| 3.3.8 Accessible Authentication (Minimum) | AA | Password fields allow paste and password managers; no puzzle-only CAPTCHA |

4.1.1 Parsing was removed in WCAG 2.2. Do not report pure HTML validation errors under it.

See [wcag-checklist.md](references/wcag-checklist.md) for the full AA list with test methods.

---

## Output Format

Report findings with the **audit-report** template and the ID prefix `A11Y-`. Each finding names:

- The success criterion (number, name, level)
- Who is affected (keyboard users, screen reader users, low vision, cognitive)
- The element (selector or accessible name) and an excerpt of the accessibility tree or axe result
- A code-level fix

Add a short conformance overview: criteria passed, failed, not applicable, not tested.

---

## Task-Specific Questions

1. Which standard applies: WCAG 2.2 AA, EN 301 549, BITV 2.0?
2. Can findings be checked with a real screen reader?
3. Are there known user groups to prioritize (older users, keyboard-only, low vision)?
4. Is there an existing accessibility statement to compare against?

---

## Related Skills

- **site-qa**: Ground rules and functional checks
- **responsive-audit**: For layout at small widths
- **website-compliance**: For the accessibility statement and BFSG scope
- **ux-review**: For plain language and clarity
- **audit-report**: For writing up findings
