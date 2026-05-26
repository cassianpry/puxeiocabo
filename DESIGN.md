---
name: Puxei o Cabo
description: Community rage-quit reporting for Street Fighter 6
colors:
  deep-canvas: "oklch(0.10 0.02 260)"
  dark-ash: "oklch(0.16 0.03 260)"
  muted-stone: "oklch(0.22 0.04 260)"
  iron-border: "oklch(0.35 0.08 260)"
  arcade-blue: "oklch(0.60 0.22 235)"
  arcade-yellow: "oklch(0.78 0.2 85)"
  arcade-pink: "oklch(0.58 0.24 350)"
  dusk-text: "oklch(0.65 0.03 260)"
  snow-text: "oklch(0.96 0.01 260)"
  success-green: "oklch(0.65 0.2 145)"
  warning-amber: "oklch(0.7 0.2 65)"
typography:
  heading:
    fontFamily: "Archivo Black, sans-serif"
    textTransform: "uppercase"
    letterSpacing: "0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.arcade-blue}"
    textColor: "{colors.deep-canvas}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    hoverGlow: "0 0 16px {colors.arcade-blue} @ 0.5"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.arcade-blue}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    border: "1px solid {colors.arcade-blue}"
  card-default:
    backgroundColor: "{colors.dark-ash}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
    borderTop: "2px solid {colors.arcade-blue}"
    hoverGlow: "0 4px 20px oklch(0.60 0.22 235 / 0.15)"
  input-default:
    backgroundColor: "{colors.deep-canvas}"
    textColor: "{colors.snow-text}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.iron-border}"
    focusRing: "0 0 0 3px oklch(0.60 0.22 235 / 0.5)"
  badge-pending:
    backgroundColor: "{colors.arcade-yellow}"
    textColor: "{colors.deep-canvas}"
  badge-approved:
    backgroundColor: "{colors.success-green}"
    textColor: "white"
  badge-rejected:
    backgroundColor: "{colors.arcade-pink}"
    textColor: "white"
---

# Design System: Puxei o Cabo

## 1. Overview

**Creative North Star: "Arcade Cabinet"**

The interface is a Brazilian arcade at night. Dark blue-black backdrop, neon glows, colors that pop against the darkness. Like walking past a row of arcade cabinets — each screen is a portal to a different fight. The player's evidence is front and center, highlighted by electric blue and yellow accents that say "this matters."

Built for the Brazilian Street Fighter 6 community. Players who just finished a ranked match where the opponent disconnected, frustrated but looking for a constructive outlet. The design serves that moment: fast, familiar, energetic. No corporate polish, no sterile SaaS — this is a community tool with the soul of an arcade.

**Key Characteristics:**
- Deep blue-black canvas (oklch(0.10 0.02 260)) — darker and cooler than before
- Electric blue (arcade-blue) as primary action color with neon glow on hover
- Arcade-yellow for badges and secondary highlights
- Arcade-pink for destructive actions (replaces standard red)
- Archivo Black for headings — bold, uppercase, impactful
- System fonts for body readability
- 2px arcade-blue top border on cards for neon shelf effect
- Glass-free, shadow-free at rest — glow only appears on interaction
- pt-BR language throughout

## 2. Colors

### Base escura (fundo de cabinet)

| Token | Value | Usage |
|---|---|---|
| `deep-canvas` | `oklch(0.10 0.02 260)` | Page background |
| `dark-ash` | `oklch(0.16 0.03 260)` | Cards, surfaces |
| `muted-stone` | `oklch(0.22 0.04 260)` | Popover, elevated |
| `iron-border` | `oklch(0.35 0.08 260)` | Dividers, borders |

### Cores que estouram (SF6-inspired)

| Token | Value | Usage |
|---|---|---|
| `arcade-blue` | `oklch(0.60 0.22 235)` | Primary buttons, links, focus rings |
| `arcade-yellow` | `oklch(0.78 0.2 85)` | Pending badges, highlights |
| `arcade-pink` | `oklch(0.58 0.24 350)` | Destructive actions, rejected |

### Texto

| Token | Value | Usage |
|---|---|---|
| `snow-text` | `oklch(0.96 0.01 260)` | Primary text |
| `dusk-text` | `oklch(0.65 0.03 260)` | Secondary text |

### Semânticas

| Token | Value | Usage |
|---|---|---|
| `success-green` | `oklch(0.65 0.2 145)` | Approved status |
| `warning-amber` | `oklch(0.7 0.2 65)` | Warning states |

## 3. Typography

**Headings:** `Archivo Black` (Google Font), uppercase, `letter-spacing: 0.02em`. Used for h1-h4, section titles, card titles — anywhere that needs impact.

**Body:** System font stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`. No custom fonts for body text. Readability comes from weight and scale.

By default:
- Body: 0.875rem / 400 weight / 1.5 line-height
- Labels: 0.875rem / 500 weight / 1 line-height
- Headings: Archivo Black, uppercase

## 4. Components

### Buttons
- **Primary**: `arcade-blue` background, `deep-canvas` text. On hover: `0 0 16px oklch(0.60 0.22 235 / 0.5)` glow.
- **Outline**: 1px `arcade-blue` border, transparent background. On hover: filled at 10% opacity.
- **Destructive**: `arcade-pink` background, white text. On hover: pink glow.
- **Ghost**: `arcade-blue` text. On hover: 10% blue background.
- **Link**: `arcade-blue` underline-offset-4.

### Cards
- `dark-ash` background, `iron-border` border, 2px `arcade-blue` top border (the neon shelf).
- On hover: `translateY(-2px)` + `0 4px 20px oklch(0.60 0.22 235 / 0.15)` glow.
- Transition: 150ms ease-out.

### Badges
- **Pending**: `arcade-yellow` background, `deep-canvas` text.
- **Approved**: `success-green` background, white text.
- **Rejected**: `arcade-pink` background, white text.
- **Deleted**: Outline style, iron-border.

### Header
- `deep-canvas` background, 2px `arcade-blue` bottom border.
- Nav links: `dusk-text` default, `arcade-blue` on hover with underline offset.

### Inputs
- `deep-canvas` background, `iron-border` border.
- On focus: `0 0 0 3px oklch(0.60 0.22 235 / 0.5)`.

### Focus rings
- 3px `arcade-blue` at 50% opacity on all interactive elements.

## 5. Motion

- **Hit-flash**: `arcade-blue` overlay on button active (80ms in, 120ms out).
- **Neon pulse**: `@keyframes neon-glow` for status indicators (2s infinite, 0.6→1 opacity).
- **Page transitions**: 200ms fade + slide-up (8px) on route enter, 100ms fade on exit.
- **Card stagger**: 60ms delay per card on homepage grid.
- **Hover glow**: `arcade-blue` shadow on interactive elements.

## 6. Elevation

Three-step tonal depth (no shadows at rest):
1. `deep-canvas` — base layer (page background)
2. `dark-ash` — cards, dropdowns, modals
3. `muted-stone` — hover states, popover backgrounds

Elevation is communicated through lightness, never `box-shadow` at rest. Glow (`box-shadow`) appears only on hover/focus as feedback, not elevation.

## 7. Rules

1. **Neon Shelf Rule**: The 2px arcade-blue top border on cards is the primary visual signature. Apply to all cards consistently.
2. **Single Glow Rule**: Only one element per viewport should have active glow at a time. Glow is for the element being interacted with.
3. **The Signal Rule**: arcade-blue is reserved for interactive states (buttons, links, focus rings). Never use it as a surface background or decorative element.
4. **Archivo Black Only**: The heading font is for titles only. Never use it for body text, captions, or labels.
5. **Flat Surface Rule**: No box-shadow at rest. Glow is feedback, not elevation.
6. **One Family Rule**: Body text uses system fonts only. No pairing, no variable fonts.

## 8. Do's and Don'ts

**Do:**
- Do use the Neon Shelf (2px arcade-blue top border) on all cards
- Do use arcade-blue for primary actions, links, and focus indicators
- Do use arcade-yellow for pending/warning states
- Do use arcade-pink for destructive/rejected states
- Do use Archivo Black for headings — uppercase for impact
- Do write in pt-BR with the warmth and directness of the Brazilian fighting game community
- Do use `hover:shadow-[0_4px_20px_oklch(0.60_0.22_235_/_0.15)]` for card hover glow
- Do use `hover:shadow-[0_0_16px_oklch(0.60_0.22_235_/_0.5)]` for button hover glow
- Do keep 150ms transitions on interactive elements

**Don't:**
- Don't use arcade-blue as a surface or decorative background
- Don't use box-shadow at rest — glow is for interaction only
- Don't use gradient text or glassmorphism
- Don't use modals as a first thought — exhaust inline and progressive disclosure first
- Don't use em dashes — substitute commas, colons, or periods
- Don't animate CSS layout properties — only opacity, transform, color
- Don't use Archivo Black for body text
