# Motion System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add punchy fighting-game-inspired motion (hit-flash, page transitions, card stagger, lightbox scale, hover glow) to the frontend — zero new dependencies.

**Architecture:** One CSS animations file + one React hook for page transitions. All hover/active effects are pure CSS. Card stagger uses inline `animation-delay` from CSS keyframes. Lightbox animation overrides shadcn Dialog's default transition via `data-state` selectors.

**Tech Stack:** CSS `@keyframes`, Tailwind v4, React 19, TanStack Router

**Design doc:** `docs/plans/2026-05-26-motion-design.md`

---

### Task 1: Create animations.css

**Files:**
- Create: `frontend/src/styles/animations.css`

**Step 1: Write animations.css**

```css
/* === Button Hit-Flash === */
@keyframes hit-flash {
  0% { opacity: 0; }
  20% { opacity: 0.4; }
  100% { opacity: 0; }
}

button[data-variant="default"]::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: oklch(1 0 0);
  pointer-events: none;
  opacity: 0;
}

button[data-variant="default"]:active:not(:disabled)::after {
  animation: hit-flash 200ms ease-out;
}

/* === Card Entrance === */
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: card-enter 200ms ease-out both;
}

/* === Page Transition === */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: page-enter 200ms ease-out both;
}

@keyframes page-exit {
  from { opacity: 1; }
  to { opacity: 0; }
}

.page-exit {
  animation: page-exit 100ms ease-out both;
}

/* === Lightbox === */
[data-state="open"] > [data-slot="dialog-content"] {
  animation: lightbox-in 200ms ease-out;
}

@keyframes lightbox-in {
  from {
    opacity: 0;
    transform: scale(0.93);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

[data-state="closed"] > [data-slot="dialog-content"] {
  animation: lightbox-out 100ms ease-out;
}

@keyframes lightbox-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  .card-enter,
  .page-enter,
  .page-exit {
    animation: none;
  }

  button[data-variant="default"]::after {
    display: none;
  }

  button[data-variant="default"]:active:not(:disabled) {
    transform: scale(0.97);
  }

  [data-state="open"] > [data-slot="dialog-content"],
  [data-state="closed"] > [data-slot="dialog-content"] {
    animation: none;
  }
}
```

**Step 2: Import in globals.css**

Edit `frontend/src/styles/globals.css` — add `@import "./animations.css";` at the top, after `@import "tailwindcss";`.

**Step 3: Build to verify**

Run: `npm run build` from `frontend/`
Expected: No errors, CSS includes animations

**Step 4: Commit**

```bash
git add frontend/src/styles/animations.css frontend/src/styles/globals.css
git commit -m "feat(motion): add hit-flash, card enter, page enter, and lightbox animations"
```

---

### Task 2: Create usePageTransition hook

**Files:**
- Create: `frontend/src/hooks/usePageTransition.ts`

**Step 1: Write the hook**

```typescript
import { useEffect, useState } from 'react'

export function usePageTransition() {
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    setEntering(true)
    const timer = setTimeout(() => setEntering(false), 200)
    return () => clearTimeout(timer)
  }, [])

  return entering ? 'page-enter' : ''
}
```

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: No TypeScript or bundler errors

**Step 3: Commit**

```bash
git add frontend/src/hooks/usePageTransition.ts
git commit -m "feat(motion): add usePageTransition hook for route entrance animation"
```

---

### Task 3: Wire page transitions in __root.tsx

**Files:**
- Modify: `frontend/src/routes/__root.tsx`

**Step 1: Edit __root.tsx**

Add import:
```typescript
import { usePageTransition } from '@/hooks/usePageTransition'
```

Inside `RootComponent`, add after `useAuth`/`useLogout`:
```typescript
const animationClass = usePageTransition()
```

Wrap `<main>` content:
```typescript
<main className="mx-auto max-w-7xl px-6 py-8">
  <div className={animationClass}>
    <Outlet />
  </div>
</main>
```

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/src/routes/__root.tsx
git commit -m "feat(motion): wire page transitions in root layout"
```

---

### Task 4: Add stagger + hover glow to ReportCard

**Files:**
- Modify: `frontend/src/components/app/ReportCard.tsx`
- Modify: `frontend/src/routes/index.tsx`

**Step 1: Edit ReportCard.tsx**

Accept an optional `index` prop:
```typescript
interface ReportCardProps {
  report: Report
  index?: number
}
```

Add stagger delay to the outer Card element:
```typescript
<Card
  className="group overflow-hidden transition-shadow duration-150 hover:shadow-[0_0_0_1px_oklch(0.922_0_0/0.1)]"
  style={props.index !== undefined ? { animationDelay: `${props.index * 60}ms` } : undefined}
>
```

Also add `card-enter` class:
```typescript
<Card
  className={`group overflow-hidden transition-shadow duration-150 hover:shadow-[0_0_0_1px_oklch(0.922_0_0/0.1)]${props.index !== undefined ? ' card-enter' : ''}`}
  ...
>
```

**Step 2: Edit index.tsx**

Pass `index` to ReportCard:
```typescript
{reports.map((report, index) => (
  <ReportCard key={report.id} report={report} index={index} />
))}
```

**Step 3: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 4: Commit**

```bash
git add frontend/src/components/app/ReportCard.tsx frontend/src/routes/index.tsx
git commit -m "feat(motion): add stagger entrance and hover glow to report cards"
```

---

### Task 5: Add hover glow to FighterCard

**Files:**
- Modify: `frontend/src/components/app/FighterCard.tsx`

**Step 1: Edit FighterCard.tsx**

Replace existing className:
```typescript
<Card onClick={onClick} className="cursor-pointer transition-all duration-150 hover:shadow-[0_0_0_1px_oklch(0.922_0_0/0.1)]">
```

**Step 2: Build to verify**

Run: `npm run build` from `frontend/`
Expected: Clean build

**Step 3: Commit**

```bash
git add frontend/src/components/app/FighterCard.tsx
git commit -m "feat(motion): add hover glow to fighter cards"
```

---

### Task 6: Final build and verify

**Step 1: Full build**

Run: `npm run build` from `frontend/`
Expected: `✓ built in ...` with no TypeScript errors, no warnings

**Step 2: Verify no regressions**

Confirm all existing routes still exist: login, register, dashboard, reports/new, reports/$id, fighters, fighters/$id, profile, admin, admin/flagged

**Step 3: Final commit (if needed)**

```bash
git add -A
git commit -m "feat(motion): complete motion system — hit-flash, page transitions, card stagger, lightbox, hover glow"
```
