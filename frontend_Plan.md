# Phase 3: Frontend Implementation Plan

## Stack
- **Build:** Vite 5 + React 18 + TypeScript
- **Routing:** TanStack Router (file-based + beforeLoad guards)
- **Data:** TanStack Query (cache + refetch)
- **UI:** shadcn/ui + Tailwind — **dark theme only**
- **Auth:** httpOnly cookies via backend CORS (`credentials: 'include'`)
- **Upload:** Direct to backend

## Design Tokens (Dark Theme Forced)
```css
--background: #09090b (zinc-950)
--card: #18181b (zinc-900)
--muted: #27272a (zinc-800)
--border: #3f3f46 (zinc-700)
--foreground: #fafafa
--muted-foreground: #a1a1aa (zinc-400)
--primary: #e4e4e7 (zinc-200)
--success: #22c55e (green-500)
--destructive: #ef4444 (red-500)
```

## Rules (MANDATORY)

### 1. shadcn/ui Usage
- Use shadcn/ui components for all UI building blocks
- Never edit `components/ui/` — customize via CSS vars and className props
- Install components via `npx shadcn@latest add <component>`

### 2. TypeScript Everywhere
- All frontend code must be TypeScript (`.ts`, `.tsx`)
- Exception: shadcn/ui components and TanStack generated files (`routeTree.gen.ts`)
- Strict types for all props, API responses, form data
- No `any` types — use proper interfaces/types

### 3. Componentes "Burros" (Dumb Components)
Componentes de UI devem:
- **Receber props** — dados prontos para renderizar
- **Renderizar** — JSX puro baseado nas props
- **Emitir eventos** — callbacks (`onClick`, `onSubmit`, `onChange`) para interação

**Evite em componentes:**
- Chamadas HTTP (`fetch`, `api()`)
- Regras complexas de negócio
- Transformações pesadas de dados
- Lógica de roteamento
- Gerenciamento de estado global

**Padrão de separação:**
```
Route (page) → TanStack Query (data fetching) → Dumb Component (render)
     ↓                                              ↓
  beforeLoad                                    recebe props
  loader                                        emite eventos
  state management                              JSX puro
```

### 4. TanStack Router
- Guards via `beforeLoad` in `_auth.tsx`/`_admin.tsx`
- Route-level data fetching via loaders or TanStack Query in route components
- Navigation via `useNavigate`, `Link`

### 5. TanStack Query
- Config only in `queryClient.ts` (staleTime, retry)
- Data fetching in route components, NOT in dumb components
- Hooks like `useFighterSearch` encapsulate query logic

### 6. Dark Theme Forced
- `classList.add('dark')` in `main.tsx`, no toggle
- `tailwind.config.ts`: `darkMode: 'class'`

### 7. Credentials
- All fetch via `lib/api.ts` with `credentials: 'include'`
- Never manual token header

### 9. Idioma pt-BR
- Todo texto visível ao usuário deve estar em português brasileiro
- Labels, placeholders, mensagens de erro, botões, títulos
- Datas formatadas com `toLocaleDateString('pt-BR')`
- Números formatados com `toLocaleString('pt-BR')`
- [x] Traduzir todas as páginas existentes (login, register, home, dashboard, etc.)

## Implementation Phases

### Phase 3.1: Setup ✅
- [x] Create Vite project with React + TypeScript
- [x] Install dependencies (TanStack Router, Query, shadcn/ui, react-hook-form, zod)
- [x] Configure Tailwind (darkMode: 'class') + globals.css with dark tokens
- [x] Setup lib/api.ts (credentials: 'include'), lib/queryClient.ts, lib/utils.ts
- [x] Setup TanStack Router (router.tsx, __root.tsx, route tree)
- [x] Force dark theme in main.tsx (classList.add('dark'))

### Phase 3.2: Auth System + Backend CORS ✅
- [x] Update backend CORS (origin: localhost:5173, credentials: true)
- [x] Create Login page with shadcn form + react-hook-form + zod (pt-BR)
- [x] Create Register page with shadcn form + react-hook-form + zod (pt-BR)
- [x] Create _auth.tsx guard layout (beforeLoad verifies cookie)
- [x] Create _admin.tsx guard layout (beforeLoad + role check)
- [x] Create useAuth hook (queries /auth/me)
- [x] Create useDebounce hook (300ms)
- [x] Create useLogin hook (extract HTTP from login)
- [x] Create useRegister hook (extract HTTP from register)
- [x] Create useLogout hook (extract HTTP from AuthNav)
- [x] Create AuthNav component (dumb: props + onLogout event)
- [x] Create AppHeader component (dumb: shared header)
- [x] Implement token refresh logic in lib/api.ts
- [x] Update backend JWT/Refresh strategies to read from cookies
- [x] Add httpOnly cookie support to auth controller (set/clear on login/logout/refresh)
- [x] Fix clearCookies to match original cookie options (httpOnly, sameSite, secure, path)
- [x] Fix useLogout: queryClient.setQueryData(['auth', 'me'], null) instead of queryClient.clear()
- [x] Fix logout redirect to '/' instead of '/login'

### Phase 3.3: Public Pages ✅
- [x] Create index.tsx — public homepage with recent reports feed (pt-BR)
- [x] All placeholder route pages created (pt-BR)

### Phase 3.4: Protected Pages ✅
- [x] Install shadcn/ui components (20 components)
- [x] Create types for all API responses (Fighter, Report, User, PaginatedResponse, Role)
- [x] Create useLinkShortId hook (mutation + cache invalidation)
- [x] Create LinkFighterModal component (fighter search, mandatory link, logout on cancel)
- [x] Update _auth.tsx to show LinkFighterModal when user has no shortId
- [x] Create dumb components:
  - `StatusBadge` — receives `status` prop, renders shadcn Badge with variant
  - `FighterCard` — receives `fighter` prop, renders shadcn Card with stats
  - `ReportRow` — receives `report` prop, renders table row with actions
  - `ImageUpload` — receives `onChange` callback, renders file input + preview
  - `EXIFIndicator` — receives `aiSuspicious`, `aiReason` props, renders alert
  - `FighterSearchCombobox` — shadcn Popover + Command + debounce
- [x] Create smart hooks:
  - `useReports` — TanStack Query for reports list
  - `useFighter` — TanStack Query for single fighter
  - `useReport` — TanStack Query for single report
  - `useFighterSearch` — already created (debounced search)
- [x] Create route pages (data fetching + compose dumb components):
  - `/_auth/dashboard` — fetches reports, renders DataTable + ReportRow
  - `/_auth/reports/new` — FighterSearchCombobox + ImageUpload + form submit
  - `/_auth/reports/$id` — fetches report, renders ReportDetail + EXIFIndicator
  - `/_auth/fighters/` — search input + DataTable + FighterCard
  - `/_auth/fighters/$id` — fetches fighter, renders FighterCard + reports
  - `/_auth/profile` — fetches user, renders profile form + link shortId
- [x] Create login/register pages
- [x] Create public homepage with recent reports feed

### Phase 3.5: Admin Pages ✅
- [x] Create dumb components:
  - `AdminStatCard` — receives `label`, `value`, `icon` props
  - `EXIFViewer` — receives `exifData` JSON string, renders formatted table
  - `ReportActions` — receives `onApprove`, `onReject`, `onDelete` callbacks
- [x] Create smart hooks:
  - `useFlaggedReports` — TanStack Query for AI-flagged reports
  - `useAdminStats` — TanStack Query for dashboard stats
- [x] Create route pages:
  - `/_admin/admin/` — fetches stats, renders AdminStatCard grid
  - `/_admin/admin/flagged` — fetches flagged reports, renders DataTable + EXIFViewer + ReportActions
- [x] Backend: `GET /reports/stats` endpoint (admin only) returning total/pending/approved/rejected/flagged/fighterCount

## Component Architecture

### Dumb Components (`components/`)
| Component | Location | Props | Events | Description |
|-----------|----------|-------|--------|-------------|
| `AuthNav` | `layout/` | `isAuthenticated`, `isAdmin`, `onLogout` | `onLogout` | Navigation links based on auth state |
| `AppHeader` | `layout/` | `title`, `isAuthenticated`, `role`, `onLogout` | `onLogout` | Shared header with logo + AuthNav |
| `LinkFighterModal` | `app/` | `open`, `onLink`, `onLogout` | `onLink`, `onLogout` | Mandatory fighter link dialog |
| `StatusBadge` | `app/` | `status: string` | - | shadcn Badge with color mapping |
| `FighterCard` | `app/` | `fighter: Fighter` | `onClick?: () => void` | Card with fighter info |
| `ReportRow` | `app/` | `report: Report` | `onView?: () => void` | Table row for reports |
| `ImageUpload` | `app/` | `value?: File` | `onChange: (file: File) => void` | File input + preview |
| `EXIFIndicator` | `app/` | `aiSuspicious`, `aiReason` | - | Alert for AI detection |
| `AdminStatCard` | `app/` | `label`, `value`, `icon` | - | Stat display card |
| `EXIFViewer` | `app/` | `exifData: string` | - | Formatted EXIF JSON table |
| `ReportActions` | `app/` | `reportId` | `onApprove`, `onReject`, `onDelete` | Admin action buttons |

### Smart Hooks (`hooks/`)
| Hook | Returns | Description |
|------|---------|-------------|
| `useAuth` | `UseAuthReturn` | Queries `/auth/me` |
| `useLogin` | `{ login: (data) => Promise<LoginResult> }` | Handles login + navigation to `/dashboard` |
| `useRegister` | `{ register: (data) => Promise<RegisterResult> }` | Handles registration + navigation to `/dashboard` |
| `useLogout` | `{ logout: () => Promise<void> }` | Handles logout + `setQueryData` + redirect to `/` |
| `useDebounce` | `debouncedValue: T` | 300ms debounce |
| `useFighterSearch` | `UseQueryResult<{ fighters: Fighter[] }>` | Debounced fighter search |
| `useLinkShortId` | `{ linkShortId: (shortId) => Promise<void>, isLinking: boolean }` | Mutation for `POST /auth/link` |
| `useReports` | `UseQueryResult<PaginatedResponse<Report>>` | Reports list with pagination |
| `useFighter` | `UseQueryResult<Fighter>` | Single fighter by shortId |
| `useReport` | `UseQueryResult<Report>` | Single report by id |
| `useFlaggedReports` | `UseQueryResult<PaginatedResponse<Report>>` | AI-flagged reports |
| `useAdminStats` | `UseQueryResult<{ total: number, pending: number, flagged: number }>` | Admin dashboard stats |

### Route Pages (`routes/`)
- Fetch data via TanStack Query or `beforeLoad`
- Compose dumb components
- Handle form submission via hooks (`useLogin`, `useRegister`, etc.)
- No complex logic in JSX — delegate to hooks
- Use `<Link>` for client-side navigation (never `<a href>`)
