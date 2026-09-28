# ApexDelta

ApexDelta is a vehicle arbitrage tracker for the South African market. It uses
Inngest to orchestrate a daily market check, Playwright to inspect AutoTrader
listings, and Express to expose the Inngest function endpoint.

All monetary values are represented in South African rand (ZAR).

## Prerequisites

- Node.js 20 or newer
- npm
- Internet access for AutoTrader and the Playwright browser

## Getting started

From the project root:

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Review `.env` before starting. The important local setting is
`TRADE_IN_MARKET_AVERAGE_ZAR`, which supplies the temporary market-average
value used to calculate the repaired value:

```text
repaired value = market average × 0.80
```

The Inngest event and signing key fields can remain blank when using the local
Inngest development server.

## Run locally

Start the Express application in one terminal:

```bash
npm run dev
```

The application listens on [http://localhost:3000](http://localhost:3000).
Check that it is running:

```bash
curl http://localhost:3000/
```

Start the Inngest development server in a second terminal:

```bash
npm run inngest
```

Open the local Inngest dashboard at
[http://localhost:8288](http://localhost:8288). The dashboard should discover
the function through:

```text
http://localhost:3000/api/inngest
```

From the dashboard, use the function's invoke action to run a market check
immediately. Otherwise, the scheduled function runs daily at 08:00 in the
`Africa/Johannesburg` timezone.

## What the workflow does

`checkMarketArbitrage` runs these steps:

1. `fetch-trade-in` calculates the repaired vehicle value from the configured
   market average.
2. `scrape-market` launches headless Chromium and extracts AutoTrader listing
   price, mileage, and whether the listing text mentions a sunroof.
3. `analyze-delta` compares the lowest target listing price with the repaired
   value and logs `HIGH ALERT` when the gap is below R150,000.

The AutoTrader markup and availability can change, so scraper results should be
treated as an experimental data source until selectors and validation are
hardened.

## Development checks

Run the full local checks before committing:

```bash
npm run lint
npm run format:check
npm run build
```

Automatically format files with:

```bash
npm run format
```

## Current limitations

- The trade-in valuation is a placeholder driven by
  `TRADE_IN_MARKET_AVERAGE_ZAR`.
- No database or historical price storage is configured yet.
- AutoTrader may require selector updates, rate-limit handling, or additional
  compliance review before regular automated scraping.
- Playwright browser binaries must be installed once per development machine.
