import type { BriefingContent } from '@/types';
import { BriefingGrid } from './BriefingGrid';

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
      <header className="mb-14 pb-10 border-b border-[#1e1e1e]">
        <p className="text-xs tracking-[0.25em] uppercase text-[#777] mb-4">Morning Briefing</p>
        <h1 className="text-5xl font-semibold leading-tight text-[#ece9e4] mb-4">Your Daily Brief</h1>
        <p className="text-sm text-[#888] tracking-wide">
          {formatted} &nbsp;·&nbsp; ~{readMinutes} min read
        </p>
      </header>

      <BriefingGrid content={content} />
    </div>
  );
}
