import { db } from '@/lib/db';
import { briefings } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { ArchiveList } from '@/components/ArchiveList';
import { Header } from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const all = await db
    .select({ id: briefings.id, date: briefings.date, generatedAt: briefings.generatedAt })
    .from(briefings)
    .orderBy(desc(briefings.date));
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold mb-8">Archive</h1>
        <ArchiveList entries={all} />
      </div>
    </>
  );
}
