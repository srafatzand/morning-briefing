'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SAMPLE_SECTIONS = [
  {
    topic: 'AI & Tech',
    context: null,
    stories: [
      {
        headline: 'OpenAI Releases GPT-5 With Native Reasoning and 1M Token Context',
        summary: ['OpenAI has released GPT-5, its most capable model to date, featuring native chain-of-thought reasoning and a one-million token context window. The model outperforms all previous benchmarks on coding, math, and scientific reasoning tasks.\n\nThe release signals a major shift in how large language models handle complex multi-step problems, with the reasoning traces now visible to developers via the API.\n\nFor builders at the intersection of tech and medicine, this opens up new possibilities for analyzing full patient histories, entire clinical trial datasets, or lengthy regulatory filings in a single pass.'],
        sources: ['https://openai.com', 'https://techcrunch.com'],
        imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&q=80',
      },
      {
        headline: 'Nvidia Unveils Blackwell Ultra GPU Architecture at GTC 2026',
        summary: ['Nvidia CEO Jensen Huang unveiled the Blackwell Ultra architecture at GTC 2026, delivering 4x the inference throughput of the previous generation. The chips are already in production at major cloud providers.\n\nThe announcement underscores Nvidia\'s continued dominance in AI infrastructure, with the new architecture specifically optimized for mixture-of-experts models.\n\nStartups building AI-native healthcare tools will benefit directly — faster inference means real-time clinical decision support becomes economically viable at scale.'],
        sources: ['https://nvidia.com'],
        imageUrl: null,
      },
    ],
  },
  {
    topic: 'Biotech & Medicine',
    context: null,
    stories: [
      {
        headline: 'CRISPR Therapy Shows 94% Remission Rate in Sickle Cell Trial',
        summary: ['A landmark NEJM study reports a 94% complete remission rate in sickle cell disease patients treated with the CRISPR-based therapy exa-cel after 24 months of follow-up. All 44 trial participants remain free of vaso-occlusive crises.\n\nThe therapy works by reactivating fetal hemoglobin production, compensating for the defective adult hemoglobin that causes sickle cell. This approach bypasses the need to correct the mutation directly.\n\nThis is the clearest proof yet that gene editing can cure a monogenic disease — expect accelerated FDA review timelines for similar therapies targeting other blood disorders.'],
        sources: ['https://nejm.org', 'https://nature.com'],
        imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=450&fit=crop&q=80',
      },
    ],
  },
  {
    topic: 'Geopolitics',
    context: 'The world enters 2026 amid unprecedented military conflicts across multiple theaters, with wars in Iran/Middle East, Ukraine, Venezuela, Myanmar, and Sudan creating a fragmented global order. US-China great power competition intensifies as both nations prioritize national security over traditional economic cooperation.',
    stories: [
      {
        headline: 'Trump Announces 104% Tariffs on All Chinese Goods Effective Wednesday',
        summary: ['President Trump signed an executive order imposing 104% tariffs on all Chinese imports, effective Wednesday, escalating the ongoing trade war to unprecedented levels. Markets fell sharply on the news.\n\nThe move follows China\'s retaliatory tariffs of 34% on US goods last week. Economists warn the combined effect could shave 1.5 percentage points off US GDP growth in 2026.\n\nWatch for China\'s response — currency devaluation and rare earth export restrictions are the two most asymmetric tools Beijing has yet to deploy.'],
        sources: ['https://reuters.com', 'https://wsj.com'],
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop&q=80',
      },
    ],
  },
  {
    topic: 'Iran News',
    context: 'Iran faces simultaneous pressure from US maximum pressure sanctions reimposed in January 2026 and a fragile domestic economy with 45% inflation. Nuclear talks remain stalled as Iran\'s uranium enrichment reaches 84% purity — just below weapons-grade.',
    stories: [
      {
        headline: 'Iran and US Hold First Direct Nuclear Talks in Oman Since 2022',
        summary: ['Senior Iranian and American diplomats met in Muscat for the first direct bilateral nuclear talks in four years, according to Reuters. No agreement was reached but both sides described the atmosphere as "constructive."\n\nThe talks center on a potential freeze of Iran\'s enrichment program in exchange for partial sanctions relief — a narrower deal than the 2015 JCPOA. European powers were not at the table.\n\nAny deal faces fierce domestic opposition in both countries, but the talks themselves signal that back-channel communication has been ongoing despite public hostility.'],
        sources: ['https://reuters.com', 'https://bbc.com'],
        imageUrl: null,
      },
    ],
  },
];

const FONT = "'JetBrains Mono', ui-monospace, monospace";
const BG = '#0a0a0a';
const TEXT = '#ece9e4';
const MUTED = '#888';
const DIM = '#444';
const BORDER = '#1e1e1e';
const CARD_BG = '#111';

// ─── Option A: Expandable Grid Cards ────────────────────────────────────────

function OptionA() {
  type StoryWithTopic = typeof SAMPLE_SECTIONS[0]['stories'][0] & { topic: string };
  const [selected, setSelected] = useState<StoryWithTopic | null>(null);

  const allStories: Array<typeof SAMPLE_SECTIONS[0]['stories'][0] & { topic: string }> = SAMPLE_SECTIONS.flatMap((s) =>
    s.stories.map((st) => ({ ...st, topic: s.topic }))
  );

  return (
    <div style={{ fontFamily: FONT, color: TEXT }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {allStories.map((story, i) => (
          <motion.article
            key={i}
            onClick={() => setSelected(story)}
            whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* Image / Placeholder */}
            <div style={{ height: '160px', overflow: 'hidden', position: 'relative', background: '#161616' }}>
              {story.imageUrl ? (
                <img src={story.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #141414, #1a1a1a)' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
              <span style={{
                position: 'absolute', bottom: '10px', left: '12px',
                fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#aaa', fontFamily: FONT,
              }}>
                {story.topic}
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.45, margin: 0, color: TEXT }}>
                {story.headline}
              </h3>
              <p style={{ fontSize: '11px', color: MUTED, margin: '10px 0 0', lineHeight: 1.6 }}>
                {story.summary[0].split('\n\n')[0].slice(0, 100)}…
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 50 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              style={{
                position: 'fixed', inset: '32px', maxWidth: '720px', margin: '0 auto',
                background: '#0f0f0f', border: `1px solid #2a2a2a`,
                overflow: 'hidden auto', zIndex: 51, fontFamily: FONT,
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: '#1a1a1a', border: `1px solid ${BORDER}`, color: TEXT, width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              >
                <X size={14} />
              </button>

              {selected.imageUrl && (
                <img src={selected.imageUrl} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover', opacity: 0.7 }} />
              )}

              <div style={{ padding: '32px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, margin: '0 0 12px' }}>{selected.topic}</p>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: TEXT, lineHeight: 1.35, margin: '0 0 24px' }}>{selected.headline}</h2>
                {selected.summary[0].split('\n\n').map((para, i) => (
                  <p key={i} style={{ fontSize: '13px', color: '#c0bdb8', lineHeight: 1.8, margin: '0 0 16px' }}>{para}</p>
                ))}
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  {selected.sources.map((s, i) => (
                    <span key={i} style={{ fontSize: '11px', color: DIM }}>[{i + 1}]</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Option B: Section Hero Cards ───────────────────────────────────────────

function OptionB() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {SAMPLE_SECTIONS.map((section) => {
        const isOpen = expanded === section.topic;
        const heroImage = section.stories.find((s) => s.imageUrl)?.imageUrl;

        return (
          <motion.div
            key={section.topic}
            layout
            onClick={() => setExpanded(isOpen ? null : section.topic)}
            style={{
              background: CARD_BG,
              border: `1px solid ${isOpen ? '#2a2a2a' : BORDER}`,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', gap: '0', minHeight: isOpen ? '0' : '120px' }}>
              {/* Left accent + numbering */}
              <div style={{ width: '4px', background: isOpen ? '#444' : '#1e1e1e', flexShrink: 0, transition: 'background 0.3s' }} />

              {/* Text block */}
              <div style={{ flex: 1, padding: '20px 20px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px', fontFamily: FONT }}>{section.topic}</p>
                  <span style={{ fontSize: '11px', color: DIM, transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.25s' }}>+</span>
                </div>

                {section.context && !isOpen && (
                  <p style={{ fontSize: '12px', color: '#777', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 12px' }}>
                    {section.context.slice(0, 120)}…
                  </p>
                )}

                {!isOpen && section.stories.map((st, i) => (
                  <p key={i} style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.45, margin: '4px 0 0', fontWeight: 500 }}>
                    — {st.headline}
                  </p>
                ))}
              </div>

              {/* Right image strip */}
              {heroImage && !isOpen && (
                <div style={{ width: '100px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={heroImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                </div>
              )}
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ overflow: 'hidden', borderTop: `1px solid ${BORDER}` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ padding: '24px 24px 24px 20px' }}>
                    {section.context && (
                      <p style={{ fontSize: '12px', color: '#b8b5b0', fontStyle: 'italic', borderLeft: `1px solid #2a2a2a`, paddingLeft: '14px', lineHeight: 1.7, margin: '0 0 24px' }}>
                        {section.context}
                      </p>
                    )}
                    {section.stories.map((story, i) => (
                      <div key={i} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: i < section.stories.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        {story.imageUrl && (
                          <img src={story.imageUrl} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', marginBottom: '16px', opacity: 0.75 }} />
                        )}
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: TEXT, lineHeight: 1.4, margin: '0 0 12px' }}>{story.headline}</h3>
                        {story.summary[0].split('\n\n').map((para, j) => (
                          <p key={j} style={{ fontSize: '12px', color: '#c0bdb8', lineHeight: 1.75, margin: '0 0 10px' }}>{para}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Option C: Horizontal Newspaper Cards ───────────────────────────────────

function OptionC() {
  return (
    <div style={{ fontFamily: FONT }}>
      {SAMPLE_SECTIONS.map((section, si) => (
        <div key={section.topic} style={{ marginBottom: '40px' }}>
          {/* Section divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', color: DIM, letterSpacing: '0.15em' }}>{String(si + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, fontWeight: 600 }}>{section.topic}</span>
            <div style={{ flex: 1, height: '1px', background: BORDER }} />
          </div>

          {section.context && (
            <p style={{ fontSize: '12px', color: '#999', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 16px', paddingLeft: '28px', borderLeft: `1px solid #2a2a2a` }}>
              {section.context}
            </p>
          )}

          {/* Story cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {section.stories.map((story, i) => (
              <motion.div
                key={i}
                whileHover={{ backgroundColor: '#131313' }}
                style={{ display: 'flex', gap: '0', border: `1px solid ${BORDER}`, background: CARD_BG, transition: 'background 0.15s' }}
              >
                {/* Left: image or numbered badge */}
                <div style={{ width: '120px', flexShrink: 0, minHeight: '100px', overflow: 'hidden', position: 'relative' }}>
                  {story.imageUrl ? (
                    <img src={story.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#151515', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '28px', fontWeight: 700, color: '#222', letterSpacing: '-0.05em' }}>{si + 1}.{i + 1}</span>
                    </div>
                  )}
                </div>

                {/* Right: text */}
                <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: TEXT, lineHeight: 1.45, margin: '0 0 10px' }}>{story.headline}</h3>
                    <p style={{ fontSize: '12px', color: '#b0aead', lineHeight: 1.7, margin: 0 }}>
                      {story.summary[0].split('\n\n')[0].slice(0, 160)}…
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    {story.sources.map((_, j) => (
                      <span key={j} style={{ fontSize: '10px', color: DIM }}>[{j + 1}]</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PreviewCards() {
  const [active, setActive] = useState<'A' | 'B' | 'C'>('A');

  const tabs = [
    { id: 'A' as const, label: 'A — Expandable Grid Cards' },
    { id: 'B' as const, label: 'B — Section Hero Cards' },
    { id: 'C' as const, label: 'C — Horizontal Newspaper' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: FONT, color: TEXT }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(8px)', zIndex: 40 }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, margin: 0 }}>Layout Preview</p>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                fontFamily: FONT,
                fontSize: '11px',
                letterSpacing: '0.1em',
                padding: '6px 16px',
                border: `1px solid ${active === tab.id ? '#444' : BORDER}`,
                background: active === tab.id ? '#1a1a1a' : 'transparent',
                color: active === tab.id ? TEXT : MUTED,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: DIM, margin: 0 }}>Tell Claude A, B, or C</p>
      </div>

      {/* Description bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '12px 40px', background: '#0d0d0d' }}>
        {active === 'A' && <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>Cards in a responsive grid. Click any card to expand into a full modal with the complete story.</p>}
        {active === 'B' && <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>Each section is a card. Click to expand and reveal all stories and context within that section.</p>}
        {active === 'C' && <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>Horizontal cards — image left, text right. All content visible at once, no modals. Newspaper digest feel.</p>}
      </div>

      {/* Preview area */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Simulated app header */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: '24px', marginBottom: '36px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#666', margin: '0 0 8px' }}>Morning Briefing</p>
          <h1 style={{ fontSize: '36px', fontWeight: 600, color: TEXT, margin: '0 0 8px', lineHeight: 1.2 }}>Your Daily Brief</h1>
          <p style={{ fontSize: '13px', color: MUTED, margin: 0 }}>Tuesday, April 7, 2026 &nbsp;·&nbsp; ~9 min read</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {active === 'A' && <OptionA />}
            {active === 'B' && <OptionB />}
            {active === 'C' && <OptionC />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
