'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { BriefingContent, Story } from '@/types';
import type { ReactNode } from 'react';

// ── Topic accent colours (subtle dark tints) ────────────────────────────────
const TOPIC_GRADIENT: Record<string, string> = {
  'AI & Tech':                'linear-gradient(135deg, #0d1117, #111823)',
  'Biotech & Medicine':       'linear-gradient(135deg, #0a110d, #0e1a12)',
  'Geopolitics':              'linear-gradient(135deg, #0f0f13, #141420)',
  'Iran News':                'linear-gradient(135deg, #120e08, #1a1408)',
  'Canadian / Quebec News':   'linear-gradient(135deg, #110b0b, #1a1010)',
  'MMA & Combat Sports':      'linear-gradient(135deg, #110d08, #1a1508)',
  'Claude / Anthropic News':  'linear-gradient(135deg, #0e0c14, #13101f)',
};

// ── Paragraph & link helpers ─────────────────────────────────────────────────
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

function renderParagraph(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-2 text-[#aaa] hover:text-[#ece9e4] transition-colors">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 1 ? parts : text;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface SelectedStory extends Story {
  topic: string;
  context?: string;
}

// ── Compact card ─────────────────────────────────────────────────────────────
function StoryCard({
  story,
  topic,
  index,
  onClick,
}: {
  story: Story;
  topic: string;
  index: number;
  onClick: () => void;
}) {
  const paragraphs = getParagraphs(story.summary);
  const excerpt = paragraphs[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 130);
  const gradient = TOPIC_GRADIENT[topic] ?? 'linear-gradient(135deg, #0f0f0f, #161616)';

  return (
    <motion.article
      onClick={onClick}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      className="border border-[#1e1e1e] bg-[#111] overflow-hidden cursor-pointer group"
    >
      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden" style={{ background: gradient }}>
        {story.imageUrl && (
          <img
            src={story.imageUrl}
            alt={story.headline}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#111] to-transparent" />
        <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.15em] uppercase text-[#999]">
          {topic}
        </span>
        <span className="absolute top-3 right-4 text-[10px] text-[#444]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-[#ece9e4] leading-snug mb-3 group-hover:text-white transition-colors line-clamp-3">
          {story.headline}
        </h3>
        <p className="text-sm text-[#999] leading-relaxed line-clamp-3">
          {excerpt}…
        </p>
        <p className="text-[10px] text-[#444] mt-4 tracking-wide">Read more →</p>
      </div>
    </motion.article>
  );
}

// ── Expanded modal ────────────────────────────────────────────────────────────
function StoryModal({ story, onClose }: { story: SelectedStory; onClose: () => void }) {
  const paragraphs = getParagraphs(story.summary);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed inset-4 md:inset-8 lg:inset-[5vw] bg-[#0f0f0f] border border-[#2a2a2a] overflow-hidden z-50 flex flex-col"
        style={{ maxWidth: '780px', margin: '0 auto' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-[#ece9e4] flex items-center justify-center transition-colors z-10"
        >
          <X size={14} />
        </button>

        <div className="overflow-y-auto flex-1">
          {story.imageUrl && (
            <div className="relative h-56 md:h-72 overflow-hidden shrink-0">
              <img
                src={story.imageUrl}
                alt={story.headline}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
            </div>
          )}

          <div className="p-8 md:p-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#555] mb-4">{story.topic}</p>

            {story.context && (
              <p className="text-xs text-[#b8b5b0] italic border-l border-[#2a2a2a] pl-4 mb-6 leading-relaxed">
                {story.context}
              </p>
            )}

            <h2 className="text-xl md:text-2xl font-semibold text-[#ece9e4] leading-snug mb-8">
              {story.headline}
            </h2>

            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-sm text-[#c0bdb8] leading-[1.85]">
                  {renderParagraph(para)}
                </p>
              ))}
            </div>

            {story.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#1e1e1e] flex gap-4">
                {story.sources.map((src, i) => (
                  <a key={src} href={src} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#555] hover:text-[#999] transition-colors">
                    Source {i + 1} ↗
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main grid ─────────────────────────────────────────────────────────────────
export function BriefingGrid({ content }: { content: BriefingContent }) {
  const [selected, setSelected] = useState<SelectedStory | null>(null);

  let globalIndex = 0;

  return (
    <>
      <div className="space-y-14">
        {content.sections.map((section, si) => (
          <section
            key={section.topic}
            id={section.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
            className="scroll-mt-24"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs text-[#444] tabular-nums">{String(si + 1).padStart(2, '0')}</span>
              <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#888]">{section.topic}</h2>
              <div className="flex-1 h-px bg-[#1a1a1a]" />
            </div>

            {section.context && (
              <p className="text-sm text-[#b8b5b0] italic border-l border-[#2a2a2a] pl-4 mb-6 leading-relaxed">
                {section.context}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.stories.map((story) => {
                const idx = globalIndex++;
                return (
                  <StoryCard
                    key={story.headline}
                    story={story}
                    topic={section.topic}
                    index={idx}
                    onClick={() => setSelected({ ...story, topic: section.topic, context: section.context })}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selected && <StoryModal story={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
