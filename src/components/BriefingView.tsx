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
    <div className="max-w-[90rem] mx-auto px-8 py-14">
      <header className="mb-12 pb-10 border-b border-[#1e1e1e]">
        <p className="text-xs tracking-[0.25em] uppercase text-[#777] mb-4">
          Morning Briefing
        </p>
        <h1 className="text-5xl font-semibold leading-tight text-[#ece9e4] mb-4">
          Your Daily Brief
        </h1>
        <p className="text-sm text-[#888] tracking-wide">
          {formatted} &nbsp;·&nbsp; ~{readMinutes} min read
        </p>
      </header>

      <div className="flex gap-16">
        {/* Sticky sidebar nav */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#666] mb-4">
              Sections
            </p>
            <nav className="flex flex-col gap-1">
              {content.sections.map((section) => (
                <a
                  key={section.topic}
                  href={`#${slugify(section.topic)}`}
                  className="text-xs text-[#888] hover:text-[#ece9e4] transition-colors py-1 leading-tight"
                >
                  {section.topic}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
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
    </div>
  );
}
