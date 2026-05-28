# 0002 — PostgreSQL, Supabase Storage, and Docker deployment

SQLite was used during development but is unsuitable for Render's free tier due to ephemeral filesystem (data lost on restart/deploy). Additionally, proof images stored on local disk would be lost on container restarts.

## Decisions

### 1. Database: SQLite → Neon PostgreSQL
- Prisma datasource changed from `sqlite` to `postgresql`
- Migrations now use `prisma migrate` instead of `prisma db push`
- Local development requires PostgreSQL (Docker: `docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`)
- Migration script (`backend/scripts/migrate-to-pg.ts`) reads from existing SQLite via better-sqlite3 and writes to PostgreSQL via PrismaClient

### 2. Image storage: local disk → Supabase Storage
- Multer `diskStorage` replaced with `memoryStorage`
- Backend uploads file buffer to Supabase Storage (S3-compatible) immediately after EXIF analysis
- `proofImagePath` stores the Supabase public URL instead of local `/uploads/...` path
- On upload failure, the uploaded file is cleaned up from Supabase

### 3. Deployment: single Docker image on Render
- Multi-stage Dockerfile: builds frontend (Vite), builds backend (NestJS), single runtime image
- Backend serves built frontend as static assets in production (`NODE_ENV=production`)
- SPA catch-all middleware: all non-API routes return `index.html`
- Local dev unchanged: Vite dev server with `VITE_BACKEND_URL=http://localhost:3000`

### 4. Frontend API URL
- Default `BACKEND_URL` changed from `http://localhost:3000` to `''` (same-origin in production)
- Local dev sets `VITE_BACKEND_URL=http://localhost:3000` in `frontend/.env`

## Alternatives rejected
- **Render PostgreSQL** (would lock us into Render's Postgres; Neon is serverless and closer to our stack)
- **Cloudflare R2** (similar to Supabase Storage but would add another provider)
- **Two services on Render** (backend + static site — more complex, CORS issues)
- **Keeping SQLite with volume** (Render free tier doesn't support persistent volumes)
