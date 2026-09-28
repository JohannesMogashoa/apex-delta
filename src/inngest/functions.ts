import { chromium } from "playwright";
import { prisma } from "wasp/server";

import { inngest } from "./client";
import type { ArbitrageResult, CarListing } from "./types";

const TARGET_MODEL = "Omoda C5 HEV";
const MARKETPLACE_URL = "https://www.autotrader.co.za/cars-for-sale/omoda/c5";
const HIGH_ALERT_THRESHOLD_ZAR = 150_000;

function parseZar(value: string): number {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function parseMileage(value: string): number {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*k?m/i);
  if (!match) return 0;

  const mileage = Number(match[1]);
  return /km/i.test(match[0]) ? mileage : mileage * 1_000;
}

async function scrapeMarket(): Promise<CarListing[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ locale: "en-ZA" });
    const searchUrl = `${MARKETPLACE_URL}?q=${encodeURIComponent(TARGET_MODEL)}`;

    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);

    const listingTexts = await page
      .locator("article, [data-testid*='listing'], [class*='listing']")
      .allTextContents();
    const listingLinks = await page
      .locator("article a[href], [data-testid*='listing'] a[href], [class*='listing'] a[href]")
      .evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));

    return listingTexts
      .map((text, index): CarListing | null => {
        const priceMatch = text.match(/R\s?[0-9][0-9\s,.]*/i);
        if (!priceMatch) return null;

        return {
          title: text.trim().split("\n")[0],
          price: parseZar(priceMatch[0]),
          mileage: parseMileage(text),
          hasSunroof: /sunroof/i.test(text),
          url: listingLinks[index],
        };
      })
      .filter((listing): listing is CarListing => listing !== null && listing.price > 0);
  } finally {
    await browser.close();
  }
}

export const checkMarketArbitrage = inngest.createFunction(
  {
    id: "check-market-arbitrage",
    name: "Check vehicle market arbitrage",
  },
  [{ cron: "TZ=Africa/Johannesburg 0 8 * * *" }, { event: "apex-delta/market-check.requested" }],
  async ({ step }) => {
    const tradeIn = await step.run("fetch-trade-in", async () => {
      const marketAverage = Number(process.env.TRADE_IN_MARKET_AVERAGE_ZAR ?? 400_000);
      const repairedValue = marketAverage * 0.8;

      return { marketAverage, repairedValue };
    });

    const listings = await step.run("scrape-market", scrapeMarket);
    const targetListing = listings.sort((a, b) => a.price - b.price)[0] ?? null;

    const result = await step.run("analyze-delta", async (): Promise<ArbitrageResult> => {
      const targetPrice = targetListing?.price ?? 0;
      const priceGap = targetPrice - tradeIn.repairedValue;
      const isHighAlert = targetListing !== null && priceGap < HIGH_ALERT_THRESHOLD_ZAR;

      if (isHighAlert) {
        console.warn(
          `HIGH ALERT: ${TARGET_MODEL} price gap is R${priceGap.toLocaleString("en-ZA")}`,
        );
      }

      const snapshot = await prisma.marketSnapshot.create({
        data: {
          targetModel: TARGET_MODEL,
          repairedValue: tradeIn.repairedValue,
          targetPrice,
          priceGap,
          checkedListings: listings.length,
          isHighAlert,
          listings: {
            create: listings.map((listing) => ({
              title: listing.title,
              url: listing.url,
              price: listing.price,
              mileage: listing.mileage,
              hasSunroof: listing.hasSunroof,
            })),
          },
        },
      });

      return {
        repairedValue: snapshot.repairedValue,
        targetPrice: snapshot.targetPrice,
        priceGap: snapshot.priceGap,
        targetListing,
        isHighAlert: snapshot.isHighAlert,
      };
    });

    return {
      currency: "ZAR",
      targetModel: TARGET_MODEL,
      checkedListings: listings.length,
      result,
    };
  },
);
