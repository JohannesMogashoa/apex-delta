import type { CarListing, MarketSnapshot } from "wasp/entities";
import type { GetSnapshots, RunMarketCheck } from "wasp/server/operations";

import { inngest } from "../inngest/client";

type SnapshotWithListings = MarketSnapshot & { listings: CarListing[] };

export const getSnapshots: GetSnapshots<void, SnapshotWithListings[]> = async (_args, context) => {
  return context.entities.MarketSnapshot.findMany({
    include: { listings: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};

export const runMarketCheck: RunMarketCheck<void, { eventId: string }> = async () => {
  const response = await inngest.send({
    name: "apex-delta/market-check.requested",
    data: { requestedAt: new Date().toISOString() },
  });

  return { eventId: response.ids[0] ?? "unknown" };
};
