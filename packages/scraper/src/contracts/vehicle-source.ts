import type { SearchCriteria } from "@apex-delta/domain";
import type { RawListing } from "../types/raw-listing.js";

export interface VehicleSource {
	/**
	 * Stable identifier for this source.
	 *
	 * Used later for ScrapeRun.source,
	 * logging and diagnostics.
	 */
	readonly sourceId: string;

	/**
	 * Search this source using application-level
	 * vehicle criteria.
	 *
	 * Source-specific pagination and query translation
	 * remain private to the adapter.
	 */
	search(criteria: SearchCriteria): Promise<RawListing[]>;

	/**
	 * Retrieve one specific source listing.
	 *
	 * `id` refers to the source's own listing identifier,
	 * not our PostgreSQL Listing.id.
	 */
	getListing(id: string): Promise<RawListing>;
}
