import { rawListingSchema, type RawListing } from "../../types/raw-listing.js";

export interface ManualVehicleSearchMetadata {
	make: string;
	model: string;

	year: number;
	price: number;
	mileage?: number;

	bodyType?: string;
	transmission?: string;
	fuelType?: string;
	province?: string;
}

export interface ManualVehicleFixture {
	searchable: ManualVehicleSearchMetadata;
	listing: RawListing;
}

function createFixture(
	searchable: ManualVehicleSearchMetadata,
	listing: RawListing,
): ManualVehicleFixture {
	return {
		searchable,
		listing: rawListingSchema.parse(listing),
	};
}

export const manualVehicleFixtures: readonly ManualVehicleFixture[] = [
	createFixture(
		{
			make: "BMW",
			model: "X3",
			year: 2022,
			price: 429_900,
			mileage: 41_230,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Diesel",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-bmw-x3-001",
			url: "https://example.invalid/apex-delta/manual-bmw-x3-001",

			title: "2022 BMW X3 xDrive20d M Sport",

			make: "BMW",
			model: "X3",
			variant: "xDrive20d M Sport",

			year: "2022",
			askingPrice: "R 429 900",
			mileage: "41 230 km",

			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Diesel",
			colour: "Black",

			dealerName: "Apex Demo Motors",
			province: "Gauteng",

			rawPayload: {
				fixture: true,
				badge: "Demo Listing",
			},
		},
	),

	createFixture(
		{
			make: "Audi",
			model: "Q3",
			year: 2021,
			price: 379_900,
			mileage: 58_200,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-audi-q3-001",
			url: "https://example.invalid/apex-delta/manual-audi-q3-001",

			title: "2021 Audi Q3 35 TFSI",

			make: "AUDI",
			model: "Q3",
			variant: "35 TFSI",

			year: 2021,
			askingPrice: "R379,900",
			mileage: "58,200 KM",

			bodyType: "SUV",
			transmission: "AUTO",
			fuelType: "Petrol",
			colour: "White",

			dealerName: "Apex Demo Motors",
			province: "GAUTENG",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "Mercedes-Benz",
			model: "GLA",
			year: 2022,
			price: 449_995,
			mileage: 36_050,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-mercedes-gla-001",
			url: "https://example.invalid/apex-delta/manual-mercedes-gla-001",

			title: "Mercedes-Benz GLA 200 Auto",

			make: "Mercedes-Benz",
			model: "GLA",
			variant: "200",

			year: "2022",
			askingPrice: "R 449,995.00",
			mileage: "36050",

			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			colour: "Silver",

			dealerName: "North Demo Auto",
			province: "Gauteng",

			rawPayload: {
				fixture: true,
				stockNumber: "DEMO-003",
			},
		},
	),

	createFixture(
		{
			make: "Volkswagen",
			model: "Tiguan",
			year: 2022,
			price: 399_900,
			mileage: 49_100,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Western Cape",
		},
		{
			source: "manual",
			sourceListingId: "manual-vw-tiguan-001",
			url: "https://example.invalid/apex-delta/manual-vw-tiguan-001",

			title: "2022 VW Tiguan 1.4 TSI",

			make: "VW",
			model: "Tiguan",
			variant: "1.4 TSI",

			year: "2022",
			askingPrice: "399900",
			mileage: "49 100kms",

			bodyType: "SUV",
			transmission: "DSG",
			fuelType: "Petrol",
			colour: "Grey",

			dealerName: "Cape Demo Cars",
			province: "Western Cape",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "Toyota",
			model: "RAV4",
			year: 2021,
			price: 369_900,
			mileage: 65_000,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "KwaZulu-Natal",
		},
		{
			source: "manual",
			sourceListingId: "manual-toyota-rav4-001",
			url: "https://example.invalid/apex-delta/manual-toyota-rav4-001",

			title: "2021 Toyota RAV4 2.0 GX",

			make: "Toyota",
			model: "RAV4",
			variant: "2.0 GX",

			year: 2021,
			askingPrice: "R369 900",
			mileage: 65000,

			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			colour: "White",

			dealerName: "Coastal Demo Motors",
			province: "KZN",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "Mazda",
			model: "CX-5",
			year: 2022,
			price: 359_900,
			mileage: 43_500,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-mazda-cx5-001",
			url: "https://example.invalid/apex-delta/manual-mazda-cx5-001",

			title: "Mazda CX5 2.0 Dynamic Auto",

			make: "Mazda",
			model: "CX5",
			variant: "2.0 Dynamic",

			year: "2022",
			askingPrice: "R 359 900",
			mileage: "43,500km",

			bodyType: "SUV",
			transmission: "A/T",
			fuelType: "Petrol",
			colour: "Red",

			dealerName: "Apex Demo Motors",
			province: "Gauteng",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "Haval",
			model: "H6",
			year: 2023,
			price: 389_950,
			mileage: 28_000,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-haval-h6-001",
			url: "https://example.invalid/apex-delta/manual-haval-h6-001",

			title: "2023 HAVAL H6 2.0T Luxury",

			make: "HAVAL",
			model: "H6",
			variant: "2.0T Luxury",

			year: 2023,
			askingPrice: 389950,
			mileage: "28 000",

			bodyType: "SUV",
			transmission: "DCT",
			fuelType: "Petrol",
			colour: "Blue",

			dealerName: "East Demo Auto",
			province: "GP",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "Chery",
			model: "Tiggo 8 Pro",
			year: 2023,
			price: 379_900,
			mileage: 32_100,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-chery-tiggo8-001",
			url: "https://example.invalid/apex-delta/manual-chery-tiggo8-001",

			title: "2023 Chery Tiggo 8 Pro",

			make: "Chery",
			model: "Tiggo 8 Pro",
			variant: "Executive",

			year: "2023",
			askingPrice: "R379900",
			mileage: "32100 KM",

			bodyType: "Sport Utility Vehicle",
			transmission: "Automatic",
			fuelType: "Petrol",
			colour: "Black",

			dealerName: "Apex Demo Motors",
			province: "Gauteng",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "BMW",
			model: "3 Series",
			year: 2020,
			price: 349_900,
			mileage: 74_300,
			bodyType: "Sedan",
			transmission: "Automatic",
			fuelType: "Diesel",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-bmw-320d-001",
			url: "https://example.invalid/apex-delta/manual-bmw-320d-001",

			title: "2020 BMW 320d M Sport",

			make: "BMW",
			model: "320d",
			variant: "M Sport",

			year: "2020",
			askingPrice: "R 349 900",
			mileage: "74 300 KM",

			bodyType: "Sedan",
			transmission: "8 Speed Automatic",
			fuelType: "Diesel",
			colour: "Blue",

			dealerName: "Apex Demo Motors",
			province: "Gauteng",

			rawPayload: {
				fixture: true,
			},
		},
	),

	createFixture(
		{
			make: "Hyundai",
			model: "Tucson",
			year: 2024,
			price: 449_900,
			mileage: 18_500,
			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Petrol",
			province: "Gauteng",
		},
		{
			source: "manual",
			sourceListingId: "manual-hyundai-tucson-001",
			url: "https://example.invalid/apex-delta/manual-hyundai-tucson-001",

			title: "2024 Hyundai Tucson 2.0 Executive",

			make: "Hyundai",
			model: "Tucson",
			variant: "2.0 Executive",

			year: 2024,
			askingPrice: "R449,900",
			mileage: "18 500 km",

			bodyType: "SUV",
			transmission: "Automatic",
			fuelType: "Unleaded",
			colour: "Grey",

			dealerName: "North Demo Auto",
			province: "Gauteng",

			rawPayload: {
				fixture: true,
			},
		},
	),
];
