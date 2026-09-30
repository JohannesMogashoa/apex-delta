import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const vehicles = pgTable(
  'vehicles',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    make: varchar('make', { length: 100 }).notNull(),

    model: varchar('model', { length: 100 }).notNull(),

    variant: varchar('variant', { length: 160 }),

    year: integer('year').notNull(),

    bodyType: varchar('body_type', { length: 80 }),

    transmission: varchar('transmission', { length: 80 }),

    fuelType: varchar('fuel_type', { length: 80 }),
  },
  (table) => [
    check('vehicles_year_check', sql`${table.year} >= 1900`),

    index('vehicles_make_model_year_idx').on(
      table.make,
      table.model,
      table.year,
    ),
  ],
);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
