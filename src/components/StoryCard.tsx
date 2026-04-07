import type { Story } from '@/types';
import type { ReactNode } from 'react';

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
        className="underline underline-offset-2 text-[#aaa] hover:text-[#ece9e4] transition-colors"
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
    <article className="py-7 border-b border-[#1a1a1a] last:border-0">
      <h3 className="text-base font-semibold leading-snug mb-3 text-[#ece9e4]">
        {story.headline}
      </h3>
      {story.imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={story.imageUrl}
          alt={story.headline}
          loading="lazy"
          className="w-full object-cover max-h-72 mb-4 opacity-80"
        />
      )}
      <div className="space-y-3">
        {getParagraphs(story.summary).map((para, i) => (
          <p key={i} className="text-[#c0bdb8] text-sm leading-relaxed">
            {renderSummary(para)}
          </p>
        ))}
      </div>
      {story.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {story.sources.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
            >
              [{i + 1}]
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
