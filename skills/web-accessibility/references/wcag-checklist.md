# WCAG 2.2 AA Checklist with Test Methods

All level A and AA success criteria of WCAG 2.2, with a practical test for a passive review of a live site. "Auto" means axe-core or a similar tool catches common failures; "Manual" means a person or scripted inspection must check it.

## Contents

- 1 Perceivable
- 2 Operable
- 3 Understandable
- 4 Robust
- Testing notes

## 1 Perceivable

| SC | Name | Level | Test | Method |
|----|------|-------|------|--------|
| 1.1.1 | Non-text Content | A | `alt` present and meaningful; decorative images `alt=""`; icon buttons named | Auto + Manual |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | Transcript or alternative exists | Manual |
| 1.2.2 | Captions (Prerecorded) | A | Videos with speech have captions | Manual |
| 1.2.3 | Audio Description or Media Alternative | A | Visual-only information in video is described | Manual |
| 1.2.4 | Captions (Live) | AA | Live streams captioned | Manual |
| 1.2.5 | Audio Description (Prerecorded) | AA | Audio description track available | Manual |
| 1.3.1 | Info and Relationships | A | Headings, lists, tables, labels in markup | Auto + Manual |
| 1.3.2 | Meaningful Sequence | A | DOM order matches visual order | Manual |
| 1.3.3 | Sensory Characteristics | A | Instructions don't rely on shape, position, or sound only | Manual |
| 1.3.4 | Orientation | AA | Works in portrait and landscape | Manual |
| 1.3.5 | Identify Input Purpose | AA | `autocomplete` on personal data fields | Auto + Manual |
| 1.4.1 | Use of Color | A | Links in text distinguishable without color; errors not color-only | Manual |
| 1.4.2 | Audio Control | A | Autoplaying audio can be stopped | Manual |
| 1.4.3 | Contrast (Minimum) | AA | 4.5:1 text, 3:1 large text | Auto + Manual (text on images, gradients) |
| 1.4.4 | Resize Text | AA | 200 % zoom without loss | Manual |
| 1.4.5 | Images of Text | AA | No text as images except logos | Manual |
| 1.4.10 | Reflow | AA | 320 CSS px, no horizontal scroll | Manual (viewport 320) |
| 1.4.11 | Non-text Contrast | AA | 3:1 for UI component borders, icons, focus | Manual |
| 1.4.12 | Text Spacing | AA | Inject spacing CSS; nothing clipped | Manual (scripted) |
| 1.4.13 | Content on Hover or Focus | AA | Tooltips dismissible, hoverable, persistent | Manual |

## 2 Operable

| SC | Name | Level | Test | Method |
|----|------|-------|------|--------|
| 2.1.1 | Keyboard | A | All functions by keyboard | Manual |
| 2.1.2 | No Keyboard Trap | A | Focus can always move on | Manual |
| 2.1.4 | Character Key Shortcuts | A | Single-key shortcuts can be turned off or remapped | Manual |
| 2.2.1 | Timing Adjustable | A | Time limits can be extended | Manual |
| 2.2.2 | Pause, Stop, Hide | A | Carousels and animations > 5 s can be paused | Manual |
| 2.3.1 | Three Flashes or Below Threshold | A | No flashing content | Manual |
| 2.4.1 | Bypass Blocks | A | Skip link or landmarks | Auto + Manual |
| 2.4.2 | Page Titled | A | Unique, descriptive `<title>` per page; SPA route changes update it | Auto + Manual |
| 2.4.3 | Focus Order | A | Logical order; modals receive focus | Manual |
| 2.4.4 | Link Purpose (In Context) | A | "Mehr" links have context | Manual |
| 2.4.5 | Multiple Ways | AA | Navigation plus search or sitemap | Manual |
| 2.4.6 | Headings and Labels | AA | Descriptive headings and labels | Manual |
| 2.4.7 | Focus Visible | AA | Visible focus indicator everywhere | Manual |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | Focused element not fully hidden by sticky content | Manual |
| 2.5.1 | Pointer Gestures | A | Multipoint or path gestures have single-pointer alternative | Manual |
| 2.5.2 | Pointer Cancellation | A | Action on up-event, not down-event | Manual |
| 2.5.3 | Label in Name | A | Accessible name contains visible label text | Auto + Manual |
| 2.5.4 | Motion Actuation | A | Shake or tilt has alternative | Manual |
| 2.5.7 | Dragging Movements | AA | Drag has single-pointer alternative | Manual |
| 2.5.8 | Target Size (Minimum) | AA | 24 × 24 CSS px or spacing exception | Manual (scripted measurement) |

## 3 Understandable

| SC | Name | Level | Test | Method |
|----|------|-------|------|--------|
| 3.1.1 | Language of Page | A | `<html lang>` correct | Auto |
| 3.1.2 | Language of Parts | AA | Foreign passages marked | Manual |
| 3.2.1 | On Focus | A | No context change on focus | Manual |
| 3.2.2 | On Input | A | No unexpected context change on input | Manual |
| 3.2.3 | Consistent Navigation | AA | Same navigation order across pages | Manual |
| 3.2.4 | Consistent Identification | AA | Same function, same name | Manual |
| 3.2.6 | Consistent Help | A | Help mechanisms in the same relative place | Manual |
| 3.3.1 | Error Identification | A | Errors described in text | Manual (blur, don't submit) |
| 3.3.2 | Labels or Instructions | A | Labels and format hints present | Auto + Manual |
| 3.3.3 | Error Suggestion | AA | Error text suggests the fix | Manual |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Review, confirm, or undo before binding actions | Manual (only up to the submit step) |
| 3.3.7 | Redundant Entry | A | No re-entry within a process | Manual |
| 3.3.8 | Accessible Authentication (Minimum) | AA | Paste allowed; no cognitive test without alternative | Manual (without logging in) |

## 4 Robust

| SC | Name | Level | Test | Method |
|----|------|-------|------|--------|
| 4.1.2 | Name, Role, Value | A | Custom widgets expose role, name, state | Auto + Manual |
| 4.1.3 | Status Messages | AA | Status updates announced via live regions | Manual |

4.1.1 Parsing is obsolete in WCAG 2.2 and always satisfied.

## Testing notes

**Contrast measurement.** Read computed `color` and the effective background (walk up the tree; note images and gradients). Compute the ratio with the WCAG relative-luminance formula. For text over images, sample the darkest and lightest background behind the text in a screenshot.

**Text spacing bookmarklet CSS:**

```css
* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
p { margin-bottom: 2em !important; }
```

**Target size measurement.** For each `a, button, input, [role=button]`, read `getBoundingClientRect()`. Flag targets under 24 × 24 px unless a 24 px circle around them doesn't overlap another target, or they sit inline in text.

**Screen reader approximation.** Without NVDA or VoiceOver, use the accessibility tree and state the limitation in the report. Real screen readers differ in what they announce for live regions and custom widgets.
