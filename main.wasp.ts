import { action, app, page, query, route } from "@wasp.sh/spec";

import { MainPage } from "./src/MainPage" with { type: "ref" };
import { getSnapshots, runMarketCheck } from "./src/market/operations" with { type: "ref" };
import { setupInngest } from "./src/server/setup" with { type: "ref" };

export default app({
  name: "apexDelta",
  wasp: { version: "^0.25.0" },
  title: "ApexDelta",
  head: ["<meta name='theme-color' content='#0f172a' />"],
  server: {
    setupFn: setupInngest,
  },
  spec: [
    route("RootRoute", "/", page(MainPage)),
    query(getSnapshots, { entities: ["MarketSnapshot", "CarListing"] }),
    action(runMarketCheck, { entities: ["MarketSnapshot", "CarListing"] }),
  ],
});
