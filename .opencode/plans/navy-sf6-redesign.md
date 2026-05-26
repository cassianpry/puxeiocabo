# Navy & Black SF6-Inspired Redesign

## Summary

Full visual redesign of Puxei o Cabo — all routes (homepage, auth, dashboard, admin, fighters, reports, profile). Shift from standard shadcn/zinc-gray to a deep navy blue + black palette inspired by Street Fighter 6's cool-toned UI. Modern, clear, tournament-grade tool feel.

---

## Design Direction

- **Register:** product
- **Color strategy:** Committed — deep navy blue carries ~30% of surfaces (nav, headers, primary buttons, active states), supported by tinted neutrals
- **Primary accent:** Deep navy blue (hue ~260), not purple, not pink
- **Theme:** Dark-only (forced via `main.tsx`)
- **Scene:** *"A Brazilian SF6 player, still buzzing from a ranked match, opens the site to quickly report a rage-quitter — the deep navy interface feels solid and legit, blue accents glow with quiet confidence, the dark background lets their proof image own the screen."*
- **Anchors:** SF6 Battle Hub, Linear dark mode, SF6 Metro City night streets

---

## Palette (OKLCH)

| Token | Current | New |
|---|---|---|
| `--background` | `oklch(0.141 0.005 285.823)` (neutral dark) | `oklch(0.12 0.015 265)` (navy-black) |
| `--foreground` | `oklch(0.985 0 0)` | keep |
| `--card` | `oklch(0.205 0 0)` (neutral dark gray) | `oklch(0.18 0.025 265)` (navy card) |
| `--card-foreground` | `oklch(0.985 0 0)` | keep |
| `--popover` | `oklch(0.205 0 0)` | `oklch(0.18 0.025 265)` |
| `--popover-foreground` | `oklch(0.985 0 0)` | keep |
| `--primary` | `oklch(0.922 0 0)` (light gray) | `oklch(0.55 0.18 265)` (navy blue) |
| `--primary-foreground` | `oklch(0.205 0 0)` (dark text) | `oklch(0.985 0 0)` (white) |
| `--secondary` | `oklch(0.269 0 0)` | `oklch(0.25 0.025 265)` |
| `--secondary-foreground` | `oklch(0.985 0 0)` | keep |
| `--muted` | `oklch(0.269 0 0)` | `oklch(0.22 0.02 265)` |
| `--muted-foreground` | `oklch(0.708 0 0)` | `oklch(0.6 0.02 265)` |
| `--accent` | `oklch(0.269 0 0)` | `oklch(0.35 0.08 265)` (lighter blue) |
| `--accent-foreground` | `oklch(0.985 0 0)` | keep |
| `--destructive` | `oklch(0.577 0.245 27.325)` | keep |
| `--destructive-foreground` | `oklch(0.985 0 0)` | keep |
| `--success` | `oklch(0.723 0.219 149.579)` | keep |
| `--success-foreground` | `oklch(0.985 0 0)` | keep |
| `--border` | `oklch(0.371 0 0)` | `oklch(0.3 0.03 265)` |
| `--input` | `oklch(0.371 0 0)` | `oklch(0.3 0.03 265)` |
| `--ring` | `oklch(0.871 0 0)` | `oklch(0.55 0.18 265)` |

## Implementation

### Step 1: globals.css
Update all CSS variable values in `frontend/src/styles/globals.css` to the new navy palette.

### Step 2: Adjust custom components
Tune any component with hardcoded Tailwind color classes (e.g. `StatusBadge`, `AppHeader`, `FighterCard`).

### Step 3: Polish
Verify hover/focus states, contrast, readability. Check that shadcn components auto-adapt through CSS variable cascade.

## Files to edit

- `frontend/src/styles/globals.css` — color token swap
- `frontend/src/components/app/StatusBadge.tsx` — verify status colors
- `frontend/src/components/app/FighterCard.tsx` — verify card styling
- `frontend/src/components/app/ReportCard.tsx` — verify card styling
- `frontend/src/components/layout/AppHeader.tsx` — verify header styling

---

Confirmed by user: 2026-05-26
