import { NextRequest, NextResponse } from 'next/server';
import { generateBriefing } from '@/lib/briefing-generator';
import { db } from '@/lib/db';
import { briefings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function handle(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  const existing = await db.query.briefings.findFirst({
    where: eq(briefings.date, today),
  });

  if (existing) {
    return NextResponse.json({ message: 'Already generated', date: today }, { status: 409 });
  }

  const briefing = await generateBriefing(today);
  return NextResponse.json({ success: true, date: briefing.date });
}

// GET: called by Vercel Cron (always sends GET)
// POST: called manually (curl, scripts)
export const GET = handle;
export const POST = handle;
