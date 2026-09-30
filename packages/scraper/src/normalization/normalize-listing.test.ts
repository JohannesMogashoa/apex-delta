import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ManualVehicleSource } from "../sources/manual/manual-vehicle-source.js";

import { normalizeListing } from "./normalize-listing.js";

describe("normalizeListing", () => {
	it("normalizes BMW source data", async () => {
		const source = new ManualVehicleSource();

		const raw = await source.getListing("manual-bmw-x3-001");

		const result = normalizeListing(raw);

		assert.equal(result.success, true);

		if (!result.success) {
			assert.fail("Expected normalization to succeed");
		}

		assert.equal(result.listing.askingPrice, 429900);

		assert.equal(result.listing.mileage, 41230);

		assert.equal(result.listing.year, 2022);

		assert.equal(result.listing.make, "BMW");
	});

	it("canonicalizes VW to Volkswagen", async () => {
		const source = new ManualVehicleSource();

		const raw = await source.getListing("manual-vw-tiguan-001");

		const result = normalizeListing(raw);

		assert.ok(result.success);

		if (!result.success) {
			return;
		}

		assert.equal(result.listing.make, "Volkswagen");

		assert.equal(result.listing.transmission, "Automatic");
	});

	it("canonicalizes CX5 to CX-5", async () => {
		const source = new ManualVehicleSource();

		const raw = await source.getListing("manual-mazda-cx5-001");

		const result = normalizeListing(raw);

		assert.ok(result.success);

		if (!result.success) {
			return;
		}

		assert.equal(result.listing.model, "CX-5");

		assert.equal(result.listing.askingPrice, 359900);

		assert.equal(result.listing.mileage, 43500);
	});

	it("normalizes province and transmission aliases", async () => {
		const source = new ManualVehicleSource();

		const raw = await source.getListing("manual-haval-h6-001");

		const result = normalizeListing(raw);

		assert.ok(result.success);

		if (!result.success) {
			return;
		}

		assert.equal(result.listing.make, "Haval");

		assert.equal(result.listing.province, "Gauteng");

		assert.equal(result.listing.transmission, "Automatic");
	});

	it("canonicalizes KZN", async () => {
		const source = new ManualVehicleSource();

		const raw = await source.getListing("manual-toyota-rav4-001");

		const result = normalizeListing(raw);

		assert.ok(result.success);

		if (!result.success) {
			return;
		}

		assert.equal(result.listing.province, "KwaZulu-Natal");
	});

	it("canonicalizes Unleaded to Petrol", async () => {
		const source = new ManualVehicleSource();

		const raw = await source.getListing("manual-hyundai-tucson-001");

		const result = normalizeListing(raw);

		assert.ok(result.success);

		if (!result.success) {
			return;
		}

		assert.equal(result.listing.fuelType, "Petrol");
	});

	it("rejects a listing without a price", () => {
		const result = normalizeListing({
			source: "manual",
			sourceListingId: "bad-001",
			url: "https://example.invalid/bad-001",

			make: "BMW",
			model: "X3",

			year: "2022",
			askingPrice: null,

			rawPayload: {},
		});

		assert.equal(result.success, false);

		if (result.success) {
			assert.fail("Expected normalization to fail");
		}

		assert.ok(result.issues.some((issue) => issue.field === "askingPrice"));
	});

	it("rejects malformed and unsafe listing URLs", () => {
		for (const url of ["not-a-url", "javascript:alert(1)"]) {
			const result = normalizeListing({
				source: "manual",
				sourceListingId: "bad-url-001",
				url,

				make: "BMW",
				model: "X3",

				year: 2022,
				askingPrice: 429900,

				rawPayload: {},
			});

			assert.equal(result.success, false);

			if (result.success) {
				assert.fail("Expected normalization to fail");
			}

			assert.ok(
				result.issues.some(
					(issue) =>
						issue.field === "url" && issue.code === "invalid_url",
				),
			);
		}
	});

	it("normalizes every manual fixture", async () => {
		const source = new ManualVehicleSource();

		const listings = await source.search({});

		for (const raw of listings) {
			const result = normalizeListing(raw);

			assert.equal(
				result.success,
				true,
				`Normalization failed for ${raw.sourceListingId}`,
			);
		}
	});
});
