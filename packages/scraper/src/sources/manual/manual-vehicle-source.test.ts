import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ManualVehicleSource } from "./manual-vehicle-source.js";

describe("ManualVehicleSource", () => {
	it("identifies itself as the manual source", () => {
		const source = new ManualVehicleSource();

		assert.equal(source.sourceId, "manual");
	});

	it("returns all fixtures for empty criteria", async () => {
		const source = new ManualVehicleSource();

		const results = await source.search({});

		assert.equal(results.length, 10);
	});

	it("filters by maximum price", async () => {
		const source = new ManualVehicleSource();

		const results = await source.search({
			maxPrice: 360_000,
		});

		assert.ok(results.length > 0);

		const ids = results.map((result) => result.sourceListingId);

		assert.ok(ids.includes("manual-mazda-cx5-001"));

		assert.ok(!ids.includes("manual-bmw-x3-001"));
	});

	it("filters by minimum year", async () => {
		const source = new ManualVehicleSource();

		const results = await source.search({
			minYear: 2023,
		});

		assert.ok(results.length > 0);

		const ids = results.map((result) => result.sourceListingId);

		assert.ok(ids.includes("manual-haval-h6-001"));

		assert.ok(!ids.includes("manual-bmw-320d-001"));
	});

	it("filters using multiple criteria", async () => {
		const source = new ManualVehicleSource();

		const results = await source.search({
			minPrice: 350_000,
			maxPrice: 400_000,
			minYear: 2021,
			maxMileage: 60_000,
			bodyTypes: ["SUV"],
			provinces: ["Gauteng"],
		});

		assert.ok(results.length > 0);

		const ids = results.map((result) => result.sourceListingId);

		assert.ok(ids.includes("manual-audi-q3-001"));

		assert.ok(ids.includes("manual-haval-h6-001"));
	});

	it("matches categorical criteria case-insensitively", async () => {
		const source = new ManualVehicleSource();

		const results = await source.search({
			makes: ["bmw"],
			provinces: ["gauteng"],
		});

		assert.equal(results.length, 2);

		assert.ok(
			results.every((result) =>
				result.sourceListingId.startsWith("manual-bmw-"),
			),
		);
	});

	it("retrieves a listing by source listing ID", async () => {
		const source = new ManualVehicleSource();

		const listing = await source.getListing("manual-bmw-x3-001");

		assert.equal(listing.sourceListingId, "manual-bmw-x3-001");

		assert.equal(listing.make, "BMW");
	});

	it("throws when a listing does not exist", async () => {
		const source = new ManualVehicleSource();

		await assert.rejects(
			() => source.getListing("does-not-exist"),
			/was not found/,
		);
	});

	it("returns raw rather than normalized values", async () => {
		const source = new ManualVehicleSource();

		const listing = await source.getListing("manual-bmw-x3-001");

		assert.equal(listing.askingPrice, "R 429 900");

		assert.equal(listing.mileage, "41 230 km");
	});
});
