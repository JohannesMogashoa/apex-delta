import express from "express";
import { serve } from "inngest/express";
import { type ServerSetupFn } from "wasp/server";

import { inngest } from "../inngest/client";
import { checkMarketArbitrage } from "../inngest/functions";

export const setupInngest: ServerSetupFn = async ({ app }) => {
  app.use(express.json());
  app.use(
    "/api/inngest",
    serve({
      client: inngest,
      functions: [checkMarketArbitrage],
    }),
  );
};
