import "dotenv/config";

import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client";
import { checkMarketArbitrage } from "./inngest/functions";

const app = express();
const port = Number(process.env.PORT ?? 3000);

// Inngest's Express adapter reads the parsed request body during sync and
// function execution requests.
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ service: "apex-delta", status: "ok" });
});

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [checkMarketArbitrage],
  }),
);

app.listen(port, () => {
  console.log(`ApexDelta listening on http://localhost:${port}`);
});
