# Deployment

## Vercel Cron

Configured in `vercel.json`: `0 7 * * *` (7:00 UTC = 3:00am EST / 2:00am EDT).
Verify after deploy: Vercel Dashboard → Functions → Cron Jobs.

## First Deploy Steps

1. Push to GitHub → Vercel → New Project → Import repo
2. Add all 5 env vars in Vercel project settings
3. Deploy
4. Run `npm run db:push` against production `DATABASE_URL`
5. Manually trigger first generation:
```bash
curl -X POST https://YOUR_APP.vercel.app/api/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Testing `/api/generate` Locally
```bash
# Should return 401
curl -X POST http://localhost:3000/api/generate

# Should return 200 or 409
curl -X POST http://localhost:3000/api/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```