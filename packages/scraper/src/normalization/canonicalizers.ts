function normalizedKey(value: string): string {
	return value.trim().toLocaleLowerCase("en-ZA").replace(/\s+/g, " ");
}

function compactKey(value: string): string {
	return normalizedKey(value).replace(/[^a-z0-9]/g, "");
}

const makeAliases = new Map<string, string>([
	["bmw", "BMW"],
	["audi", "Audi"],

	["vw", "Volkswagen"],
	["volkswagen", "Volkswagen"],

	["mercedes", "Mercedes-Benz"],
	["mercedes benz", "Mercedes-Benz"],
	["mercedes-benz", "Mercedes-Benz"],

	["haval", "Haval"],
	["toyota", "Toyota"],
	["mazda", "Mazda"],
	["hyundai", "Hyundai"],
	["chery", "Chery"],
]);

export function canonicalizeMake(value: string): string {
	return makeAliases.get(normalizedKey(value)) ?? value.trim();
}

const modelAliases = new Map<string, Map<string, string>>([
	["Mazda", new Map([["cx5", "CX-5"]])],
]);

export function canonicalizeModel(make: string, model: string): string {
	const aliases = modelAliases.get(make);

	if (!aliases) {
		return model.trim();
	}

	return aliases.get(compactKey(model)) ?? model.trim();
}

const provinceAliases = new Map<string, string>([
	["gauteng", "Gauteng"],
	["gp", "Gauteng"],

	["western cape", "Western Cape"],
	["wc", "Western Cape"],

	["eastern cape", "Eastern Cape"],
	["ec", "Eastern Cape"],

	["kwazulu-natal", "KwaZulu-Natal"],
	["kwazulu natal", "KwaZulu-Natal"],
	["kzn", "KwaZulu-Natal"],

	["limpopo", "Limpopo"],
	["lp", "Limpopo"],

	["mpumalanga", "Mpumalanga"],
	["mp", "Mpumalanga"],

	["free state", "Free State"],
	["fs", "Free State"],

	["north west", "North West"],
	["nw", "North West"],

	["northern cape", "Northern Cape"],
	["nc", "Northern Cape"],
]);

export function canonicalizeProvince(value: string): string {
	return provinceAliases.get(normalizedKey(value)) ?? value.trim();
}

const automaticTransmissions = new Set([
	"automatic",
	"auto",
	"a/t",
	"dsg",
	"dct",
	"cvt",
	"8 speed automatic",
	"8-speed automatic",
]);

const manualTransmissions = new Set(["manual", "m/t"]);

export function canonicalizeTransmission(value: string): string {
	const key = normalizedKey(value);

	if (automaticTransmissions.has(key)) {
		return "Automatic";
	}

	if (manualTransmissions.has(key)) {
		return "Manual";
	}

	return value.trim();
}

const fuelAliases = new Map<string, string>([
	["petrol", "Petrol"],
	["unleaded", "Petrol"],
	["gasoline", "Petrol"],

	["diesel", "Diesel"],

	["hybrid", "Hybrid"],
	["petrol hybrid", "Hybrid"],

	["electric", "Electric"],
	["ev", "Electric"],
]);

export function canonicalizeFuelType(value: string): string {
	return fuelAliases.get(normalizedKey(value)) ?? value.trim();
}

const bodyTypeAliases = new Map<string, string>([
	["suv", "SUV"],
	["sport utility vehicle", "SUV"],

	["sedan", "Sedan"],
	["saloon", "Sedan"],

	["hatchback", "Hatchback"],
	["hatch", "Hatchback"],

	["coupe", "Coupe"],
	["coupé", "Coupe"],

	["convertible", "Convertible"],
	["cabriolet", "Convertible"],

	["bakkie", "Bakkie"],
	["pickup", "Bakkie"],
]);

export function canonicalizeBodyType(value: string): string {
	return bodyTypeAliases.get(normalizedKey(value)) ?? value.trim();
}
