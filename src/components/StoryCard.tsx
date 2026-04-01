import type { Story } from '@/types';

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="py-5 border-b border-neutral-200 last:border-0">
      <h3 className="font-serif text-lg font-semibold leading-snug mb-2">
        {story.headline}
      </h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{story.summary}</p>
      {story.sources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {story.sources.map((src, i) => (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-neutral-700 underline underline-offset-2 transition-colors"
            >
              Source {i + 1}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
