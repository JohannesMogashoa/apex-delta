import type { NormalizedListing } from "./normalized-listing.js";

export type NormalizationIssueCode =
	| "missing_required_field"
	| "invalid_number"
	| "invalid_value"
	| "out_of_range"
	| "invalid_url";

export type NormalizationWarningCode =
	"trimmed" | "parsed_number" | "canonicalized";

export interface NormalizationIssue {
	field: string;
	code: NormalizationIssueCode;
	message: string;
	input?: unknown;
}

export interface NormalizationWarning {
	field: string;
	code: NormalizationWarningCode;
	message: string;
	input?: unknown;
	output?: unknown;
}

export interface NormalizationSuccess {
	success: true;

	listing: NormalizedListing;

	warnings: NormalizationWarning[];
}

export interface NormalizationFailure {
	success: false;

	issues: NormalizationIssue[];

	warnings: NormalizationWarning[];
}

export type NormalizationResult = NormalizationSuccess | NormalizationFailure;
