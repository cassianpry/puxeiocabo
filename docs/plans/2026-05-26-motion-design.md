# Motion Design: Puxei o Cabo

**North Star:** O Ringue (The Ring) — punchy, impactful motion like a fighting game hit.

**Color palette:** Blue-shifted dark neutrals (hue 250) + `match-light` spotlight + `signal-blue` focus rings. See DESIGN.md for full reference.

## Approach: CSS + lightweight JS hook

Zero dependencies. One CSS animation file + one React hook for page transitions.

## Motion Patterns

### 1. Button Hit-Flash (CSS only, no JS)

- **Trigger:** `:active` on primary buttons (`data-variant="default"`)
- **Effect:** White `::after` pseudo-element overlay (oklch(1 0 0) at 40% opacity)
- **Timing:** 80ms flash in, 120ms fade out — total 200ms
- **Fallback:** `prefers-reduced-motion` → skip flash, use `:active` scale(0.97)
- **Scope:** All `Button` components with `variant="default"`

### 2. Page Transitions (`usePageTransition` hook)

- **Trigger:** Route component mount (TanStack Router)
- **Effect:** Fade in (0 → 1) + slide up (8px → 0)
- **Timing:** 200ms in (ease-out), 100ms out (fade only)
- **Implementation:** Hook returns `isEntering` state, applies CSS class `page-enter` on mount, removes after 200ms
- **Scope:** All route pages via `__root.tsx` wrapping `<Outlet />`

### 3. Card Grid Stagger (CSS only)

- **Trigger:** ReportCards on homepage mount
- **Effect:** Fade in (0 → 1) + slide up (12px → 0)
- **Timing:** 200ms per card, staggered by 60ms per card (`animation-delay` via inline style)
- **Implementation:** Each `ReportCard` gets `style={{ animationDelay: \`${index * 60}ms\` }}` + CSS `@keyframes cardEnter`
- **Scope:** Homepage report grid

### 4. Evidence Lightbox (CSS override on shadcn Dialog)

- **Open:** Scale(0.93 → 1) + fade, 200ms ease-out
- **Close:** Scale(1 → 0.95) + fade, 100ms
- **Overlay:** Fade to `bg-black/80`, 150ms
- **Implementation:** CSS targeting `[data-state="open"]` / `[data-state="closed"]` on DialogContent
- **Scope:** ReportCard lightbox

### 5. Card Hover Glow (CSS only)

- **Trigger:** `:hover` on ReportCard and FighterCard
- **Effect:** `box-shadow: 0 0 0 1px oklch(0.922 0 0 / 0.1)` border glow
- **Timing:** 150ms transition
- **Scope:** All interactive cards

## Files to create/modify

### New files
- `src/styles/animations.css` — all `@keyframes` + button hit-flash
- `src/hooks/usePageTransition.ts` — page entrance hook

### Modified files
- `src/styles/globals.css` — import animations.css
- `src/routes/__root.tsx` — wrap `<Outlet />` with page transition
- `src/components/app/ReportCard.tsx` — add stagger delay, hover glow
- `src/components/app/FighterCard.tsx` — add hover glow
- `src/routes/index.tsx` — pass index to ReportCards for stagger

## Accessibility

- `prefers-reduced-motion` respected on all animations
- Button hit-flash degrades to scale(0.97) when reduced motion is preferred
- Card stagger and page transitions skip entirely
- No motion conveys information — purely decorative
