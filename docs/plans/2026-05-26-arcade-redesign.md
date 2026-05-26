# Arcade Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Puxei o Cabo frontend from subtle blue-black to vibrant arcade/SF6-inspired aesthetic with neon glows, arcade-blue primary, arcade-yellow highlights, and Archivo Black headings.

**Architecture:** Pure CSS variable swap + Tailwind utility updates + component-level className changes. Zero new dependencies except Google Fonts link.

**Tech Stack:** Tailwind v4, React 19, shadcn/ui, Vite

---

### Task 1: Update globals.css with arcade palette

**Files:**
- Modify: `frontend/src/styles/globals.css`

**Step 1: Rewrite @theme block**

Replace all hue-250 values with arcade palette:

```
deep-canvas:    oklch(0.10 0.02 260)  (was oklch(0.14 0.015 250))
dark-ash:       oklch(0.16 0.03 260)  (was oklch(0.20 0.01 250))
muted-stone:    oklch(0.22 0.04 260)  (was oklch(0.27 0.008 250))
primary:        oklch(0.60 0.22 235)  (was oklch(0.92 0.01 250))
primary-fg:     oklch(0.10 0.02 260)  (was oklch(0.14 0.015 250))
secondary:      oklch(0.22 0.04 260)  (was oklch(0.27 0.008 250))
muted-fg:       oklch(0.65 0.03 260)  (was oklch(0.71 0.01 250))
accent:         oklch(0.60 0.22 235)  (was oklch(0.55 0.2 250))
accent-fg:      oklch(0.96 0.01 260)  (was oklch(0.98 0.005 250))
destructive:    oklch(0.58 0.24 350)  (was oklch(0.577 0.245 27.325))
destructive-fg: oklch(0.96 0.01 260)
success:        oklch(0.65 0.2 145)   (was oklch(0.723 0.219 149.579))
border:         oklch(0.35 0.08 260)  (was oklch(0.37 0.006 250))
ring:           oklch(0.60 0.22 235)  (was oklch(0.55 0.2 250))
```

Replace `--color-foreground`: `oklch(0.96 0.01 260)`
Replace `--color-card-foreground`: `oklch(0.96 0.01 260)`
Replace `--color-popover-foreground`: `oklch(0.96 0.01 260)`
Replace `--color-secondary-foreground`: `oklch(0.96 0.01 260)`
Replace `--color-signal-foreground`: `oklch(0.96 0.01 260)`

Remove `--color-signal` (no longer needed, using `--color-accent`).

Add `--color-warning`: `oklch(0.7 0.2 65)`

Also add `h1, h2, h3, h4 { font-family: 'Archivo Black', sans-serif; }` to the body styles.

Also add `h1, h2, h3, h4 { text-transform: uppercase; letter-spacing: 0.02em; }`

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/src/styles/globals.css
git commit -m "feat(redesign): update palette to arcade colors (blue primary, yellow accent, pink destructive)"
```

---

### Task 2: Add Archivo Black font

**Files:**
- Modify: `frontend/index.html`

**Step 1: Add Google Fonts link**

Add inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet">
```

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/index.html
git commit -m "feat(redesign): add Archivo Black font for headings"
```

---

### Task 3: Update animations.css

**Files:**
- Modify: `frontend/src/styles/animations.css`

**Step 1: Update hit-flash color**

Change:
```css
background: oklch(1 0 0);
```
To:
```css
background: oklch(0.60 0.22 235);
```

**Step 2: Add neon-glow keyframes**

```css
@keyframes neon-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.neon-pulse {
  animation: neon-glow 2s ease-in-out infinite;
}
```

**Step 3: Update reduced motion**

Add `.neon-pulse` to the reduced motion block with `animation: none`.

**Step 4: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 5: Commit**

```bash
git add frontend/src/styles/animations.css
git commit -m "feat(redesign): change hit-flash to arcade-blue, add neon pulse animation"
```

---

### Task 4: Refactor Button

**Files:**
- Modify: `frontend/src/components/ui/button.tsx`

**Step 1: Update default variant**

Change:
```tsx
default: "bg-primary text-primary-foreground hover:bg-primary/90",
```
To:
```tsx
default: "bg-primary text-primary-foreground shadow-[0_0_0_0_oklch(0.60_0.22_235_/_0)] hover:shadow-[0_0_16px_oklch(0.60_0.22_235_/_0.5)] transition-shadow duration-150",
```

**Step 2: Update outline variant**

Change:
```tsx
outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
```
To:
```tsx
outline: "border border-[oklch(0.60_0.22_235)] bg-transparent text-[oklch(0.60_0.22_235)] hover:bg-[oklch(0.60_0.22_235_/_0.1)] transition-all duration-150",
```

**Step 3: Update destructive variant**

Change:
```tsx
destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
```
To:
```tsx
destructive: "bg-destructive text-destructive-foreground shadow-[0_0_0_0_oklch(0.58_0.24_350_/_0)] hover:shadow-[0_0_16px_oklch(0.58_0.24_350_/_0.5)] transition-shadow duration-150",
```

**Step 4: Update ghost variant**

Change:
```tsx
ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
```
To:
```tsx
ghost: "text-[oklch(0.60_0.22_235)] hover:bg-[oklch(0.60_0.22_235_/_0.1)]",
```

**Step 5: Update base className focus ring**

Change:
```tsx
"inline-flex ... focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ..."
```
(Keep as-is, ring is already arcade-blue via --color-ring)

**Step 6: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 7: Commit**

```bash
git add frontend/src/components/ui/button.tsx
git commit -m "feat(redesign): arcade-blue primary button with neon glow, arcade-pink destructive"
```

---

### Task 5: Update Card

**Files:**
- Modify: `frontend/src/components/ui/card.tsx`

**Step 1: Add top border glow to Card**

Change Card className:
```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm border-t-2 border-t-primary transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_oklch(0.60_0.22_235_/_0.15)]", className)} {...props} />
))
Card.displayName = "Card"
```

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/src/components/ui/card.tsx
git commit -m "feat(redesign): add arcade-blue top border glow and hover lift to cards"
```

---

### Task 6: Update Badge

**Files:**
- Modify: `frontend/src/components/ui/badge.tsx`
- Modify: `frontend/src/components/app/StatusBadge.tsx`

**Step 1: Update badge variants**

In `badge.tsx`:

Change secondary variant:
```tsx
secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
```
To:
```tsx
secondary: "bg-[oklch(0.78_0.2_85)] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.78_0.2_85_/_0.8)]",
```

Change destructive variant:
```tsx
destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
```
To:
```tsx
destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
```

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/src/components/ui/badge.tsx frontend/src/components/app/StatusBadge.tsx
git commit -m "feat(redesign): arcade-yellow pending badge, arcade-pink destructive badge"
```

---

### Task 7: Update AppHeader + AuthNav

**Files:**
- Modify: `frontend/src/components/layout/AppHeader.tsx`
- Modify: `frontend/src/components/layout/AuthNav.tsx`

**Step 1: Update AppHeader border**

Change header className to add `border-b-2 border-b-primary`:
```tsx
<header className="sticky top-0 z-50 border-b-2 border-b-primary bg-background">
```

**Step 2: Update AuthNav hover color**

Change link hover class from `hover:text-foreground` to `hover:text-primary`:
```tsx
className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
```

**Step 3: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 4: Commit**

```bash
git add frontend/src/components/layout/AppHeader.tsx frontend/src/components/layout/AuthNav.tsx
git commit -m "feat(redesign): arcade-blue header border and neon nav link hover"
```

---

### Task 8: Update AdminStatCard

**Files:**
- Modify: `frontend/src/components/app/AdminStatCard.tsx`

**Step 1: Add colored icons based on stat type**

The admin page renders stat cards with different labels. Use the label to determine icon color:
- "Total de Denúncias" → arcade-blue icon
- "Pendentes" → arcade-yellow icon
- "Aprovadas" → success green icon
- "Rejeitadas" → arcade-pink icon
- "Sinalizadas pela IA" → warning (amber) icon
- "Lutadores Cadastrados" → arcade-blue icon

Since AdminStatCard receives children for the icon slot, we can change icon color by adding a className based on a new `iconColor` prop:

```tsx
interface AdminStatCardProps {
  label: string
  value: string | number
  iconColor?: string
  children?: React.ReactNode
}
```

Pass `iconColor` from `admin/index.tsx` based on label.

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/src/components/app/AdminStatCard.tsx frontend/src/routes/_admin/admin/index.tsx
git commit -m "feat(redesign): colored icons on admin stat cards"
```

---

### Task 9: Update DESIGN.md and sidecar design.json

**Files:**
- Modify: `DESIGN.md`
- Modify: `.impeccable/design.json`

**Step 1: Update DESIGN.md**

Replace palette values with arcade palette. Update overview/characteristics to reflect arcade direction. Update CSS examples with new colors.

**Step 2: Update design.json**

Replace all oklch values in colorMeta with arcade values. Update component CSS snippets.

**Step 3: Build to verify**

No build needed (docs only).

**Step 4: Commit**

```bash
git add DESIGN.md .impeccable/design.json
git commit -m "docs(redesign): update DESIGN.md and sidecar with arcade palette"
```

---

### Task 10: Final build and verify

**Step 1: Full build**

Run: `npm run build` from `frontend/`
Expected: `✓ built in ...` with no errors, no warnings

**Step 2: Verify all routes still render**

- `/` — homepage with ReportCards
- `/login` — login form
- `/register` — registration form
- Authenticated: `/dashboard`, `/fighters`, `/reports/new`, `/profile`
- Admin: `/admin`, `/admin/flagged`

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(redesign): complete arcade redesign — palette, typography, glow effects"
```
