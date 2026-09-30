import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { connect } from 'inngest/connect';

import { inngest } from './ingest/client.js';
import { functions } from './ingest/functions.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

config({
  path: path.resolve(currentDirectory, '../.env'),
});

const connection = await connect({
  apps: [
    {
      client: inngest,
      functions,
    },
  ],
  instanceId: 'apex-delta-local-worker',
  maxWorkerConcurrency: 2,
});

console.log(`Apex Delta worker: ${connection.state}`);
