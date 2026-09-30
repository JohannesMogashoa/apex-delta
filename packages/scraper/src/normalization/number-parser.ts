export function parseWholeNumber(value: unknown): number | undefined {
	if (typeof value === "number" && Number.isFinite(value)) {
		return Math.round(value);
	}

	if (typeof value !== "string") {
		return undefined;
	}

	let candidate = value
		.trim()
		.replace(/\u00a0/g, " ")
		.replace(/[^\d,.-]/g, "");

	if (!candidate) {
		return undefined;
	}

	const lastComma = candidate.lastIndexOf(",");

	const lastDot = candidate.lastIndexOf(".");

	if (lastComma !== -1 && lastDot !== -1) {
		const decimalSeparator = lastComma > lastDot ? "," : ".";

		const thousandsSeparator = decimalSeparator === "," ? "." : ",";

		candidate = candidate.split(thousandsSeparator).join("");

		if (decimalSeparator === ",") {
			candidate = candidate.replace(",", ".");
		}
	} else {
		const separator =
			lastComma !== -1 ? "," : lastDot !== -1 ? "." : undefined;

		if (separator) {
			const parts = candidate.split(separator);

			const looksLikeThousandsSeparator =
				parts.length > 2 ||
				(parts.length === 2 && parts[1]?.length === 3);

			if (looksLikeThousandsSeparator) {
				candidate = parts.join("");
			} else if (separator === ",") {
				candidate = candidate.replace(",", ".");
			}
		}
	}

	const parsed = Number(candidate);

	if (!Number.isFinite(parsed)) {
		return undefined;
	}

	return Math.round(parsed);
}
