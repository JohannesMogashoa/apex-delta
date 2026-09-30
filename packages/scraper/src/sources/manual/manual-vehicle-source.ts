import { searchCriteriaSchema, type SearchCriteria } from "@apex-delta/domain";

import type { VehicleSource } from "../../contracts/vehicle-source.js";
import { rawListingSchema, type RawListing } from "../../types/raw-listing.js";

import {
	manualVehicleFixtures,
	type ManualVehicleFixture,
} from "./manual-vehicle-fixtures.js";

function comparable(value: string): string {
	return value.trim().toLocaleLowerCase("en-ZA");
}

function matchesAny(
	value: string | undefined,
	accepted: readonly string[] | undefined,
): boolean {
	if (!accepted || accepted.length === 0) {
		return true;
	}

	if (!value) {
		return false;
	}

	const candidate = comparable(value);

	return accepted.some((item) => comparable(item) === candidate);
}

function matchesCriteria(
	fixture: ManualVehicleFixture,
	criteria: SearchCriteria,
): boolean {
	const vehicle = fixture.searchable;

	if (criteria.minPrice !== undefined && vehicle.price < criteria.minPrice) {
		return false;
	}

	if (criteria.maxPrice !== undefined && vehicle.price > criteria.maxPrice) {
		return false;
	}

	if (criteria.minYear !== undefined && vehicle.year < criteria.minYear) {
		return false;
	}

	if (criteria.maxYear !== undefined && vehicle.year > criteria.maxYear) {
		return false;
	}

	if (criteria.maxMileage !== undefined) {
		if (vehicle.mileage === undefined) {
			return false;
		}

		if (vehicle.mileage > criteria.maxMileage) {
			return false;
		}
	}

	if (!matchesAny(vehicle.make, criteria.makes)) {
		return false;
	}

	if (!matchesAny(vehicle.model, criteria.models)) {
		return false;
	}

	if (!matchesAny(vehicle.bodyType, criteria.bodyTypes)) {
		return false;
	}

	if (!matchesAny(vehicle.transmission, criteria.transmissions)) {
		return false;
	}

	if (!matchesAny(vehicle.fuelType, criteria.fuelTypes)) {
		return false;
	}

	if (!matchesAny(vehicle.province, criteria.provinces)) {
		return false;
	}

	return true;
}

export class ManualVehicleSource implements VehicleSource {
	public readonly sourceId = "manual";

	public constructor(
		private readonly fixtures: readonly ManualVehicleFixture[] = manualVehicleFixtures,
	) {}

	public async search(criteria: SearchCriteria): Promise<RawListing[]> {
		const validatedCriteria = searchCriteriaSchema.parse(criteria);

		return this.fixtures
			.filter((fixture) => matchesCriteria(fixture, validatedCriteria))
			.map((fixture) => rawListingSchema.parse(fixture.listing));
	}

	public async getListing(id: string): Promise<RawListing> {
		const fixture = this.fixtures.find(
			({ listing }) => listing.sourceListingId === id,
		);

		if (!fixture) {
			throw new Error(`Manual listing "${id}" was not found`);
		}

		return rawListingSchema.parse(fixture.listing);
	}
}
