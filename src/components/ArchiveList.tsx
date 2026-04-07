import Link from 'next/link';

interface Entry { id: number; date: string; generatedAt: Date; }

export function ArchiveList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return <p className="text-[#444] text-sm">No archived briefings yet.</p>;
  }
  return (
    <ul className="divide-y divide-[#1a1a1a]">
      {entries.map((e) => {
        const label = new Date(e.date + 'T12:00:00').toLocaleDateString('en-CA', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        return (
          <li key={e.id}>
            <Link
              href={`/archive/${e.date}`}
              className="flex items-center justify-between py-4 px-2 -mx-2 transition-colors group"
            >
              <span className="text-sm text-[#555] group-hover:text-[#e0ddd8] transition-colors">{label}</span>
              <span className="text-[#333] text-xs group-hover:text-[#888] transition-colors">→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
