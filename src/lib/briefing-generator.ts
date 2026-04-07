import Anthropic from '@anthropic-ai/sdk';
import probe from 'probe-image-size';
import { parseBriefingJSON } from './briefing-parser';
import { db } from './db';
import { briefings } from './db/schema';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(date: string): string {
  return `You are a personal news briefing assistant for a 19-year-old pre-med CS student in Montreal with entrepreneurial interests at the intersection of tech, medicine, and startups. Today's date is ${date}.

Generate a daily briefing covering these topics:
- AI & Tech (2 stories)
- Biotech & Medicine (2 stories)
- Geopolitics (2 stories)
- Iran News (1 story)
- Canadian / Quebec News (1 story)
- MMA & Combat Sports (1 story)
- Claude / Anthropic News (1 story)

STRICT SOURCE RULES:
- For geopolitics and Iran news, use ONLY: Reuters, Al Jazeera, New York Times, Washington Post, BBC, CBC, The Economist
- For geopolitics, include both Western (Reuters, BBC, NYT, WaPo, The Economist) and non-Western (Al Jazeera) perspectives where available
- For AI & Tech and Biotech & Medicine, you have more flexibility but prioritize reputable sources, including but not limited to scientific journals like: Nature, Science, JAMA, The New England Journal of Medicine (NEJM)
- Do NOT cite Twitter, Reddit, Substack, blogs, or any unaccredited source

CONTENT RULES:
- Stories must be from the last 48 hours — genuinely newsworthy TODAY
- Filter for relevance to someone building at the intersection of tech, medicine, startups
- For Claude/Anthropic: search specifically for Anthropic announcements or research
- Do NOT include <cite> tags or any XML/HTML markup in text fields — plain text only

SUMMARY FORMAT:
Each summary is 3 short paragraphs separated by \n\n (a blank line). Structure each summary as:
  Paragraph 1 (2-3 sentences): What happened — the core news, plainly stated.
  Paragraph 2 (2-3 sentences): Why it matters / what it means — context, implications, or who is affected. For technical or medical stories, briefly explain the underlying concept in plain language (e.g. what a GLP-1 agonist actually does, or why a transformer architecture matters). For political stories, give the relevant background a non-expert needs to understand the stakes.
  Paragraph 3 (2 sentences): What's next, what to watch, or why a pre-med CS student building at the intersection of tech and medicine should care.
Prioritize clarity and context over exhaustive detail. Do not try to mention every fact — choose the ones that matter most for understanding.
- In summaries, include occasional markdown links [term](url) to explain jargon or link further reading. 1-3 per summary, only where genuinely useful — don't force it.
- Do NOT include an "imageUrl" field in stories — images are fetched automatically from source URLs.

SECTION CONTEXT:
For "Geopolitics", "Iran News", and "Canadian / Quebec News" sections, you MUST always include a "context" field. This is required — never omit it. Write 2 sentences of essential background that frames why this region/topic matters right now. This is not a story — it's orientation for the reader. Keep it factual and brief.

OUTPUT: Return ONLY a valid JSON object. No markdown fences, no preamble.
{
  "sections": [
    {
      "topic": "AI & Tech",
      "stories": [
        { "headline": "...", "summary": "...", "sources": ["url"] }
      ]
    },
    {
      "topic": "Geopolitics",
      "context": "Two sentences of background on the current geopolitical landscape.",
      "stories": [
        { "headline": "...", "summary": "...", "sources": ["url"] }
      ]
    },
    {
      "topic": "Iran News",
      "context": "Two sentences of background on Iran's current situation — nuclear negotiations, regional posture, or domestic politics.",
      "stories": [
        { "headline": "...", "summary": "...", "sources": ["url"] }
      ]
    },
    {
      "topic": "Canadian / Quebec News",
      "context": "Two sentences of background on the current Canadian / Quebec political or social context.",
      "stories": [
        { "headline": "...", "summary": "...", "sources": ["url"] }
      ]
    }
  ]
}`;
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    });
    const html = await res.text();
    // Try og:image, og:image:secure_url, then twitter:image in order
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:secure_url["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      const src = match?.[1] ?? null;
      if (src && src.startsWith('http')) return src;
    }
    return null;
  } catch {
    return null;
  }
}

// Returns true if the image is suitable as a hero (landscape, large enough)
async function isValidHeroImage(url: string): Promise<boolean> {
  try {
    const result = await probe(url, { timeout: 6000 });
    const { width, height } = result;
    const ratio = width / height;
    return width >= 400 && height >= 200 && ratio >= 1.2 && ratio <= 3.5;
  } catch {
    return false;
  }
}

// Fetch OG image URL from a page and validate it as a hero image.
// Returns the image URL if valid, null otherwise.
async function fetchAndValidateImage(sourceUrl: string): Promise<string | null> {
  const imgUrl = await fetchOgImage(sourceUrl);
  if (!imgUrl) return null;
  const valid = await isValidHeroImage(imgUrl);
  return valid ? imgUrl : null;
}

export async function generateBriefing(date: string) {
  const start = Date.now();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    tools: [{
      type: 'web_search_20250305' as const,
      name: 'web_search',
      max_uses: 25,
    }],
    system: buildSystemPrompt(date),
    messages: [{ role: 'user', content: "Generate today's briefing now." }],
  });

  // Response has multiple blocks (tool use rounds, then final text)
  // Find the last text block — never assume it's content[0]
  const textBlock = [...response.content].reverse().find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude did not return a text response');
  }

  const content = parseBriefingJSON(textBlock.text);

  // For each story: try sources in order until a valid hero image is found.
  // Also collect all valid images for the gallery.
  await Promise.all(
    content.sections.flatMap(section =>
      section.stories.map(async (story) => {
        for (const src of story.sources) {
          const url = await fetchAndValidateImage(src);
          if (url) {
            story.imageUrl = url;
            break;
          }
        }
      })
    )
  );

  const [saved] = await db.insert(briefings).values({
    date,
    modelUsed: 'claude-sonnet-4-20250514',
    content: content,
    durationMs: Date.now() - start,
  }).returning();

  return saved;
}
