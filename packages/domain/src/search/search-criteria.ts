import * as z from "zod";

const filterValueSchema = z.string().trim().min(1);

export const searchCriteriaSchema = z
	.object({
		minPrice: z.number().int().nonnegative().optional(),
		maxPrice: z.number().int().nonnegative().optional(),

		minYear: z.number().int().min(1900).optional(),
		maxYear: z.number().int().min(1900).optional(),

		maxMileage: z.number().int().nonnegative().optional(),

		makes: z.array(filterValueSchema).min(1).optional(),
		models: z.array(filterValueSchema).min(1).optional(),

		bodyTypes: z.array(filterValueSchema).min(1).optional(),
		transmissions: z.array(filterValueSchema).min(1).optional(),
		fuelTypes: z.array(filterValueSchema).min(1).optional(),

		provinces: z.array(filterValueSchema).min(1).optional(),
	})
	.refine(
		({ minPrice, maxPrice }) =>
			minPrice === undefined ||
			maxPrice === undefined ||
			minPrice <= maxPrice,
		{
			error: "minPrice must be less than or equal to maxPrice",
		},
	)
	.refine(
		({ minYear, maxYear }) =>
			minYear === undefined ||
			maxYear === undefined ||
			minYear <= maxYear,
		{
			error: "minYear must be less than or equal to maxYear",
		},
	);

export type SearchCriteria = z.infer<typeof searchCriteriaSchema>;
