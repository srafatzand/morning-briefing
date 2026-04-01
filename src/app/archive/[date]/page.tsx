import { db } from '@/lib/db';
import { briefings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { BriefingView } from '@/components/BriefingView';
import { Header } from '@/components/Header';
import { notFound } from 'next/navigation';
import type { BriefingContent } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ArchiveDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return notFound();
  const briefing = await db.query.briefings.findFirst({
    where: eq(briefings.date, date),
  });
  if (!briefing) return notFound();
  return (
    <>
      <Header />
      <BriefingView
        content={briefing.content as BriefingContent}
        date={briefing.date}
      />
    </>
  );
}
