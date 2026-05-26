# AGENTS.md

## Dev environment tips
- Install dependencies with `npm install` before running scaffolds.
- Use `npm run dev` for the interactive TypeScript session that powers local experimentation.
- Run `npm run build` to refresh the CommonJS bundle in `dist/` before shipping changes.
- Store generated artefacts in `.context/` so reruns stay deterministic.

## Testing instructions
- Execute `npm run test` to run the Jest suite.
- Append `-- --watch` while iterating on a failing spec.
- Trigger `npm run build && npm run test` before opening a PR to mimic CI.
- Add or update tests alongside any generator or CLI changes.
- **Always use `test@teste.test` / `123456` for manual tests.** Account is linked to fake fighter shortId `9999999`. Do NOT create additional test accounts.

## PR instructions
- Follow Conventional Commits (for example, `feat(scaffolding): add doc links`).
- Cross-link new scaffolds in `docs/README.md` and `agents/README.md` so future agents can find them.
- Attach sample CLI output or generated markdown when behaviour shifts.
- Confirm the built artefacts in `dist/` match the new source changes.

## Repository map
- `skills-lock.json/` — explain what lives here and when agents should edit it.

## AI Context References
- Documentation index: `.context/docs/README.md`
- Agent playbooks: `.context/agents/README.md`
- Contributor guide: `CONTRIBUTING.md`

## Project rules (`.opencode/rules/`)
- `shadcn-never-edit.mdc` — **Never** touch files under `frontend/src/components/ui/` or `frontend/src/routeTree.gen.ts`. Custom styling goes in `globals.css`, `className` props, or `components/app/` wrappers.

## Build discipline
- **NEVER** run `npm run build` after every change.
- Only build when the user explicitly says `build` or `build it`.
- Before building, verify the fix works via Playwright tests or manual testing (screenshots, computed styles, dialog state).
- Build output must be error-free and match the tested behavior.
