import { pgEnum } from 'drizzle-orm/pg-core';

export const listingStatusEnum = pgEnum('listing_status', [
  'active',
  'inactive',
  'removed',
  'sold',
  'unknown',
]);

export const scrapeRunStatusEnum = pgEnum('scrape_run_status', [
  'running',
  'succeeded',
  'partial',
  'failed',
]);
