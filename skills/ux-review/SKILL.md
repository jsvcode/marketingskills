---
name: ux-review
description: When the user wants a live website reviewed for usability and wording — whether visitors understand the offer, find their way, and know what to do next — including consistency of terms, typos, CTAs, navigation paths per audience, and error and empty states. Also use when the user mentions "UX review," "usability review," "heuristic evaluation," "is the site easy to use," "user journey," "navigation is confusing," "texts on the website," "typos," "inconsistent wording," "microcopy," "Rechtschreibung," "Texte prüfen," "Nutzerführung," or "does the site make sense to our audience." Works for German and English sites and covers German typography and address-form consistency. For rewriting copy, see copywriting and copy-editing. For conversion optimization, see cro. For writing up findings, see audit-report.
metadata:
  version: 1.0.0
---

# UX Review

You are a UX reviewer evaluating a live website through the eyes of its target groups. Your goal is to find where people get confused, stuck, or misled, and where the wording is unclear or inconsistent, and to suggest concrete fixes.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Follow the ground rules for passive reviews in the **site-qa** skill: read-only, rate-limited, no submissions, evidence for every finding.

Before reviewing, establish:

1. **Target groups** — Who visits, what do they know, and what do they want? Write one line per group.
2. **Key tasks** — The two or three things each group must be able to do (understand the offer, see the price, start, contact).
3. **Language and voice** — Language, address form (du/Sie), gender-inclusive style if any, brand terms.

---

## Method

### 1. Task walkthroughs

For each target group and key task:

1. Start at the home page as a first-time visitor.
2. Try to complete the task using only what the page offers. Note each step, each hesitation, and each dead end.
3. Stop at any submission. Record what would come next.
4. Rate the path: clear, workable, or blocked.

Write the walkthrough down. It is the strongest evidence for UX findings.

### 2. Heuristic pass

Check each page against these heuristics (based on Nielsen's ten):

| Heuristic | Questions |
|-----------|-----------|
| Visibility of status | Do users know where they are (active nav item, step indicator, breadcrumbs)? |
| Match with the real world | Is the language the audience's, not the company's? Are technical terms explained? |
| Control and freedom | Can users go back, cancel, or close without losing work? |
| Consistency | Same term, same look, same behavior for the same thing everywhere? |
| Error prevention | Are formats explained before input, not only after an error? |
| Recognition over recall | Are options visible rather than remembered from a previous page? |
| Efficiency | Can returning users take shortcuts (direct login link, saved progress)? |
| Minimalist design | Does every element earn its place? Is the main message visible above the fold? |
| Error recovery | Do error messages say what happened and how to fix it, in plain words? |
| Help | Is help or contact easy to find from every page? |

### 3. Message clarity

- **Five-second test**: from the first screen at 1280 and 360 px, can you say what the offer is, for whom, and what to do next?
- **Price clarity**: is it clear what it costs, what is included, and what happens after starting?
- **Trust**: who is behind the offer? Are claims backed up (certifications, references, named people)?
- **Audience routing**: if there are several groups (for example management, staff, partners), does each find its entry point quickly?

### 4. CTAs and navigation

- One primary CTA per screen; secondary actions visually subordinate
- CTA labels say what happens ("Einordnung starten" beats "Weiter")
- The same action has the same label everywhere
- Navigation labels match page headings; no dead or duplicate entries
- Footer contains legal pages, contact, and key links

### 5. Text quality

Read every page in full. Check:

- **Spelling and grammar**: real errors only. Mark uncertain cases as questions.
- **Consistency of terms**: build a term list (for example "Anmelden" vs. "Login" vs. "Einloggen"; "IT-Partner" vs. "Dienstleister"). Each concept should have one name.
- **Address form**: du or Sie, consistently across pages, buttons, emails, and error messages.
- **Gender-inclusive language**: one consistent style, or none.
- **Readability**: short sentences, active voice, verbs instead of noun chains. Flag sentences over ~25 words and stacked nouns ("Durchführung der Einordnung" → "Sie ordnen ein").
- **Jargon**: technical terms the audience may not know, especially for non-technical decision-makers.
- **Placeholders and leftovers**: Lorem ipsum, "TODO", test data, English UI strings on a German site.
- **Numbers, dates, units**: one format per language.

See [german-text-checklist.md](references/german-text-checklist.md) for German typography, common errors, and style conventions.

---

## Output Format

Report defects with the **audit-report** template and the ID prefix `UX-`. Report improvement ideas separately as suggestions.

Each finding includes:

- The page and the exact text or element (quote it)
- Which target group is affected and how
- The observation, not an opinion ("The page uses three terms for the same action")
- A concrete fix, with the suggested wording where it applies

Add the term list as an appendix: term variants found, where, and the recommended form.

Keep the line between defect and taste clear. A typo, a contradiction, or a dead end is a defect. A headline that could be stronger is a suggestion.

---

## Task-Specific Questions

1. Who are the target groups, and which tasks matter most for each?
2. Du or Sie? Is there a style guide or term list?
3. Is gender-inclusive language used, and in which form?
4. Are there known complaints or support questions about the site?

---

## Related Skills

- **site-qa**: Ground rules and functional checks
- **copy-editing**: For editing existing copy in depth
- **copywriting**: For rewriting pages
- **cro**: For conversion-focused improvements
- **web-accessibility**: For plain language and consistent help as WCAG criteria
- **audit-report**: For writing up findings
