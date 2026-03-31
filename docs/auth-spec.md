# Auth Spec

- PIN stored in `PIN_CODE` env var. Never stored in DB or logged.
- Successful login → signed httpOnly JWT cookie: name `briefing_session`, 24h TTL, SameSite: lax, Secure in production.
- `src/lib/auth.ts` — PIN check, JWT sign/verify via `jose`.
- `src/middleware.ts` — verifies cookie on every request; redirects to `/login?from=<path>` on failure.