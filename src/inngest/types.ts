export interface CarListing {
  price: number;
  mileage: number;
  hasSunroof: boolean;
  title?: string;
  url?: string;
}

export interface ArbitrageResult {
  repairedValue: number;
  targetPrice: number;
  priceGap: number;
  targetListing: CarListing | null;
  isHighAlert: boolean;
}
