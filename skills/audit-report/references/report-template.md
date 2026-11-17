# Report Template

Skeletons for the report, the CSV, and the cover note. The German version is first because German-language audits use it most in this setup; the English headings follow.

## Contents

- German report skeleton
- English headings
- CSV header and example row
- Cover note example (German)

## German report skeleton

```markdown
# Prüfbericht: example.de

Stand: 17.11.2026 · Prüfer: [Name] · Methode: passive Prüfung von außen

## Zusammenfassung

1. [Wichtigster Punkt in einem Satz]
2. [Zweitwichtigster Punkt]
3. [Drittwichtigster Punkt]

Befunde: 1 kritisch, 4 hoch, 9 mittel, 6 niedrig. Dazu 8 Verbesserungsvorschläge.

## Umfang und Vorgehen

- Seiten: …
- Viewports: 360, 768, 1280, 1920 px
- Browser: Chromium 131 (Playwright, headless), Linux
- Zeitraum: 17.11.2026, 10:00–14:00 Uhr
- Grenzen: nur lesend, höchstens 1 Request/s, keine Formulare abgeschickt

## Befunde

### Kritisch
### Hoch
### Mittel
### Niedrig

## Sicherheitsrelevante Befunde (vertraulich)

## Verbesserungsvorschläge

## Was gut gelöst ist

## Nicht geprüft und warum

| Bereich | Grund |
|---|---|

## Anhang
```

German field labels for each finding: **Bereich**, **Schweregrad**, **URL**, **Sicherheit** (beobachtet / abgeleitet), **Viewport / Browser**, **Beschreibung**, **Schritte zum Nachstellen**, **Erwartet**, **Tatsächlich**, **Lösungsvorschlag**, **Beleg**.

## English headings

Summary · Scope and method · Findings (Critical, High, Medium, Low) · Security findings (confidential) · Improvements · What works well · Not tested and why · Appendix

## CSV header and example row

```csv
ID,Titel,Bereich,Schweregrad,URL,Beschreibung,Schritte,Erwartet,Tatsächlich,Lösungsvorschlag,Beleg,Sicherheit
A11Y-03,"Menü-Button per Tastatur nicht erreichbar",Barrierefreiheit,Hoch,https://example.de/,"Der Menü-Button ist ein div ohne Rolle.","1. Seite bei 360 px öffnen
2. Mit Tab durch die Seite gehen","Fokus erreicht den Button","Fokus überspringt den Button","<button> mit aria-expanded verwenden",screenshots/A11Y-03_menu_360.png,beobachtet
```

## Cover note example (German)

```markdown
Betreff: Prüfbericht secure-example.de

Hallo [Vorname],

danke für die gute Zusammenarbeit an der Website. Ich habe die Seite am 17.11. von außen geprüft. Ich habe nur gelesen und nichts abgeschickt.

Die drei wichtigsten Punkte:
- …
- …
- …

Im Anhang findest du den Bericht (bericht.md), alle Befunde als CSV für den Import ins Ticketsystem und die Screenshots. Jeder Befund hat eine ID, Schritte zum Nachstellen und einen Lösungsvorschlag.

Die sicherheitsrelevanten Punkte schicke ich dir separat.

Wenn etwas unklar ist, melde dich gern.

Viele Grüße
[Name]
```

Match the address form (du/Sie) to how the sender normally writes to the recipient. Ask if unsure.
