import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  // Dynamic import after env is loaded
  const { generateBriefing } = await import('../src/lib/briefing-generator');

  const date = process.argv[2] || new Date().toISOString().split('T')[0];
  console.log(`Generating briefing for ${date}...`);

  try {
    const result = await generateBriefing(date);
    console.log(`✓ Done in ${result.durationMs}ms`);
    process.exit(0);
  } catch (err) {
    console.error('✗ Failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
