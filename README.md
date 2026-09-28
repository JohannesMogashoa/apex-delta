# ApexDelta

A full-stack vehicle arbitrage and sweet-spot tracker for the South African
market. ApexDelta uses Wasp for the React/Node.js/Prisma application, Inngest
for durable orchestration, and Playwright for the AutoTrader market check.

All monetary values are represented in South African rand (ZAR).

## Architecture

- `main.wasp.ts` defines the Wasp TypeScript Spec, route, query, action, and
  server setup.
- `schema.prisma` stores market snapshots and their scraped car listings.
- `src/MainPage.tsx` is the React dashboard.
- `src/market/operations.ts` exposes the Wasp query and action used by the UI.
- `src/inngest/functions.ts` runs the daily or manually requested market check.
- `src/server/setup.ts` mounts the Inngest Express adapter at
  `/api/inngest` inside Wasp's generated server.

## Prerequisites

- Node.js 24.14.1 or newer
- npm
- The Wasp CLI 0.25 or newer
- Internet access for npm, Inngest, AutoTrader, and Playwright

Install Wasp globally if needed:

```bash
npm install --global @wasp.sh/wasp-cli@latest
```

## Local setup

Install project dependencies and the Chromium browser used by the scraper:

```bash
npm install
npx playwright install chromium
```

Create the Wasp server environment file:

```bash
cp .env.server.example .env.server
```

Set `TRADE_IN_MARKET_AVERAGE_ZAR` to the temporary market-average value you
want to use. The workflow calculates:

```text
repaired value = market average × 0.80
```

The local Inngest event and signing keys may remain blank while using the
Inngest development server. Wasp uses `DATABASE_URL` for PostgreSQL. Start the
included local services with Docker Compose:

```bash
docker compose up -d postgres inngest adminer
```

Docker must be installed and running, and ports 5432, 8080, 8288, and 8289 must
be available. Adminer provides a browser UI for the PostgreSQL database.

Apply the database schema whenever `schema.prisma` changes:

```bash
wasp db migrate-dev --name initial_market_snapshot_schema
```

Use a new descriptive migration name for later schema changes.

## Run the full stack locally

Start Wasp in another terminal:

```bash
npm run dev
```

Open the dashboard at [http://localhost:3000](http://localhost:3000). Wasp
serves the web client on port 3000 and its Node server on port 3001 by default.

Open the Inngest dashboard at
[http://localhost:8288](http://localhost:8288). Adminer is available at
[http://localhost:8080](http://localhost:8080) with server `postgres`, user
`apexdelta`, password `apexdelta`, and database `apexdelta`.

The `check-market-arbitrage` function supports both:

- a daily schedule at 08:00 `Africa/Johannesburg` time;
- the dashboard's manual invoke action;
- the dashboard action in ApexDelta, which sends an Inngest event.

Click **Run market check** in the ApexDelta dashboard. The action queues an
Inngest event, the scraper runs in the server process, and the resulting
snapshot is persisted to PostgreSQL. Refresh the page after the run completes to
see the latest snapshot.

Stop the local services with:

```bash
docker compose down
```

To also delete the local PostgreSQL data volume, use `docker compose down -v`.

## Development checks

```bash
npm run lint
npm run format:check
npm run compile
```

Build a production Wasp bundle with:

```bash
npm run build
```

## Current limitations

- The trade-in valuation is still a placeholder based on
  `TRADE_IN_MARKET_AVERAGE_ZAR`.
- AutoTrader markup and availability can change; selectors need hardening,
  retries, rate-limit handling, and compliance review before unattended use.
- No authentication or multi-user ownership model is enabled yet.
- Wasp warns if an old root `.env` file is present. Prefer `.env.server` for
  server variables and keep secrets out of version control.

## Useful references

- [Wasp TypeScript Spec](https://wasp.sh/docs/general/spec)
- [Wasp server setup](https://wasp.sh/docs/project/server-config)
- [Wasp entities](https://wasp.sh/docs/data-model/entities)
- [Wasp environment variables](https://wasp.sh/docs/project/env-vars)
