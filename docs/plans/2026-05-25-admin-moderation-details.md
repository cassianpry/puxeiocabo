# Admin Moderation Details Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let admins review full flagged report details inline, require an admin rejection reason, and show that reason to users on rejected reports.

**Architecture:** Keep `Denúncias Sinalizadas` as the moderation hub. Add a dedicated moderation field on `Report`, enforce reject-comment rules in the backend, and expose the current moderation reason on both admin and user surfaces. Use one expandable admin row at a time, with moderation actions only inside the expanded panel.

**Tech Stack:** Prisma + SQLite, NestJS, React 19, TanStack Router, TanStack Query, shadcn/ui

---

### Task 1: Add moderation field to the report model

**Files:**
- Modify: `backend/prisma/schema.prisma`
- Verify: `backend/prisma/dev.db` after schema sync

**Step 1: Write the failing test**
- Backend service/controller test for rejected report moderation should expect an `adminComment` field to exist in returned report data.
- Backend user-resubmission test should expect `adminComment` to be cleared after update.

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- report
```
Expected:
- FAIL because `adminComment` does not exist yet.

**Step 3: Write minimal implementation**
- Add `adminComment String?` to `Report`.

**Step 4: Sync schema**
Run:
```bash
npx prisma db push
```

**Step 5: Run focused test again**
Run:
```bash
npm run test -- report
```
Expected:
- Still failing on behavior, but schema field now exists.

**Step 6: Commit**
```bash
git add prisma/schema.prisma
git commit -m "feat(report): add admin moderation comment field"
```

---

### Task 2: Enforce moderation comment rules in backend status updates

**Files:**
- Modify: `backend/src/report/report.controller.ts`
- Modify: `backend/src/report/report.service.ts`
- Modify: `backend/src/report/dto.ts`
- Test: backend report tests

**Step 1: Write the failing test**
- Reject without `adminComment` returns 400.
- Approve with no `adminComment` succeeds.
- Reject with `adminComment` persists the value.

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- report
```
Expected:
- FAIL because `PATCH /reports/:id/status` only accepts `status`.

**Step 3: Write minimal implementation**
- Accept `adminComment` in the admin status endpoint body.
- Validate:
  - `rejected` requires non-empty `adminComment`
  - `approved` may omit it
- Persist `adminComment` in `updateStatus`.

**Step 4: Run focused tests**
Run:
```bash
npm run test -- report
```
Expected:
- PASS for moderation validation behavior.

**Step 5: Commit**
```bash
git add src/report/report.controller.ts src/report/report.service.ts src/report/dto.ts
git commit -m "feat(report): require moderation comment on rejection"
```

---

### Task 3: Clear moderation comment on user resubmission

**Files:**
- Modify: `backend/src/report/report.service.ts`
- Possibly modify: `backend/src/report/report.controller.ts`
- Test: backend report tests

**Step 1: Write the failing test**
- When a rejected report is edited by its owner, the updated report no longer has the prior `adminComment`.

**Step 2: Run test to verify it fails**
Run:
```bash
npm run test -- report
```
Expected:
- FAIL because `updateByUser` currently preserves all moderation state except what is explicitly overwritten.

**Step 3: Write minimal implementation**
- In `updateByUser`, clear `adminComment`.
- Ensure the report goes back to review state consistently:
  - keep current status-reset behavior aligned with existing flow
  - if current flow should remain rejected unless explicitly changed, decide there
  - likely set status back to `pending` unless EXIF auto-rejects again

**Step 4: Run focused tests**
Run:
```bash
npm run test -- report
```
Expected:
- PASS for resubmission-clears-comment behavior.

**Step 5: Commit**
```bash
git add src/report/report.service.ts src/report/report.controller.ts
git commit -m "feat(report): clear moderation comment on resubmission"
```

---

### Task 4: Extend shared frontend report types

**Files:**
- Modify: `frontend/src/types/api.ts`
- Test: frontend typecheck

**Step 1: Write the failing test**
- Typecheck or component usage should fail once UI reads `report.adminComment`.

**Step 2: Run typecheck to verify failure**
Run:
```bash
npx tsc -p tsconfig.app.json --noEmit
```

**Step 3: Write minimal implementation**
- Add `adminComment: string | null` to `Report`.

**Step 4: Run typecheck again**
Run:
```bash
npx tsc -p tsconfig.app.json --noEmit
```
Expected:
- PASS or advance to next real UI failure.

**Step 5: Commit**
```bash
git add src/types/api.ts
git commit -m "feat(frontend): add moderation comment to report type"
```

---

### Task 5: Add inline expandable review panel to flagged reports

**Files:**
- Modify: `frontend/src/routes/_admin/admin/flagged.tsx`
- Possibly create: `frontend/src/components/app/AdminFlaggedReportDetails.tsx`
- Possibly create: `frontend/src/components/app/AdminModerationForm.tsx`
- Test: `frontend/test/admin-flagged-review.test.ts`
- Verify: Playwright/manual admin flow

**Step 1: Write the failing test**
- One row expanded at a time.
- Collapsed row shows `Ver detalhes`, not moderation actions.
- Expanded panel shows:
  - reporter
  - reported
  - comment
  - proof image
  - AI reason
  - EXIF
  - status
  - created date

**Step 2: Run test to verify it fails**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/admin-flagged-review.test.ts
```
Expected:
- FAIL because the helper/component behavior does not exist yet.

**Step 3: Write minimal implementation**
- Track `expandedReportId`.
- Replace row action controls with `Ver detalhes`.
- Render an extra full-width detail row below the selected report.
- Close previous row when a new one opens.
- Move EXIF section into the expanded panel instead of rendering all EXIF blocks below the table.

**Step 4: Run focused tests**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/admin-flagged-review.test.ts
```

**Step 5: Commit**
```bash
git add src/routes/_admin/admin/flagged.tsx src/components/app
git commit -m "feat(admin): add inline flagged report review panel"
```

---

### Task 6: Add admin moderation comment form to the expanded panel

**Files:**
- Modify: `frontend/src/routes/_admin/admin/flagged.tsx`
- Possibly create: `frontend/src/hooks/useModerateReport.ts`
- Test: `frontend/test/admin-flagged-review.test.ts`
- Verify: Playwright/manual admin flow

**Step 1: Write the failing test**
- Reject action without comment shows validation error.
- Approve action works without comment.
- Admin comment is submitted with status update.
- Panel closes after successful moderation refresh.

**Step 2: Run test to verify it fails**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/admin-flagged-review.test.ts
```

**Step 3: Write minimal implementation**
- Add textarea in expanded panel.
- Validate required-on-reject inline.
- Send `{ status, adminComment }` to `PATCH /reports/:id/status`.
- Keep delete action in the panel too.
- On success:
  - invalidate flagged + stats queries
  - collapse expanded row

**Step 4: Run focused tests**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/admin-flagged-review.test.ts
```

**Step 5: Commit**
```bash
git add src/routes/_admin/admin/flagged.tsx src/hooks/useModerateReport.ts
git commit -m "feat(admin): capture moderation comment in flagged review"
```

---

### Task 7: Show admin rejection reason in user dashboard

**Files:**
- Modify: `frontend/src/components/app/ReportRow.tsx`
- Modify: `frontend/src/routes/_auth/dashboard.tsx`
- Possibly modify: `frontend/src/components/app/EditReportDialog.tsx`
- Test: `frontend/test/user-rejection-reason.test.ts`

**Step 1: Write the failing test**
- Rejected report displays admin rejection reason in dashboard context.
- Non-rejected reports do not show it.

**Step 2: Run test to verify it fails**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/user-rejection-reason.test.ts
```

**Step 3: Write minimal implementation**
- Show `adminComment` near the rejected report’s action area or directly under the row in dashboard.
- If keeping the table compact, show it inside the rejected report edit flow summary area.
- Prefer the smallest visible placement that satisfies “visible before edit/resubmit”.

**Step 4: Run focused tests**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/user-rejection-reason.test.ts
```

**Step 5: Commit**
```bash
git add src/components/app/ReportRow.tsx src/routes/_auth/dashboard.tsx src/components/app/EditReportDialog.tsx
git commit -m "feat(user): show rejection reason in dashboard"
```

---

### Task 8: Show admin rejection reason in report detail page

**Files:**
- Modify: `frontend/src/routes/_auth/reports/$id.tsx`
- Test: `frontend/test/user-rejection-reason.test.ts`

**Step 1: Write the failing test**
- Rejected report detail displays `adminComment`.
- Reports without moderation comment do not render the block.

**Step 2: Run test to verify it fails**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/user-rejection-reason.test.ts
```

**Step 3: Write minimal implementation**
- Add a dedicated card/section for `comentário do admin`.
- Show only when present.

**Step 4: Run focused tests**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/user-rejection-reason.test.ts
```

**Step 5: Commit**
```bash
git add src/routes/_auth/reports/$id.tsx
git commit -m "feat(user): show moderation comment on report detail"
```

---

### Task 9: End-to-end verification

**Files:**
- No new files required unless adding browser fixtures
- Verify existing changed files

**Step 1: Run backend tests**
Run:
```bash
npm run test -- report
```

**Step 2: Run frontend focused tests**
Run:
```bash
../backend/node_modules/.bin/tsx --test test/admin-routing.test.ts test/admin-flagged-review.test.ts test/user-rejection-reason.test.ts
```

**Step 3: Run frontend lint on touched files**
Run:
```bash
npx eslint src/routes/_admin/admin/flagged.tsx src/routes/_auth/dashboard.tsx src/routes/_auth/reports/$id.tsx src/components/app/ReportRow.tsx src/components/app/EditReportDialog.tsx src/types/api.ts src/lib/admin-routing.ts test/*.test.ts
```

**Step 4: Run frontend typecheck**
Run:
```bash
npx tsc -p tsconfig.app.json --noEmit
```

**Step 5: Manual/Playwright verification**
- Login as admin
- Open `/admin/flagged`
- Expand one report
- Reject without comment -> expect inline error
- Reject with comment -> expect success and collapse
- Login as reporting user
- Confirm rejection reason visible in dashboard
- Confirm rejection reason visible in report detail
- Edit/resubmit rejected report
- Confirm old admin comment disappears after resubmission

**Step 6: Commit**
```bash
git add .
git commit -m "feat(admin): add inline moderation details and rejection reasons"
```

---

### Notes for execution
- Reuse existing admin route URLs: `/admin` and `/admin/flagged`
- Do not overload report `comment`; keep reporter text separate from admin moderation text
- Do not add moderation history in this pass
- Keep one expanded flagged row at a time
- Keep moderation actions only inside the expanded panel
