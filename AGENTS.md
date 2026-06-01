# AGENTS.md

## Dev environment tips
- Monorepo sem workspaces: root `package.json` usa `npm --prefix` para delegar comandos.
- `npm run dev` at root → sobe Vite (port 5173) + Nest (port 3000) via concurrently.
- `npm run dev:backend` ou `npm run dev:frontend` para serviço único.
- Backend requer PostgreSQL local: `docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`
- Frontend `.env`: `VITE_BACKEND_URL=http://localhost:3000`
- Backend `.env` contém secrets reais — cuidado ao commitar.
- SPA catch-all no backend: API prefix exclusions + `Accept: text/html` check (ver CONTEXT.md linha 301).

## Testing instructions
- Só o backend tem testes: `npm --prefix backend run test` (Jest + ts-jest).
- `npm --prefix backend run test:watch` para iterar em spec falhando.
- `npm --prefix backend run test:cov` para cobertura.
- Frontend não tem framework de teste instalado.
- **Sempre usar `test@teste.test` / `123456` para testes manuais.** Conta vinculada ao fighter shortId `9999999`. Não criar contas de teste adicionais.

## PR instructions
- Seguir Conventional Commits (ex: `feat(reports): add admin filtering`).
- Rodar `npm --prefix backend run lint` e `npm --prefix frontend run lint` antes do PR.
- Verificar se `npm run build` passa limpo.

## Repository map
- `skills-lock.json` — arquivo JSON com manifesto de skills instaladas. Editar quando adicionar/remover skills.
- `CONTEXT.md` — glossário do domínio do projeto.
- `DESIGN.md` — sistema de design (cores, tipografia, componentes).
- `PRODUCT.md` — definição de produto e personalidade da marca.
- `frontend/` — Vite + React SPA (pt-BR, dark mode, shadcn/ui)
- `backend/` — NestJS + Prisma + PostgreSQL
- `scraper/` — CLI TypeScript para scraping do ranking SF6
- `data/pages/` — páginas scrapedas (19.620 JSONs)

## AI Context References
- Glossário do projeto: `CONTEXT.md`
- Sistema de design: `DESIGN.md`
- Definição de produto: `PRODUCT.md`
- Decisões de arquitetura: `docs/adr/`
- Context scaffolding: `.context/docs/README.md`
- Playbooks de agente: `.context/agents/README.md`

## Project rules (`.opencode/rules/`)
- `shadcn-never-edit.mdc` — **Never** touch `frontend/src/components/ui/` or `frontend/src/routeTree.gen.ts`. Custom styling goes in `globals.css`, `className` props, or `components/app/` wrappers.
- `frontend-type-safety.mdc` — Explicit types, no `any` in `frontend/src/**/*.{ts,tsx}`.
- `always-type-never-any.mdc` — Explicit types, no `any` in `backend/src/**/*.ts`.

## Build discipline
- **NEVER** run `npm run build` after every change.
- Only build when the user explicitly says `build` or `build it`.
- Before building, verify the fix works via Playwright tests or manual testing (screenshots, computed styles, dialog state).
- Build output must be error-free and match the tested behavior.
