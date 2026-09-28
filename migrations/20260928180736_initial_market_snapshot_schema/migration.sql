-- CreateTable
CREATE TABLE "MarketSnapshot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetModel" TEXT NOT NULL,
    "repairedValue" INTEGER NOT NULL,
    "targetPrice" INTEGER NOT NULL,
    "priceGap" INTEGER NOT NULL,
    "checkedListings" INTEGER NOT NULL,
    "isHighAlert" BOOLEAN NOT NULL,

    CONSTRAINT "MarketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarListing" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "url" TEXT,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "hasSunroof" BOOLEAN NOT NULL,

    CONSTRAINT "CarListing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarListing" ADD CONSTRAINT "CarListing_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "MarketSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
