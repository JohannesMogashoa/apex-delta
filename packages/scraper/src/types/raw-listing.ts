import * as z from "zod";

const rawNumericValueSchema = z
	.union([z.string(), z.number()])
	.nullable()
	.optional();

const rawStringValueSchema = z.string().nullable().optional();

export const rawListingSchema = z.object({
	/**
	 * Stable source identifier.
	 *
	 * Examples:
	 * manual
	 * autotrader
	 * approved-api
	 */
	source: z.string().trim().min(1),

	/**
	 * The listing identifier assigned by the source.
	 */
	sourceListingId: z.string().trim().min(1),

	/**
	 * Source URL for the advertisement.
	 */
	url: z.string().trim().min(1),

	/**
	 * Optional original advert title.
	 */
	title: rawStringValueSchema,

	make: rawStringValueSchema,
	model: rawStringValueSchema,
	variant: rawStringValueSchema,

	year: rawNumericValueSchema,
	askingPrice: rawNumericValueSchema,
	mileage: rawNumericValueSchema,

	bodyType: rawStringValueSchema,
	transmission: rawStringValueSchema,
	fuelType: rawStringValueSchema,
	colour: rawStringValueSchema,

	dealerName: rawStringValueSchema,
	province: rawStringValueSchema,

	/**
	 * Untouched source-specific information.
	 *
	 * This ensures data we do not currently normalize
	 * is not lost.
	 */
	rawPayload: z.record(z.string(), z.unknown()),
});

export type RawListing = z.infer<typeof rawListingSchema>;
