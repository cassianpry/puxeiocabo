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
| **consentGivenAt** | Timestamp when the user consented to the Privacy Policy at registration. Stored on Account. |
| **emailVerifiedAt** | Timestamp when the user verified their email address. Null until verified. Added May 2026 for email verification flow. Blocked from login if null. |
| **LGPD** | Lei Geral de Proteção de Dados Pessoais (Law 13.709/2018) — Brazil's data protection regulation governing collection, storage, and processing of personal data. |
| **GA4** | Google Analytics 4 — web analytics service that tracks page views and user events. Loaded client-side via gtag.js only after user consents via banner. Three tiers: `refused` (no GA), `essential` (page views only), `full` (page views + custom events). |
| **EmailJS** | Transactional email service provider. Integrated via `@emailjs/nodejs` npm package. Used for password reset, email change verification, email verification (new accounts), and admin contact notifications. Uses dashboard templates with template params (service + template IDs configured via env vars). Server-side API requires enabling "API requests for non-browser applications" in EmailJS dashboard (Account → Security). |
| **EmailJS generic template** | Single dashboard template (`template_d0b10gp`) with `{{to_email}}`, `{{subject}}`, `{{{html}}}` variables (triple brackets = unescaped HTML). Backend builds full HTML inline for each email type and sends through this one template. |
| **VerificationToken** | Prisma model storing one-time tokens for password reset (`password_reset`), email change (`email_change`), and email verification (`email_verification`). Token expires in 1 hour. Cascades on account deletion. Metadata field stores JSON (e.g., `{ newEmail }` for email changes). |
| **ContactInquiry** | Prisma model storing general contact form submissions (name, email, subject, message). Shown in admin panel. Each submission triggers an admin notification email via EmailJS. |
| **BugReport** | Prisma model for user-submitted bug reports (subject, description, status, createdAt). Status can be `open` or `resolved`. Admins can view, filter by status, and mark as resolved. Paginated in admin panel. |
| **AppPagination** | Reusable React component (`components/app/Pagination.tsx`) wrapping shadcn Pagination. Provides numbered pages with ellipsis, "Anterior"/"Próximo" labels in Portuguese, and `cursor-pointer` on clickable pages. Accepts `page`, `totalPages`, `onPageChange`, and optional `className`. |
| **Report search** | Public endpoint `GET /reports?search=` filters approved reports by the reported fighter's `fighterId` (contains) or `shortId` (exact match if input is numeric). Frontend has a debounced (300ms) input with "Limpar busca" button and a limit selector (10/20/50 items per page). |

## Project Phases

### Phase 1: Data Scraping (TypeScript CLI)
- Scraped all 19,620 pages of League Point Rankings from Capcom's site
- Extracted `__NEXT_DATA__` from SSR HTML using cookies for auth
- Saved each page as `data/pages/page_N.json`
- Concurrency: 2 workers, 1s delay with jitter, 5 retries with exponential backoff
- **Result:** 19,620 pages, 392,400 total entries, 112,379 unique fighters

### Phase 2: Backend (NestJS + Prisma + PostgreSQL)
- **Database:** PostgreSQL via Neon (originally SQLite, migrated per ADR 0002)
- **Schema:** `Account` (auth), `Fighter` (shortId BigInt PK), `Report` (relations + EXIF fields)
- **Import Script:** `backend/scripts/import-fighters.ts` — reads all JSON pages, upserts by short_id
- **Auth Module:** Email/password registration, JWT access (15m) + refresh (7d), bcrypt passwords, role-based access (user/admin). Email stored as plaintext with `@unique` constraint (AES-256-GCM encryption removed — caused undetectable duplicate registrations since ciphertext differs per encryption, and forced full-table scan on login)
- **Swagger:** OpenAPI docs at `/api` with Bearer auth support. All protected routes require JWT via `@ApiBearerAuth()`
- **API Endpoints:**
  - `GET /fighters?q=...` — Search fighters by name or shortId (public) — uses BigInt(query) for precision
  - `GET /fighters/:shortId` — Get fighter details + reports (public)
  - `GET /fighters/:shortId/reports` — Get reports for a fighter (public)
  - `POST /auth/register` — Create account (email + password + consent) (public, no auto-login, sends verification email)
  - `POST /auth/verify-email` — Verify email with token (public, sets `emailVerifiedAt`)
  - `POST /auth/login` — Authenticate, returns access + refresh tokens (public, blocks unverified accounts)
  - `POST /auth/refresh` — Refresh access token (JWT required)
  - `POST /auth/logout` — Invalidate refresh token + clear cookies (JWT required)
  - `POST /auth/link` — Link account to fighter (JWT required)
  - `POST /auth/forgot-password` — Request password reset email (public, always returns success to prevent email enumeration)
  - `POST /auth/reset-password` — Reset password with token (public, validates token + expiry, invalidates existing sessions)
  - `POST /auth/change-email` — Request email change (JWT required, validates current password, sends verification to new email)
  - `POST /auth/verify-email-change` — Confirm email change with token (public, validates token + expiry, updates email)
  - `POST /auth/change-password` — Change password (JWT required, validates current + new + confirm, issues new tokens, invalidates other sessions)
  - `POST /auth/delete-account` — Delete account + anonymize reports (JWT required, clears PII, clears EXIF data from user's reports)
  - `GET /auth/export` — Export personal data (JWT required, returns JSON with account info + reports)
  - `GET /auth/me` — Get current user profile (JWT required, returns role + createdAt, consentGivenAt)
  - `POST /contact/send` — Submit contact inquiry (public, saves to DB + notifies admin via EmailJS)
  - `GET /contact/inquiries` — List contact inquiries (JWT + Admin required)
  - `POST /reports` — Submit report (JWT required, JPEG-only proof image)
  - `GET /reports` — List approved reports (pagination, public homepage feed) (public)
  - `GET /reports/my` — List own reports (JWT required)
   - `GET /reports/flagged` — List all pending reports for admin review (JWT + Admin required, returns all pending, not just AI-flagged)
  - `GET /reports/:id` — Get single report (public)
  - `PATCH /reports/:id` — Update own rejected report (JWT required, JPEG-only re-upload)
  - `PATCH /reports/:id/status` — Update status (JWT + Admin required)
  - `DELETE /reports/:id` — Soft delete (JWT + Admin required)
- **Image Upload:** Stored in Supabase Storage (`reports` bucket, public), served via Supabase CDN
- **AI Detection:** EXIF analysis via `exifr` — auto-rejects if AI keywords found (Midjourney, DALL-E, etc.), flags if missing camera metadata or date/time, stores EXIF as JSON in `exifData`

### Phase 3: Frontend (Vite + React SPA)
- **Stack:** Vite 5 + React 18 + TypeScript, TanStack Router (file-based), TanStack Query, shadcn/ui + Tailwind (dark only)
- **Language:** pt-BR throughout
- **Auth:** httpOnly cookies via backend CORS (`credentials: 'include'`), auto token refresh
- **Rules:** shadcn/ui never edited, dumb components only (props + events), TypeScript strict, HTTP in hooks only
- **Auth flow:** Register creates account without auto-login (shows success view with "verifique seu e-mail"). Login (after email verification) → navigate to `/dashboard` → `_auth` layout `beforeLoad` validates auth + `shortId` → if missing shortId, sets `needsLink` context → component shows mandatory `LinkFighterModal` (child routes not rendered) → after successful link, `router.invalidate()` re-runs `beforeLoad` → `needsLink` false → `<Outlet />` renders
- **Auth guards:** Centralized in layout routes (`_auth.tsx`, `_admin.tsx`) only — child routes must NOT have their own `beforeLoad` auth checks (caused redirect loop: `dashboard.tsx` used relative `fetch('/auth/me')` hitting Vite dev server instead of backend). Login/register routes also have `beforeLoad` that redirect authenticated users to `/dashboard` (throw redirect must be outside try/catch to avoid being swallowed).
- **Navbar:** `AuthNav` shows "Vincular Lutador" + "Sair" when authenticated but `!isLinked` (no private links until fighter linked); shows full nav (Painel, Nova Denúncia, Perfil, Sair) when linked
- **Logout:** `POST /auth/logout` → backend clears cookies (matching original options) → frontend `setQueryData(['auth', 'me'], null)` → redirect to `/`
- **Completed:**
  - Project setup with Vite + TypeScript + Tailwind dark theme
  - 20 shadcn/ui components installed (button, input, card, badge, label, form, alert, dialog, table, pagination, dropdown-menu, separator, sheet, popover, command, select, textarea, avatar, skeleton, sonner)
  - Auth system: login/register pages with react-hook-form + zod, `_auth`/`_admin` route guards
    - Smart hooks: `useAuth`, `useLogin`, `useRegister`, `useLogout`, `useDebounce`, `useFighterSearch`, `useLinkShortId`, `useChangePassword`, `useFlaggedReports`, `useAdminStats`, `useMyReports`, `useUpdateReport`, `useExportData`, `useDeleteAccount`, `useAnalytics`
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
       - Lists all pending reports (not just AI-flagged since May 2026)
       - Title: "Revisão de Denúncias", count badge shows `stats.pending`
       - Click "Ver detalhes" or chevron icon to expand each row (one at a time)
       - Expanded panel shows: reporter, reported, comment, proof image (clickable Dialog lightbox — full size modal), AI signal, EXIF data
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
      - Profile page: "Alterar email" card (new email + current password), sends verification to new email
     - LGPD compliance (Standard tier):
       - Privacy Policy page (`/privacidade`) with data inventory, legal bases, user rights, DPO contact
       - Consent checkbox on registration (required, linked to Privacy Policy)
       - `consentGivenAt` timestamp stored on Account
       - Account deletion endpoint + UI: clears email/hash/refreshToken/shortId, anonymizes reports (clears EXIF), keeps proof images
       - Data export endpoint + UI: JSON download with account info + fighter + reports
       - "Privacidade" link in AppHeader (visible to all visitors)
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
│       ├── emailjs/           # EmailJS module (global, transactional emails)
│       │   ├── emailjs.module.ts
│       │   └── emailjs.service.ts
│       ├── auth/              # Auth module (JWT, refresh, roles, cookies, email flows)
│       │   ├── dto.ts         # +ForgotPasswordDto, ResetPasswordDto, ChangeEmailDto, VerifyEmailChangeDto
│       │   ├── auth.controller.ts
│       │   └── auth.service.ts
│       ├── fighter/           # Fighter module
│       │   └── fighter.controller.ts
│       ├── contact/           # Contact module (form + admin inquiries)
│       │   ├── dto.ts         # ContactDto, BugReportDto
│       │   ├── contact.controller.ts
│       │   └── contact.service.ts
│       ├── report/            # Report module + EXIF analysis
│       │   ├── dto.ts         # CreateReportDto, UpdateReportDto, ReportResponseDto
│       │   ├── exif-analysis.service.ts
│       │   ├── report.controller.ts
│       │   └── report.service.ts
│       └── common/            # RolesGuard, @Roles decorator
├── frontend/                   # Phase 3: Vite + React SPA (pt-BR)
│   ├── public/               # Static assets (logo.png, icons, SEO images)
│   ├── .env                  # VITE_BACKEND_URL, VITE_GA_MEASUREMENT_ID
│   └── src/
│       ├── routes/            # TanStack Router file-based routes
│       │   ├── __root.tsx
│       │   ├── index.tsx
│       │   ├── login.tsx
│       │   ├── register.tsx
│       │   ├── privacidade.tsx
│       │   ├── contato.tsx
│       │   ├── auth/
│       │   │   ├── forgot-password.tsx
│       │   │   ├── reset-password.tsx
│       │   │   └── verify-email.tsx
│       │   ├── _auth.tsx
│       │   ├── _auth/
│       │   ├── _admin.tsx
│       │   └── _admin/admin/
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
- **LinkFighterModal scroll fix:** Radix Dialog sets `body.style.overflow: hidden`, blocking browser wheel scroll for PopoverContent. Solved with manual `onWheel` handler that programmatically sets `popoverRef.current.scrollTop += e.deltaY` — circumvents passive event listener on body. PopoverContent is scroll container (`max-h-[320px] overflow-y-auto`), Input is sticky at top.
- **LinkFighterModal design:** Dialog `bg-card border-t-2 border-t-primary` (neon shelf), Popover `bg-muted border-muted` (elevated surface), Input sticky container `bg-muted`, CommandItem `bg-card`, fighter card `bg-card border-t-2 border-t-primary`, description `text-muted-foreground`.
- **LinkFighterModal search icon + focus:** `Search` icon (lucide-react) in relative wrapper, `pl-9` on Input. Focus via `onOpenAutoFocus` + `inputRef.current?.focus()` (more reliable than `useEffect` timing).
- **Fighter minimum search chars:** Changed from 2 to 3 characters minimum for search across LinkFighterModal, FighterSearchCombobox, and fighters/index page. All corresponding `search.length > 1` → `> 2` and `<= 1` → `<= 2`.
- **FighterSearchCombobox:** Same `hover:bg-accent/10 data-[selected=true]:bg-accent/10`, `fighter.fighterId ?? fighter.shortId` display, and 3-char minimum search as LinkFighterModal.
- **Logout:** Redirects to `/` (homepage), not `/login`
- **Cookie clearing:** Backend `clearCookie` uses same options as `setCookie` (httpOnly, sameSite, secure, path) to ensure proper removal
- **Fighter search:** Uses `BigInt(query)` directly (not `Number()` + `BigInt()`) to avoid JavaScript precision loss for large shortIds
- **Auth guard placement:** All `beforeLoad` auth checks live in layout routes (`_auth.tsx`, `_admin.tsx`) only — child routes never duplicate auth guards. A child `beforeLoad` using relative `fetch('/auth/me')` (vs `api` helper) caused a redirect loop that prevented `LinkFighterModal` from showing after login/register.
- **Auth cache invalidation:** When `_auth.tsx` or `_admin.tsx` `beforeLoad` detects session invalidation, it calls `queryClient.setQueryData(['auth', 'me'], null)` before redirecting to `/login`. This clears the stale TanStack Query cache so `__root.tsx`'s `useAuth()` returns `null` immediately — navbar never flashes logged-in menus after session death.
- **Login/register redirect:** Both routes have `beforeLoad` that redirect authenticated users to `/dashboard`. The `redirect()` throw MUST be outside the `try/catch` — otherwise the `catch` silently swallows it and no redirect occurs.
- **Navbar link visibility:** `AuthNav` receives `isLinked` prop. When authenticated but `!isLinked`, shows \"Vincular Lutador\" (navigates to `/dashboard` → triggers `_auth.tsx` `beforeLoad` → mandatory `LinkFighterModal`) and \"Sair\". Private links (Painel, Nova Denúncia, Perfil) are hidden until the user links a fighter.
- **Test accounts:** Only `test@teste.test` (pass: `123456`, linked to fake fighter `9999999`) — no other test accounts. Rule documented in `AGENTS.md`. Email temporarily changed to `cassianpry@gmail.com` for testing EmailJS delivery.
- **File dialog:** ImageUpload uses `className="hidden"` + `inputRef.current?.click()` — explicit click handlers on both drop zone and button
- **EXIF analysis:** Removed from frontend ImageUpload to simplify code; backend EXIF analysis remains in `exif-analysis.service.ts` for admin review
- **fighterId display:** Dashboard, detail page, and fighter search show `fighterId` (nullable display name) instead of `platformName`, with `(shortId)` fallback when null
- **Report card design:** NFT Preview Card style (image + hover overlay + centered metadata + dialog lightbox), grid layout with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **ESLint react-refresh:** `allowExportNames: ['Route']` instead of `allowConstantExport` — `createFileRoute()` is a `CallExpression` not a literal constant
- **Build discipline:** No automatic builds — only when user explicitly says "build" or "build it"; verify via manual/Playwright testing first
- **Footer:** `AppFooter` in `__root.tsx` — 2px arcade-blue top border, `bg-background`. Links: Privacidade (`/privacidade`), Termos de Serviço (`/termos-de-servico`), Reportar um bug (`/bug-report`), Contato (`/contato`). Copyright `© 2026 cassianpry`. "Privacidade" link removed from `AppHeader`, moved to footer.
- **Bug report:** `POST /contact/bug-report` — public endpoint, stores in `BugReport` table (subject + description). Frontend form at `/bug-report`.
- **Terms of service:** Static page at `/termos-de-servico` — 7 sections (aceitação, uso aceitável, denúncias, propriedade intelectual, isenção, limitação, alterações). Same layout pattern as `privacidade.tsx`.
- **POST /reports error handling:** Account validation (`getReporterId`) runs before EXIF analysis and Supabase upload to fail fast. Supabase upload wrapped in try/catch returning 400 "Falha ao fazer upload da imagem" instead of unhandled 500.
- **SPA routing for /reports/new and /auth/verify-email:** NestJS `@Get(':id')` catches `/reports/new` unless excluded. `/auth/verify-email` is under `/auth` API prefix so it was passed to NestJS instead of serving SPA HTML. Fixed by adding exception in middleware to serve SPA HTML for GET requests with `Accept: text/html` — same pattern as `/reports/:id`.
- **shadcn/ui rule enforced:** `cursor-pointer` applied globally via `globals.css` (`button:not(:disabled), [role="button"]:not(:disabled), [data-slot="button"]:not(:disabled)`) — shadcn Button component never edited directly; previously reverted a direct edit to `button.tsx`
- **LGPD compliance:** Standard tier implemented. Consent collected at registration with timestamp. Account deletion replaces PII with placeholders (`deleted-{id}@removed`, `DELETED` hash) rather than hard delete — preserves FK integrity and report records for community blocklist. Report EXIF data is cleared on account deletion (potential GPS/camera metadata). Proof images are preserved (evidence of reported player behavior). Data export returns JSON with account info, fighter data, and report history. See `docs/adr/0001-lgpd-anonymization-strategy.md`.
- **Google Analytics:** GA4 loaded via gtag.js with three-tier consent gate. Bottom banner (`LgpdConsentBanner`) on first visit offers "Recusar" (`refused`), "Apenas Essenciais" (`essential`), or "Aceitar Completo" (`full`) — stored in localStorage (`ga-consent`). GA initializes for both `essential` and `full` (both need page views). Custom events only fire when `full`. Page views tracked via TanStack Router's `useLocation`. Custom events on `register`, `login`, `report_submitted`, `password_changed`, `account_deleted` — all guarded centrally in `trackEvent()`. Measurement ID via `VITE_GA_MEASUREMENT_ID` env var. Privacy policy updated to list GA cookie with tier descriptions.

- **EmailJS generic template:** Single dashboard template (`template_d0b10gp`) with `{{{html}}}` (triple brackets = unescaped HTML), `{{subject}}`, and `{{to_email}}`. Backend builds full inline HTML for each email type (password reset, email change, email verification, admin contact) and sends through this one template. This avoids needing multiple template slots on EmailJS free plan (limited to 2 templates).
- **VerificationToken:** One-time tokens for `password_reset` and `email_change`, expires in 1 hour, cascading delete on account removal. Metadata field stores JSON payloads (e.g., `{ newEmail }`).
- **Contact flow:** Form submission at `POST /contact/send` saves to `ContactInquiry` table + notifies admin via EmailJS. Admin reviews at `GET /contact/inquiries` (JWT + Admin). No user authentication required for submission.
- **Forgot-password security:** Always returns success regardless of whether the email exists (prevents email enumeration). Token created + email sent only if account found.

## Key Infrastructure Changes

### Database: SQLite → Neon PostgreSQL
- Prisma datasource: `provider = "postgresql"` with connection via `DATABASE_URL` env var
- Migrations versioned via `prisma migrate` (migration files in `backend/prisma/migrations/`)
- Local dev requires PostgreSQL: `docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`
- Migration script `scripts/migrate-to-pg.ts` copies data from existing SQLite to PostgreSQL

### Image Storage: local disk → Supabase Storage
- `SupabaseService` (`backend/src/supabase/supabase.service.ts`) wraps Supabase client
- Uploads go to Supabase Storage bucket (`reports`, made public in May 2026) using service role key (JWT from Supabase dashboard Settings → API → Legacy service_role key)
- `proofImagePath` stores the Supabase public URL (not local `/uploads/...`)
- Multer uses `memoryStorage` — file buffer is analyzed for EXIF, then uploaded to Supabase
- On creation failure, the uploaded file is cleaned up from Supabase
- **S3 service key note:** The old `#wdcvq7R@2lgTQ` value was not a valid Supabase key (expected JWT format, `eyJ...`). Fixed by using the correct `service_role` JWT from Supabase dashboard.

### Deployment: Docker image on Render
- **Dockerfile**: multi-stage (frontend build → backend build → runtime)
- Backend serves built frontend as static assets when `NODE_ENV=production`
- SPA catch-all (`backend/src/main.ts`): Express `app.use()` middleware with explicit API prefix exclusions. `/reports/new` and `/reports/:id` (numeric) served as SPA HTML via `Accept: text/html` check. `app.use()` was chosen over `app.get('*')` because newer path-to-regexp throws `PathError` on wildcard.
- **`render.yaml`**: Web Service with Docker runtime, health check at `/api`
- Local dev unchanged: `npm run dev` runs both backend + frontend via concurrently
- Env vars set via Render dashboard (sync: false in render.yaml): DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, SUPABASE_URL, SUPABASE_SERVICE_KEY, EMAILJS_*, etc.

### Frontend API URL
- `BACKEND_URL` default changed to `''` (same-origin in production)
- Local dev: `VITE_BACKEND_URL=http://localhost:3000` in `frontend/.env`
- No more Vite proxy for `/uploads` (images served directly from Supabase)
- Image lightbox: Dialog modal for full-size image preview in admin flagged page (same pattern as ReportCard home page)

## Swagger Documentation
- **URL:** `http://localhost:3000/api`
- **Auth:** Click "Authorize" → enter JWT access token (without "Bearer " prefix)
- **Tags:** `auth`, `fighters`, `reports`
- **DTOs:**
  - `auth/dto.ts`: RegisterDto, LoginDto, LinkShortIdDto, AuthResponseDto
  - `report/dto.ts`: CreateReportDto, UpdateReportDto, ReportResponseDto, PaginatedResponseDto
- **Protected endpoints** show lock icon in Swagger UI
- **Usage:** Login → copy `accessToken` → Authorize in Swagger → test protected endpoints
