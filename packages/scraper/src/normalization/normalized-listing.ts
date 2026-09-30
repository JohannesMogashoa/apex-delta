import * as z from "zod";

const maximumVehicleYear = new Date().getFullYear() + 1;

export const normalizedListingSchema = z.object({
	source: z.string().min(1),

	sourceListingId: z.string().min(1),

	url: z.string().min(1),

	title: z.string().min(1).optional(),

	make: z.string().min(1),
	model: z.string().min(1),
	variant: z.string().min(1).optional(),

	year: z.number().int().min(1900).max(maximumVehicleYear),

	askingPrice: z.number().int().nonnegative(),

	mileage: z.number().int().nonnegative().optional(),

	bodyType: z.string().min(1).optional(),

	transmission: z.string().min(1).optional(),

	fuelType: z.string().min(1).optional(),

	colour: z.string().min(1).optional(),

	dealerName: z.string().min(1).optional(),

	province: z.string().min(1).optional(),

	rawPayload: z.record(z.string(), z.unknown()),
});

export type NormalizedListing = z.infer<typeof normalizedListingSchema>;
