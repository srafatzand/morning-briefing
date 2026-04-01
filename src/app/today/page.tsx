export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { briefings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { BriefingView } from '@/components/BriefingView';
import { Header } from '@/components/Header';
import type { BriefingContent } from '@/types';

export default async function TodayPage() {
  const today = new Date().toISOString().split('T')[0];
  const briefing = await db.query.briefings.findFirst({
    where: eq(briefings.date, today),
  });

  return (
    <>
      <Header />
      {briefing ? (
        <BriefingView
          content={briefing.content as BriefingContent}
          date={briefing.date}
          generatedAt={briefing.generatedAt}
        />
      ) : (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="font-serif text-2xl text-neutral-400">Today&apos;s briefing is being prepared.</p>
          <p className="text-sm text-neutral-400 mt-2">Check back after 3am EST.</p>
        </div>
      )}
    </>
  );
}
