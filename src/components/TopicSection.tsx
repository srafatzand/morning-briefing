import type { Section } from '@/types';
import { StoryCard } from './StoryCard';

export function TopicSection({ section }: { section: Section }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4 pb-2 border-b border-neutral-200">
        {section.topic}
      </h2>
      {section.stories.map((story) => <StoryCard key={story.headline} story={story} />)}
    </section>
  );
}
