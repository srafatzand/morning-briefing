import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { briefings } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const all = await db
    .select({ id: briefings.id, date: briefings.date, generatedAt: briefings.generatedAt })
    .from(briefings)
    .orderBy(desc(briefings.date));
  return NextResponse.json(all);
}
