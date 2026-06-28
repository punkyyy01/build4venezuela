<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repo uses Next `16.2.9` and React `19.2.4`; APIs and file conventions may differ from model defaults. Before changing Next code, read the relevant docs in `node_modules/next/dist/docs/` if dependencies are installed, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- Use Bun: lockfile is `bun.lock`; install with `bun install`.
- Dev server: `bun dev`.
- Lint/format: `bun run lint` runs `biome check`; `bun run format` runs `biome format --write`.
- Tests: `bun test`; focused tests include `bun test src/lib/projects/spam.test.ts` and `bun test src/lib/projects/api-security.test.ts`.
- Build verification: `bun run build`. There is no typecheck script; use `bunx tsc --noEmit` when a focused TS check is needed.

## App Structure

- Localized marketing pages live under `src/app/[locale]`; supported locales are in `src/i18n/routing.ts` and messages are in `messages/*.json`.
- Project/community pages are intentionally non-localized: `src/app/(project-routes)` serves `/projects`, `/submit`, `/p/[slug]`, `/requests`, and `/recursos`, wrapping them with English messages from `messages/en.json`.
- `src/proxy.ts` combines Clerk auth and `next-intl`; it skips intl for APIs, redirects, non-localized project/community routes, and static assets. `/submit` is protected there; API routes and edit ownership also check auth server-side.
- Root layout wires Clerk and TanStack Query globally in `src/app/layout.tsx`; client data helpers live in `src/lib/projects/queries.ts`.

## Data And Env

- Required env vars are enforced in `src/env.ts`; copy keys from `.env.example`, including Upstash Redis for rate limiting. Tests that import env-backed modules must set fake env vars before dynamic imports, as the project tests do.
- Project persistence is centralized in `src/lib/projects/store.ts`: Supabase service-role client first, then local fallback at `.data/projects.json` on store failures.
- Solution-request persistence is centralized in `src/lib/requests/store.ts`: it uses Supabase tables named `solution_requests`, `solution_request_votes`, `solution_request_comments`, and `solution_request_comment_votes`, with local fallback at `.data/solution-requests.json`.
- Supabase schema/RLS/realtime setup is in `supabase/projects.sql`; update it when project, vote, comment, or publication-event tables change.
- Realtime UI subscribes directly from the browser with the Supabase anon key via `src/lib/projects/browser-supabase.ts`; keep public subscriptions aligned with the event tables in `supabase/projects.sql`.

## UI Conventions

- Styling is Tailwind CSS v4 through `src/app/globals.css`, with shadcn config in `components.json` (`style: base-lyra`, Phosphor icons, aliases under `@/`).
- The visual language is a black-background, mono-font Build4Venezuela poster style using assets/fonts in `public/BFV`; preserve that before introducing generic shadcn-looking layouts.
