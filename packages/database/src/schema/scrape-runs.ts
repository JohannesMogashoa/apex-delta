import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { scrapeRunStatusEnum } from './enums.js';

export const scrapeRuns = pgTable(
  'scrape_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    source: varchar('source', { length: 64 }).notNull(),

    status: scrapeRunStatusEnum('status').default('running').notNull(),

    startedAt: timestamp('started_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    }),

    listingsDiscovered: integer('listings_discovered').default(0).notNull(),

    listingsProcessed: integer('listings_processed').default(0).notNull(),

    failureCount: integer('failure_count').default(0).notNull(),

    errorMessage: text('error_message'),

    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  },
  (table) => [
    check(
      'scrape_runs_discovered_non_negative_check',
      sql`${table.listingsDiscovered} >= 0`,
    ),

    check(
      'scrape_runs_processed_non_negative_check',
      sql`${table.listingsProcessed} >= 0`,
    ),

    check(
      'scrape_runs_failure_count_non_negative_check',
      sql`${table.failureCount} >= 0`,
    ),

    index('scrape_runs_source_started_at_idx').on(
      table.source,
      table.startedAt,
    ),

    index('scrape_runs_status_started_at_idx').on(
      table.status,
      table.startedAt,
    ),
  ],
);

export type ScrapeRun = typeof scrapeRuns.$inferSelect;
export type NewScrapeRun = typeof scrapeRuns.$inferInsert;
