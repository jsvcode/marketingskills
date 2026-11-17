# German Text Checklist

Conventions and common errors to check on German-language websites. Use it in the text-quality pass of the ux-review skill.

## Contents

- Typography
- Numbers, dates, currency
- Common spelling and grammar errors
- Style
- Consistency list template

## Typography

| Check | Correct | Common error |
|---|---|---|
| Quotation marks | „Text“ (low-high) or »Text« | "Text" (straight), “Text” (English style) |
| Apostrophe | ’ (typographic) | ' or ´ |
| Dash for ranges and asides | Gedankenstrich – with spaces; bis-Strich 9–17 Uhr without spaces | Hyphen - used as dash |
| Ellipsis | … (one character) | ... |
| Non-breaking space | Between number and unit (10 %, 5 GB, 49 €), in "z. B.", "d. h.", "S. 3" | Unit or abbreviation part wraps to next line |
| Abbreviations | z. B., d. h., u. a. (with space) | z.B., d.h. |
| Hyphenation | `hyphens: auto` with `lang="de"` for long compounds on mobile | Overflowing compounds |

## Numbers, dates, currency

- Thousands separator: point or narrow space (1.000 or 1 000); decimal: comma (2,5)
- Currency: 49 € or 49,00 € (amount first); "EUR 49" is acceptable in tables; choose one
- Prices for consumers include VAT ("inkl. MwSt."); for businesses state "zzgl. MwSt."
- Percent: 10 % with a (non-breaking) space
- Dates: 17.11.2026 or 17. November 2026; one format per site
- Times: 9:00 Uhr or 9 Uhr; ranges 9–17 Uhr

## Common spelling and grammar errors

- Compound nouns: "IT-Sicherheit", "E-Mail", "KMU-Kunden" (hyphen with abbreviations), "Cyberangriff" (closed)
- Anglicisms with hyphen or closed form: "Log-in"/"Login", "Onboarding", "Check-up"; pick one form
- das/dass; seid/seit; wieder/wider
- Capitalization of the polite form: "Sie", "Ihr", "Ihnen" (capitalized); "du", "dein" (lowercase allowed and common on websites)
- Comma before "dass", "weil", "wenn", "um … zu" with extended infinitives
- Adjectives from place names: "Berliner", "deutsche Unternehmen"
- Hyphen in compounds with numbers: "24-Stunden-Support", "3-stufig"

## Style

- **Verbs over nouns**: "Sie prüfen Ihre Sicherheit" instead of "Durchführung einer Sicherheitsüberprüfung"
- **Short sentences**: one statement per sentence; aim for under 20 words
- **Active voice**: "Wir melden uns" instead of "Es wird sich gemeldet"
- **Concrete over abstract**: "in 15 Minuten" instead of "zeitnah"
- **Address form**: Sie for most B2B audiences; du if the brand chose it. Never mixed.
- **Gender-inclusive forms**: one style (Doppelpunkt, Sternchen, Paarform, neutral forms such as "Mitarbeitende") consistently, or none
- **Buttons**: verb first, describes the result ("Kosten ansehen", "Einordnung starten")
- **Error messages**: say what is wrong and how to fix it ("Bitte geben Sie eine E-Mail-Adresse im Format name@firma.de ein")

## Consistency list template

| Concept | Variants found (page) | Recommended |
|---|---|---|
| Log in | Anmelden (Header), Login (Footer), Einloggen (/kosten) | Anmelden |
| IT service provider | IT-Partner, IT-Dienstleister, Systemhaus | IT-Partner |
| Address form | Sie (most pages), du (/partner) | Sie |
