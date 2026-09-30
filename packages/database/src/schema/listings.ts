import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { listingStatusEnum } from './enums.js';
import { vehicles } from './vehicles.js';

export const listings = pgTable(
  'listings',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    vehicleId: uuid('vehicle_id')
      .notNull()
      .references(() => vehicles.id, {
        onDelete: 'restrict',
      }),

    source: varchar('source', { length: 64 }).notNull(),

    sourceListingId: varchar('source_listing_id', {
      length: 255,
    }).notNull(),

    url: text('url').notNull(),

    dealerName: text('dealer_name'),

    province: varchar('province', {
      length: 100,
    }),

    status: listingStatusEnum('status').default('active').notNull(),

    firstSeenAt: timestamp('first_seen_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    lastSeenAt: timestamp('last_seen_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('listings_source_source_listing_id_uidx').on(
      table.source,
      table.sourceListingId,
    ),

    index('listings_vehicle_id_idx').on(table.vehicleId),

    index('listings_status_last_seen_at_idx').on(
      table.status,
      table.lastSeenAt,
    ),
  ],
);

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
