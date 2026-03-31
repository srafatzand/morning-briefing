# Environment Variables

All are required. See `.env.example` for the template.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `PIN_CODE` | 4-digit login PIN |
| `JWT_SECRET` | 32+ char random string — signs session cookies |
| `CRON_SECRET` | 32+ char random string — protects `/api/generate` |

Generate secrets: `openssl rand -hex 32`