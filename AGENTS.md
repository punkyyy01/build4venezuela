<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repo uses Next `16.2.9` and React `19.2.4`; APIs and file conventions may differ from model defaults. Before changing Next code, read the relevant docs in `node_modules/next/dist/docs/` if dependencies are installed, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- Use Bun: lockfile is `bun.lock`; install with `bun install`.
- Dev server: `bun dev`.
- Lint/format: `bun run lint` runs `biome check`; `bun run format` runs `biome format --write`.
- Tests: `bun test`; focused test: `bun test src/lib/projects/spam.test.ts`.
- Build verification: `bun run build`. There is no typecheck script; use `bunx tsc --noEmit` when a focused TS check is needed.

## App Structure

- Localized marketing pages live under `src/app/[locale]`; supported locales are in `src/i18n/routing.ts` and messages are in `messages/*.json`.
- Project pages are intentionally non-localized: `src/app/(project-routes)` serves `/projects`, `/submit`, and `/p/[slug]`, wrapping them with English messages from `messages/en.json`.
- `src/proxy.ts` combines Clerk auth and `next-intl`; it skips intl for APIs, redirects, project routes, and static assets. `/submit` is protected there; API routes and edit ownership also check auth server-side.
- Root layout wires Clerk and TanStack Query globally in `src/app/layout.tsx`; client data helpers live in `src/lib/projects/queries.ts`.

## Data And Env

- Required env vars are enforced in `src/env.ts`; copy keys from `.env.example`. Tests that import env-backed modules must set fake env vars before dynamic imports, as `src/lib/projects/spam.test.ts` does.
- Server-side reads/writes go through Drizzle (`src/db/index.ts` + `src/db/schema.ts`) over the `DATABASE_URL` Postgres connection. `DATABASE_URL` is optional: when unset, the project/category stores fall back to local JSON in `.data/`. **In production `DATABASE_URL` must be set, or the app silently serves the empty local fallback.**
- Project persistence is centralized in `src/lib/projects/store.ts` (Drizzle, then `.data/projects.json` fallback); cluster persistence is in `src/lib/projects/category-store.ts` (Drizzle, then `.data/categories.json`).
- Schema source of truth is the raw SQL in `supabase/migrations/` (plus the consolidated `supabase/projects.sql`): triggers, functions, RLS, and the realtime event-queue tables live there. `src/db/schema.ts` is the typed query surface only — keep it in sync by hand or `bun run db:pull`; do NOT `drizzle-kit push`.
- Realtime UI subscribes directly from the browser with the Supabase anon key via `src/lib/projects/browser-supabase.ts` (Supabase Realtime has no Drizzle equivalent).

## UI Conventions

- Styling is Tailwind CSS v4 through `src/app/globals.css`, with shadcn config in `components.json` (`style: base-lyra`, Phosphor icons, aliases under `@/`).
- The visual language is a black-background, mono-font Build4Venezuela poster style using assets/fonts in `public/BFV`; preserve that before introducing generic shadcn-looking layouts.
