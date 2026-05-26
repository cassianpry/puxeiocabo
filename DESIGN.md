---
name: Puxei o Cabo
description: Community rage-quit reporting for Street Fighter 6
colors:
  deep-canvas: "oklch(0.14 0.015 250)"
  dark-ash: "oklch(0.20 0.01 250)"
  muted-stone: "oklch(0.27 0.008 250)"
  iron-border: "oklch(0.37 0.006 250)"
  match-light: "oklch(0.92 0.01 250)"
  dusk-text: "oklch(0.71 0.01 250)"
  snow-text: "oklch(0.98 0.005 250)"
  signal-blue: "oklch(0.55 0.2 250)"
  flag-red: "oklch(0.577 0.245 27.325)"
  clear-green: "oklch(0.723 0.219 149.579)"
typography:
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
    backgroundColor: "{colors.match-light}"
    textColor: "{colors.deep-canvas}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.snow-text}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    border: "1px solid {colors.iron-border}"
  card-default:
    backgroundColor: "{colors.dark-ash}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  input-default:
    backgroundColor: "{colors.deep-canvas}"
    textColor: "{colors.snow-text}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.iron-border}"
---

# Design System: Puxei o Cabo

## 1. Overview

**Creative North Star: "O Ringue (The Ring)"**

The interface is the arena. Deep blue-black backdrop, bright central action, no distractions around the edges. Like a fighting game tournament stage under a cool arena light: the player's evidence is the only thing that matters, and everything else exists to support it without competing.

This system is built for the Brazilian Street Fighter 6 community — players who just finished a ranked match where the opponent disconnected, frustrated but looking for a constructive outlet. The design serves that moment: fast to enter, clear to read, honest about what it is. No corporate polish, no gamer theatrics. Just a well-lit table where proof is examined and calls are made.

The system explicitly rejects generic dark SaaS aesthetics, neon/cyberpunk gaming tropes, and false authority badges. It is not a business tool, not a social media feed, and not a gamer dashboard with RGB gradients.

**Key Characteristics:**
- Blue-black canvas with tonal depth through contrast, not shadows
- Single near-white spotlight accent against cool blue-toned neutrals
- Desaturated signal blue for interactive states and focus indicators
- System fonts throughout — one family, no pairing
- Evidence-first layouts: images centered, chrome receded
- Tactile responsiveness on every interactive element
- pt-BR language throughout — the interface speaks to the community in its own voice

## 2. Colors

A restrained palette anchored on deep blue-black tones, with a single near-white accent for primary actions and a desaturated blue for interactive states. The effect is of a dimly lit arena with cool overhead lights — atmospheric without being thematic, blue without being "gaming blue."

### Primary
- **Match Light** (`oklch(0.92 0.01 250)`): The spotlight accent. Used for primary buttons and foreground emphasis. Its near-white value against `deep-canvas` creates the ring-spotlight effect. The subtle blue tint keeps it cohesive with the overall temperature.

### Accent
- **Signal Blue** (`oklch(0.55 0.2 250)`): Interactive states only — focus rings, `:focus-visible` indicators, selection highlights. Not used as a surface color or decorative element. Its chroma is high enough to register as blue but constrained enough to avoid "gamer RGB" territory.

### Neutral
- **Deep Canvas** (`oklch(0.14 0.015 250)`): Page background. The arena floor. Dark blue-black, barely perceptible as blue — like a stage under cool lighting.
- **Dark Ash** (`oklch(0.20 0.01 250)`): Card, popover, and sheet backgrounds. One tonal step up from the canvas. Defines surface hierarchy without shadows.
- **Muted Stone** (`oklch(0.27 0.008 250)`): Secondary surfaces, hover fills, and muted element backgrounds. The mid-tone of the system.
- **Iron Border** (`oklch(0.37 0.006 250)`): Borders, dividers, separators. Dark enough to stay subtle, light enough to define edges.
- **Snow Text** (`oklch(0.98 0.005 250)`): High-emphasis text and headings. Very subtle blue tint.
- **Dusk Text** (`oklch(0.71 0.01 250)`): Muted/secondary text, placeholders, labels.

### Semantic
- **Flag Red** (`oklch(0.577 0.245 27.325)`): Destructive actions, errors, rejected status, AI suspicion alerts.
- **Clear Green** (`oklch(0.723 0.219 149.579)`): Success states, approved status, confirmations.

### Named Rules

**The Single Spotlight Rule.** The `match-light` accent occupies at most 10% of any given screen. Its rarity is what makes it read as the focus. Applying it to backgrounds, decorative elements, or more than one competing element per viewport dilutes the whole system.

**The Tonal Depth Rule.** Hierarchy is communicated through lightness steps, not shadows. `deep-canvas` → `dark-ash` → `muted-stone` form a three-step elevation ladder. No surface at rest carries a box-shadow. This rule keeps the ring feeling flat, honest, and grounded.

**The Signal Rule.** `signal-blue` is reserved for focus and interaction feedback only — never as a surface color or page accent. It signals that an element is interactive, not decorative.

## 3. Typography

**Body Font:** System UI stack (`-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif`)

**Character:** One family, no pairing. The system font stack gives every platform its native feel — macOS gets SF Pro, Windows gets Segoe UI, Linux gets system-ui. No custom fonts to load, no rendering surprises. The type disappears into the task, exactly as product UI should.

### Hierarchy

- **Headline** (700, 1.5rem / 24px, 1.2): Page titles (`<h1>`). Used once per view.
- **Subheadline** (600, 1.25rem / 20px, 1.3): Section headings (`<h2>`).
- **Title** (600, 1rem / 16px, 1.4): Card titles, component headings.
- **Body** (400, 0.875rem / 14px, 1.5): Paragraph text, descriptions. The default size.
- **Small** (400, 0.75rem / 12px, 1.5): Metadata, dates, captions, footer content.
- **Label** (500, 0.875rem / 14px, 1): Form labels, table headers. Medium weight distinguishes them from body copy.
- **Mono** (400, 0.75rem / 12px, 1.4): EXIF data values, short IDs, code-adjacent content. Uses the system's monospace fallback within the UI stack.

Body line length capped at 65–75ch for prose sections. Data tables and compact UI may run denser — tables at 120ch+ are acceptable.

### Named Rules

**The One Family Rule.** No display fonts, no serif/sans pairings, no variable font axes to animate. Every piece of text uses the same system stack. Differentiation comes from weight (400/500/600/700) and scale, not family changes.

## 4. Elevation

**Flat by default.** The system has no shadow vocabulary. Depth is communicated entirely through tonal contrast between the three surface levels: `deep-canvas` (base), `dark-ash` (card/popover), `muted-stone` (hover/highlight). This is a deliberate rejection of the common dark-SaaS pattern of floating cards with heavy shadows.

Interactive elements (buttons, inputs) show a `signal-blue` focus ring (`ring-[3px] ring-signal/50`) on `:focus-visible`, but no surface at rest carries a `box-shadow`. The flatness reinforces honesty — nothing is floating, nothing is ambiguous. What you see is what's there.

### Named Rules

**The Flat Surface Rule.** A surface at rest has no shadow. Elevation cues exist only through tonal layer shifts. If a card needs to feel "higher," move it one lightness step: card to popover (`dark-ash` to `muted-stone` border). Do not add a shadow.

## 5. Components

### Buttons

- **Shape:** Gently curved corners (6px / `rounded-md`)
- **Primary:** `match-light` background on `deep-canvas` foreground text. Light button on dark background — the spotlight on a dark stage.
- **Hover / Focus:** Reduced opacity on hover (primary: `90%`), subtle `signal-blue` focus ring (3px, `signal` at 50% opacity) on `:focus-visible`. 150ms transition.
- **Outline:** Transparent background, `snow-text` text, `iron-border` stroke. Darkens on hover with `muted-stone` fill.
- **Secondary:** `muted-stone` background fills to `80%` on hover.
- **Ghost:** Transparent, fills to `muted-stone` on hover.
- **Loading:** All buttons show disabled state (`opacity-50`, `pointer-events-none`) while loading; text swaps to progress label ("Entrando...", "Salvando...").

### Cards

- **Shape:** Subtly curved corners (8px / `rounded-lg`)
- **Background:** `dark-ash` — one tonal step above the canvas
- **Shadow Strategy:** None at rest. See The Flat Surface Rule.
- **Border:** 1px `iron-border` (via `border-border` inheritance)
- **Internal Padding:** `1.5rem` (CardContent), `1rem` top/bottom (CardHeader/CardFooter with `pb-3`)
- **Usage:** Report cards on the homepage use an image-first layout with hover-reveal overlay (eye icon, 300ms scale transition on image). Admin stat cards use a compact header with icon-right and large value.

### Inputs / Fields

- **Style:** `deep-canvas` background, `iron-border` stroke, 6px radius (`rounded-md`)
- **Focus:** `signal-blue` focus ring (3px, `signal/50`)
- **Textarea:** Same treatment, 4-row default height
- **File Upload (ImageUpload):** Dashed border drop zone, `muted-foreground/30` default, shifts to `match-light` on drag-over with `5%` fill tint. Hidden native input triggered via ref click.
- **Error:** `flag-red` border via `aria-invalid` → `border-destructive`

### Navigation (AuthNav / AppHeader)

- **Style:** Top bar, `dark-ash` background (`bg-card`), `iron-border` bottom border
- **Typography:** Body size (14px), `dusk-text` default, `snow-text` on hover
- **Layout:** `max-w-7xl` centered, logo left (bold headline weight), nav links right
- **States:** No active indicators — current page context comes from the page title, not a highlighted nav item
- **Mobile:** Responsive via shadcn Sheet component for authenticated nav

### Chips / Badges (StatusBadge)

- **Pending:** `muted-stone` background (`secondary` variant) — neutral, awaiting action
- **Approved:** `clear-green` tint (shadcn default `variant`) — confirmed
- **Rejected:** `flag-red` tint (shadcn `destructive` variant) — denied
- **Deleted:** Border only (shadcn `outline` variant) — archival state

### Dialogs

- **Lightbox (ReportCard):** Max width `80rem` (`max-w-7xl!`), dark overlay (`bg-black/80`), image centered with `max-h-[80vh] object-contain`
- **Modal (LinkFighter, EditReport):** Standard shadcn Dialog, `sm:max-w-md` for small forms, `sm:max-w-3xl` for edit forms with image preview
- **All dialogs:** Trapped focus, dismiss on backdrop click or Escape, optional `onInteractOutside` prevent for mandatory flows

### Alerts / EXIFIndicator

- **Destructive alert** with `alert-circle` icon for AI suspicion warnings
- **Standard alert** for errors (login, form validation)
- **Empty state:** Centered muted text, no illustration

### Skeleton Loading

- Used for tables, stat cards, and detail views
- shadcn Skeleton with default animation (pulse) over neutral fill
- No spinners in content areas

## 6. Do's and Don'ts

### Do:

- **Do** use the three tonal steps (canvas → ash → stone) for surface hierarchy. It's the only elevation tool you need.
- **Do** lead with the image. Report cards center proof screenshots; lightboxes open them full-width. Evidence is the hero.
- **Do** use `match-light` sparingly. One primary action per view. The spotlight only hits one spot.
- **Do** reserve `signal-blue` for focus rings and interaction states only — never as a surface or accent.
- **Do** write in pt-BR with the warmth and directness of the Brazilian fighting game community. "Playful, sharp, clear" — like a tournament referee who has seen it all (PRODUCT.md).
- **Do** use system fonts everywhere. No `@font-face`, no Google Fonts, no variable fonts. The platform's native typeface is the right one.
- **Do** show skeleton loading for tables, cards, and detail views. Never show a spinner in the middle of content.
- **Do** keep buttons responsive at 150ms transitions. The ring is a fast place.
- **Do** use 65–75ch line length for prose sections. Data tables can run wider.

### Don't:

- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, or alerts. Use full borders, background tints, or nothing — never a stripe.
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis is for weight and size only.
- **Don't** apply glassmorphism (blurs, glass cards) as a default. The interface is flat and honest, not glossy.
- **Don't** use the hero-metric template (big number, small label, supporting stats, gradient accent). This is a community tool, not a SaaS landing page.
- **Don't** create identical card grids with icon + heading + text repeated endlessly. Vary the card types.
- **Don't** use modals as a first thought — exhaust inline and progressive disclosure alternatives first (PRODUCT.md: "Respect the user's time").
- **Don't** use neon, cyberpunk, or RGB-gamer aesthetic — no excessive glow, no forced gaming tropes (PRODUCT.md anti-reference).
- **Don't** add badges, trust seals, or "enterprise" signaling. False authority has no place here (PRODUCT.md anti-reference).
- **Don't** make the design look like a generic dark SaaS admin panel. This is the Brazilian SF6 community's tool, not a corporate dashboard (PRODUCT.md anti-reference).
- **Don't** use `signal-blue` as a surface color or decorative backdrop. It belongs on focus rings and interactive feedback only.
- **Don't** animate CSS layout properties. Use `transition` on opacity, transform, and color only. Ease with exponential curves (`ease-out`).
- **Don't** use em dashes. Substitute commas, colons, semicolons, or periods.
- **Don't** apply color to inactive states. Inactive means muted (`dusk-text` or `muted-stone`).
