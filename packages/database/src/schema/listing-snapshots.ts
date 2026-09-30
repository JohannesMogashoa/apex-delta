import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { listings } from './listings.js';
import { scrapeRuns } from './scrape-runs.js';

export const listingSnapshots = pgTable(
  'listing_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    listingId: uuid('listing_id')
      .notNull()
      .references(() => listings.id, {
        onDelete: 'cascade',
      }),

    scrapeRunId: uuid('scrape_run_id').references(() => scrapeRuns.id, {
      onDelete: 'set null',
    }),

    capturedAt: timestamp('captured_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    /**
     * Asking price in whole South African Rand.
     *
     * Example:
     * R359,900 => 359900
     */
    askingPrice: integer('asking_price').notNull(),

    mileage: integer('mileage'),

    rawPayload: jsonb('raw_payload').$type<Record<string, unknown>>().notNull(),
  },
  (table) => [
    check(
      'listing_snapshots_price_non_negative_check',
      sql`${table.askingPrice} >= 0`,
    ),

    check(
      'listing_snapshots_mileage_non_negative_check',
      sql`${table.mileage} IS NULL OR ${table.mileage} >= 0`,
    ),

    index('listing_snapshots_listing_captured_at_idx').on(
      table.listingId,
      table.capturedAt,
    ),

    index('listing_snapshots_scrape_run_id_idx').on(table.scrapeRunId),
  ],
);

export type ListingSnapshot = typeof listingSnapshots.$inferSelect;

export type NewListingSnapshot = typeof listingSnapshots.$inferInsert;
