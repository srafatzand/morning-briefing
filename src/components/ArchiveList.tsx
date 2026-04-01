import Link from 'next/link';

interface Entry { id: number; date: string; generatedAt: Date; }

export function ArchiveList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return <p className="text-neutral-400 text-sm">No archived briefings yet.</p>;
  }
  return (
    <ul className="divide-y divide-neutral-200">
      {entries.map((e) => {
        const label = new Date(e.date + 'T12:00:00').toLocaleDateString('en-CA', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        return (
          <li key={e.id}>
            <Link
              href={`/archive/${e.date}`}
              className="flex items-center justify-between py-4 px-2 -mx-2 rounded hover:bg-neutral-100 transition-colors group"
            >
              <span className="font-serif text-neutral-800 group-hover:text-neutral-900">{label}</span>
              <span className="text-neutral-400 text-sm">→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
