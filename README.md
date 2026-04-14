# Morning Briefing

I built this because reading the news was broken for me in two ways.

**Time.** Finding articles across medicine, tech, and geopolitics every morning meant 20–30 minutes of tab-switching before I even had context on anything.

**Quality.** Misinformation is everywhere. I only wanted to read from reputable, trusted sources.

Every night, Claude searches the web with explicit source constraints, summarizes what actually happened across my personal fields of interest, and stores a structured briefing in a database. By the time I wake up, I have everything I want to read, without the stuff I didn't ask for.

Built with Next.js 16, TypeScript, Tailwind CSS v4, Drizzle ORM, PostgreSQL (Neon), and the Anthropic SDK.

---

## What It Does

- **Nightly generation** — a Vercel Cron Job runs at 3am EST, calling Claude with web search to compile fresh stories
- **PIN-protected** — a 4-digit PIN gates the entire site; no accounts, no sign-up
- **Designed reading experience** — dark editorial UI with news cards, hero images, and a dot-grid radial glow background
- **Archive** — all past briefings are stored and browsable by date

**Topics covered:** AI & Tech · Biotech & Medicine · Geopolitics · Iran News · Local Quebec News · MMA & Combat Sports · Claude/Anthropic News

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) account (free tier) for PostgreSQL
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd morning-briefing
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
DATABASE_URL=        # Neon connection string (from Neon dashboard → Connection Details)
ANTHROPIC_API_KEY=   # Your Anthropic API key
PIN_CODE=            # Your chosen 4-digit PIN (e.g. 1234)
JWT_SECRET=          # Run: openssl rand -hex 32
CRON_SECRET=         # Run: openssl rand -hex 32
```

### 3. Initialize the database

This creates the `briefings` table in your Neon database:

```bash
npm run db:push
```

To visually inspect the database:

```bash
npm run db:studio
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## Generating a Briefing

The site shows a "coming soon" message until a briefing is generated for today. Run this to generate one manually:

```bash
npm run generate
```

This calls the Claude API with web search and stores the result in your database. It takes ~30–60 seconds. You can also pass a specific date:

```bash
npm run generate 2026-03-30
```

---

## Project Structure

```
src/
├── proxy.ts                   # PIN gate — runs before every request
├── app/
│   ├── login/page.tsx         # PIN entry page
│   ├── today/page.tsx         # Today's briefing
│   ├── archive/               # Archive list + date detail pages
│   └── api/                   # Auth, briefings, and generate endpoints
├── components/                # UI components (PinForm, BriefingView, etc.)
├── lib/
│   ├── db/                    # Drizzle client + schema
│   ├── auth.ts                # PIN check, JWT cookie helpers
│   ├── briefing-generator.ts  # Claude API call + prompt
│   └── briefing-parser.ts     # Parse Claude JSON output
└── types/index.ts             # Shared TypeScript types
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `PIN_CODE` | 4-digit login PIN |
| `JWT_SECRET` | Random 32+ char string for signing session cookies |
| `CRON_SECRET` | Random 32+ char string to protect the `/api/generate` endpoint |

---

## Deployment (Vercel)

### First deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all 5 environment variables in Vercel project settings (Settings → Environment Variables)
4. Deploy

### After deploying

Run `npm run db:push` once more against your production `DATABASE_URL` to ensure the table exists in Neon, then manually trigger the first generation:

```bash
curl -X POST https://YOUR_APP.vercel.app/api/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Cron schedule

The nightly job is configured in `vercel.json`:

```json
{ "crons": [{ "path": "/api/generate", "schedule": "0 7 * * *" }] }
```

`0 7 * * *` = 7:00am UTC = 3:00am EST / 2:00am EDT.

Verify it's active in: Vercel Dashboard → your project → Functions → Cron Jobs.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run generate` | Manually generate today's briefing |
| `npm run generate [date]` | Generate for a specific date (YYYY-MM-DD) |
| `npm run db:push` | Apply schema to database |
| `npm run db:studio` | Open Drizzle Studio to inspect DB |
