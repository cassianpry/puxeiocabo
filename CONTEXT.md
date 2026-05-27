# CONTEXT: Puxei o Cabo

A project to scrape, store, and manage Street Fighter 6 ranking data from Capcom's Buckler's Boot Camp, with a rage-quit reporting system.

## Glossary

| Term | Definition |
|------|-----------|
| **Fighter** | A SF6 player identified by `short_id` (unique), `fighter_id` (nullable display name), and `platform_id`. |
| **short_id** | Unique numeric identifier for a Fighter. Stored as BigInt (exceeds 32-bit INT range). |
| **fighter_id** | Player's display name on Capcom's system. Can be null or empty. |
| **Platform** | Gaming platform (Steam, PS5, Xbox). Identified by `platform_id`. |
| **circle_name** | The name of the Capcom Fighters Network circle a Fighter belongs to. Stored as `circleName` in the DB. Null when the Fighter has no circle. |
| **Report** | A player-submitted report of a rage-quit (leaving mid-match). Includes proof image, comment, and status. |
| **CFN** | Capcom Fighters Network — the in-game social/ranking system. |
| **Buckler's Boot Camp** | Capcom's web portal for SF6 player stats and rankings. |
| **__NEXT_DATA__** | Embedded JSON in Next.js SSR HTML pages, contains ranking data. |

## Project Phases

### Phase 1: Data Scraping (TypeScript CLI)
- Scraped all 19,620 pages of League Point Rankings from Capcom's site
- Extracted `__NEXT_DATA__` from SSR HTML using cookies for auth
- Saved each page as `data/pages/page_N.json`
- Concurrency: 2 workers, 1s delay with jitter, 5 retries with exponential backoff
- **Result:** 19,620 pages, 392,400 total entries, 112,379 unique fighters

### Phase 2: Backend (NestJS + Prisma + SQLite)
- **Database:** SQLite with Prisma ORM, 112,379 unique fighters
- **Schema:** `Account` (auth), `Fighter` (shortId BigInt PK), `Report` (relations + EXIF fields)
- **Import Script:** `backend/scripts/import-fighters.ts` — reads all JSON pages, upserts by short_id
- **Auth Module:** Email/password registration, JWT access (15m) + refresh (7d), bcrypt passwords, role-based access (user/admin). Email stored as plaintext with `@unique` constraint (AES-256-GCM encryption removed — caused undetectable duplicate registrations since ciphertext differs per encryption, and forced full-table scan on login)
- **Swagger:** OpenAPI docs at `/api` with Bearer auth support. All protected routes require JWT via `@ApiBearerAuth()`
- **API Endpoints:**
  - `GET /fighters?q=...` — Search fighters by name or shortId (public) — uses BigInt(query) for precision
  - `GET /fighters/:shortId` — Get fighter details + reports (public)
  - `GET /fighters/:shortId/reports` — Get reports for a fighter (public)
  - `POST /auth/register` — Create account (email + password) (public)
  - `POST /auth/login` — Authenticate, returns access + refresh tokens (public)
  - `POST /auth/refresh` — Refresh access token (JWT required)
  - `POST /auth/logout` — Invalidate refresh token + clear cookies (JWT required)
   - `POST /auth/link` — Link account to fighter (JWT required)
   - `POST /auth/change-password` — Change password (JWT required, validates current + new + confirm, issues new tokens, invalidates other sessions)
   - `GET /auth/me` — Get current user profile (JWT required, returns role + createdAt)
  - `POST /reports` — Submit report (JWT required, JPEG-only proof image)
  - `GET /reports` — List approved reports (pagination, public homepage feed) (public)
  - `GET /reports/my` — List own reports (JWT required)
  - `GET /reports/flagged` — List AI-flagged reports (JWT + Admin required)
  - `GET /reports/:id` — Get single report (public)
  - `PATCH /reports/:id` — Update own rejected report (JWT required, JPEG-only re-upload)
  - `PATCH /reports/:id/status` — Update status (JWT + Admin required)
  - `DELETE /reports/:id` — Soft delete (JWT + Admin required)
- **Image Upload:** Stored in `backend/uploads/`, served as static assets at `/uploads/`
- **AI Detection:** EXIF analysis via `exifr` — auto-rejects if AI keywords found (Midjourney, DALL-E, etc.), flags if missing camera metadata or date/time, stores EXIF as JSON in `exifData`

### Phase 3: Frontend (Vite + React SPA) — In Progress
- **Stack:** Vite 5 + React 18 + TypeScript, TanStack Router (file-based), TanStack Query, shadcn/ui + Tailwind (dark only)
- **Language:** pt-BR throughout
- **Auth:** httpOnly cookies via backend CORS (`credentials: 'include'`), auto token refresh
- **Rules:** shadcn/ui never edited, dumb components only (props + events), TypeScript strict, HTTP in hooks only
- **Auth flow:** After login/register → navigate to `/dashboard` → `_auth` layout `beforeLoad` validates auth + `shortId` → if missing shortId, sets `needsLink` context → component shows mandatory `LinkFighterModal` (child routes not rendered) → after successful link, `router.invalidate()` re-runs `beforeLoad` → `needsLink` false → `<Outlet />` renders
- **Auth guards:** Centralized in layout routes (`_auth.tsx`, `_admin.tsx`) only — child routes must NOT have their own `beforeLoad` auth checks (caused redirect loop: `dashboard.tsx` used relative `fetch('/auth/me')` hitting Vite dev server instead of backend). Login/register routes also have `beforeLoad` that redirect authenticated users to `/dashboard` (throw redirect must be outside try/catch to avoid being swallowed).
- **Navbar:** `AuthNav` shows only "Sair" when authenticated but `!isLinked` (no private links until fighter linked); shows full nav (Painel, Nova Denúncia, Perfil, Sair) when linked
- **Logout:** `POST /auth/logout` → backend clears cookies (matching original options) → frontend `setQueryData(['auth', 'me'], null)` → redirect to `/`
- **Completed:**
  - Project setup with Vite + TypeScript + Tailwind dark theme
  - 20 shadcn/ui components installed (button, input, card, badge, label, form, alert, dialog, table, pagination, dropdown-menu, separator, sheet, popover, command, select, textarea, avatar, skeleton, sonner)
  - Auth system: login/register pages with react-hook-form + zod, `_auth`/`_admin` route guards
    - Smart hooks: `useAuth`, `useLogin`, `useRegister`, `useLogout`, `useDebounce`, `useFighterSearch`, `useLinkShortId`, `useChangePassword`, `useFlaggedReports`, `useAdminStats`, `useMyReports`, `useUpdateReport`
    - Dumb components: `AuthNav`, `AppHeader`, `LinkFighterModal`, `AdminStatCard`, `EXIFViewer`, `ReportActions`, `EditReportDialog`, `ReportCard`
    - Public homepage (`/`) with recent reports feed — NFT-style report cards in grid layout (4 cols lg)
      - Image at top with hover overlay (eye icon), click opens Dialog lightbox (max-w-7xl!)
      - Center-aligned title (reporter → reported), comment, and date (footer)
      - Shows conditional buttons: "Painel" / "Nova Denúncia" when authenticated, "Entrar" / "Cadastrar" when not
      - No redirect for authenticated users (removed `beforeLoad` guard from index route)
   - Image upload uses `className="hidden"` + `inputRef.current?.click()` for file dialog
  - LinkFighterModal: fighter search via `useFighterSearch`, command popover, mandatory link (close/logout on cancel). Link validation moved to `_auth.tsx` `beforeLoad` — component uses `Route.useRouteContext()` (not `useAuth()`) to avoid flash/loading state. `router.invalidate()` re-runs `beforeLoad` after successful link
  - All route placeholders created (dashboard, reports, fighters, profile, admin)
  - Backend CORS updated for `credentials: true` + cookie-based JWT strategies
  - Backend `GET /reports/stats` endpoint (admin only) for dashboard statistics
  - Admin dashboard (`/_admin/admin/`) with stat cards grid
  - Admin flagged reports page (`/_admin/admin/flagged`) with expandable inline review panels
      - Click "Ver detalhes" or chevron icon to expand each row (one at a time)
      - Expanded panel shows: reporter, reported, comment, proof image (clickable fullscreen modal), AI signal, EXIF data
      - Moderation form inside expanded panel: textarea + Approve / Reject / Delete buttons
      - Reject requires adminComment (validated client-side); approve may omit it
      - adminComment cleared when collapsing or switching rows
  - `adminComment` field on Report (string | null) — shown in:
      - Dashboard: rejection reason below rejected rows
      - Report detail page: "Comentário do admin" card
      - EditReportDialog: destructive banner at top for rejected reports (cleared on user resubmission)
   - Fixed: `_auth/dashboard.tsx` redundant `beforeLoad` using `fetch('/auth/me')` (relative URL) — removed; parent `_auth.tsx` handles auth correctly via `api('/auth/me')`
    - Dashboard now shows user's own reports via `GET /reports/my` (`useMyReports`), rejected reports have "Editar" button opening `EditReportDialog` — uses `sm:max-w-3xl` for spacious layout, reuses `ImageUpload` for optional proof replacement, submits via `PATCH /reports/:id` (`useUpdateReport` mutation)
   - Dashboard "Denunciado" column shows `fighterId` (not `platformName`), fallback `(shortId)` — same in detail page and admin flagged
   - `apiFormData` in `lib/api.ts` fixed: was missing `method: 'POST'` (defaulted to GET which rejects body)
   - Vite proxy `/uploads` → `http://localhost:3000` in `vite.config.ts`
   - ESLint: `allowExportNames: ['Route']` for `react-refresh/only-export-components`
   - EXIF analysis code removed from frontend `ImageUpload.tsx` (backend still analyzes)
    - FighterSearchCombobox: `onOpenAutoFocus={(e) => e.preventDefault()}` prevents focus steal; selected item shows `fighterId`
    - AGENTS.md: Build discipline section — no automatic builds, only on explicit "build" command
    - SEO page `/como-usar` — redesigned with brand register (impeccable), single-scroll layout
      - Hero: oversized Archivo Black title split in two lines, arcade-blue accent bar, logo on right side, radial glow background
      - 4 steps with staggered alternating layout (text/image), numbered 01-04, custom generated images (playerSearch.png, playerProof.png, descriptionReport.png, moderationReview.png)
      - Moderation section: sticky title + 3 cards with icons (camera, people, scroll)
      - Trust section: 3-col grid with hover glow cards
      - CTA: gradient background card with radial glow
      - SEO meta tags via TanStack Router `head` (title, description, og, twitter, canonical)
      - Brand copy: "block list da comunidade brasileira de SF6"
    - "Como usar" link in AppHeader visible to all visitors (between logo and auth nav)
    - Login/register: email icon (`Mail`) inside input field (right side), password eye toggle (`Eye`/`EyeOff`) inside password field
    - Register: "Confirmar senha" field with own eye toggle; client-side validation (min 6 chars + passwords must match) before submit
    - Logo (`logo.png`) as favicon in `index.html` + displayed next to title in AppHeader
     - New report page: added instruction text specifying proof image must show player name, opponent name, and disconnection message
     - Profile page: change password form with current/new/confirm fields, eye toggle, client+server validation, issues new tokens on success
    - `.opencode/rules/shadcn-never-edit.mdc` — rule file covering shadcn/ui + TanStack routeTree.gen.ts

## Project Structure
```
puxeiocabo/
├── scraper/                    # Phase 1: TypeScript scraper CLI
│   ├── src/
│   │   ├── config/            # Env loading, cookie management
│   │   ├── scraper/           # HTTP client, retry logic
│   │   ├── models/            # TypeScript interfaces
│   │   ├── storage/           # JSON file I/O, dead letter queue
│   │   ├── validator/         # Schema + integrity validation
│   │   └── index.ts           # CLI entry (run, validate, resume)
│   ├── .env                   # Cookies + config
│   └── package.json
├── data/
│   └── pages/                 # page_1.json ... page_19620.json
├── backend/                    # Phase 2: NestJS API
│   ├── prisma/
│   │   ├── schema.prisma      # DB schema (Account, Fighter, Report)
│   │   └── dev.db             # SQLite database
│   ├── uploads/               # Proof images (JPEG only)
│   ├── scripts/
│   │   └── import-fighters.ts # Data import script
│   └── src/
│       ├── prisma/            # Prisma service
│       ├── auth/              # Auth module (JWT, refresh, roles, cookies)
│       │   ├── dto.ts         # RegisterDto, LoginDto, LinkShortIdDto
│       │   ├── auth.controller.ts
│       │   └── auth.service.ts
│       ├── fighter/           # Fighter module
│       │   └── fighter.controller.ts
│       ├── report/            # Report module + EXIF analysis
│       │   ├── dto.ts         # CreateReportDto, UpdateReportDto, ReportResponseDto
│       │   ├── exif-analysis.service.ts
│       │   ├── report.controller.ts
│       │   └── report.service.ts
│       └── common/            # RolesGuard, @Roles decorator
├── frontend/                   # Phase 3: Vite + React SPA (pt-BR)
│   ├── src/
│   │   ├── routes/            # TanStack Router file-based routes
│   │   │   ├── __root.tsx     # Root layout with QueryClientProvider
│   │   │   ├── index.tsx      # Public homepage + recent reports
│   │   │   ├── login.tsx      # Login page (shadcn form + zod)
│   │   │   ├── register.tsx   # Register page (shadcn form + zod)
│   │   │   ├── _auth.tsx      # Auth guard layout
│   │   │   ├── _auth/         # Protected pages (dashboard, reports, fighters, profile)
│   │   │   ├── _admin.tsx     # Admin guard layout
│   │   │   └── _admin/admin/  # Admin pages (dashboard, flagged)
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui (never edited)
│   │   │   ├── app/           # Domain dumb components
│   │   │   └── layout/        # AuthNav, AppHeader
│   │   ├── hooks/             # Smart hooks (useAuth, useLogin, etc.)
│   │   ├── lib/               # api.ts, queryClient.ts, utils.ts
│   │   ├── styles/            # globals.css (dark theme tokens)
│   │   └── types/             # API types (Fighter, Report, User)
│   └── components.json        # shadcn/ui config
└── CONTEXT.md
```

## Key Decisions
- **Auth:** No Capcom ID login — users self-report `short_id`, verified against scraped DB
- **Rate limiting:** 2 concurrent workers, 1s delay + jitter to avoid 405/502 bans
- **BigInt:** `short_id` exceeds 32-bit INT, stored as BigInt in SQLite
- **DB sync:** `prisma db push` (no migration files for local SQLite)
- **Report workflow:** `pending` → `approved` / `rejected` (manual review), soft delete for audit trail
- **JPEG only:** Proof images restricted to JPEG format (rejects PNG, GIF, WebP)
- **AI detection:** EXIF heuristic analysis — auto-rejects if AI generator signatures found, flags if missing camera metadata
- **EXIF storage:** Full EXIF data stored as JSON in `exifData` column for admin review
- **Swagger:** OpenAPI docs at `/api` with Bearer auth. DTOs with `@ApiProperty()` for all endpoints. Protected routes clearly marked.
- **Frontend:** Vite SPA (not Next.js), TanStack Router for file-based routing, httpOnly cookies via CORS
- **Frontend language:** pt-BR throughout — all UI text, labels, dates, numbers
- **Frontend architecture:** Dumb components (props + events only), smart hooks (HTTP + state), shadcn/ui never edited
- **LinkFighterModal:** Mandatory after login/register for unlinked accounts — fighter search + link, close/logout on cancel. `shortId` validation is in `_auth.tsx` `beforeLoad` (returns `needsLink` context), component uses `Route.useRouteContext()` to avoid flash. `router.invalidate()` re-runs `beforeLoad` after link
- **Logout:** Redirects to `/` (homepage), not `/login`
- **Cookie clearing:** Backend `clearCookie` uses same options as `setCookie` (httpOnly, sameSite, secure, path) to ensure proper removal
- **Fighter search:** Uses `BigInt(query)` directly (not `Number()` + `BigInt()`) to avoid JavaScript precision loss for large shortIds
- **Auth guard placement:** All `beforeLoad` auth checks live in layout routes (`_auth.tsx`, `_admin.tsx`) only — child routes never duplicate auth guards. A child `beforeLoad` using relative `fetch('/auth/me')` (vs `api` helper) caused a redirect loop that prevented `LinkFighterModal` from showing after login/register.
- **Login/register redirect:** Both routes have `beforeLoad` that redirect authenticated users to `/dashboard`. The `redirect()` throw MUST be outside the `try/catch` — otherwise the `catch` silently swallows it and no redirect occurs.
- **Navbar link visibility:** `AuthNav` receives `isLinked` prop. When authenticated but `!isLinked`, only "Sair" is shown — private links (Painel, Nova Denúncia, Perfil) are hidden until the user links a fighter.
- **Test accounts:** Only `test@teste.test` (pass: `123456`, linked to fake fighter `9999999`) — no other test accounts. Rule documented in `AGENTS.md`.
- **File dialog:** ImageUpload uses `className="hidden"` + `inputRef.current?.click()` — explicit click handlers on both drop zone and button
- **EXIF analysis:** Removed from frontend ImageUpload to simplify code; backend EXIF analysis remains in `exif-analysis.service.ts` for admin review
- **fighterId display:** Dashboard, detail page, and fighter search show `fighterId` (nullable display name) instead of `platformName`, with `(shortId)` fallback when null
- **Report card design:** NFT Preview Card style (image + hover overlay + centered metadata + dialog lightbox), grid layout with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **ESLint react-refresh:** `allowExportNames: ['Route']` instead of `allowConstantExport` — `createFileRoute()` is a `CallExpression` not a literal constant
- **Build discipline:** No automatic builds — only when user explicitly says "build" or "build it"; verify via manual/Playwright testing first
- **shadcn/ui rule enforced:** `cursor-pointer` applied globally via `globals.css` (`button:not(:disabled), [role="button"]:not(:disabled), [data-slot="button"]:not(:disabled)`) — shadcn Button component never edited directly; previously reverted a direct edit to `button.tsx`

## Swagger Documentation
- **URL:** `http://localhost:3000/api`
- **Auth:** Click "Authorize" → enter JWT access token (without "Bearer " prefix)
- **Tags:** `auth`, `fighters`, `reports`
- **DTOs:**
  - `auth/dto.ts`: RegisterDto, LoginDto, LinkShortIdDto, AuthResponseDto
  - `report/dto.ts`: CreateReportDto, UpdateReportDto, ReportResponseDto, PaginatedResponseDto
- **Protected endpoints** show lock icon in Swagger UI
- **Usage:** Login → copy `accessToken` → Authorize in Swagger → test protected endpoints
