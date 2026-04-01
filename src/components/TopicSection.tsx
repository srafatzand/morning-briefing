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
    <section id={slugify(section.topic)} className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-2 mb-5 pl-4 border-l-4 border-blue-500">
        {emoji && <span className="text-lg leading-none">{emoji}</span>}
        <h2 className="text-lg font-bold text-blue-700">
          {index}. {section.topic}
        </h2>
      </div>
      {section.context && (
        <p className="text-sm text-neutral-500 italic leading-relaxed mb-5 pb-5 border-b border-neutral-100">
          {section.context}
        </p>
      )}
      {section.stories.map((story) => <StoryCard key={story.headline} story={story} />)}
    </section>
  );
}
