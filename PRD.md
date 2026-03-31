# Product Requirements Document — Morning Briefing

**Version:** 1.0
**Date:** 2026-03-31
**Author:** Samyar Rafatzand
**Status:** Approved

---

## 1. Overview

Morning Briefing is a personal, password-protected web application that delivers a daily AI-generated news briefing. Every night, an automated scheduler calls the Claude API (with live web search) to compile a fresh briefing across a curated set of topics. The owner visits the site in the morning, enters a 4-digit PIN, and reads the briefing. All past briefings are archived and browsable by date.

This is a single-user personal tool — there are no public-facing pages, no sign-up flow, and no user management.

---

## 2. Goals & Non-Goals

### Goals
- Deliver a high-quality, AI-curated daily briefing with zero manual effort
- Enforce a minimal PIN gate to keep the site private
- Provide a clean, distraction-free reading experience (editorial/news aesthetic)
- Store all past briefings in a persistent archive
- Run fully automatically once deployed — no daily intervention required

### Non-Goals
- Multi-user support or account management
- Real-time updates or push notifications
- Native mobile app (mobile-responsive web is sufficient)
- Monetization or social sharing features
- Custom topic configuration via UI (topics are defined in code)

---

## 3. User

**Single user:** 19-year-old pre-med CS student in Montreal with entrepreneurial interests at the intersection of technology, medicine, and startups.

**Usage pattern:**
- Visits the site once per morning (typically after 7am EST)
- Reads through the briefing in ~6–8 minutes
- Occasionally browses the archive for a past date

**Lens for content curation:** Stories should be selected and summarized through the perspective of someone building at the intersection of tech, medicine, and startups — prioritizing what is genuinely actionable, intellectually stimulating, or directly relevant to that domain.

---

## 4. Content Specification

### 4.1 Topics & Story Count

| Topic | Stories |
|---|---|
| AI & Tech | 2 |
| Biotech & Medicine | 2 |
| Geopolitics | 2 |
| Iran News | 1 |
| Canadian / Quebec News | 1 |
| MMA & Combat Sports | 1 |
| Claude / Anthropic News | 1 |
| **Total** | **10** |

### 4.2 Story Format

Each story consists of:
- **Headline** — concise, factual, mirrors news outlet style
- **Summary** — 4–6 sentences in plain, direct language. Written through the user's lens (pre-med CS student / builder). No jargon unless explained.
- **Sources** — 1–3 URLs pointing to the primary source articles used

### 4.3 Source Rules

Source restrictions vary by topic:

**Geopolitics & Iran News — restricted sources only:**
- Reuters, Al Jazeera, New York Times, Washington Post, BBC, CBC, The Economist
- For geopolitics, include both Western perspectives (Reuters, BBC, NYT, WaPo, The Economist) and non-Western perspectives (Al Jazeera) where available

**AI & Tech, Biotech & Medicine — flexible, prioritize reputable outlets:**
- General news: Reuters, NYT, WaPo, BBC, The Economist, etc.
- Scientific/academic: Nature, Science, JAMA, The New England Journal of Medicine (NEJM), and equivalent peer-reviewed journals

**All topics — prohibited sources:**
- Twitter / X, Reddit, Substack, personal blogs, unaccredited or anonymous sources

### 4.4 Freshness Requirement

All stories must be from the last 48 hours — genuinely newsworthy on the day of generation. The briefing generator explicitly passes today's date and instructs Claude to prioritize recency.

---

## 5. Functional Requirements

### 5.1 Authentication

| ID | Requirement |
|---|---|
| AUTH-01 | All pages and API routes (except `/login` and `/api/auth/*`) are blocked without a valid session |
| AUTH-02 | A 4-digit PIN stored in an environment variable (`PIN_CODE`) is the sole authentication mechanism |
| AUTH-03 | On successful PIN entry, a signed `httpOnly` JWT cookie (`briefing_session`) is set with a 24-hour TTL |
| AUTH-04 | On failed PIN entry, an error message is shown and the PIN input is cleared |
| AUTH-05 | A logout action clears the session cookie and redirects to `/login` |
| AUTH-06 | The PIN is never stored in the database or logged |

### 5.2 Briefing Display

| ID | Requirement |
|---|---|
| BRIEF-01 | The `/today` page displays the most recently generated briefing for the current date |
| BRIEF-02 | If no briefing exists for today, a "coming soon" message is displayed |
| BRIEF-03 | Each briefing is rendered with: a date header, total story count, and sections per topic |
| BRIEF-04 | Each story shows its headline, summary, and clickable source links (open in new tab) |
| BRIEF-05 | Typography uses a serif font for headlines and sans-serif for body text (editorial aesthetic) |

### 5.3 Archive

| ID | Requirement |
|---|---|
| ARCH-01 | `/archive` displays a list of all past briefing dates, sorted newest-first |
| ARCH-02 | Clicking a date navigates to `/archive/[date]` which renders the full briefing for that date |
| ARCH-03 | Navigating to a date with no briefing returns a 404 |

### 5.4 Briefing Generation

| ID | Requirement |
|---|---|
| GEN-01 | A scheduled job runs nightly at 7:00 UTC (3:00am EST / 2:00am EDT) |
| GEN-02 | The scheduler calls `POST /api/generate` with a `CRON_SECRET` bearer token |
| GEN-03 | The endpoint is idempotent — if a briefing for today already exists, it returns 409 and does nothing |
| GEN-04 | The briefing generator uses `claude-sonnet-4-20250514` with the `web_search_20250305` tool (max 25 searches) |
| GEN-05 | The Claude system prompt includes today's date, topic/count requirements, source rules, and required JSON output format |
| GEN-06 | The generated JSON is validated for correct structure before being saved |
| GEN-07 | The briefing is stored in the database with: date, model used, structured content (JSONB), and generation duration |
| GEN-08 | A manual trigger script (`npm run generate`) allows on-demand generation during development |

### 5.5 Navigation

| ID | Requirement |
|---|---|
| NAV-01 | A sticky header is present on all authenticated pages with: site title (links to `/today`), archive link, logout button |
| NAV-02 | The root path (`/`) redirects to `/today` |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Pages load in under 2 seconds on a standard connection. Briefing generation (background job) may take up to 60 seconds — this does not affect page load. |
| **Security** | Session cookie is `httpOnly`, `Secure` (production), `SameSite: lax`. JWT signed with a secret env var. CRON_SECRET never exposed client-side. |
| **Reliability** | Vercel Cron retries on failure. Generation is idempotent so retries are safe. |
| **Maintainability** | Code is organized by responsibility (lib/, components/, app/). Each file has one clear purpose. Comments explain non-obvious logic. |
| **Portability** | All secrets in environment variables. `.env.example` documents all required vars. No hardcoded secrets anywhere. |
| **Deployability** | Deployable to Vercel with a single `git push`. No infrastructure management required beyond Neon DB setup. |

---

## 7. Technical Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Drizzle ORM |
| Auth | Custom PIN + `jose` (JWT) |
| AI | Anthropic SDK + `web_search_20250305` tool |
| Scheduler | Vercel Cron Jobs |
| Deployment | Vercel |

### Database Schema

One table: `briefings`

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL | Primary key |
| `date` | TEXT | YYYY-MM-DD, unique |
| `generated_at` | TIMESTAMP | Auto-set on insert |
| `model_used` | TEXT | e.g. `claude-sonnet-4-20250514` |
| `content` | JSONB | Structured briefing (sections → stories) |
| `duration_ms` | INTEGER | Generation time in milliseconds |

### Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `PIN_CODE` | 4-digit login PIN |
| `JWT_SECRET` | 32+ char random secret for signing cookies |
| `CRON_SECRET` | 32+ char random secret to protect `/api/generate` |

---

## 8. Pages & Routes

| Path | Type | Description |
|---|---|---|
| `/` | Redirect | → `/today` |
| `/login` | Page | PIN entry form |
| `/today` | Page | Today's briefing |
| `/archive` | Page | List of all past dates |
| `/archive/[date]` | Page | Briefing for a specific date |
| `/api/auth/login` | API | POST — verify PIN, set cookie |
| `/api/auth/logout` | API | POST — clear cookie |
| `/api/briefings` | API | GET — list all briefing metadata |
| `/api/briefings/[date]` | API | GET — fetch full briefing by date |
| `/api/generate` | API | POST — trigger generation (cron-protected) |

---

## 9. Build Phases

| Phase | Scope | Deliverable |
|---|---|---|
| 1 | Foundation | Next.js scaffold, Neon DB, Drizzle schema, TypeScript types |
| 2 | Authentication | PIN login, JWT cookie, middleware gate |
| 3 | Briefing Generation | Claude API integration, parser, `/api/generate`, manual script |
| 4 | Core UI | Reading experience: layout, typography, BriefingView, today page |
| 5 | Archive | Archive list page, date detail page |
| 6 | Scheduler & Deployment | `vercel.json` cron, Vercel deploy, end-to-end verification |

Each phase ends with a code review before the next phase begins.

---

## 10. Acceptance Criteria

The product is complete when all of the following are true in the production deployment:

- [ ] Unauthenticated requests to all routes redirect to `/login`
- [ ] Correct PIN logs in; wrong PIN shows an error without exposing the PIN
- [ ] `/today` renders a full briefing with all 7 sections after a generation run
- [ ] `/today` shows a "coming soon" message when no briefing exists for today
- [ ] `/archive` lists all past briefings, newest first
- [ ] Clicking a date in `/archive` renders the full briefing for that date
- [ ] An unknown date at `/archive/[date]` returns a 404
- [ ] Logout clears the session and blocks subsequent requests
- [ ] `/api/generate` returns 401 without the correct `CRON_SECRET`
- [ ] `/api/generate` returns 409 (not re-generating) if called twice on the same day
- [ ] Vercel Cron Job appears in the Vercel dashboard with schedule `0 7 * * *`
- [ ] `npm run build` exits 0 with zero TypeScript errors
