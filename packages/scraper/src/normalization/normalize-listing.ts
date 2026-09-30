import type { RawListing } from "../types/raw-listing.js";

import {
	canonicalizeBodyType,
	canonicalizeFuelType,
	canonicalizeMake,
	canonicalizeModel,
	canonicalizeProvince,
	canonicalizeTransmission,
} from "./canonicalizers.js";

import { normalizedListingSchema } from "./normalized-listing.js";

import type {
	NormalizationIssue,
	NormalizationResult,
	NormalizationWarning,
} from "./normalization-result.js";

import { parseWholeNumber } from "./number-parser.js";

function cleanText(value: string | null | undefined): string | undefined {
	if (value == null) {
		return undefined;
	}

	const cleaned = value.trim().replace(/\s+/g, " ");

	return cleaned || undefined;
}

function requiredText(
	field: string,
	value: string | null | undefined,
	issues: NormalizationIssue[],
): string | undefined {
	const cleaned = cleanText(value);

	if (!cleaned) {
		issues.push({
			field,
			code: "missing_required_field",
			message: `${field} is required`,
			input: value,
		});

		return undefined;
	}

	return cleaned;
}

function requiredNumber(
	field: string,
	value: unknown,
	issues: NormalizationIssue[],
	warnings: NormalizationWarning[],
): number | undefined {
	const parsed = parseWholeNumber(value);

	if (parsed === undefined) {
		issues.push({
			field,
			code: "invalid_number",
			message: `${field} could not be converted to a number`,
			input: value,
		});

		return undefined;
	}

	if (typeof value !== "number") {
		warnings.push({
			field,
			code: "parsed_number",
			message: `${field} was parsed from source data`,
			input: value,
			output: parsed,
		});
	}

	return parsed;
}

function optionalNumber(
	field: string,
	value: unknown,
	warnings: NormalizationWarning[],
): number | undefined {
	if (value === undefined || value === null || value === "") {
		return undefined;
	}

	const parsed = parseWholeNumber(value);

	if (parsed === undefined) {
		return undefined;
	}

	if (typeof value !== "number") {
		warnings.push({
			field,
			code: "parsed_number",
			message: `${field} was parsed from source data`,
			input: value,
			output: parsed,
		});
	}

	return parsed;
}

function trackCanonicalization(
	field: string,
	input: string | undefined,
	output: string | undefined,
	warnings: NormalizationWarning[],
): void {
	if (input !== undefined && output !== undefined && input !== output) {
		warnings.push({
			field,
			code: "canonicalized",
			message: `${field} was canonicalized`,
			input,
			output,
		});
	}
}

export function normalizeListing(raw: RawListing): NormalizationResult {
	const issues: NormalizationIssue[] = [];
	const warnings: NormalizationWarning[] = [];

	const source = requiredText("source", raw.source, issues);

	const sourceListingId = requiredText(
		"sourceListingId",
		raw.sourceListingId,
		issues,
	);

	const url = requiredText("url", raw.url, issues);

	if (url && !isValidListingUrl(url)) {
		issues.push({
			field: "url",
			code: "invalid_url",
			message: "url must be a valid HTTP or HTTPS URL",
			input: raw.url,
		});
	}

	const rawMake = requiredText("make", raw.make, issues);

	const rawModel = requiredText("model", raw.model, issues);

	const year = requiredNumber("year", raw.year, issues, warnings);

	const askingPrice = requiredNumber(
		"askingPrice",
		raw.askingPrice,
		issues,
		warnings,
	);

	const mileage = optionalNumber("mileage", raw.mileage, warnings);

	if (
		issues.length > 0 ||
		!source ||
		!sourceListingId ||
		!url ||
		!rawMake ||
		!rawModel ||
		year === undefined ||
		askingPrice === undefined
	) {
		return {
			success: false,
			issues,
			warnings,
		};
	}

	const make = canonicalizeMake(rawMake);

	trackCanonicalization("make", rawMake, make, warnings);

	const model = canonicalizeModel(make, rawModel);

	trackCanonicalization("model", rawModel, model, warnings);

	const rawProvince = cleanText(raw.province);

	const province = rawProvince
		? canonicalizeProvince(rawProvince)
		: undefined;

	trackCanonicalization("province", rawProvince, province, warnings);

	const rawTransmission = cleanText(raw.transmission);

	const transmission = rawTransmission
		? canonicalizeTransmission(rawTransmission)
		: undefined;

	trackCanonicalization(
		"transmission",
		rawTransmission,
		transmission,
		warnings,
	);

	const rawFuelType = cleanText(raw.fuelType);

	const fuelType = rawFuelType
		? canonicalizeFuelType(rawFuelType)
		: undefined;

	trackCanonicalization("fuelType", rawFuelType, fuelType, warnings);

	const rawBodyType = cleanText(raw.bodyType);

	const bodyType = rawBodyType
		? canonicalizeBodyType(rawBodyType)
		: undefined;

	trackCanonicalization("bodyType", rawBodyType, bodyType, warnings);

	const candidate = {
		source,
		sourceListingId,
		url,

		title: cleanText(raw.title),

		make,
		model,
		variant: cleanText(raw.variant),

		year,
		askingPrice,
		mileage,

		bodyType,
		transmission,
		fuelType,

		colour: cleanText(raw.colour),

		dealerName: cleanText(raw.dealerName),

		province,

		rawPayload: raw.rawPayload,
	};

	const result = normalizedListingSchema.safeParse(candidate);

	if (!result.success) {
		return {
			success: false,

			warnings,

			issues: result.error.issues.map((issue) => ({
				field: issue.path.join(".") || "listing",

				code: "invalid_value",

				message: issue.message,
			})),
		};
	}

	return {
		success: true,
		listing: result.data,
		warnings,
	};
}

function isValidListingUrl(value: string): boolean {
	try {
		const url = new URL(value);

		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}
