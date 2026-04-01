import type { BriefingContent } from '@/types';

export function parseBriefingJSON(raw: string): BriefingContent {
  // Strip markdown fences if Claude wrapped the JSON
  let cleaned = raw
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();

  // If Claude prepended preamble text, extract the JSON object starting at the first '{'
  const jsonStart = cleaned.indexOf('{');
  if (jsonStart > 0) {
    cleaned = cleaned.slice(jsonStart);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse briefing JSON: ${e}. Raw: ${raw.slice(0, 200)}`);
  }

  if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as any).sections)) {
    throw new Error(`Invalid briefing shape. Got: ${JSON.stringify(parsed).slice(0, 200)}`);
  }

  return parsed as BriefingContent;
}
