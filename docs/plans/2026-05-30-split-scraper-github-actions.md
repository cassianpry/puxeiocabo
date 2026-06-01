# Split Scraper GitHub Action Into Two Jobs + Resume Support

## Summary

Update the scraper GitHub Actions workflow so the weekly scrape no longer exceeds GitHub's 6-hour job limit. Keep a single workflow run, but split the scrape into two sequential jobs: pages `1-9810`, then pages `9811-19620`.

## Evidence

The job timed out at page 15300/19620 with rate 0.7 pages/s. Each half (9810 pages) takes ~3.9h, well under the 6h limit.

## Key Changes

### 1. CLI: `--skip-existing` flag
- `scraper/src/index.ts` — command `run` gets flag `-k, --skip-existing`
- Before fetching each page, checks `pageExists()` — if file is on disk, skips it
- Progress log includes `Skipped` count

### 2. Workflow: 3 modes, 4 jobs

Uses `${{ inputs.resume != 'true' }}` and `${{ inputs.start_page != '' }}` for mutual exclusion between modes:

| Mode | Trigger | Jobs | Behavior |
|------|---------|------|----------|
| **Range test** | `start_page` + `end_page` set | 1: `scrape-range` | Scrapes exact range, imports, uploads artifact |
| **Resume** | `resume: true` | 1: `scrape-resume` | Downloads artifact from latest run, `run --skip-existing` fills gaps, imports |
| **Weekly** | No inputs | 2: `scrape-first-half` → `scrape-second-half` | Pages 1–9810, then 9811–19620. Each job uploads artifact |

Each job: `run` → `resume --failed` → `import` → upload artifact (`if: always()` for artifact upload).

- `scrape-range`: `run --start $start --end $end`
- `scrape-resume`: `gh run download` → `run --skip-existing` (defaults to 1–19620, skips what's on disk)
- `scrape-first-half`: `run --start 1 --end 9810`
- `scrape-second-half`: `needs: scrape-first-half`, `run --start 9811 --end 19620`
- Same env vars, Node setup, Prisma generation in all jobs.

## Test Plan

- `workflow_dispatch` with `start_page: 1`, `end_page: 3`
- Verify: 3 JSONs in artifact, fighters upserted in DB
- Then run a larger range or wait for weekly schedule

## Assumptions

- Total ranking pages remain `19,620`.
- Partial imports are acceptable — importer uses PostgreSQL upserts.
- Importing after each half preserves progress if second half fails.
- Artifacts from different jobs merge cleanly (no overlapping page files).
- `gh run download` extracts artifacts into subdirectories matching artifact names — `pages/` aligns with `DATA_DIR=../data/pages`.
