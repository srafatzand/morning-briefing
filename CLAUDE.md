# CLAUDE.md

## Project

Personal PIN-gated daily news briefing app. Vercel Cron calls `/api/generate` nightly → Claude API with web search → structured briefing stored in Neon PostgreSQL → read at `/today`.

## Commands
```bash
npm run dev
npm run build        # must exit 0 with zero TS errors
npm run generate     # manually generate today's briefing (~30–60s)
npm run generate 2026-03-31
npm run db:push
npm run db:studio
```

## Non-Obvious Architecture Decisions

- **Middleware** (`src/middleware.ts`) blocks all routes except `/login`, `/api/auth/*`, `/_next/*`, `favicon.ico`. Do not add new public routes without updating the matcher.
- **Generation is idempotent** — `/api/generate` returns 409 if today's briefing already exists. Never remove this check.
- **`/today` empty state** — when no briefing exists for today, render a "coming soon" message. Do not throw or redirect.
- **`/archive/[date]`** — call `notFound()` for unknown dates. Do not render an empty state.
- **Server/Client split** — most pages are Server Components that query the DB directly. Only `PinForm.tsx` and `Header.tsx` are `'use client'`. Do not add `'use client'` without a clear reason.

## Claude API — Do Not Change

- Model: `claude-sonnet-4-20250514`
- Tool: `web_search_20250305`, `max_uses: 25`
- The response contains multiple content blocks. Always find the **last** `type: 'text'` block — never assume it's `content[0]`.

## Reference Docs

Read these only when working on the relevant area:

- `docs/PLAN.md` — full phase-by-phase implementation plan with task checklists
- `docs/content-spec.md` — topic list, story counts, source allow/deny rules
- `docs/auth-spec.md` — PIN flow, cookie spec, JWT details
- `docs/env-vars.md` — all required environment variables
- `docs/deploy.md` — Vercel cron config, first-deploy steps, manual curl commands