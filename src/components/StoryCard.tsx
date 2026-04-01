import type { Story } from '@/types';
import type { ReactNode } from 'react';

function renderSummary(text: string): ReactNode {
  // Strip <cite index="...">...</cite> wrappers — keep inner text
  const stripped = text.replace(/<cite[^>]*>/g, '').replace(/<\/cite>/g, '');

  // Parse [text](url) markdown links into anchor elements
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(stripped)) !== null) {
    if (match.index > lastIndex) {
      parts.push(stripped.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 text-neutral-700 hover:text-neutral-900 transition-colors"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < stripped.length) {
    parts.push(stripped.slice(lastIndex));
  }

  return parts.length > 1 ? parts : stripped;
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="py-5 border-b border-neutral-200 last:border-0">
      <h3 className="font-serif text-lg font-semibold leading-snug mb-2">
        {story.headline}
      </h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{renderSummary(story.summary)}</p>
      {story.sources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {story.sources.map((src, i) => (
            <a
              key={src}
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
