import type { Story } from '@/types';
import type { ReactNode } from 'react';

// Split summary into paragraphs. Uses explicit \n\n breaks if present,
// otherwise groups sentences into chunks of 3 for older DB entries.
function getParagraphs(text: string): string[] {
  const stripped = text.replace(/<cite[^>]*>/g, '').replace(/<\/cite>/g, '');
  if (stripped.includes('\n\n')) {
    return stripped.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
  }
  const sentences = stripped.match(/[^.!?]+[.!?]+\s*/g) ?? [stripped];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    const chunk = sentences.slice(i, i + 3).join('').trim();
    if (chunk) paragraphs.push(chunk);
  }
  return paragraphs.length > 0 ? paragraphs : [stripped];
}

function renderSummary(text: string): ReactNode {
  // Parse [text](url) markdown links into anchor elements
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
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

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 1 ? parts : text;
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="py-5 border-b border-neutral-200 last:border-0">
      <h3 className="font-serif text-lg font-semibold leading-snug mb-2">
        {story.headline}
      </h3>
      {story.imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={story.imageUrl}
          alt={story.headline}
          loading="lazy"
          className="w-full rounded-lg object-cover max-h-64 mb-3"
        />
      )}
      <div className="space-y-3">
        {getParagraphs(story.summary).map((para, i) => (
          <p key={i} className="text-neutral-600 text-sm leading-relaxed">
            {renderSummary(para)}
          </p>
        ))}
      </div>
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
