CREATE TYPE "public"."listing_status" AS ENUM('active', 'inactive', 'removed', 'sold', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."scrape_run_status" AS ENUM('running', 'succeeded', 'partial', 'failed');--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"make" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"variant" varchar(160),
	"year" integer NOT NULL,
	"body_type" varchar(80),
	"transmission" varchar(80),
	"fuel_type" varchar(80),
	CONSTRAINT "vehicles_year_check" CHECK ("vehicles"."year" >= 1900)
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"source" varchar(64) NOT NULL,
	"source_listing_id" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"dealer_name" text,
	"province" varchar(100),
	"status" "listing_status" DEFAULT 'active' NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"scrape_run_id" uuid,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"asking_price" integer NOT NULL,
	"mileage" integer,
	"raw_payload" jsonb NOT NULL,
	CONSTRAINT "listing_snapshots_price_non_negative_check" CHECK ("listing_snapshots"."asking_price" >= 0),
	CONSTRAINT "listing_snapshots_mileage_non_negative_check" CHECK ("listing_snapshots"."mileage" IS NULL OR "listing_snapshots"."mileage" >= 0)
);
--> statement-breakpoint
CREATE TABLE "scrape_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(64) NOT NULL,
	"status" "scrape_run_status" DEFAULT 'running' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"listings_discovered" integer DEFAULT 0 NOT NULL,
	"listings_processed" integer DEFAULT 0 NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"metadata" jsonb,
	CONSTRAINT "scrape_runs_discovered_non_negative_check" CHECK ("scrape_runs"."listings_discovered" >= 0),
	CONSTRAINT "scrape_runs_processed_non_negative_check" CHECK ("scrape_runs"."listings_processed" >= 0),
	CONSTRAINT "scrape_runs_failure_count_non_negative_check" CHECK ("scrape_runs"."failure_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_snapshots" ADD CONSTRAINT "listing_snapshots_scrape_run_id_scrape_runs_id_fk" FOREIGN KEY ("scrape_run_id") REFERENCES "public"."scrape_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vehicles_make_model_year_idx" ON "vehicles" USING btree ("make","model","year");--> statement-breakpoint
CREATE UNIQUE INDEX "listings_source_source_listing_id_uidx" ON "listings" USING btree ("source","source_listing_id");--> statement-breakpoint
CREATE INDEX "listings_vehicle_id_idx" ON "listings" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "listings_status_last_seen_at_idx" ON "listings" USING btree ("status","last_seen_at");--> statement-breakpoint
CREATE INDEX "listing_snapshots_listing_captured_at_idx" ON "listing_snapshots" USING btree ("listing_id","captured_at");--> statement-breakpoint
CREATE INDEX "listing_snapshots_scrape_run_id_idx" ON "listing_snapshots" USING btree ("scrape_run_id");--> statement-breakpoint
CREATE INDEX "scrape_runs_source_started_at_idx" ON "scrape_runs" USING btree ("source","started_at");--> statement-breakpoint
CREATE INDEX "scrape_runs_status_started_at_idx" ON "scrape_runs" USING btree ("status","started_at");