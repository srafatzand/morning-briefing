import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

export const briefings = pgTable('briefings', {
  id: serial('id').primaryKey(),
  date: text('date').notNull().unique(),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
  modelUsed: text('model_used').notNull(),
  content: jsonb('content').notNull(),
  durationMs: integer('duration_ms'),
});

export type Briefing = typeof briefings.$inferSelect;
export type NewBriefing = typeof briefings.$inferInsert;
