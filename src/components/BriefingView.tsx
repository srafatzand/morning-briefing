import type { BriefingContent } from '@/types';
import { TopicSection } from './TopicSection';

const SECTION_EMOJIS: Record<string, string> = {
  'AI & Tech': '🤖',
  'Biotech & Medicine': '🧬',
  'Geopolitics': '🌍',
  'Iran News': '🇮🇷',
  'Canadian / Quebec News': '🍁',
  'MMA & Combat Sports': '🥊',
  'Claude / Anthropic News': '✦',
};

function slugify(topic: string) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

interface Props {
  content: BriefingContent;
  date: string;
}

export function BriefingView({ content, date }: Props) {
  const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const wordCount = content.sections.reduce((total, s) => {
    const sectionWords = (s.context ?? '').split(/\s+/).length;
    const storyWords = s.stories.reduce((n, story) =>
      n + story.headline.split(/\s+/).length + story.summary.split(/\s+/).length, 0);
    return total + sectionWords + storyWords;
  }, 0);
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">
          Morning Briefing
        </p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-neutral-900 mb-3">
          Your Daily Morning Brief
        </h1>
        <p className="text-sm text-neutral-500">
          {formatted} · Est. read time: ~{readMinutes} minutes
        </p>
        <div className="mt-5 border-b-2 border-blue-500" />
      </header>

      <nav className="mb-10 p-4 rounded-lg border border-blue-100 bg-blue-50">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">
          Jump to Section
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {content.sections.map((section) => {
            const emoji = SECTION_EMOJIS[section.topic];
            return (
              <a
                key={section.topic}
                href={`#${slugify(section.topic)}`}
                className="text-sm text-blue-700 hover:text-blue-900 transition-colors"
              >
                {emoji && <span className="mr-1">{emoji}</span>}
                {section.topic}
              </a>
            );
          })}
        </div>
      </nav>

      <main>
        {content.sections.map((section, i) => (
          <TopicSection
            key={section.topic}
            section={section}
            index={i + 1}
            emoji={SECTION_EMOJIS[section.topic] ?? ''}
          />
        ))}
      </main>
    </div>
  );
}
