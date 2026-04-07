import type { Section } from '@/types';
import { StoryCard } from './StoryCard';

function slugify(topic: string) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

interface Props {
  section: Section;
  index: number;
  emoji: string;
}

export function TopicSection({ section, index, emoji }: Props) {
  return (
    <section id={slugify(section.topic)} className="mb-16 scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-xs text-[#666] font-light tabular-nums w-6 shrink-0">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="text-base font-semibold text-[#ece9e4] tracking-wide uppercase">
          {section.topic}
        </h2>
      </div>
      {section.context && (
        <p className="text-sm text-[#b8b5b0] italic leading-relaxed mb-6 pl-9 border-l border-[#2a2a2a]">
          {section.context}
        </p>
      )}
      <div className="pl-9">
        {section.stories.map((story) => <StoryCard key={story.headline} story={story} />)}
      </div>
    </section>
  );
}
