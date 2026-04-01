import type { BriefingContent } from '@/types';
import { TopicSection } from './TopicSection';

interface Props {
  content: BriefingContent;
  date: string;
  generatedAt: Date;
}

export function BriefingView({ content, date, generatedAt }: Props) {
  const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const storyCount = content.sections.reduce((n, s) => n + s.stories.length, 0);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-10 pb-6 border-b-2 border-neutral-900">
        <p className="text-xs tracking-widest uppercase text-neutral-400 mb-2">{formatted}</p>
        <h1 className="font-serif text-4xl font-bold leading-tight">Morning Briefing</h1>
        <p className="text-xs text-neutral-400 mt-3">{storyCount} stories</p>
      </header>
      <main>
        {content.sections.map((section, i) => (
          <TopicSection key={i} section={section} />
        ))}
      </main>
    </div>
  );
}
